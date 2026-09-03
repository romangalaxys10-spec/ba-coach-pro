import { NextRequest, NextResponse } from 'next/server';
import { callASR } from '@/lib/ai';

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const { audio } = await req.json();
    if (!audio) {
      return NextResponse.json({ error: 'audio (base64) is required' }, { status: 400 });
    }
    const text = await callASR(audio);
    return NextResponse.json({ text });
  } catch (error) {
    console.error('[/api/asr] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transcription failed' },
      { status: 500 }
    );
  }
}
