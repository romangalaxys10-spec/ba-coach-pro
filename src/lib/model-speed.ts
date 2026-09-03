/**
 * Model speed ranking for providers that expose a model list without speed
 * metadata (NVIDIA NIM and friends).
 *
 * Two layers:
 *  1. Heuristic estimator — parses model ids (parameter counts, MoE active
 *     params, speed keywords, known families) into a comparable tier. Instant,
 *     no key required. Used for the auto-suggestion the moment a student
 *     picks the NVIDIA preset and to choose which candidates to benchmark.
 *  2. Live benchmark — fires one tiny chat completion per candidate with the
 *     student's own key and measures real tokens/sec + latency. This is the
 *     source of truth for the "fastest models" list.
 *
 * The API key is never stored in cache keys — only a salted hash fragment.
 */

/* ------------------------------------------------------------------ */
/* Heuristic speed estimation                                          */
/* ------------------------------------------------------------------ */

/** Models that are not general-purpose chat models — never suggest them. */
const NON_CHAT_RE =
  /embed|embedqa|retriev|rerank|reranking|reward|guard|content-safety|topic-control|calibration|moderation|deplot|kosmos|nvclip|clip|diffusion|video-detector|synthetic-video|nemotron-parse|ocr|riva|whisper|segment|yolo|muse-/i;

/** Known families with distinctive real-world speed (substring → override). */
const SPEED_OVERRIDES: Array<{ match: RegExp; tier: number; label: string }> = [
  { match: /deepseek-v4-flash/i, tier: 1, label: 'MoE flash family — built for speed' },
  { match: /gpt-oss-20b/i, tier: 1, label: '20B MXFP4 — very fast decode' },
  { match: /nemotron.*lightning/i, tier: 1, label: 'Lightning MoE — NVIDIA speed-optimised' },
  { match: /nemotron-nano/i, tier: 1, label: 'Nano family — fastest Nemotron line' },
  { match: /minitron/i, tier: 2, label: 'Minitron — pruned for speed' },
  { match: /glm-4\.5-flash|glm-4-flash|glm-flash/i, tier: 1.5, label: 'GLM flash tier — fastest GLM line' },
  { match: /glm-4\.5-air|glm-4\.6-air|glm-4\.1-air|glm-air/i, tier: 4, label: 'GLM air — lightweight mid-tier' },
  { match: /gemini[-\d.]*flash/i, tier: 2, label: 'Gemini flash — fast multimodal line' },
  { match: /gemini.*pro/i, tier: 5, label: 'Gemini pro — quality tier' },
  { match: /claude.*haiku|haiku/i, tier: 3, label: 'Haiku — fastest Claude line' },
  { match: /claude.*sonnet|sonnet/i, tier: 5, label: 'Sonnet — balanced Claude tier' },
  { match: /claude.*opus|opus/i, tier: 7, label: 'Opus — heavyweight Claude tier' },
  { match: /gpt-4o-mini|gpt-4\.1-mini|gpt-5-mini|o4-mini/i, tier: 2.5, label: 'Mini GPT tier — fast' },
  { match: /(^|\/)o[134](-|$|_)/i, tier: 6, label: 'Reasoning model — slow first token' },
  { match: /gpt-4o|gpt-4\.1|gpt-5/i, tier: 5, label: 'Full-size GPT — slower than mini' },
  { match: /code-supernova/i, tier: 3, label: 'Supernova — fast coding model' },
  { match: /grok-code|grok-mini|grok-fast/i, tier: 3, label: 'Grok fast/code tier' },
  { match: /deepseek-r1|deepseek-reasoner|reasoning/i, tier: 6, label: 'Reasoning model — thinking tokens slow responses' },
  { match: /deepseek-chat|deepseek-v3/i, tier: 4.5, label: 'DeepSeek chat — mid-speed MoE' },
  { match: /qwen-(turbo|flash)/i, tier: 2, label: 'Qwen turbo/flash — fast line' },
  { match: /qwen-max/i, tier: 5.5, label: 'Qwen max — quality tier' },
  { match: /kimi-k/i, tier: 8, label: 'Trillion-param MoE — heavy' },
  { match: /minimax-m\d/i, tier: 8, label: 'Large MoE — heavy' },
  { match: /nemotron-3-ultra|ultra-253b/i, tier: 8, label: 'Ultra 550B — quality over speed' },
  { match: /deepseek-v4-pro/i, tier: 7, label: 'Pro tier — slower than flash' },
  { match: /mistral-large/i, tier: 7, label: 'Large dense — slow' },
  { match: /nemotron-4-340b/i, tier: 9, label: '340B dense — very slow' },
];

export interface SpeedEstimate {
  /** lower = faster; 1 (fastest) … 9 (slowest); 99 = not a chat model */
  tier: number;
  /** active (MoE) or total (dense) parameters in billions, when parseable */
  paramsB: number | null;
  totalB: number | null;
  label: string;
}

export function estimateSpeed(modelId: string): SpeedEstimate {
  const s = modelId.toLowerCase();

  if (NON_CHAT_RE.test(s)) {
    return { tier: 99, paramsB: null, totalB: null, label: 'not a chat model' };
  }

  for (const o of SPEED_OVERRIDES) {
    if (o.match.test(s)) return { tier: o.tier, paramsB: null, totalB: null, label: o.label };
  }

  // total params: largest "…b" token (gemma-3-12b-it → 12, mixtral-8x22b → 22)
  const sizes = [...s.matchAll(/(\d+(?:\.\d+)?)b(?![a-z0-9])/g)].map(m => parseFloat(m[1]));
  const totalB = sizes.length ? Math.max(...sizes) : null;

  // MoE active params: "a3b" / "a12b" / "a55b"
  const act = s.match(/a(\d+(?:\.\d+)?)b(?![a-z0-9])/);
  const activeB = act ? parseFloat(act[1]) : null;

  // speed-determining size = MoE active params when present, else total
  const paramsB = activeB ?? totalB;

  let tier: number;
  let sizeLabel: string;
  if (paramsB == null) {
    tier = 6;
    sizeLabel = 'speed unknown';
  } else if (paramsB <= 3) {
    tier = 1;
    sizeLabel = `${trim(paramsB)}B ${activeB ? 'active (MoE)' : 'dense'} — tiny & quick`;
  } else if (paramsB <= 5) {
    tier = 1.5;
    sizeLabel = `${trim(paramsB)}B ${activeB ? 'active (MoE)' : 'dense'} — very fast`;
  } else if (paramsB <= 9) {
    tier = 2;
    sizeLabel = `${trim(paramsB)}B — fast`;
  } else if (paramsB <= 14) {
    tier = 3;
    sizeLabel = `${trim(paramsB)}B — medium`;
  } else if (paramsB <= 24) {
    tier = 4;
    sizeLabel = `${trim(paramsB)}B — medium`;
  } else if (paramsB <= 35) {
    tier = 5;
    sizeLabel = `${trim(paramsB)}B — slowish`;
  } else if (paramsB <= 60) {
    tier = 6;
    sizeLabel = `${trim(paramsB)}B — slow`;
  } else if (paramsB <= 80) {
    tier = 7;
    sizeLabel = `${trim(paramsB)}B — slow`;
  } else if (paramsB <= 130) {
    tier = 8;
    sizeLabel = `${trim(paramsB)}B — heavy`;
  } else {
    tier = 9;
    sizeLabel = `${trim(paramsB)}B — very heavy`;
  }

  // keyword nudges (half a tier each)
  if (/nano|flash|lightning|turbo|mini\b|lite\b|small\b|instant\b|air\b|swift|express|rapid/.test(s)) tier -= 0.5;
  if (/ultra|large|pro\b|plus\b|max\b|opus\b|giant|huge/.test(s)) tier += 0.5;
  if (/-it\b|instruct|chat/.test(s)) tier -= 0.1; // tuned chat variants respond cleanly

  return {
    tier: Math.max(1, Math.min(9.5, tier)),
    paramsB,
    totalB,
    label: sizeLabel,
  };
}

function trim(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** Heuristic sort: fastest first; recognisable chat families win ties. */
export function rankByEstimate(ids: string[]): string[] {
  return [...ids].sort((a, b) => {
    const ea = estimateSpeed(a);
    const eb = estimateSpeed(b);
    if (ea.tier !== eb.tier) return ea.tier - eb.tier;
    const brand = (id: string) =>
      /nemotron|deepseek|llama|mistral|gemma|qwen|gpt|phi|granite/i.test(id) ? 0 : 1;
    const br = brand(a) - brand(b);
    if (br !== 0) return br;
    return a.localeCompare(b);
  });
}

/**
 * Filter the raw model list down to plausible general-purpose chat models and
 * order them fastest-first (heuristic).
 */
export function chatCandidates(ids: string[]): string[] {
  const unique = [...new Set(ids)];
  const chat = unique.filter(id => estimateSpeed(id).tier < 99);
  return rankByEstimate(chat);
}

/* ------------------------------------------------------------------ */
/* Live benchmark                                                      */
/* ------------------------------------------------------------------ */

export interface BenchRow {
  model: string;
  ok: boolean;
  /** output tokens per second (measured) */
  tokPerSec?: number;
  /** wall time of the whole tiny completion */
  latencyMs?: number;
  outTokens?: number;
  reply?: string;
  error?: string;
}

export interface BenchOptions {
  baseUrl: string;
  apiKey: string;
  /** ordered candidate list (fastest-first heuristic) */
  models: string[];
  /** how many of the list to benchmark (default 30) */
  limit?: number;
  concurrency?: number;
  timeoutMs?: number;
}

/**
 * Benchmark candidates concurrently. Each model gets one tiny request
 * ("Reply with exactly one word: OK", max_tokens 24) — enough to measure
 * response speed without burning the student's quota.
 */
export async function benchmarkModels(opts: BenchOptions): Promise<BenchRow[]> {
  const limit = Math.min(opts.models.length, opts.limit ?? 30);
  const queue = opts.models.slice(0, limit);
  const concurrency = Math.max(1, Math.min(opts.concurrency ?? 6, 12));
  const results: BenchRow[] = new Array(queue.length);

  let cursor = 0;
  async function worker() {
    while (cursor < queue.length) {
      const idx = cursor++;
      results[idx] = await benchOne(opts.baseUrl, opts.apiKey, queue[idx], opts.timeoutMs ?? 14000);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
  return results;
}

async function benchOne(baseUrl: string, apiKey: string, model: string, timeoutMs: number): Promise<BenchRow> {
  const t0 = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Reply with exactly one word: OK' }],
        max_tokens: 24,
        temperature: 0,
        stream: false,
      }),
      signal: ctrl.signal,
      cache: 'no-store',
    });
    const latencyMs = Date.now() - t0;

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      let error = `HTTP ${res.status}`;
      if (res.status === 429) error = 'rate limited (429) — not ranked';
      else if (res.status === 401 || res.status === 403) error = 'rejected — invalid key for this model';
      else if (res.status === 404) error = 'not available on this account (404)';
      else if (res.status === 410) error = 'retired (410)';
      else if (body) error += `: ${body.slice(0, 120)}`;
      return { model, ok: false, latencyMs, error };
    }

    const j = (await res.json().catch(() => null)) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { completion_tokens?: number };
    } | null;

    const text = j?.choices?.[0]?.message?.content ?? '';
    const outTokens = j?.usage?.completion_tokens ?? roughTokens(text);
    const tokPerSec = outTokens > 0 ? outTokens / (latencyMs / 1000) : 0;
    return {
      model,
      ok: tokPerSec > 0,
      tokPerSec: tokPerSec > 0 ? Math.round(tokPerSec * 10) / 10 : undefined,
      latencyMs,
      outTokens,
      reply: text.slice(0, 40) || undefined,
      error: tokPerSec > 0 ? undefined : 'empty response',
    };
  } catch (e) {
    const aborted = e instanceof Error && (e.name === 'AbortError' || /abort/i.test(e.message));
    return {
      model,
      ok: false,
      latencyMs: Date.now() - t0,
      error: aborted ? `slower than ${Math.round(timeoutMs / 1000)}s — too slow` : 'request failed',
    };
  } finally {
    clearTimeout(timer);
  }
}

function roughTokens(text: string): number {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

/* ------------------------------------------------------------------ */
/* Result cache (per server instance, 10 min)                          */
/* ------------------------------------------------------------------ */

import { createHash } from 'node:crypto';

interface CacheEntry {
  at: number;
  payload: unknown;
}

const CACHE_TTL_MS = 10 * 60 * 1000;
const globalCache = globalThis as unknown as { __baFastModels?: Map<string, CacheEntry> };
const cache: Map<string, CacheEntry> = (globalCache.__baFastModels ??= new Map());

export function cacheKey(baseUrl: string, apiKey: string): string {
  const frag = createHash('sha256').update(apiKey || '').digest('hex').slice(0, 16);
  return `${baseUrl}::${frag}`;
}

export function getCached<T>(key: string): T | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.payload as T;
}

export function setCached(key: string, payload: unknown): void {
  cache.set(key, { at: Date.now(), payload });
}

/* ------------------------------------------------------------------ */
/* Orchestration — fetch all models, rank, return top 10               */
/* ------------------------------------------------------------------ */

export interface FastModelRow {
  model: string;
  /** true = heuristic estimate only (no key available for measurement) */
  estimated: boolean;
  tokPerSec?: number;
  latencyMs?: number;
  outTokens?: number;
  /** heuristic size/family label, or measured reply */
  note?: string;
}

export interface FastestResult {
  ok: boolean;
  status?: number;
  providerId: string;
  providerName: string;
  baseUrl: string;
  totalModels: number;
  chatCandidates: number;
  benchmarked: number;
  /** true when no key was available — tiers are estimates, not measurements */
  estimated: boolean;
  /** 'live' = provider's /models list; 'fallback' = built-in preset suggestions */
  listSource?: 'live' | 'fallback';
  suggested: string | null;
  results: FastModelRow[];
  errors: Array<{ model: string; error: string }>;
  fetchedAt: string;
  cached?: boolean;
  message?: string;
}

interface ModelsListResponse {
  data?: Array<{ id?: string }>;
}

async function fetchProviderModels(
  baseUrl: string,
  apiKey: string
): Promise<{ ok: boolean; status?: number; ids: string[]; error?: string }> {
  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/models`, {
      headers: apiKey ? { authorization: `Bearer ${apiKey}` } : {},
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return {
        ok: false,
        status: res.status,
        ids: [],
        error:
          res.status === 401 || res.status === 403
            ? 'The provider rejected the API key while listing models.'
            : `Model list request failed (HTTP ${res.status}).`,
      };
    }
    const j = (await res.json().catch(() => null)) as ModelsListResponse | null;
    const ids = (j?.data ?? []).map(m => (m?.id || '').trim()).filter(Boolean);
    return { ok: true, ids };
  } catch {
    return { ok: false, ids: [], error: 'Provider unreachable — could not fetch the model list.' };
  }
}

const TOP_N = 10;

export async function benchModelList(input: {
  providerId: string;
  providerName: string;
  baseUrl: string;
  apiKey: string;
  refresh: boolean;
  limit?: number;
  /** built-in suggestions used when the endpoint hides its model list */
  fallbackModels?: string[];
}): Promise<FastestResult> {
  const { providerId, providerName, baseUrl, apiKey, refresh, fallbackModels = [] } = input;

  const key = cacheKey(baseUrl, apiKey);
  if (!refresh) {
    const hit = getCached<FastestResult>(key);
    if (hit) return { ...hit, cached: true };
  }

  const list = await fetchProviderModels(baseUrl, apiKey);
  const base: Omit<FastestResult, 'results' | 'suggested' | 'benchmarked' | 'estimated' | 'ok'> = {
    providerId,
    providerName,
    baseUrl,
    totalModels: list.ids.length,
    chatCandidates: 0,
    errors: [],
    fetchedAt: new Date().toISOString(),
    listSource: 'live',
  };

  // Endpoints that hide /models (OpenAdapter & Z.ai without a key, custom
  // servers without a list) fall back to the preset's built-in suggestions —
  // with a key those are still benchmarked for real tok/s.
  let fallbackNotice: string | null = null;
  if (!list.ids.length && fallbackModels.length) {
    list.ids = [...fallbackModels];
    base.totalModels = fallbackModels.length;
    base.listSource = 'fallback';
    fallbackNotice = apiKey
      ? `Live model list unavailable from this endpoint — benchmarked the built-in suggestions instead.`
      : `This provider hides its model list without a key — showing built-in suggestions (estimated). Paste your key and press "Measure real speed".`;
  }

  if (!list.ids.length && !fallbackModels.length) {
    return {
      ...base,
      ok: false,
      status: list.status,
      benchmarked: 0,
      estimated: true,
      suggested: null,
      results: [],
      message:
        list.error ||
        'This endpoint does not expose a model list — type the model id manually, or paste a key and press Test.',
    };
  }

  const candidates = chatCandidates(list.ids);
  base.chatCandidates = candidates.length;

  // No key → heuristic-only suggestion (still auto-fetches the live list).
  if (!apiKey) {
    const results: FastModelRow[] = candidates.slice(0, TOP_N).map(id => ({
      model: id,
      estimated: true,
      note: estimateSpeed(id).label,
    }));
    const out: FastestResult = {
      ...base,
      ok: true,
      benchmarked: 0,
      estimated: true,
      suggested: results[0]?.model ?? null,
      results,
      message:
        fallbackNotice ||
        'Showing estimated speed (parameter counts and model families). Press "Measure real speed" after pasting your key for measured tokens/sec.',
    };
    setCached(key, out);
    return out;
  }

  const rows = await benchmarkModels({
    baseUrl,
    apiKey,
    models: candidates,
    limit: input.limit ?? 30,
  });

  const okRows = rows
    .filter(r => r.ok)
    .sort((a, b) => (b.tokPerSec ?? 0) - (a.tokPerSec ?? 0) || (a.latencyMs ?? 0) - (b.latencyMs ?? 0));
  const failed = rows.filter(r => !r.ok).map(r => ({ model: r.model, error: r.error || 'failed' }));

  // any heuristic-fast candidate we did not reach (beyond the benchmark cap)
  // completes the suggestions so the list always has 10 entries
  const measured = okRows.map(r => ({
    model: r.model,
    estimated: false,
    tokPerSec: r.tokPerSec,
    latencyMs: r.latencyMs,
    outTokens: r.outTokens,
    note: r.reply ? `replied "${r.reply}"` : undefined,
  }));
  const measuredSet = new Set(measured.map(m => m.model));
  const filler = candidates
    .filter(id => !measuredSet.has(id) && !failed.some(f => f.model === id))
    .slice(0, TOP_N - measured.length)
    .map(id => ({ model: id, estimated: true, note: estimateSpeed(id).label }));

  const results = [...measured, ...filler].slice(0, TOP_N);
  const out: FastestResult = {
    ...base,
    ok: results.length > 0,
    benchmarked: rows.length,
    estimated: false,
    suggested: results[0]?.model ?? null,
    results,
    errors: failed.slice(0, 12),
    message: fallbackNotice
      ? `${fallbackNotice} ${okRows.length ? `Fastest: ${results[0]?.model}.` : ''}`.trim()
      : okRows.length
        ? `Measured ${rows.length} models live — ${okRows.length} responded. Ranked by real tokens/sec.`
        : 'None of the candidate models responded — check your key/quota, or the endpoint is busy.',
  };
  setCached(key, out);
  return out;
}
