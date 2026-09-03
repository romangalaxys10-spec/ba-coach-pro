/**
 * Provider runtime — glues the adapter layer to the student's saved config.
 *
 * Responsibilities:
 *  - short-lived model-discovery cache (in-memory per instance + persisted
 *    per-student in the DB so cold serverless starts stay fast)
 *  - reconciliation of the saved model against the provider's CURRENT list
 *  - definitive model-retirement handling (HTTP 410 / model-404): mark retired,
 *    invalidate cache, refresh the list, surface an actionable message, and
 *    never retry that model again for this configuration
 */

import { createHash } from 'crypto';
import { db } from '@/lib/db';
import { callLLM, type ChatMsg } from '@/lib/ai';
import {
  capModels,
  classifyProviderError,
  getAdapter,
  providerDisplayName,
  type ClassifiedError,
  type ProviderConfig,
} from '@/lib/provider-adapters';
import {
  studentAIOverride,
  type ModelAvailability,
  type ProviderDiscovery,
  type ProviderModel,
  type SavedModelState,
} from '@/lib/ai-providers';
import type { AuthedStudent } from '@/lib/auth';

const MEM_TTL = 5 * 60_000;
const DB_TTL = 10 * 60_000;
const MAX_RETAINED_MODELS = 120;
const MAX_RETIRED = 100;

interface MemEntry {
  models: ProviderModel[];
  ok: boolean;
  fetchedAt: number;
}

const memCache = new Map<string, MemEntry>();

function cacheKey(cfg: ProviderConfig): string {
  const hash = createHash('sha256').update(cfg.apiKey || '').digest('hex').slice(0, 16);
  return `${cfg.providerId}|${cfg.baseUrl}|${hash}`;
}

function studentConfig(student: {
  aiProviderId?: string | null;
  aiBaseUrl?: string | null;
  aiApiKey?: string | null;
  aiModel?: string | null;
}): ProviderConfig | null {
  const override = studentAIOverride(student);
  if (!override) return null;
  return {
    providerId: student.aiProviderId || 'custom',
    baseUrl: override.baseUrl,
    apiKey: override.apiKey,
    model: override.model,
  };
}

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function retiredModelsOf(student: { aiRetiredModels?: string | null }): string[] {
  return parseJson<string[]>(student.aiRetiredModels, []).filter(m => typeof m === 'string');
}

async function persistRetired(studentId: string, models: string[]): Promise<void> {
  await db.student.update({
    where: { id: studentId },
    data: { aiRetiredModels: JSON.stringify(models.slice(-MAX_RETIRED)) },
  });
}

/** Mark a model definitively unavailable → invalidate cached list, remember retirement. */
export async function markModelUnavailable(
  studentId: string,
  modelId: string,
  reason: 'retired' | 'unavailable',
  providerStatus?: number
): Promise<void> {
  const student = await db.student.findUnique({
    where: { id: studentId },
    select: { aiRetiredModels: true },
  });
  const current = retiredModelsOf(student);
  if (!current.includes(modelId)) current.push(modelId);
  await persistRetired(studentId, current);
  // invalidate any cached list — it still contains the dead model
  await db.student.update({
    where: { id: studentId },
    data: { aiModelsFetchedAt: null },
  });
  console.log(`[provider-runtime] model ${reason} (${providerStatus ?? 'n/a'}): ${modelId} — cache invalidated`);
}

/**
 * Model discovery with two-layer cache. `force` bypasses both layers
 * (manual "Refresh models" and post-retirement refreshes).
 */
export async function discoverModels(
  cfg: ProviderConfig,
  opts?: { force?: boolean }
): Promise<ProviderDiscovery> {
  const key = cacheKey(cfg);
  const now = Date.now();

  if (!opts?.force) {
    const mem = memCache.get(key);
    if (mem && now - mem.fetchedAt < MEM_TTL) {
      return {
        status: mem.ok ? 'connected' : 'models_unavailable',
        message: mem.ok ? `${mem.models.length} models available` : 'Using the last known model list.',
        models: mem.models,
        count: mem.models.length,
        fetchedAt: new Date(mem.fetchedAt).toISOString(),
      };
    }
  }

  const adapter = getAdapter(cfg.providerId);
  const outcome = await adapter.listModels(cfg);
  const entry: MemEntry = { models: outcome.models, ok: outcome.ok, fetchedAt: now };
  memCache.set(key, entry);

  return {
    status: outcome.status,
    message: outcome.message,
    models: outcome.models,
    count: outcome.models.length,
    fetchedAt: new Date(now).toISOString(),
    fallbackUsed: outcome.fallbackUsed,
  };
}

async function cachedFromDb(student: { aiModelsCache?: string | null; aiModelsFetchedAt?: Date | string | null }) {
  const fetchedAt = student.aiModelsFetchedAt ? new Date(student.aiModelsFetchedAt) : null;
  if (!fetchedAt || Date.now() - fetchedAt.getTime() > DB_TTL) return null;
  const models = parseJson<ProviderModel[]>(student.aiModelsCache, []);
  if (!models.length) return null;
  return { models, fetchedAt };
}

export interface ProviderHealth {
  discovery: ProviderDiscovery;
  savedModel: SavedModelState;
  retiredModels: string[];
  providerName: string;
}

/**
 * Full health snapshot for the settings UI: discovery (cached when fresh,
 * refreshed when stale) + reconciliation of the saved model.
 */
export async function getProviderHealth(
  student: {
    id: string;
    aiProviderId?: string | null;
    aiBaseUrl?: string | null;
    aiApiKey?: string | null;
    aiModel?: string | null;
    aiModelsCache?: string | null;
    aiModelsFetchedAt?: Date | string | null;
    aiRetiredModels?: string | null;
  }
): Promise<ProviderHealth> {
  const cfg = studentConfig(student);
  const retired = retiredModelsOf(student);
  const savedModelId = (student.aiModel || '').trim() || null;
  const providerName = cfg ? providerDisplayName(cfg.providerId) : 'provider';

  const none: ProviderHealth = {
    discovery: { status: 'connected', message: '', models: [], count: 0, fetchedAt: null },
    savedModel: { id: savedModelId, state: 'none' },
    retiredModels: retired,
    providerName,
  };
  if (!cfg) return none;

  const adapter = getAdapter(cfg.providerId);
  let models: ProviderModel[] = [];
  let fetchedAt: string | null = null;
  let status: ProviderDiscovery['status'] = 'models_unavailable';
  let message = '';
  let fallbackUsed = false;

  const dbCache = await cachedFromDb(student);
  if (dbCache && !retired.length) {
    // fast path: fresh persisted discovery — reconcile against it
    models = dbCache.models;
    fetchedAt = dbCache.fetchedAt.toISOString();
    // kick off a background refresh for next time (fire and forget)
    void discoverModels(cfg, { force: true })
      .then(r => persistDiscovery(student.id, r))
      .catch(() => null);
    status = 'connected';
    message = `${models.length} models available (cached)`;
  } else {
    // stale or retirement happened → refresh inline (bounded by adapter timeouts)
    try {
      const fresh = await discoverModels(cfg, { force: true });
      await persistDiscovery(student.id, fresh);
      models = fresh.models;
      fetchedAt = fresh.fetchedAt || null;
      status = fresh.status;
      message = fresh.message;
      fallbackUsed = Boolean(fresh.fallbackUsed);
    } catch (e) {
      const cls = classifyProviderError(e, cfg.baseUrl);
      status = cls.kind === 'auth' ? 'authentication_failed' : 'provider_unreachable';
      message = cls.message;
    }
  }

  // reconcile the saved model against the CURRENT discovered list + retirement memory
  const savedModel = await reconcileSavedModel(savedModelId, models, retired, {
    ok: status === 'connected',
  });

  return {
    discovery: { status, message, models, count: models.length, fetchedAt, fallbackUsed },
    savedModel,
    retiredModels: retired,
    providerName,
  };
}

async function persistDiscovery(studentId: string, discovery: ProviderDiscovery): Promise<void> {
  try {
    await db.student.update({
      where: { id: studentId },
      data: {
        aiModelsCache: JSON.stringify(capModels(discovery.models, MAX_RETAINED_MODELS)),
        aiModelsFetchedAt: discovery.fetchedAt ? new Date(discovery.fetchedAt) : new Date(),
      },
    });
  } catch (e) {
    console.error('[provider-runtime] persistDiscovery failed:', e);
  }
}

/** Public alias used by the ai-provider routes after explicit discovery. */
export const persistDiscoveryInHealth = persistDiscovery;

async function reconcileSavedModel(
  modelId: string | null,
  discovered: ProviderModel[],
  retired: string[],
  discoveryState: { ok: boolean }
): Promise<SavedModelState> {
  if (!modelId) return { id: null, state: 'none' };
  if (retired.includes(modelId)) {
    return {
      id: modelId,
      state: 'retired',
      message: `Model ${modelId} has been retired by the provider. Pick another model from the refreshed list.`,
    };
  }
  if (discoveryState.ok && discovered.length) {
    const found = discovered.find(m => m.id === modelId);
    if (!found) {
      return {
        id: modelId,
        state: 'unavailable',
        message: `Model ${modelId} is no longer in the provider's current model list. Pick another model.`,
      };
    }
    if (found.lifecycle?.status === 'retired') {
      return { id: modelId, state: 'retired', message: `Model ${modelId} has been retired by the provider.` };
    }
    return { id: modelId, state: 'available', message: 'Model verified against the provider’s current list.' };
  }
  return { id: modelId, state: 'unknown', message: 'Model could not be verified — the provider’s model list is currently unavailable.' };
}

/**
 * The one LLM entry point for feature routes (chat / quiz / flashcards).
 * Deployment chain when no custom provider; student provider otherwise, with
 * retirement enforcement and classified, actionable errors.
 */
export async function callLLMForStudent(
  student: Pick<AuthedStudent, 'id' | 'aiProviderId' | 'aiBaseUrl' | 'aiApiKey' | 'aiModel' | 'aiRetiredModels'> & { aiRetiredModels?: string | null },
  messages: ChatMsg[],
  retries = 1
): Promise<string> {
  const override = studentAIOverride(student);

  if (!override) {
    return callLLM(messages, 2); // deployment chain (tunnel / env key / SDK)
  }

  const cfg: ProviderConfig = {
    providerId: student.aiProviderId || 'custom',
    baseUrl: override.baseUrl,
    apiKey: override.apiKey,
    model: override.model,
  };
  const adapter = getAdapter(cfg.providerId);

  // Retirement pre-check — never even dial a model the provider has retired.
  const retired = retiredModelsOf(student);
  if (retired.includes(override.model)) {
    void refreshAfterRetirement(student.id, cfg).catch(() => null);
    throw new Error(
      `Model ${override.model} has been retired by ${providerDisplayName(cfg.providerId)} and is no longer available. The available model list has been refreshed — pick another model in Settings → AI provider.`
    );
  }

  try {
    return await callLLM(messages, retries, override);
  } catch (e) {
    const cls = classifyProviderError(e, cfg.baseUrl);
    if (cls.kind === 'retired' || cls.kind === 'model_not_found') {
      await markModelUnavailable(student.id, override.model, cls.kind === 'retired' ? 'retired' : 'unavailable', cls.httpStatus);
      void refreshAfterRetirement(student.id, cfg).catch(() => null);
      throw new Error(
        `${cls.message} The available model list has been refreshed — pick another model in Settings → AI provider.`
      );
    }
    throw new Error(cls.message);
  }
}

/** Invalidate + re-fetch the model list after a retirement event (or manual refresh). */
export async function refreshAfterRetirement(studentId: string, cfg: ProviderConfig): Promise<ProviderDiscovery> {
  try {
    memCache.delete(cacheKey(cfg));
    await db.student.update({ where: { id: studentId }, data: { aiModelsFetchedAt: null } });
    const discovery = await discoverModels(cfg, { force: true });
    await persistDiscovery(studentId, discovery);
    console.log(`[provider-runtime] post-retirement refresh for ${cfg.providerId}: ${discovery.count} models`);
    return discovery;
  } catch (e) {
    console.error('[provider-runtime] refreshAfterRetirement failed:', e);
    throw e;
  }
}
