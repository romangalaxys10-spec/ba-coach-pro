import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;

function splitIntoChunks(text: string, maxLength = 950): string[] {
  const sentences = text.match(/[^.!?;]+[.!?;]*[\s]*/g) || [text];
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if ((current + sentence).length <= maxLength) {
      current += sentence;
    } else {
      if (current.trim()) chunks.push(current.trim());
      if (sentence.length > maxLength) {
        // hard-split very long sentence
        let rest = sentence;
        while (rest.length > maxLength) {
          chunks.push(rest.slice(0, maxLength).trim());
          rest = rest.slice(maxLength);
        }
        current = rest;
      } else {
        current = sentence;
      }
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text.slice(0, maxLength)];
}

/** Strip markdown so the spoken audio sounds natural */
function speakableText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' (code block omitted) ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~`>|]/g, '')
    .replace(/\|/g, ' ')
    .replace(/^\s*[-+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, (m) => m)
    .replace(/\s+/g, ' ')
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'jam', speed = 1.0 } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }
    const clean = speakableText(text);
    if (!clean) return NextResponse.json({ error: 'nothing speakable in text' }, { status: 400 });

    const chunks = splitIntoChunks(clean);
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const buffers: Buffer[] = [];
    for (const chunk of chunks.slice(0, 12)) {
      const response = await zai.audio.tts.create({
        input: chunk,
        voice: ['jam', 'kazi', 'xiaochen', 'tongtong', 'douji', 'luodo', 'chuichui'].includes(voice) ? voice : 'jam',
        speed: Math.min(2, Math.max(0.5, Number(speed) || 1)),
        response_format: 'mp3',
        stream: false,
      });
      const arrayBuffer = await response.arrayBuffer();
      buffers.push(Buffer.from(new Uint8Array(arrayBuffer)));
    }

    const audio = Buffer.concat(buffers);
    return new NextResponse(new Uint8Array(audio), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audio.length.toString(),
        'Cache-Control': 'no-cache',
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
