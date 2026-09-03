import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthedStudent, unauthorized } from '@/lib/auth';
import { publicProviderState, studentAIOverride } from '@/lib/ai-providers';
import {
  discoverModels,
  persistDiscoveryInHealth,
  refreshAfterRetirement,
} from '@/lib/provider-runtime';
import type { ProviderConfig } from '@/lib/provider-adapters';

export const maxDuration = 60;

/**
 * POST /api/ai-provider/models  { force?: boolean }
 *
 * The "↻ Refresh models" action — re-queries the provider's model list and
 * reconciles the saved model against it. Cache is invalidated when:
 * API key/endpoint change (implicit via cache key), 410 retirement (automatic),
 * manual refresh (force), or any provider configuration change.
 */
export async function POST(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  const row = await db.student.findUnique({ where: { id: student.id } });
  if (!row) return NextResponse.json({ error: 'student not found' }, { status: 404 });

  const provider = publicProviderState(row);
  if (!provider.configured) {
    return NextResponse.json(
      { error: 'Configure a provider first — enter your base URL and API key, then save.' },
      { status: 400 }
    );
  }

  let force = true;
  try {
    const body = (await req.json()) as { force?: boolean };
    if (typeof body.force === 'boolean') force = body.force;
  } catch {
    /* empty body → force refresh */
  }

  const override = studentAIOverride(row);
  if (!override) {
    return NextResponse.json({ error: 'Provider configuration is incomplete.' }, { status: 400 });
  }

  const cfg: ProviderConfig = {
    providerId: row.aiProviderId || 'custom',
    baseUrl: override.baseUrl,
    apiKey: override.apiKey,
    model: override.model,
  };

  try {
    const discovery = force
      ? await refreshAfterRetirement(student.id, cfg) // clears mem + DB cache, re-fetches, persists
      : await discoverModels(cfg);
    if (!force) await persistDiscoveryInHealth(student.id, discovery);

    // reconcile the saved model against the fresh list
    let retiredModels: string[] = [];
    try {
      retiredModels = JSON.parse(row.aiRetiredModels || '[]') as string[];
    } catch {
      retiredModels = [];
    }
    const savedModelId = (row.aiModel || '').trim() || null;
    let savedModelState: { id: string | null; state: string; message?: string } = { id: savedModelId, state: 'none' };
    if (savedModelId) {
      if (retiredModels.includes(savedModelId)) {
        savedModelState = {
          id: savedModelId,
          state: 'retired',
          message: `Model ${savedModelId} has been retired by the provider. Pick another model.`,
        };
      } else {
        const found = discovery.models.find(m => m.id === savedModelId);
        savedModelState = found
          ? { id: savedModelId, state: 'available', message: 'Model verified against the provider’s current list.' }
          : {
              id: savedModelId,
              state: 'unavailable',
              message: `Model ${savedModelId} is not in the provider's current model list. Pick another model.`,
            };
      }
    }

    return NextResponse.json({
      ok: discovery.status === 'connected',
      provider,
      discovery,
      savedModel: savedModelState,
      retiredModels,
    });
  } catch (error) {
    console.error('[/api/ai-provider/models POST] error:', error);
    return NextResponse.json(
      { ok: false, error: 'Model refresh failed — please retry.', detail: error instanceof Error ? error.message : undefined },
      { status: 500 }
    );
  }
}
