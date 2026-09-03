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
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract the raw PCM payload from a WAV buffer */
function wavPayload(buf: Buffer): { payload: Buffer; fmt: Buffer | null } {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('Not a WAV buffer');
  }
  let offset = 12;
  let payload: Buffer | null = null;
  let fmt: Buffer | null = null;
  while (offset + 8 <= buf.length) {
    const id = buf.toString('ascii', offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    const body = buf.subarray(offset + 8, Math.min(offset + 8 + size, buf.length));
    if (id === 'data') payload = Buffer.from(body);
    if (id === 'fmt ') fmt = Buffer.from(body);
    offset += 8 + size + (size % 2); // chunks are word-aligned
  }
  if (!payload) throw new Error('WAV data chunk missing');
  return { payload, fmt };
}

/** Concatenate same-format WAV buffers into one WAV */
function concatWav(buffers: Buffer[]): Buffer {
  if (buffers.length === 1) return buffers[0];
  const fmt = wavPayload(buffers[0]).fmt;
  const channels = fmt ? fmt.readUInt16LE(2) : 1;
  const sampleRate = fmt ? fmt.readUInt32LE(4) : 24000;
  const bitsPerSample = fmt ? fmt.readUInt16LE(14) : 16;
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const payloads = buffers.map(b => wavPayload(b).payload);
  const dataSize = payloads.reduce((n, p) => n + p.length, 0);
  const header = Buffer.alloc(44);
  header.write('RIFF', 0, 'ascii');
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8, 'ascii');
  header.write('fmt ', 12, 'ascii');
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36, 'ascii');
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, ...payloads]);
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
        response_format: 'wav',
        stream: false,
      });
      const arrayBuffer = await response.arrayBuffer();
      buffers.push(Buffer.from(new Uint8Array(arrayBuffer)));
    }

    const audio = buffers.length > 1 ? concatWav(buffers) : buffers[0];
    return new NextResponse(new Uint8Array(audio), {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
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
