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
    note: 'Uses the Coding Plan endpoint (OpenAI protocol). Any active GLM Coding Plan subscription works.',
  },
  {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM',
    emoji: '🟩',
    tagline: 'build.nvidia.com free-tier key — Llama, DeepSeek, Nemotron, Qwen',
    signupUrl: 'https://build.nvidia.com/explore',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    models: [
      'deepseek-ai/deepseek-v4-flash-0731',
      'openai/gpt-oss-20b',
      'nvidia/nemotron-3.5-lightning-30b-a3b',
      'nvidia/nemotron-nano-3-30b-a3b',
      'google/gemma-3-4b-it',
      'nv-mistralai/mistral-nemo-12b-instruct',
      'moonshotai/kimi-k3',
      'nvidia/nemotron-3-ultra-550b-a55b',
    ],
    defaultModel: 'deepseek-ai/deepseek-v4-flash-0731',
    keyHint: 'Paste your nvapi-… key',
    needsKey: true,
    freeTier: true,
    fastModels: true,
    note: 'Free API credits from build.nvidia.com. Keys start with nvapi-. All models are auto-fetched and ranked by speed — the fastest 10 are suggested, and "Measure real speed" benchmarks them live with your key.',
  },
  {
    id: 'opencode-zen',
    name: 'OpenCode Zen',
    emoji: '🔵',
    tagline: 'opencode.ai tested & verified models — free coding models included',
    signupUrl: 'https://opencode.ai/auth',
    baseUrl: 'https://opencode.ai/zen/v1',
    models: ['code-supernova', 'grok-code', 'kimi-k2.7', 'gemini-3.8-flash', 'claude-opus-5'],
    defaultModel: 'code-supernova',
    keyHint: 'Paste your OpenCode Zen API key',
    needsKey: true,
    freeTier: true,
    note: 'Zen is the OpenCode team’s curated model gateway — OpenAI-compatible at /zen/v1.',
  },
  {
    id: 'openadapter',
    name: 'OpenAdapter',
    emoji: '🟠',
    tagline: 'openadapter.dev — one key, 79+ models across 15+ providers',
    signupUrl: 'https://openadapter.dev',
    baseUrl: 'https://api.openadapter.dev/v1',
    models: [],
    defaultModel: '',
    keyHint: 'Paste your OpenAdapter API key',
    needsKey: true,
    note: 'Model IDs depend on the upstream provider (e.g. gpt-4o-mini, claude-sonnet-4, llama-3.3-70b). Type any model id your plan supports and press Test.',
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
    note: 'Any endpoint speaking the OpenAI chat/completions protocol. Local http:// is allowed for localhost / 127.0.0.1 (Ollama, LM Studio, vLLM).',
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
  if (k.length <= 8) return '••••';
  return `${k.slice(0, 4)}••••${k.slice(-4)}`;
}

/**
 * Normalize / sanity-check a base URL coming from a student:
 *  - trim, drop trailing slash
 *  - accept a full .../chat/completions paste and reduce it to the base
 *  - require http(s); plain http only for localhost / 127.0.0.1 / [::1]
 * Returns null when the URL is unusable.
 */
export function sanitizeBaseUrl(raw: string): string | null {
  let u = (raw || '').trim();
  if (!u) return null;
  u = u.replace(/\/chat\/completions\/?$/i, '');
  u = u.replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    const host = parsed.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '0.0.0.0';
    if (parsed.protocol === 'http:' && !isLocal) return null;
    return u;
  } catch {
    return null;
  }
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
