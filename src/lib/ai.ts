/**
 * Unified AI client.
 *
 * Resolution order:
 *  1. `ZAI_API_KEY` (+ optional `ZAI_BASE_URL`, default https://api.z.ai/api/paas/v4)
 *     — direct OpenAI-compatible calls. Works on any host (Vercel, Railway, VPS).
 *  2. `z-ai-web-dev-sdk` — reads the standard .z-ai-config file chain. Works in
 *     the Z.ai dev sandbox and self-hosted environments that provide one.
 *
 * If neither is available, callers get a clear, actionable error instead of a
 * cryptic network failure.
 */

export interface ChatMsg {
  role: string;
  content: string;
}

const ENV_KEY = process.env.ZAI_API_KEY || '';
const ENV_BASE = (process.env.ZAI_BASE_URL || 'https://api.z.ai/api/paas/v4').replace(/\/$/, '');

export const NOT_CONFIGURED_MSG =
  '🤖 **AI coaching is not configured on this deployment.**\n\n' +
  'Everything else (student accounts, GitHub backups, templates, progress) works — to light up live AI, set `ZAI_API_KEY` (+ optional `ZAI_BASE_URL`, default `https://api.z.ai/api/paas/v4`) in your hosting environment. Self-hosted instances inside the Z.ai sandbox work out of the box.';

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

export async function callLLM(messages: ChatMsg[], retries = 2): Promise<string> {
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
