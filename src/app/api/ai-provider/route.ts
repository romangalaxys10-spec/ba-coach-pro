import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthedStudent, unauthorized } from '@/lib/auth';
import {
  AI_PROVIDER_PRESETS,
  getPreset,
  publicProviderState,
  sanitizeBaseUrl,
} from '@/lib/ai-providers';

export const maxDuration = 60;

/** GET /api/ai-provider — masked state of the student's saved provider. */
export async function GET(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();
  return NextResponse.json({ provider: publicProviderState(student) });
}

/**
 * PUT /api/ai-provider
 * { providerId, baseUrl?, apiKey?, model? }
 * - providerId: preset id or 'custom'
 * - apiKey may be omitted to KEEP the previously saved key (model/URL edits)
 */
export async function PUT(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  try {
    const body = (await req.json()) as {
      providerId?: string;
      baseUrl?: string;
      apiKey?: string;
      model?: string;
    };

    const preset = getPreset(body.providerId);
    if (!preset) {
      return NextResponse.json(
        { error: `Unknown provider. Choose one of: ${AI_PROVIDER_PRESETS.map(p => p.id).join(', ')}.` },
        { status: 400 }
      );
    }

    // Base URL: preset default unless the student overrides it (required for custom)
    const rawBase = (body.baseUrl || '').trim() || preset.baseUrl;
    if (!rawBase) {
      return NextResponse.json({ error: 'Base URL is required for a custom provider.' }, { status: 400 });
    }
    const baseUrl = sanitizeBaseUrl(rawBase);
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Invalid base URL. Use an https:// OpenAI-compatible endpoint (plain http:// is allowed for localhost only).' },
        { status: 400 }
      );
    }

    const model = (body.model || '').trim() || preset.defaultModel;
    if (!model) {
      return NextResponse.json(
        { error: 'Model is required (e.g. gpt-4o-mini, glm-4.7, meta/llama-3.3-70b-instruct).' },
        { status: 400 }
      );
    }

    // Key: empty → keep the stored one so students can change models without re-pasting
    const apiKey = (body.apiKey || '').trim() || student.aiApiKey || '';
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required.' }, { status: 400 });
    }
    if (apiKey.length < 8 || apiKey.length > 400) {
      return NextResponse.json(
        { error: 'That API key length looks wrong — please double-check it.' },
        { status: 400 }
      );
    }

    await db.student.update({
      where: { id: student.id },
      data: {
        aiProviderId: preset.id,
        aiBaseUrl: baseUrl,
        aiApiKey: apiKey,
        aiModel: model,
        aiVerifiedAt: null, // must pass "Test connection" again after any change
      },
    });

    const fresh = await db.student.findUnique({ where: { id: student.id } });
    return NextResponse.json({
      ok: true,
      provider: publicProviderState(fresh),
      hint: 'Saved. Press Test connection to verify, then just chat — your provider is used automatically.',
    });
  } catch (error) {
    console.error('[/api/ai-provider PUT] error:', error);
    return NextResponse.json({ error: 'Could not save the AI provider config.' }, { status: 500 });
  }
}

/** DELETE /api/ai-provider — remove the custom provider, back to the deployment default AI. */
export async function DELETE(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  await db.student.update({
    where: { id: student.id },
    data: {
      aiProviderId: null,
      aiBaseUrl: null,
      aiApiKey: null,
      aiModel: null,
      aiVerifiedAt: null,
    },
  });
  return NextResponse.json({ ok: true, provider: publicProviderState(null) });
}
