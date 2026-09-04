/**
 * Unified AI client with four resolution modes.
 *
 * Resolution order (for every LLM call):
 *  0. The STUDENT'S OWN custom provider (Settings → AI Provider) — an
 *     OpenAI-compatible base URL + key + model saved on their account
 *     (Z.ai Coding Plan, NVIDIA NIM, OpenCode Zen, OpenAdapter, or any
 *     custom endpoint). Takes priority because it is the student's explicit
 *     choice and their own paid key.
 *  1. `AI_TUNNEL_URL` (+ optional `AI_TUNNEL_KEY`) — proxy tunnel: forward the
 *     call to a host that CAN reach the Z.ai internal models (e.g. the app's
 *     own preview running inside a Z.ai sandbox, same as space-z.ai). This is
 *     what makes a Vercel deployment fully functional without any API key:
 *     set AI_TUNNEL_URL=https://preview-<id>.space-z.ai and every chat, quiz,
 *     flashcard, TTS and ASR call is executed by the sandbox and returned.
 *  2. `ZAI_API_KEY` (+ optional `ZAI_BASE_URL`, default https://api.z.ai/api/paas/v4)
 *     — direct OpenAI-compatible calls (LLM only). Works on any host.
 *  3. `z-ai-web-dev-sdk` — reads the standard .z-ai-config file chain. Works in
 *     the Z.ai dev sandbox and self-hosted environments that provide one.
 *  4. FREE key-less pool (text.pollinations.ai/openai) — zero-config public AI
 *     so a fresh deployment has working AI out of the box. Best-effort: the
 *     anonymous tier is rate-limited; set POLLINATIONS_API_KEY to lift limits.
 *
 * TTS/ASR always use modes 1–3 (custom providers are OpenAI LLM endpoints).
 *
 * If none is available, callers get a clear, actionable error instead of a
 * cryptic network failure.
 */

import { TTS_VOICES } from '@/lib/audio';
import { privateHostCheck } from '@/lib/ai-providers';

export interface ChatMsg {
  role: string;
  content: string;
}

const envTunnelUrl = () => (process.env.AI_TUNNEL_URL || '').replace(/\/$/, '');
const envTunnelKey = () => process.env.AI_TUNNEL_KEY || '';
const ENV_KEY = process.env.ZAI_API_KEY || '';

// ZAI_CONFIG_JSON — single-secret alternative: {"apiKey":"…","baseUrl":"…","model":"…"}
let cfgJsonKey = '';
let cfgJsonBase = '';
let cfgJsonModel = '';
try {
  const raw = process.env.ZAI_CONFIG_JSON || '';
  if (raw) {
    const j = JSON.parse(raw) as { apiKey?: unknown; key?: unknown; baseUrl?: unknown; model?: unknown };
    cfgJsonKey = typeof j.apiKey === 'string' ? j.apiKey.trim() : typeof j.key === 'string' ? j.key.trim() : '';
    cfgJsonBase = typeof j.baseUrl === 'string' ? j.baseUrl.trim() : '';
    cfgJsonModel = typeof j.model === 'string' ? j.model : '';
    // sanity: placeholder/short keys or non-https bases make the whole
    // deployment chain fail — ignore them and fall through to the free pool
    if (cfgJsonKey && (cfgJsonKey.length < 8 || !/^https:\/\//i.test(cfgJsonBase || 'https://x'))) {
      console.error('[ai] ZAI_CONFIG_JSON ignored — placeholder key or non-https baseUrl');
      cfgJsonKey = '';
      cfgJsonBase = '';
      cfgJsonModel = '';
    }
  }
} catch {
  // malformed secret — ignore and fall through to the other steps
}

const ENV_KEY_EFF = ENV_KEY || cfgJsonKey;
const ENV_BASE_EFF = (cfgJsonBase || process.env.ZAI_BASE_URL || 'https://api.z.ai/api/paas/v4').replace(/\/$/, '');
const ENV_MODEL_EFF = cfgJsonModel || process.env.ZAI_MODEL || 'glm-4.7';

export function aiMode(): 'tunnel' | 'env-key' | 'sdk' | 'free' {
  if (envTunnelUrl()) return 'tunnel';
  if (ENV_KEY_EFF) return 'env-key';
  // the SDK attempt may still fall through to the free key-less pool at call time
  return 'sdk';
}

export const NOT_CONFIGURED_MSG =
  '🤖 **AI is not reachable on this deployment right now.**\n\n' +
  'Everything else (student accounts, GitHub backups, templates, progress) works. The free key-less AI pool was tried but is busy/rate-limited. To restore AI:\n' +
  '1. **Free pool key** — set `POLLINATIONS_API_KEY` from https://enter.pollinations.ai (cheap, removes the free-tier limits); or\n' +
  '2. **Direct API key** — set `ZAI_API_KEY` (+ optional `ZAI_BASE_URL`, default `https://api.z.ai/api/paas/v4`) in your hosting environment; or\n' +
  '3. **Your own provider** — every student can plug an OpenAI-compatible key in Settings → AI provider (NVIDIA NIM and OpenCode Zen have free tiers).\n\n' +
  'Self-hosted instances inside the Z.ai sandbox work out of the box.';

/* ------------------------------------------------------------------ */
/* Tunnel transport                                                    */
/* ------------------------------------------------------------------ */

async function tunnelCall<T>(payload: Record<string, unknown>, timeoutMs: number): Promise<T> {
  const base = envTunnelUrl();
  const key = envTunnelKey();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (key) headers['x-tunnel-key'] = key;
  let res: Response;
  try {
    res = await fetch(`${base}/api/tunnel`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (e) {
    throw new Error(
      `AI tunnel unreachable at ${base}/api/tunnel — is the sandbox instance running? (${
        e instanceof Error ? e.message : String(e)
      })`
    );
  }
  if (!res.ok) {
    const text = (await res.text().catch(() => '')).slice(0, 300);
    throw new Error(`AI tunnel responded ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

/* ------------------------------------------------------------------ */
/* LLM                                                                 */
/* ------------------------------------------------------------------ */

async function callViaSdk(messages: ChatMsg[]): Promise<string> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();
  type SdkBody = Parameters<typeof zai.chat.completions.create>[0];
  const completion = await zai.chat.completions.create({
    messages: messages as SdkBody['messages'],
    thinking: { type: 'disabled' },
  });
  const content = completion.choices?.[0]?.message?.content;
  if (!content || !content.trim()) throw new Error('Empty response from model');
  return content;
}

/* ------------------------------------------------------------------ */
/* Generic OpenAI-compatible transport (env key + student providers)   */
/* ------------------------------------------------------------------ */

export interface StudentAIOverride {
  baseUrl: string;
  apiKey: string;
  model: string;
}

/** HTTP-level failure from an OpenAI-compatible provider, with body for classification. */
export class ProviderHttpError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string) {
    super(`AI endpoint responded ${status}: ${body.slice(0, 240)}`);
    this.name = 'ProviderHttpError';
    this.status = status;
    this.body = body;
  }
}

const isZaiHost = (base: string) => /(^|\.)z\.ai($|:|\/)/i.test(base);
const isPollinationsHost = (base: string) => /(^|\.)pollinations\.ai($|:|\/)/i.test(base);

/**
 * SSRF guard for server-side provider calls. Students configure arbitrary
 * base URLs, so before dialling we reject hosts that must never be reached
 * from the server: cloud metadata, link-local, RFC1918 and loopback ranges.
 * Local dev endpoints (Ollama / LM Studio on localhost, or a LAN box) are
 * opt-in per deployment: set ALLOW_LOCAL_AI_ENDPOINTS=1 to allow them.
 */
export function guardProviderUrl(base: string): string {
  let parsed: URL;
  try {
    parsed = new URL(base);
  } catch {
    throw new Error(`Invalid provider URL: ${base}`);
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`Provider URL must be http(s): ${base}`);
  }
  if (parsed.username || parsed.password) {
    throw new Error('Blocked provider URL (embedded credentials not allowed)');
  }
  const host = parsed.hostname.toLowerCase();
  const allowLocal = process.env.ALLOW_LOCAL_AI_ENDPOINTS === '1';
  if (privateHostCheck(host)) {
    if (!allowLocal) {
      throw new Error(
        `Blocked provider URL (${host} is a private/loopback host). Self-hosters can allow local AI endpoints with ALLOW_LOCAL_AI_ENDPOINTS=1.`
      );
    }
    if (/^169\.254\./.test(host) || host === 'metadata.google.internal') {
      // the one private range that stays forbidden even when locals are allowed
      throw new Error(`Blocked provider URL (metadata host not allowed): ${host}`);
    }
  }
  return base;
}

/**
 * Extract the user-facing answer from an OpenAI-shaped chat response.
 * Handles reasoning models: `reasoning_content` (DeepSeek style), `reasoning`
 * (Pollinations style) and <think>…</think> wrappers.
 */
function parseOpenAIChoice(data: {
  choices?: { message?: { content?: string | null; reasoning_content?: string | null; reasoning?: string | null } }[];
}): string {
  const msg = data.choices?.[0]?.message;
  const raw = msg?.content ?? '';
  // Reasoning models sometimes put the whole answer (or a preamble) inside
  // <think>…</think>; the user-facing answer is what comes after the tags.
  const stripped = raw.includes('</think>') ? raw.split('</think>').pop()! : raw;
  return stripped.trim() || (msg?.reasoning_content ?? '').trim() || (msg?.reasoning ?? '').trim();
}

/** One OpenAI chat/completions call against an arbitrary compatible base URL. */
async function callViaOpenAI(
  messages: ChatMsg[],
  base: string,
  apiKey: string,
  model: string,
  timeoutMs = 180_000,
  extra?: Record<string, unknown>
): Promise<string> {
  // Pollinations has two APIs: the legacy text.pollinations.ai/openai works
  // ANONYMOUSLY (with a referrer) but rejects authenticated callers with 402
  // deprecation; gen.pollinations.ai/v1 is the modern API but REQUIRES a key
  // (401 without one). Route by credential: real key → gen.*, keyless → legacy.
  let cleanBase = base;
  const hasRealKey = Boolean(apiKey && apiKey !== 'free');
  const isGenHost = /gen\.pollinations\.ai/i.test(cleanBase);
  const isLegacyHost = /text\.pollinations\.ai/i.test(cleanBase);
  if (isLegacyHost && hasRealKey) {
    // real key → modern API
    cleanBase = 'https://gen.pollinations.ai/v1';
  } else if (isGenHost && !hasRealKey) {
    // keyless caller on the modern API → legacy anonymous endpoint
    cleanBase = 'https://text.pollinations.ai/openai';
  }

  // `thinking` is a Z.ai-only extension — other providers reject unknown args.
  const body: Record<string, unknown> = { model, messages };
  if (isZaiHost(cleanBase)) body.thinking = { type: 'disabled' };
  // Pollinations' free anonymous tier is keyed on a referrer; without it the
  // request is billed as keyless-with-zero-budget and rejected (HTTP 402).
  if (isPollinationsHost(cleanBase)) body.referrer = body.referrer || 'ba-coach-pro';
  if (extra) Object.assign(body, extra);

  // A base already ending in /openai IS the chat endpoint (Pollinations style);
  // appending /chat/completions would 404.
  const url = /\/(chat\/completions|openai)$/.test(cleanBase) ? cleanBase : `${cleanBase}/chat/completions`;
  guardProviderUrl(url);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey && apiKey !== 'free') {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      redirect: 'error',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (e) {
    // Normalise network/abort failures so callers can classify them.
    const msg = e instanceof Error ? e.message : String(e);
    const err = new Error(/timeout|aborted/i.test(msg) ? `Request timed out after ${timeoutMs}ms` : `Fetch failed: ${msg}`);
    err.name = /timeout|aborted/i.test(msg) ? 'ProviderTimeoutError' : 'ProviderNetworkError';
    throw err;
  }
  if (!res.ok) {
    const text = (await res.text().catch(() => '')).slice(0, 800);
    throw new ProviderHttpError(res.status, text);
  }
  const data = (await res.json()) as Parameters<typeof parseOpenAIChoice>[0];
  const content = parseOpenAIChoice(data);
  if (!content) throw new Error('Empty response from AI model');
  return content;
}

/**
 * Errors that will NEVER succeed on retry — the provider gave a definitive
 * answer about this credential/model. Retrying causes runaway loops (and on
 * Vercel, function timeouts → 502 Bad Gateway).
 */
export function isDefinitiveModelError(e: unknown): boolean {
  if (e instanceof ProviderHttpError) {
    if (e.status === 401 || e.status === 403 || e.status === 410) return true;
    if (e.status === 404 && /model/i.test(e.body)) return true;
  }
  return false;
}

/**
 * One LLM call against a student-configured provider.
 * Used by the discovery layer (model probes) and the test endpoint.
 */
export async function callLLMCustom(
  messages: ChatMsg[],
  override: StudentAIOverride,
  timeoutMs = 90_000,
  extra?: Record<string, unknown>
): Promise<string> {
  return callViaOpenAI(messages, override.baseUrl, override.apiKey, override.model, timeoutMs, extra);
}

/* ------------------------------------------------------------------ */
/* Free key-less pool (Pollinations) — final fallback before giving up */
/* ------------------------------------------------------------------ */

const POLLINATIONS_DEFAULT_URL = 'https://gen.pollinations.ai/v1/chat/completions';

/**
 * Fixed-infrastructure endpoint for the free key-less pool. Domain-pinned to
 * pollinations.ai over https (the env override cannot point anywhere else)
 * — this call is NOT student-configurable, so it stays a closed allowlist
 * rather than an open URL input.
 */
function pollinationsUrl(): string {
  const raw = (process.env.POLLINATIONS_BASE_URL || '').trim().replace(/\/$/, '');
  if (raw) {
    try {
      const u = new URL(raw.endsWith('/chat/completions') || raw.endsWith('/openai') ? raw : `${raw}/chat/completions`);
      if (u.protocol === 'https:' && /(^|\.)pollinations\.ai$/i.test(u.hostname)) return u.toString();
    } catch {
      /* fall through to default */
    }
    console.error('[ai] POLLINATIONS_BASE_URL rejected (must be an https pollinations.ai host) — using default');
  }
  return POLLINATIONS_DEFAULT_URL;
}

const POLLINATIONS_MODEL = process.env.POLLINATIONS_MODEL || 'openai-fast';
const POLLINATIONS_KEY = process.env.POLLINATIONS_API_KEY || '';

/**
 * Free, key-less OpenAI-compatible pool (gen.pollinations.ai/v1).
 * Anonymous traffic is rate-limited and occasionally returns 402 "budget"
 * errors when the pool is saturated — callers treat this tier as
 * best-effort, never as the only option.
 */
async function callViaPollinations(messages: ChatMsg[]): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await callViaPollinationsOnce(messages);
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      // 402/429 carry their own actionable guidance — retrying changes nothing
      const transient = /unreachable|Fetch failed|timed out|responded 5\d\d/i.test(msg);
      if (!transient || attempt === 2) break;
      await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Free AI pool failed');
}

/**
 * The free pool is served over a flaky edge (intermittent 502s and undici
 * "fetch failed" connect resets from serverless runtimes). Retry transient
 * failures a couple of times with a short backoff; 402/429 are definitive
 * (pool saturated for this keyless identity) and return their own guidance.
 */
async function callViaPollinationsOnce(messages: ChatMsg[]): Promise<string> {
  let res: Response;
  try {
    res = await fetch(pollinationsUrl(), {
      method: 'POST',
      redirect: 'error',
      headers: {
        'Content-Type': 'application/json',
        ...(POLLINATIONS_KEY && POLLINATIONS_KEY !== 'free' ? { Authorization: `Bearer ${POLLINATIONS_KEY}` } : {}),
      },
      body: JSON.stringify({ model: POLLINATIONS_MODEL, messages, referrer: 'ba-coach-pro' }),
      signal: AbortSignal.timeout(120_000),
    });
  } catch (e) {
    throw new Error(`Free AI pool unreachable (${e instanceof Error ? e.message : String(e)})`);
  }
  if (!res.ok) {
    const text = (await res.text().catch(() => '')).slice(0, 300);
    if (res.status === 402 || res.status === 429) {
      throw new Error(
        'The free AI pool is busy or rate-limited right now (HTTP ' +
          res.status +
          '). Set POLLINATIONS_API_KEY (https://enter.pollinations.ai) or configure any AI provider to remove the limits.'
      );
    }
    throw new Error(`Free AI pool responded ${res.status}: ${text}`);
  }
  const data = (await res.json()) as Parameters<typeof parseOpenAIChoice>[0];
  const content = parseOpenAIChoice(data);
  if (!content) throw new Error('Empty response from the free AI pool');
  return content;
}

async function callViaEnvKey(messages: ChatMsg[]): Promise<string> {
  return callViaOpenAI(
    messages,
    ENV_BASE_EFF,
    ENV_KEY_EFF,
    ENV_MODEL_EFF
  );
}

/** Direct resolution (env key → SDK → free pool). Used by the tunnel endpoint itself. */
export async function callLLMDirect(messages: ChatMsg[], retries = 2): Promise<string> {
  if (ENV_KEY_EFF) {
    let lastErr: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await callViaEnvKey(messages);
      } catch (e) {
        lastErr = e;
        if (isDefinitiveModelError(e)) throw e;
        if (attempt < retries) await new Promise(r => setTimeout(r, 1200 * (attempt + 1)));
      }
    }
    // the deployment key failed for a non-definitive reason (dead host,
    // network blip, exhausted quota) — degrade to the free pool instead of
    // taking the whole platform's AI down with it
    console.error('[ai] env-key AI failed after retries — falling through to the free pool:', lastErr);
  }

  try {
    return await callViaSdk(messages);
  } catch (sdkErr) {
    // No sandbox SDK config (typical on Vercel/self-host) → try the free
    // key-less pool so the deployment still has working AI out of the box.
    try {
      return await callViaPollinations(messages);
    } catch (freeErr) {
      const sdkMsg = sdkErr instanceof Error ? sdkErr.message : String(sdkErr);
      const freeMsg = freeErr instanceof Error ? freeErr.message : 'AI unavailable';
      if (/Configuration file not found/i.test(sdkMsg)) {
        throw freeErr instanceof Error ? freeErr : new Error(NOT_CONFIGURED_MSG);
      }
      // SDK existed but its endpoint failed — report both attempts clearly.
      throw new Error(`Configured AI endpoint failed (${sdkMsg}). ${freeMsg}`);
    }
  }
}

/**
 * Tunnel-aware LLM entry point used by all feature routes.
 * `override` (the student's own provider) always wins when present.
 */
export async function callLLM(
  messages: ChatMsg[],
  retries = 2,
  override?: StudentAIOverride | null
): Promise<string> {
  if (override) {
    let lastErr: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // 90s per attempt keeps worst-case retries inside Vercel's function
        // limits (2 × 90s < 300s) — longer ceilings caused ALB 502s.
        return await callLLMCustom(messages, override, 90_000);
      } catch (e) {
        lastErr = e;
        // Definitive answers (401/403/410/404-model) are never retried —
        // the provider has made a final decision about this key/model.
        if (isDefinitiveModelError(e)) break;
        if (attempt < retries) await new Promise(r => setTimeout(r, 1200 * (attempt + 1)));
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('Custom AI provider call failed');
  }
  if (envTunnelUrl()) {
    let lastErr: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const data = await tunnelCall<{ text?: string }>(
          { kind: 'llm', messages },
          120_000
        );
        if (data.text && data.text.trim()) return data.text;
        throw new Error('Empty response from AI tunnel');
      } catch (e) {
        lastErr = e;
        if (attempt < retries) await new Promise(r => setTimeout(r, 1200 * (attempt + 1)));
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('AI tunnel call failed');
  }
  return callLLMDirect(messages, retries);
}

/* ------------------------------------------------------------------ */
/* TTS (one chunk per call — route handles chunking + concat)          */
/* ------------------------------------------------------------------ */

async function ttsViaSdk(input: string, voice: string, speed: number): Promise<Buffer> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();
  const response = await zai.audio.tts.create({
    input,
    voice: (TTS_VOICES as readonly string[]).includes(voice) ? voice : 'jam',
    speed: Math.min(2, Math.max(0.5, speed)),
    response_format: 'wav',
    stream: false,
  });
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(new Uint8Array(arrayBuffer));
}

/**
 * Synthesize ONE chunk (≤ ~950 chars) to a WAV buffer.
 * Tunnel mode forwards the chunk to the sandbox; otherwise the local SDK is used.
 */
export async function callTTSChunk(input: string, voice: string, speed: number): Promise<Buffer> {
  if (envTunnelUrl()) {
    const data = await tunnelCall<{ audio?: string }>(
      { kind: 'tts', input, voice, speed },
      120_000
    );
    if (!data.audio) throw new Error('AI tunnel returned no audio');
    return Buffer.from(data.audio, 'base64');
  }
  return ttsViaSdk(input, voice, speed);
}

/* ------------------------------------------------------------------ */
/* ASR                                                                 */
/* ------------------------------------------------------------------ */

async function asrViaSdk(fileBase64: string): Promise<string> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();
  const response = await zai.audio.asr.create({ file_base64: fileBase64 });
  return response.text || '';
}

/** Transcribe a base64 WAV. Tunnel mode forwards to the sandbox. */
export async function callASR(audioBase64: string): Promise<string> {
  if (envTunnelUrl()) {
    const data = await tunnelCall<{ text?: string }>(
      { kind: 'asr', audio: audioBase64 },
      90_000
    );
    return data.text || '';
  }
  return asrViaSdk(audioBase64);
}
