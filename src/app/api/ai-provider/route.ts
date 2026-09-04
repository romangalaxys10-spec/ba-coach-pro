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

export const maxDuration = 60;

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
    const pastedKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';
    const storedKey = typeof student.aiApiKey === 'string' ? student.aiApiKey : '';
    let apiKey = pastedKey || storedKey;
    const localEndpoint = /\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(baseUrl);
    if (!preset.needsKey) {
      // key-less providers (e.g. the Free AI pool): use only a freshly pasted
      // optional key (Pollinations tier key) — never forward a stored key that
      // may belong to a different provider
      apiKey = pastedKey || 'free';
    } else if (!apiKey) {
      return NextResponse.json({ error: 'API key is required.' }, { status: 400 });
    } else if (apiKey.length > 400 || (apiKey.length < 8 && !localEndpoint)) {
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

    // The config is already saved above. Everything below is best-effort
    // verification, wrapped in ONE wall-clock budget: a slow provider or a
    // slow GitHub-backed DB write must never keep this request past the
    // platform's response window (that kills the function and the browser
    // shows "server sent an invalid response").
    const withBudget = async <T>(p: Promise<T>, ms: number): Promise<T | null> => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const timeout = new Promise<null>(resolve => { timer = setTimeout(() => resolve(null), ms); });
      try {
        return await Promise.race([p, timeout]);
      } finally {
        if (timer) clearTimeout(timer);
      }
    };
    const savedState = async () => publicProviderState(await db.student.findUnique({ where: { id: student.id } }));

    const verification = (async () => {
      // 1) authoritative model discovery (also classifies authentication)
      const discovery = await (async () => {
        const d = await discoverModels(cfg, { force: true });
        await persistDiscoveryInHealth(student.id, d);
        return d;
      })();

      if (discovery.status === 'authentication_failed') {
        return {
          ok: true, saved: true, provider: await savedState(), discovery,
          savedModel: { id: model, state: 'unknown' as const, message: 'Not verified — authentication failed.' },
          error: discovery.message,
        };
      }
      if (discovery.status === 'provider_unreachable') {
        return {
          ok: true, saved: true, provider: await savedState(), discovery,
          savedModel: { id: model, state: 'unknown' as const, message: 'Not verified — provider unreachable.' },
          error: discovery.message,
        };
      }

      // 2) if the provider exposes no model list, confirm credentials via live probe
      if (!discovery.models.length) {
        const cred = await withBudget(adapter.validateCredentials(cfg), 15_000);
        if (cred && !cred.ok && cred.status === 'authentication_failed') {
          return {
            ok: true, saved: true, provider: await savedState(), discovery,
            savedModel: { id: model, state: 'unknown' as const, message: 'Not verified — authentication failed.' },
            error: cred.message,
          };
        }
      }

      // 3) validate the chosen model against the CURRENT discovered list
      const probe = (await withBudget(
        adapter.validateModel(cfg, model, discovery.models.length ? discovery.models : undefined),
        20_000
      )) ?? {
        ok: false,
        availability: 'unknown' as const,
        message: 'Verification timed out — model availability could not be checked.',
      };

      if (probe.ok && probe.availability === 'available') {
        await db.student.update({ where: { id: student.id }, data: { aiVerifiedAt: new Date() } });
        return {
          ok: true, saved: true, provider: await savedState(), discovery,
          savedModel: { id: model, state: probe.availability, message: probe.message },
        };
      }

      if (probe.availability === 'retired' || probe.availability === 'unavailable') {
        // definitive lifecycle event — mark, invalidate, refresh, notify
        await markModelUnavailable(student.id, model, probe.availability === 'retired' ? 'retired' : 'unavailable', probe.endOfLife ? 410 : undefined);
        const refreshed = await discoverModels(cfg, { force: true });
        await persistDiscoveryInHealth(student.id, refreshed);
        const notice =
          probe.availability === 'retired'
            ? `Model ${model} is no longer available from ${providerName}. The available model list has been refreshed.`
            : `Model ${model} is not available for this endpoint/account. The available model list has been refreshed.`;
        return {
          ok: true, saved: true, provider: await savedState(), discovery: refreshed,
          savedModel: { id: model, state: probe.availability, message: notice },
          notice,
        };
      }

      return {
        ok: true, saved: true, provider: await savedState(), discovery,
        savedModel: { id: model, state: probe.availability, message: probe.message },
      };
    })();

    const verified = await withBudget(verification, 45_000);
    if (verified) return NextResponse.json(verified);

    // Budget blown — the config IS saved; report it as saved-but-unverified
    // instead of letting the platform kill the function mid-flight. (Any
    // still-running verification work after the response is best-effort and
    // idempotent: it only refreshes cached model lists / verification stamps.)
    const provider = await withBudget(savedState(), 8_000);
    return NextResponse.json({
      ok: true,
      saved: true,
      ...(provider ? { provider } : {}),
      discovery: {
        status: 'provider_unreachable' as const,
        message: 'Verification timed out — the provider did not respond in time.',
        models: [],
        count: 0,
        fetchedAt: null,
      },
      savedModel: { id: model, state: 'unknown' as const, message: 'Not verified — verification exceeded the time budget.' },
      notice: `Config saved. ${providerName} verification is taking unusually long — you can try chatting now and check the provider status again in a moment.`,
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
