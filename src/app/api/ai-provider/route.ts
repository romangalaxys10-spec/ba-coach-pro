import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthedStudent, unauthorized } from '@/lib/auth';
import {
  AI_PROVIDER_PRESETS,
  getPreset,
  publicProviderState,
  sanitizeBaseUrl,
  type ProviderDiscovery,
  type SavedModelState,
} from '@/lib/ai-providers';
import { getAdapter, providerDisplayName, type ProviderConfig } from '@/lib/provider-adapters';
import {
  discoverModels,
  getProviderHealth,
  markModelUnavailable,
  persistDiscoveryInHealth,
} from '@/lib/provider-runtime';

export const maxDuration = 120;

/**
 * GET /api/ai-provider — masked provider state + discovery health + saved-model
 * reconciliation (against the provider's CURRENT model list).
 */
export async function GET(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  const row = await db.student.findUnique({ where: { id: student.id } });
  if (!row) return NextResponse.json({ error: 'student not found' }, { status: 404 });

  const provider = publicProviderState(row);
  if (!provider.configured) {
    return NextResponse.json({
      provider,
      discovery: { status: 'connected', message: '', models: [], count: 0, fetchedAt: null },
      savedModel: { id: null, state: 'none' },
      retiredModels: [],
      providerName: 'Deployment AI',
    });
  }

  const health = await getProviderHealth(row);
  return NextResponse.json({ provider, ...health });
}

/**
 * PUT /api/ai-provider — save + full verification pipeline:
 *   save → discover models (force) → credential classification →
 *   validate saved model → stamp verification / flag retirement.
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
        { error: 'Model is required (e.g. gpt-4o-mini, glm-4.7, deepseek-ai/deepseek-v4-flash-0731).' },
        { status: 400 }
      );
    }

    // Key: empty → keep the stored one so students can change models without re-pasting
    const apiKey = (body.apiKey || '').trim() || student.aiApiKey || '';
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required.' }, { status: 400 });
    }
    if (apiKey.length < 8 || apiKey.length > 400) {
      return NextResponse.json({ error: 'That API key length looks wrong — please double-check it.' }, { status: 400 });
    }

    // Persist the configuration (verification state is decided by the pipeline below)
    await db.student.update({
      where: { id: student.id },
      data: {
        aiProviderId: preset.id,
        aiBaseUrl: baseUrl,
        aiApiKey: apiKey,
        aiModel: model,
        aiVerifiedAt: null,
      },
    });

    const cfg: ProviderConfig = { providerId: preset.id, baseUrl, apiKey, model };
    const adapter = getAdapter(preset.id);
    const providerName = providerDisplayName(preset.id);

    // 1) authoritative model discovery (also classifies authentication)
    const discovery = await discoverModels(cfg, { force: true });
    await persistDiscoveryInHealth(student.id, discovery);

    if (discovery.status === 'authentication_failed') {
      return NextResponse.json({
        ok: true,
        saved: true,
        provider: publicProviderState(await db.student.findUnique({ where: { id: student.id } })),
        discovery,
        savedModel: { id: model, state: 'unknown', message: 'Not verified — authentication failed.' },
        error: discovery.message,
      });
    }
    if (discovery.status === 'provider_unreachable') {
      return NextResponse.json({
        ok: true,
        saved: true,
        provider: publicProviderState(await db.student.findUnique({ where: { id: student.id } })),
        discovery,
        savedModel: { id: model, state: 'unknown', message: 'Not verified — provider unreachable.' },
        error: discovery.message,
      });
    }

    // 2) if the provider exposes no model list, confirm credentials via live probe
    if (!discovery.models.length) {
      const cred = await adapter.validateCredentials(cfg);
      if (!cred.ok && cred.status === 'authentication_failed') {
        return NextResponse.json({
          ok: true,
          saved: true,
          provider: publicProviderState(await db.student.findUnique({ where: { id: student.id } })),
          discovery,
          savedModel: { id: model, state: 'unknown', message: 'Not verified — authentication failed.' },
          error: cred.message,
        });
      }
    }

    // 3) validate the chosen model against the CURRENT discovered list
    const probe = await adapter.validateModel(cfg, model, discovery.models.length ? discovery.models : undefined);

    let notice: string | undefined;
    let savedModelState: SavedModelState = { id: model, state: probe.availability, message: probe.message };

    if (probe.ok && probe.availability === 'available') {
      await db.student.update({ where: { id: student.id }, data: { aiVerifiedAt: new Date() } });
    } else if (probe.availability === 'retired' || probe.availability === 'unavailable') {
      // definitive lifecycle event — mark, invalidate, refresh, notify
      await markModelUnavailable(student.id, model, probe.availability === 'retired' ? 'retired' : 'unavailable', probe.endOfLife ? 410 : undefined);
      const refreshed = await discoverModels(cfg, { force: true });
      await persistDiscoveryInHealth(student.id, refreshed);
      notice =
        probe.availability === 'retired'
          ? `Model ${model} is no longer available from ${providerName}. The available model list has been refreshed.`
          : `Model ${model} is not available for this endpoint/account. The available model list has been refreshed.`;
      savedModelState = {
        id: model,
        state: probe.availability,
        message: notice,
      };
      return NextResponse.json({
        ok: true,
        saved: true,
        provider: publicProviderState(await db.student.findUnique({ where: { id: student.id } })),
        discovery: refreshed,
        savedModel: savedModelState,
        notice,
      });
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      provider: publicProviderState(await db.student.findUnique({ where: { id: student.id } })),
      discovery,
      savedModel: savedModelState,
      notice,
    });
  } catch (error) {
    console.error('[/api/ai-provider PUT] error:', error);
    return NextResponse.json(
      { error: 'Could not save the AI provider config — please try again.', detail: error instanceof Error ? error.message : undefined },
      { status: 500 }
    );
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
      aiModelsCache: null,
      aiModelsFetchedAt: null,
      aiRetiredModels: null,
    },
  });
  return NextResponse.json({ ok: true, provider: publicProviderState(null) });
}
