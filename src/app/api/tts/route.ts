import { NextRequest, NextResponse } from 'next/server';
import { callTTSChunk } from '@/lib/ai';
import { splitIntoChunks, speakableText, concatWav } from '@/lib/audio';

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'jam', speed = 1.0 } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }
    const clean = speakableText(text);
    if (!clean) return NextResponse.json({ error: 'nothing speakable in text' }, { status: 400 });

    const chunks = splitIntoChunks(clean);

    const buffers: Buffer[] = [];
    for (const chunk of chunks.slice(0, 12)) {
      // Each chunk goes through the AI gateway (tunnel → local SDK).
      buffers.push(await callTTSChunk(chunk, voice, Number(speed) || 1));
    }

    const audio = buffers.length > 1 ? concatWav(buffers) : buffers[0];
    return new NextResponse(new Uint8Array(audio), {
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[/api/tts] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'TTS failed' },
      { status: 500 }
    );
  }
}
