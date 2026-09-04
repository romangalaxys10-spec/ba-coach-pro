/**
 * Provider adapters — capability discovery + model validation layer.
 *
 * The SOURCE OF TRUTH for available models is always the provider's current
 * API response. Static preset lists are fallback metadata only and are
 * flagged `unverified`. Every adapter encapsulates:
 *   models endpoint · auth headers · response parsing · capability extraction
 *   lifecycle/deprecation info · error classification
 *
 * A reusable OpenAI-compatible base adapter covers most providers; per-provider
 * overrides encode where their APIs actually differ (e.g. NVIDIA's 410
 * end-of-life bodies, endpoints without a models list at all).
 */

import {
  callLLMCustom,
  guardProviderUrl,
  ProviderHttpError,
  type ChatMsg,
  type StudentAIOverride,
} from '@/lib/ai';
import {
  AI_PROVIDER_PRESETS,
  getPreset,
  type DiscoveryStatus,
  type ModelAvailability,
  type ProviderModel,
} from '@/lib/ai-providers';

export interface ProviderConfig {
  providerId: string;
  baseUrl: string;
  apiKey: string;
  /** model id — used for chat() calls */
  model?: string;
}

export interface DiscoveryOutcome {
  ok: boolean;
  status: DiscoveryStatus;
  message: string;
  detail?: string;
  models: ProviderModel[];
  fallbackUsed?: boolean;
}

export interface CredentialCheck {
  ok: boolean;
  status: DiscoveryStatus;
  message: string;
  detail?: string;
}

export interface ModelProbeResult {
  ok: boolean;
  availability: ModelAvailability;
  message: string;
  detail?: string;
  endOfLife?: string;
}

export interface AIProviderAdapter {
  id: string;
  name: string;
  validateCredentials(cfg: ProviderConfig): Promise<CredentialCheck>;
  listModels(cfg: ProviderConfig): Promise<DiscoveryOutcome>;
  validateModel(cfg: ProviderConfig, modelId: string, discovered?: ProviderModel[]): Promise<ModelProbeResult>;
  chat(cfg: ProviderConfig, messages: ChatMsg[], timeoutMs?: number): Promise<string>;
}

/* ------------------------------------------------------------------ */
/* Error classification                                                */
/* ------------------------------------------------------------------ */

export interface ClassifiedError {
  kind:
    | 'retired'
    | 'model_not_found'
    | 'auth'
    | 'rate_limit'
    | 'timeout'
    | 'network'
    | 'server'
    | 'empty'
    | 'unknown';
  httpStatus?: number;
  message: string;
  detail?: string;
  endOfLife?: string;
}

/** Extract an end-of-life date from a provider body (e.g. NVIDIA 410 detail). */
export function parseEndOfLife(body: string): string | undefined {
  const m =
    body.match(/end of life on (\d{4}-\d{2}-\d{2}(?:T[\d:.Z+-]+)?)/i) ||
    body.match(/"endOfLife"\s*:\s*"([^"]+)"/i) ||
    body.match(/retired (?:on|since) (\d{4}-\d{2}-\d{2})/i);
  return m ? m[1] : undefined;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export function classifyProviderError(e: unknown, baseUrl?: string): ClassifiedError {
  const host = baseUrl ? hostOf(baseUrl) : 'the provider';

  if (e instanceof ProviderHttpError) {
    const detail = e.body.slice(0, 500);
    if (e.status === 410) {
      const endOfLife = parseEndOfLife(e.body);
      return {
        kind: 'retired',
        httpStatus: 410,
        endOfLife,
        message: `Model unavailable — this model has been retired by the provider${endOfLife ? ` (end of life ${endOfLife.slice(0, 10)})` : ''}.`,
        detail,
      };
    }
    if (e.status === 401 || e.status === 403) {
      const expired = /expired|revoked|invalid[_ ]token/i.test(e.body);
      return {
        kind: 'auth',
        httpStatus: e.status,
        message: expired
          ? 'Authentication failed — the API key has expired or been revoked.'
          : 'Authentication failed — invalid API key for this provider.',
        detail,
      };
    }
    if (e.status === 404) {
      const isNvidiaFunction = /function.*not found for account/i.test(e.body);
      const modelIssue = isNvidiaFunction || /model|not[_ -]?found|decommis/i.test(e.body);
      return {
        kind: modelIssue ? 'model_not_found' : 'unknown',
        httpStatus: 404,
        message: isNvidiaFunction
          ? 'This model is not accessible for your account (NVIDIA 404: Function not found). Try selecting a different model such as Nemotron Nano, Mistral 7B, or Gemma.'
          : modelIssue
            ? 'Model not found — this model is not available for this endpoint/account.'
            : `Endpoint not found (404) — check the base URL for ${host}.`,
        detail,
      };
    }
    if (e.status === 402) {
      const isPollinations = /pollinations/i.test(e.body) || (baseUrl && /pollinations/i.test(baseUrl));
      return {
        kind: 'rate_limit',
        httpStatus: 402,
        message: isPollinations
          ? 'Payment required (402) — Pollinations free keyless pool is deprecated and requires credits. Get an API key at https://enter.pollinations.ai, or switch to NVIDIA NIM (1,000 free credits at build.nvidia.com) or Deployment AI.'
          : 'Payment required (402) — this provider account requires credits or a funded API key.',
        detail,
      };
    }
    if (e.status === 429) {
      return { kind: 'rate_limit', httpStatus: 429, message: 'Rate limited — the key works but hit a quota or concurrency limit. Try again shortly.', detail };
    }
    if (e.status >= 500) {
      const busy = /busy|temporarily|retry/i.test(e.body);
      return {
        kind: 'server',
        httpStatus: e.status,
        message: busy
          ? `Model temporarily busy at the provider (${e.status}) — the app retries automatically; if it keeps happening, free-tier models are the busiest, so pick a non-free model from the list.`
          : `Provider server error (${e.status}) — the provider failed to answer. Try again or pick another model.`,
        detail,
      };
    }
    return { kind: 'unknown', httpStatus: e.status, message: `The provider rejected the request (${e.status}).`, detail };
  }

  const raw = e instanceof Error ? e : new Error(String(e));
  if (raw.name === 'ProviderTimeoutError' || /timed out/i.test(raw.message)) {
    return { kind: 'timeout', message: 'Timed out — the provider did not respond in time. Try again or pick another model.', detail: raw.message };
  }
  if (raw.name === 'ProviderNetworkError' || /fetch failed|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|getaddrinfo|ConnectTimeout/i.test(raw.message)) {
    return { kind: 'network', message: `Provider unreachable — unable to connect to ${host}. Check the base URL and your network.`, detail: raw.message };
  }
  if (/empty response/i.test(raw.message)) {
    return { kind: 'empty', message: 'Empty response — the provider accepted the call but returned no content.', detail: raw.message };
  }
  return { kind: 'unknown', message: raw.message.slice(0, 240), detail: raw.message };
}

/* ------------------------------------------------------------------ */
/* Model normalisation (OpenAI-ish /models payloads → ProviderModel)   */
/* ------------------------------------------------------------------ */

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = Record<string, any>;

export function normalizeModel(rawIn: unknown, provider: string): ProviderModel | null {
  if (typeof rawIn === 'string') {
    const id = rawIn.trim();
    return id ? { id, provider, capabilities: { chat: true } } : null;
  }
  const raw = (rawIn ?? {}) as Json;
  const id = String(raw.id ?? raw.name ?? raw.model ?? '').trim();
  if (!id) return null;

  const contextWindow: number | undefined =
    num(raw.context_window) ??
    num(raw.context_length) ??
    num(raw.max_model_len) ??
    num(raw.max_context_length) ??
    num(raw.architecture?.max_context_window) ??
    num(raw.top_provider?.context_length);

  const inputMods: unknown = raw.architecture?.input_modalities ?? raw.input_modalities;
  const supported: unknown = raw.supported_parameters ?? raw.features;

  const capabilities = {
    chat: true,
    completion: true,
    vision: Array.isArray(inputMods) ? inputMods.includes('image') : undefined,
    tools: Array.isArray(supported) ? supported.includes('tools') : undefined,
    reasoning: Array.isArray(supported) ? supported.includes('reasoning') : undefined,
  };

  const statusRaw = String(raw.lifecycle?.status ?? raw.status ?? '').toLowerCase();
  const eol = str(raw.lifecycle?.endOfLife ?? raw.retirement_date ?? raw.deprecation?.date);
  const deprecated = raw.deprecated === true || statusRaw === 'deprecated' || Boolean(eol && statusRaw !== 'active');

  const lifecycle: ProviderModel['lifecycle'] =
    ['active', 'deprecated', 'retired'].includes(statusRaw) || eol
      ? { status: (['active', 'deprecated', 'retired'].includes(statusRaw) ? statusRaw : 'deprecated') as 'active' | 'deprecated' | 'retired', endOfLife: eol }
      : undefined;

  const name = str(raw.display_name) || (str(raw.name) && str(raw.name) !== id ? str(raw.name) : undefined);

  return {
    id,
    name,
    provider,
    capabilities,
    contextWindow,
    deprecated: deprecated || undefined,
    lifecycle,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

function num(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : undefined;
}

/** Trim a model list for persistence (avoid huge rows in the DB / ghdb). */
export function capModels(models: ProviderModel[], max = 120): ProviderModel[] {
  return models.slice(0, max).map(m => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    contextWindow: m.contextWindow,
    deprecated: m.deprecated,
    lifecycle: m.lifecycle,
    unverified: m.unverified || undefined,
    capabilities: m.capabilities,
  }));
}

/* ------------------------------------------------------------------ */
/* Shared HTTP helper                                                  */
/* ------------------------------------------------------------------ */

class FetchFailure extends Error {
  kind: 'timeout' | 'network';
  constructor(kind: 'timeout' | 'network', message: string) {
    super(message);
    this.kind = kind;
  }
}

async function providerFetch(
  url: string,
  apiKey: string,
  timeoutMs = 20_000,
  init?: RequestInit
): Promise<{ status: number; json: unknown; text: string }> {
  guardProviderUrl(url);
  // keyless pools (Pollinations with the 'free' placeholder) must NOT carry an
  // Authorization header — a bogus bearer makes them treat the call as an
  // authenticated (deprecated) client and reject it with 402.
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (apiKey && apiKey !== 'free') headers.Authorization = `Bearer ${apiKey}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        ...headers,
        ...(init?.headers as Record<string, string> | undefined),
      },
      signal: AbortSignal.timeout(timeoutMs),
      cache: 'no-store',
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new FetchFailure(
      /timeout|aborted/i.test(msg) ? 'timeout' : 'network',
      /timeout|aborted/i.test(msg) ? `Request timed out after ${timeoutMs}ms` : `Fetch failed: ${msg}`
    );
  }
  const text = await res.text().catch(() => '');
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null; // malformed body — callers treat as unusable
  }
  return { status: res.status, json, text };
}

function authFailure(body: string): CredentialCheck {
  const expired = /expired|revoked|invalid[_ ]token/i.test(body);
  return {
    ok: false,
    status: 'authentication_failed',
    message: expired
      ? 'Authentication failed — the API key has expired or been revoked.'
      : 'Authentication failed — invalid API key for this provider.',
    detail: body.slice(0, 500),
  };
}

function networkFailure(e: unknown, baseUrl: string): CredentialCheck {
  const host = hostOf(baseUrl);
  if (e instanceof FetchFailure) {
    return e.kind === 'timeout'
      ? { ok: false, status: 'provider_unreachable', message: 'Provider unreachable — the connection timed out.', detail: e.message }
      : { ok: false, status: 'provider_unreachable', message: `Provider unreachable — unable to connect to ${host}.`, detail: e.message };
  }
  return {
    ok: false,
    status: 'provider_unreachable',
    message: `Provider unreachable — unable to connect to ${host}.`,
    detail: e instanceof Error ? e.message : String(e),
  };
}

/* ------------------------------------------------------------------ */
/* OpenAI-compatible base adapter                                      */
/* ------------------------------------------------------------------ */

interface CompatOptions {
  id: string;
  name: string;
  /** path appended to the base URL for model discovery (default /models) */
  modelsPath?: string;
}

function parseModelList(json: unknown, text: string, provider: string): ProviderModel[] {
  const list = Array.isArray(json) ? json : Array.isArray((json as Json)?.data) ? (json as Json).data : null;
  if (!list) throw new Error(`Malformed model list: ${text.slice(0, 120)}`);
  return list.map((m: unknown) => normalizeModel(m, provider)).filter((m): m is ProviderModel => Boolean(m));
}

function fallbackModelsFor(id: string): ProviderModel[] {
  const preset = getPreset(id);
  return (preset?.models || []).map(mid => ({ id: mid, provider: id, capabilities: { chat: true }, unverified: true }));
}

function makeCompatAdapter(opts: CompatOptions): AIProviderAdapter {
  const modelsUrl = (cfg: ProviderConfig) => `${cfg.baseUrl.replace(/\/+$/, '')}${opts.modelsPath || '/models'}`;

  const adapter: AIProviderAdapter = {
    id: opts.id,
    name: opts.name,

    async chat(cfg, messages, timeoutMs = 90_000): Promise<string> {
      const override: StudentAIOverride = { baseUrl: cfg.baseUrl, apiKey: cfg.apiKey, model: cfg.model || '' };
      return callLLMCustom(messages, override, timeoutMs);
    },

    async validateCredentials(cfg): Promise<CredentialCheck> {
      // 1) cheap authoritative check: the models endpoint with the key
      try {
        const { status, json, text } = await providerFetch(modelsUrl(cfg), cfg.apiKey);
        if (status === 401 || status === 403) return authFailure(text);
        if (status === 200) {
          try {
            const models = parseModelList(json, text, opts.id);
            return { ok: true, status: 'connected', message: `${models.length} models available for this key.` };
          } catch {
            return {
              ok: true,
              status: 'models_unavailable',
              message: 'Credentials accepted, but the provider returned an unreadable model list.',
              detail: text.slice(0, 300),
            };
          }
        }
        // 404/other → endpoint may not expose /models; fall through to chat probe
      } catch (e) {
        if (e instanceof FetchFailure) return networkFailure(e, cfg.baseUrl);
        // malformed JSON at 200 etc → still try the probe below
      }
      // 2) fallback: a tiny live completion proves the credential
      try {
        await callLLMCustom([{ role: 'user', content: 'Reply with: OK' }], { baseUrl: cfg.baseUrl, apiKey: cfg.apiKey, model: 'probe' }, 25_000, { max_tokens: 8 });
        return { ok: true, status: 'connected', message: 'Credentials accepted (verified via live probe).' };
      } catch (e) {
        if (e instanceof ProviderHttpError) {
          const cls = classifyProviderError(e, cfg.baseUrl);
          // "model probe not found" on a valid endpoint still proves the KEY works
          if (cls.kind === 'auth') return { ok: false, status: 'authentication_failed', message: cls.message, detail: cls.detail };
          if (cls.kind === 'model_not_found') return { ok: true, status: 'connected', message: 'Credentials accepted (verified via live probe).' };
          return { ok: false, status: cls.kind === 'retired' ? 'connected' : 'provider_unreachable', message: cls.message, detail: cls.detail };
        }
        const cls = classifyProviderError(e, cfg.baseUrl);
        return cls.kind === 'timeout'
          ? { ok: false, status: 'provider_unreachable', message: cls.message, detail: cls.detail }
          : { ok: false, status: 'provider_unreachable', message: cls.message, detail: cls.detail };
      }
    },

    async listModels(cfg): Promise<DiscoveryOutcome> {
      try {
        const { status, json, text } = await providerFetch(modelsUrl(cfg), cfg.apiKey);
        if (status === 401 || status === 403) {
          const fail = authFailure(text);
          return { ok: false, status: fail.status, message: fail.message, detail: fail.detail, models: fallbackModelsFor(opts.id) };
        }
        if (status !== 200) {
          return {
            ok: false,
            status: 'models_unavailable',
            message: 'Credentials were accepted, but the provider did not return an available model list.',
            detail: `HTTP ${status}: ${text.slice(0, 200)}`,
            models: fallbackModelsFor(opts.id),
            fallbackUsed: true,
          };
        }
        let models: ProviderModel[];
        try {
          models = parseModelList(json, text, opts.id);
        } catch (e) {
          return {
            ok: false,
            status: 'models_unavailable',
            message: 'Credentials were accepted, but the provider returned an unreadable model list.',
            detail: e instanceof Error ? e.message : String(e),
            models: fallbackModelsFor(opts.id),
            fallbackUsed: true,
          };
        }
        if (!models.length) {
          return {
            ok: false,
            status: 'models_unavailable',
            message: 'Credentials were accepted, but the provider returned an empty model list.',
            models: fallbackModelsFor(opts.id),
            fallbackUsed: true,
          };
        }
        models.sort((a, b) => a.id.localeCompare(b.id));
        return { ok: true, status: 'connected', message: `${models.length} models available`, models };
      } catch (e) {
        const fail =
          e instanceof FetchFailure
            ? networkFailure(e, cfg.baseUrl)
            : { status: 'models_unavailable' as DiscoveryStatus, message: 'Credentials were accepted, but the provider did not return a usable model list.', detail: e instanceof Error ? e.message : String(e) };
        return { ok: false, status: fail.status, message: fail.message, detail: fail.detail, models: fallbackModelsFor(opts.id), fallbackUsed: true };
      }
    },

    async validateModel(cfg, modelId, discovered): Promise<ModelProbeResult> {
      if (discovered && discovered.length) {
        const found = discovered.find(m => m.id === modelId);
        if (found) {
          if (found.lifecycle?.status === 'retired') {
            return { ok: false, availability: 'retired', message: `Model ${modelId} has been retired by the provider.` };
          }
          // NVIDIA NIM lists all enterprise models in /models publicly, but chat/completions
          // returns 404 Function not found if the account lacks permission for that model.
          if (cfg.providerId === 'nvidia-nim' || /nvidia\.com/i.test(cfg.baseUrl)) {
            try {
              await callLLMCustom([{ role: 'user', content: 'Reply with: OK' }], { baseUrl: cfg.baseUrl, apiKey: cfg.apiKey, model: modelId }, 15_000, { max_tokens: 8 });
              return { ok: true, availability: 'available', message: `Model ${modelId} is available and responsive.` };
            } catch (e) {
              const cls = classifyProviderError(e, cfg.baseUrl);
              return {
                ok: false,
                availability: cls.kind === 'retired' ? 'retired' : cls.kind === 'model_not_found' ? 'unavailable' : 'unknown',
                message: cls.message,
                detail: cls.detail,
                endOfLife: cls.endOfLife,
              };
            }
          }
          const ctx = found.contextWindow ? ` (${Math.round(found.contextWindow / 1024)}k context)` : '';
          return {
            ok: true,
            availability: 'available',
            message: found.deprecated
              ? `Model ${modelId} works, but the provider marks it deprecated — consider migrating.${ctx}`
              : `Model ${modelId} is available${ctx}.`,
          };
        }
        return {
          ok: false,
          availability: 'unavailable',
          message: `Model not found — ${modelId} is not in the provider's current model list for this endpoint/account.`,
        };
      }
      // No discovery data → lightweight live probe (short completion)
      try {
        await callLLMCustom([{ role: 'user', content: 'Reply with: OK' }], { baseUrl: cfg.baseUrl, apiKey: cfg.apiKey, model: modelId }, 30_000, { max_tokens: 8 });
        return { ok: true, availability: 'available', message: `Model ${modelId} responded to a live probe.` };
      } catch (e) {
        const cls = classifyProviderError(e, cfg.baseUrl);
        return {
          ok: false,
          availability: cls.kind === 'retired' ? 'retired' : cls.kind === 'model_not_found' ? 'unavailable' : 'unknown',
          message: cls.message,
          detail: cls.detail,
          endOfLife: cls.endOfLife,
        };
      }
    },
  };

  return adapter;
}

/* ------------------------------------------------------------------ */
/* Provider registry — each preset gets an adapter instance; provider- */
/* specific overrides live here, everything else shares the compat base */
/* ------------------------------------------------------------------ */

const nvidiaAdapter: AIProviderAdapter = makeCompatAdapter({
  id: 'nvidia-nim',
  name: 'NVIDIA NIM',
  // NVIDIA quirk: 410 bodies carry `detail` with an explicit end-of-life date —
  // the shared classifier parses it into lifecycle.endOfLife. Their /v1/models
  // is public, but sending the key keeps the contract uniform.
});

// The Z.ai coding endpoint may not expose /models — the compat base already
// degrades to a live credential probe + unverified fallback list.
const zaiCodingAdapter = makeCompatAdapter({ id: 'zai-coding', name: 'Z.ai Coding Plan' });
const opencodeZenAdapter = makeCompatAdapter({ id: 'opencode-zen', name: 'OpenCode Zen' });
const openadapterAdapter = makeCompatAdapter({ id: 'openadapter', name: 'OpenAdapter' });
const customAdapter = makeCompatAdapter({ id: 'custom', name: 'Custom OpenAI-compatible' });

export function getAdapter(providerId: string): AIProviderAdapter {
  switch (providerId) {
    case 'nvidia-nim':
      return nvidiaAdapter;
    case 'zai-coding':
      return zaiCodingAdapter;
    case 'opencode-zen':
      return opencodeZenAdapter;
    case 'openadapter':
      return openadapterAdapter;
    default:
      return customAdapter;
  }
}

export function providerDisplayName(providerId: string): string {
  return getAdapter(providerId).name || AI_PROVIDER_PRESETS.find(p => p.id === providerId)?.name || 'custom provider';
}
