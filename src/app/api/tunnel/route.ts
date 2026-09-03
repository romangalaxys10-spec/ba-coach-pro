import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Tunnel — the server side of the proxy tunnel.
 *
 * Deployments that cannot reach the Z.ai internal model endpoints (e.g. the
 * Vercel demo) forward their AI calls here. This endpoint executes them with
 * the local z-ai-web-dev-sdk (which resolves the internal GLM-5 models via
 * .z-ai-config) and returns the results.
 *
 * Security: if the TUNNEL_KEY env var is set on this instance, every request
 * must carry a matching `x-tunnel-key` header. When unset, the tunnel is open
 * — same trust level as the rest of the public demo.
 *
 * Usage:
 *   GET  /api/tunnel          → health check (no model call)
 *   POST { kind: 'llm',  messages }            → { text }
 *   POST { kind: 'tts',  input, voice, speed } → { audio: base64 WAV }
 *   POST { kind: 'asr',  audio: base64 WAV }   → { text }
 */

import { callLLMDirect, callTTSChunk, callASR, type ChatMsg } from '@/lib/ai';

export const maxDuration = 300;

export async function GET() {
  return NextResponse.json({
    ok: true,
    tunnel: 'ba-coach-pro',
    kinds: ['llm', 'tts', 'asr'],
    secured: Boolean(process.env.TUNNEL_KEY),
  });
}

export async function POST(req: NextRequest) {
  // ---- shared-secret check ----
  const serverKey = process.env.TUNNEL_KEY || '';
  if (serverKey && req.headers.get('x-tunnel-key') !== serverKey) {
    return NextResponse.json({ error: 'Invalid tunnel key' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      kind?: string;
      messages?: ChatMsg[];
      input?: string;
      voice?: string;
      speed?: number;
      audio?: string;
    };

    switch (body.kind) {
      case 'llm': {
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (!messages.length) {
          return NextResponse.json({ error: 'messages are required' }, { status: 400 });
        }
        const text = await callLLMDirect(messages);
        return NextResponse.json({ text });
      }

      case 'tts': {
        const input = (body.input || '').trim();
        if (!input) {
          return NextResponse.json({ error: 'input is required' }, { status: 400 });
        }
        const buffer = await callTTSChunk(
          input.slice(0, 1200),
          body.voice || 'jam',
          Number(body.speed) || 1
        );
        return NextResponse.json({ audio: buffer.toString('base64') });
      }

      case 'asr': {
        if (!body.audio) {
          return NextResponse.json({ error: 'audio (base64) is required' }, { status: 400 });
        }
        const text = await callASR(body.audio);
        return NextResponse.json({ text });
      }

      default:
        return NextResponse.json(
          { error: `Unknown kind "${body.kind}" — use llm | tts | asr` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[/api/tunnel] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Tunnel call failed' },
      { status: 500 }
    );
  }
}
