import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const { audio } = await req.json();
    if (!audio) {
      return NextResponse.json({ error: 'audio (base64) is required' }, { status: 400 });
    }
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();
    const response = await zai.audio.asr.create({ file_base64: audio });
    const text = response.text || '';
    return NextResponse.json({ text });
  } catch (error) {
    console.error('[/api/asr] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transcription failed' },
      { status: 500 }
    );
  }
}
