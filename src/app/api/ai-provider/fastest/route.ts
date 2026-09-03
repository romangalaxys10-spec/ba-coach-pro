import { NextRequest, NextResponse } from 'next/server';
import { getAuthedStudent, unauthorized } from '@/lib/auth';
import { getPreset, sanitizeBaseUrl } from '@/lib/ai-providers';
import { db } from '@/lib/db';
import { benchModelList } from '@/lib/model-speed';

export const maxDuration = 120;

/**
 * POST /api/ai-provider/fastest
 *
 * Auto-fetches every model the provider currently exposes, ranks them by
 * speed and returns the top 10:
 *   - with the student's key available: LIVE benchmark (tokens/sec measured
 *     on a tiny completion per model) — the authoritative ranking;
 *   - without a key: heuristic estimate (parameter counts / MoE active
 *     params / speed families) — instant, marked `estimated: true`.
 *
 * Body: { providerId, baseUrl?, apiKey?, refresh?, limit? }
 * The key is optional: NVIDIA's model list is public. No key is ever cached
 * by content or logged; the stored key is used when the request omits it.
 */
export async function POST(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  let body: {
    providerId?: string;
    baseUrl?: string;
    apiKey?: string;
    refresh?: boolean;
    limit?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const preset = getPreset(body.providerId);
  if (!preset) {
    return NextResponse.json({ error: 'Unknown provider preset.' }, { status: 400 });
  }

  const baseUrl = sanitizeBaseUrl((body.baseUrl || '').trim() || preset.baseUrl);
  if (!baseUrl) {
    return NextResponse.json({ error: 'Invalid base URL.' }, { status: 400 });
  }

  // key: request → stored. Needed only for live measurement, not for listing.
  const row = await db.student.findUnique({ where: { id: student.id } });
  const stored =
    row && row.aiProviderId === preset.id && row.aiBaseUrl === baseUrl ? row.aiApiKey || '' : '';
  const apiKey = (body.apiKey || '').trim() || stored;

  const result = await benchModelList({
    providerId: preset.id,
    providerName: preset.name,
    baseUrl,
    apiKey,
    refresh: Boolean(body.refresh),
    limit: Number(body.limit) || undefined,
    fallbackModels: preset.models,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : result.status ?? 502 });
}
