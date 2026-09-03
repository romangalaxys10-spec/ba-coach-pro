'use client';

import { readJson } from '@/lib/client-api';

/** Client-side voice helpers: microphone recording → WAV base64, and TTS playback. */

export interface RecordingSession {
  stop: () => Promise<string>; // resolves with base64 wav
  cancel: () => void;
}

function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return buffer;
}

function downsample(input: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (toRate >= fromRate) return input;
  const ratio = fromRate / toRate;
  const length = Math.round(input.length / ratio);
  const result = new Float32Array(length);
  let pos = 0;
  for (let i = 0; i < length; i++) {
    const nextPos = Math.round((i + 1) * ratio);
    let sum = 0;
    let count = 0;
    for (let j = pos; j < nextPos && j < input.length; j++) {
      sum += input[j];
      count++;
    }
    result[i] = count > 0 ? sum / count : 0;
    pos = nextPos;
  }
  return result;
}

export async function startRecording(): Promise<RecordingSession> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = e => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  recorder.start();

  let cancelled = false;

  const cleanup = () => stream.getTracks().forEach(t => t.stop());

  const stop = () =>
    new Promise<string>((resolve, reject) => {
      recorder.onstop = async () => {
        cleanup();
        if (cancelled) return reject(new Error('cancelled'));
        try {
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          const arrayBuffer = await blob.arrayBuffer();
          const Ctx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new Ctx();
          const decoded = await ctx.decodeAudioData(arrayBuffer);
          // downmix to mono
          const mono = new Float32Array(decoded.length);
          for (let ch = 0; ch < decoded.numberOfChannels; ch++) {
            const data = decoded.getChannelData(ch);
            for (let i = 0; i < decoded.length; i++) mono[i] += data[i] / decoded.numberOfChannels;
          }
          const targetRate = 16000;
          const downsampled = downsample(mono, decoded.sampleRate, targetRate);
          const wavBuffer = encodeWav(downsampled, targetRate);
          ctx.close();
          const bytes = new Uint8Array(wavBuffer);
          let binary = '';
          const CHUNK = 0x8000;
          for (let i = 0; i < bytes.length; i += CHUNK) {
            binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
          }
          resolve(btoa(binary));
        } catch (e) {
          reject(e);
        }
      };
      recorder.stop();
    });

  return {
    stop,
    cancel: () => {
      cancelled = true;
      try {
        if (recorder.state !== 'inactive') recorder.stop();
      } catch {
        /* already stopped */
      }
      cleanup();
    },
  };
}

export async function transcribeAudio(base64Wav: string): Promise<string> {
  const res = await fetch('/api/asr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audio: base64Wav }),
  });
  const data = await readJson<{ error?: string; text?: string }>(res);
  if (!res.ok || data.error) throw new Error(data.error || 'Transcription failed');
  return (data.text || '').trim();
}

export interface TtsHandle {
  stop: () => void;
  done: Promise<void>;
}

export function speakText(text: string, voice = 'jam'): TtsHandle {
  const audio = new Audio();
  let objectUrl: string | null = null;
  let stopped = false;

  const done = (async () => {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });
    if (!res.ok) {
      const data = await readJson<{ error?: string }>(res).catch((): { error?: string } => ({}));
      throw new Error(data.error || 'Speech generation failed');
    }
    if (stopped) return;
    const blob = await res.blob();
    if (stopped) return;
    objectUrl = URL.createObjectURL(blob);
    audio.src = objectUrl;
    await new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Audio playback failed'));
      void audio.play().catch(reject);
    });
  })();

  return {
    stop: () => {
      stopped = true;
      audio.pause();
      audio.currentTime = 0;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    },
    done: done.finally(() => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }),
  };
}
