/**
 * Unified AI client with three resolution modes.
 *
 * Resolution order (for every model call — LLM, TTS, ASR):
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
 *
 * If none is available, callers get a clear, actionable error instead of a
 * cryptic network failure.
 */

import { TTS_VOICES } from '@/lib/audio';

export interface ChatMsg {
  role: string;
  content: string;
}

const envTunnelUrl = () => (process.env.AI_TUNNEL_URL || '').replace(/\/$/, '');
const envTunnelKey = () => process.env.AI_TUNNEL_KEY || '';
const ENV_KEY = process.env.ZAI_API_KEY || '';
const ENV_BASE = (process.env.ZAI_BASE_URL || 'https://api.z.ai/api/paas/v4').replace(/\/$/, '');

export function aiMode(): 'tunnel' | 'env-key' | 'sdk' {
  return envTunnelUrl() ? 'tunnel' : ENV_KEY ? 'env-key' : 'sdk';
}

export const NOT_CONFIGURED_MSG =
  '🤖 **AI coaching is not configured on this deployment.**\n\n' +
  'Everything else (student accounts, GitHub backups, templates, progress) works — to light up live AI, either:\n' +
  '1. **AI tunnel (no key needed)** — set `AI_TUNNEL_URL` to a running Z.ai sandbox instance of this app (e.g. `https://preview-<id>.space-z.ai`), so model calls are proxied to its internal GLM-5 models; or\n' +
  '2. **Direct API key** — set `ZAI_API_KEY` (+ optional `ZAI_BASE_URL`, default `https://api.z.ai/api/paas/v4`) in your hosting environment.\n\n' +
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

async function callViaEnvKey(messages: ChatMsg[]): Promise<string> {
  const res = await fetch(`${ENV_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ENV_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.ZAI_MODEL || 'glm-4.7',
      messages,
      thinking: { type: 'disabled' },
    } as Record<string, unknown>),
    signal: AbortSignal.timeout(180_000),
  });
  if (!res.ok) {
    const text = (await res.text().catch(() => '')).slice(0, 200);
    throw new Error(`AI endpoint responded ${res.status}: ${text}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content || !content.trim()) throw new Error('Empty response from AI model');
  return content;
}

async function callViaSdk(messages: ChatMsg[]): Promise<string> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();
  const completion = await zai.chat.completions.create({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: messages as any,
    thinking: { type: 'disabled' },
  });
  const content = completion.choices?.[0]?.message?.content;
  if (!content || !content.trim()) throw new Error('Empty response from model');
  return content;
}

/** Direct resolution (env key → SDK). Used by the tunnel endpoint itself. */
export async function callLLMDirect(messages: ChatMsg[], retries = 2): Promise<string> {
  if (ENV_KEY) {
    let lastErr: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await callViaEnvKey(messages);
      } catch (e) {
        lastErr = e;
        if (attempt < retries) await new Promise(r => setTimeout(r, 1200 * (attempt + 1)));
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('AI call failed');
  }

  try {
    return await callViaSdk(messages);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/Configuration file not found/i.test(msg)) {
      throw new Error(NOT_CONFIGURED_MSG);
    }
    throw e;
  }
}

/** Tunnel-aware LLM entry point used by all feature routes. */
export async function callLLM(messages: ChatMsg[], retries = 2): Promise<string> {
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
