/**
 * Custom AI provider presets.
 *
 * Students can plug their own OpenAI-compatible API key into their profile
 * (Settings → AI Provider). Their key is used for their chats, quizzes and
 * flashcards — bypassing the deployment-wide AI (tunnel / ZAI_API_KEY / SDK).
 *
 * All preset endpoints below were verified live:
 *  - Z.ai Coding Plan : https://api.z.ai/api/coding/paas/v4   (OpenAI protocol, GLM Coding Plan subscription)
 *  - NVIDIA NIM       : https://integrate.api.nvidia.com/v1   (free tier keys at build.nvidia.com, `nvapi-…`)
 *  - OpenCode Zen     : https://opencode.ai/zen/v1            (OpenAI-compatible; free models like code-supernova / grok-code)
 *  - OpenAdapter      : https://api.openadapter.dev/v1        (aggregator — 79+ models across 15+ providers)
 */

export interface ProviderPreset {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  signupUrl: string;
  baseUrl: string;
  models: string[];
  defaultModel: string;
  /** free-text entry always allowed on top of the suggested list */
  keyHint: string;
  needsKey: boolean;
  freeTier?: boolean;
  note?: string;
  /** provider exposes a model list → settings shows the auto "fastest models" panel */
  fastModels?: boolean;
}

export const AI_PROVIDER_PRESETS: ProviderPreset[] = [
  {
    id: 'zai-coding',
    name: 'Z.ai Coding Plan',
    emoji: '🟢',
    tagline: 'Your GLM Coding Plan key — GLM-4.7 / 4.6 / 4.5 family',
    signupUrl: 'https://z.ai/subscribe',
    baseUrl: 'https://api.z.ai/api/coding/paas/v4',
    models: ['glm-4.7', 'glm-4.6', 'glm-4.5', 'glm-4.5-air', 'glm-4.5-flash'],
    defaultModel: 'glm-4.7',
    keyHint: 'Paste your Z.ai API key',
    needsKey: true,
    fastModels: true,
    note: 'Uses the Coding Plan endpoint (OpenAI protocol). Any active GLM Coding Plan subscription works. The GLM models are ranked fastest-first below — "Measure real speed" benchmarks them with your key.',
  },
  {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM',
    emoji: '🟩',
    tagline: 'build.nvidia.com key — Nemotron Nano, Mistral, Gemma, Llama',
    signupUrl: 'https://build.nvidia.com/explore',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    models: [
      'nvidia/nemotron-3.5-lightning-30b-a3b',
      'meta/llama-3.2-11b-vision-instruct',
      'google/gemma-4-31b-it',
      'deepseek-ai/deepseek-v4-flash-0731',
    ],
    defaultModel: 'nvidia/nemotron-3.5-lightning-30b-a3b',
    keyHint: 'Paste your nvapi-… key from build.nvidia.com',
    needsKey: true,
    freeTier: true,
    fastModels: true,
    note: 'Free 1,000 API credits from build.nvidia.com. Keys start with nvapi-. IMPORTANT: free-tier keys can only call a subset of models — Nemotron Lightning and Llama 3.2 are verified working; some catalogue models (Nano 3, Mistral 7B, Gemma 3) return 404 on free accounts. Press "Measure real speed" to benchmark what YOUR key can actually call, fastest-first.',
  },
  {
    id: 'pollinations-free',
    name: 'Free AI (no key)',
    emoji: '🆓',
    tagline: 'Pollinations open pool — zero setup, zero cost',
    signupUrl: 'https://enter.pollinations.ai',
    baseUrl: 'https://text.pollinations.ai/openai',
    models: ['openai', 'openai-fast'],
    defaultModel: 'openai',
    keyHint: 'No key needed — leave empty (paste an optional enter.pollinations.ai key to remove limits)',
    needsKey: false,
    freeTier: true,
    note: 'The key-less community AI pool (no signup, no card): only the "openai" and "openai-fast" models are available anonymously, and traffic is rate-limited. A key from enter.pollinations.ai removes the limits and unlocks 40+ models (the app automatically switches to the modern keyed API when a key is pasted). For guaranteed-free chats, NVIDIA NIM gives 1,000 credits with a free key.',
  },
  {
    id: 'opencode-zen',
    name: 'OpenCode Zen',
    emoji: '🔵',
    tagline: 'opencode.ai curated gateway — free models with a free key',
    signupUrl: 'https://opencode.ai/auth',
    baseUrl: 'https://opencode.ai/zen/v1',
    models: ['gemini-3.8-flash', 'claude-haiku-4-5', 'gpt-5.6-luna', 'gpt-5.5', 'gemini-3.5-flash', 'claude-sonnet-4-5'],
    defaultModel: 'gemini-3.8-flash',
    keyHint: 'Paste your OpenCode Zen API key',
    needsKey: true,
    freeTier: true,
    fastModels: true,
    note: 'Zen is the OpenCode team’s curated model gateway — OpenAI-compatible at /zen/v1. The model list is public (66+ models) but chat requires a free key from opencode.ai/auth — code-supernova and grok-code were retired in 2026. The full live model list is fetched automatically and ranked fastest-first.',
  },
  {
    id: 'openadapter',
    name: 'OpenAdapter',
    emoji: '🟠',
    tagline: 'openadapter.dev — one key, SOTA models across 15+ providers',
    signupUrl: 'https://openadapter.dev',
    baseUrl: 'https://api.openadapter.dev/v1',
    models: [
      'Qwen3.8-Flash',
      'DeepSeek-V4-Flash',
      'GLM-5.1',
      'GPT-5.6-Luna',
      'Kimi-K2.6',
      'gemma-4-31b-it',
      'MiniMax-M3',
    ],
    defaultModel: 'Qwen3.8-Flash',
    keyHint: 'Paste your OpenAdapter API key',
    needsKey: true,
    freeTier: true,
    fastModels: true,
    note: 'One key, every upstream provider. Their /models endpoint requires a key — until you paste one, the list below shows BUILT-IN suggestions (current as of Sep 2026), not a live fetch. With a key, "Measure real speed" benchmarks what your account can actually call, fastest-first. Model ids are case-sensitive (e.g. Qwen3.8-Flash).',
  },
  {
    id: 'custom',
    name: 'Custom OpenAI-compatible',
    emoji: '⚙️',
    tagline: 'OpenRouter, Groq, DeepSeek, Together, local Ollama / LM Studio…',
    signupUrl: 'https://openrouter.ai/keys',
    baseUrl: '',
    models: [],
    defaultModel: '',
    keyHint: 'Paste the API key (local servers: any string)',
    needsKey: true,
    fastModels: true,
    note: 'Any endpoint speaking the OpenAI chat/completions protocol. Local http:// is allowed for localhost / 127.0.0.1 (Ollama, LM Studio, vLLM). If the endpoint exposes /models, all models are fetched and ranked fastest-first.',
  },
];

export const PRESET_IDS = AI_PROVIDER_PRESETS.map(p => p.id);

/* ------------------------------------------------------------------ */
/* Discovery / validation layer — shared client+server types           */
/* ------------------------------------------------------------------ */

export type DiscoveryStatus =
  | 'connected'
  | 'authentication_failed'
  | 'models_unavailable'
  | 'provider_unreachable'
  | 'invalid_configuration';

export type ModelAvailability = 'available' | 'unavailable' | 'retired' | 'unknown';

export interface ProviderModelCapabilities {
  chat?: boolean;
  completion?: boolean;
  vision?: boolean;
  tools?: boolean;
  reasoning?: boolean;
  embeddings?: boolean;
}

export interface ProviderModel {
  id: string;
  name?: string;
  provider: string;
  capabilities?: ProviderModelCapabilities;
  contextWindow?: number;
  deprecated?: boolean;
  lifecycle?: {
    status?: 'active' | 'deprecated' | 'retired' | 'unknown';
    endOfLife?: string;
  };
  /** true when this entry comes from static fallback metadata, NOT the provider's live API */
  unverified?: boolean;
  raw?: unknown;
}

/** What the model-discovery layer returns to the UI. */
export interface ProviderDiscovery {
  status: DiscoveryStatus;
  message: string;
  models: ProviderModel[];
  count: number;
  fetchedAt?: string | null;
  fallbackUsed?: boolean;
}

export interface SavedModelState {
  id: string | null;
  state: ModelAvailability | 'none';
  message?: string;
}

export function getPreset(id: string | null | undefined): ProviderPreset | null {
  if (!id) return null;
  return AI_PROVIDER_PRESETS.find(p => p.id === id) || null;
}

/** Mask an API key for display: never return the full key to any client. */
export function maskKey(key: string | null | undefined): string | null {
  if (!key) return null;
  const k = key.trim();
  if (k === 'free' || k === 'none') return 'none (free tier)';
  if (k.length <= 8) return '••••';
  return `${k.slice(0, 4)}••••${k.slice(-4)}`;
}

/**
 * Normalize / sanity-check a base URL coming from a student:
 *  - trim, drop trailing slash
 *  - accept a full .../chat/completions paste and reduce it to the base
 *  - require https; plain http and private/loopback hosts only when the
 *    deployment opted in via ALLOW_LOCAL_AI_ENDPOINTS=1 (local Ollama /
 *    LM Studio on self-hosts)
 * Returns null when the URL is unusable.
 */
export function sanitizeBaseUrl(raw: string): string | null {
  let u = (raw || '').trim();
  if (!u) return null;
  u = u.replace(/\/chat\/completions\/?$/i, '');
  u = u.replace(/\/+$/, '');
  // Seamless migration: auto-upgrade deprecated legacy text.pollinations.ai to gen.pollinations.ai/v1
  if (/text\.pollinations\.ai/i.test(u)) {
    u = 'https://gen.pollinations.ai/v1';
  }
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  const allowLocal = process.env.ALLOW_LOCAL_AI_ENDPOINTS === '1';
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    if (parsed.username || parsed.password) return null; // no embedded credentials
    if (parsed.search || parsed.hash) return null; // a base URL needs no query/fragment
    let host = parsed.hostname.toLowerCase().replace(/\.+$/, ''); // no trailing-dot tricks
    const isPrivate = privateHostCheck(host);
    if (isPrivate && !allowLocal) return null;
    if (parsed.protocol === 'http:' && !allowLocal) return null;
    return u;
  } catch {
    return null;
  }
}

/**
 * True for loopback / private-network hosts in ANY notation we can detect
 * (canonical IPv4 RFC1918 + loopback, alternate-encoding IPv4, IPv6 loopback
 * and ULA, .internal/.local names). DNS rebinding (public name → private IP)
 * is re-checked at fetch time by the same rules via guardProviderUrl.
 */
export function privateHostCheck(rawHost: string): boolean {
  const host = rawHost.toLowerCase().replace(/\.+$/, '');
  if (host.endsWith(']')) {
    // IPv6 literal — only ::1/loopback forms are recognised as local; every
    // other IPv6 (incl. fc00::/7 ULA and fe80::/10 link-local) is private too
    const v6 = host.replace(/^\[|\]$/g, '');
    if (v6 === '::1' || v6 === '::') return true;
    if (/^f[cd]/.test(v6) || /^fe[89ab]/.test(v6)) return true;
    return false;
  }
  if (/^0x[0-9a-f]+$/i.test(host) || /^\d+$/.test(host) || /0\d/.test(host)) {
    // non-canonical IPv4 encodings (hex, decimal, octal) — reject outright
    return true;
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    const octets = host.split('.').map(Number);
    if (octets.some(o => o > 255)) return true;
    const [a, b] = octets;
    if (a === 127 || a === 10 || a === 0 || a === 169 || a === 100 || a === 198 || a === 192) {
      if (a === 192 && b !== 168) return false; // 192.0.x etc. is public
      if (a === 198 && !(b === 18 || b === 19)) return false; // benchmark range only
      return true; // 127/8, 10/8, 0/8, 169.254, 100.64/10, 198.18/15, 192.168
    }
    if (a === 172 && b >= 16 && b <= 31) return true;
    return false;
  }
  return (
    host === 'localhost' ||
    host === 'metadata' ||
    host === 'metadata.google.internal' ||
    host.endsWith('.internal') ||
    host.endsWith('.local') ||
    host.endsWith('.localhost')
  );
}

/**
 * Build the per-request override from a student record (Prisma Student or the
 * AuthedStudent projection — both carry the ai* fields). Returns null when the
 * student has no usable provider configured.
 */
export function studentAIOverride(student: {
  aiBaseUrl?: string | null;
  aiApiKey?: string | null;
  aiModel?: string | null;
} | null | undefined): { baseUrl: string; apiKey: string; model: string } | null {
  if (!student) return null;
  const baseUrl = sanitizeBaseUrl(student.aiBaseUrl || '');
  const apiKey = (student.aiApiKey || '').trim();
  const model = (student.aiModel || '').trim();
  if (!baseUrl || !apiKey || !model) return null;
  return { baseUrl, apiKey, model };
}

/** Masked, client-safe projection of a student's saved provider (never leaks the key). */
export function publicProviderState(student?: {
  aiProviderId?: string | null;
  aiBaseUrl?: string | null;
  aiApiKey?: string | null;
  aiModel?: string | null;
  aiVerifiedAt?: Date | string | null;
} | null) {
  if (!student) {
    return { configured: false, providerId: null, baseUrl: null, model: null, keyMasked: null, verifiedAt: null };
  }
  const configured = Boolean(student.aiBaseUrl && student.aiApiKey && student.aiModel);
  return {
    configured,
    providerId: configured ? student.aiProviderId || null : null,
    baseUrl: configured ? student.aiBaseUrl : null,
    model: configured ? student.aiModel : null,
    keyMasked: configured ? maskKey(student.aiApiKey) : null,
    verifiedAt: student.aiVerifiedAt ?? null,
  };
}

export type PublicProviderState = ReturnType<typeof publicProviderState>;
