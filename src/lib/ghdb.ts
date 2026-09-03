/**
 * GitHub-backed durable data layer for ephemeral hosts (the public demo).
 *
 * The platform's normal store is Prisma + SQLite. On ephemeral hosts
 * (Vercel serverless) the filesystem is wiped, so the demo instead persists
 * every record as JSON files inside a PRIVATE GitHub repo provisioned with
 * DEMO_DB_TOKEN. The adapter below mirrors the small slice of the Prisma
 * API the app actually uses, so `src/lib/db.ts` can swap implementations
 * without touching any route handler.
 *
 * Files:
 *   db/students.json · db/conversations.json · db/messages.json
 *   db/quizAttempts.json · db/lessonProgress.json · db/flashcardStats.json
 */

const API = 'https://api.github.com';

const OWNER = process.env.DEMO_DB_OWNER || '';
const REPO = process.env.DEMO_DB_REPO || '';
const TOKEN = process.env.DEMO_DB_TOKEN || '';

export const ghDbEnabled = Boolean(OWNER && REPO && TOKEN);

type Row = Record<string, unknown>;
type FileData = Record<string, Row[]>;

const FILES = ['students', 'conversations', 'messages', 'quizAttempts', 'lessonProgress', 'flashcardStats'] as const;
type FileName = (typeof FILES)[number];

const cache: { data: Partial<FileData>; fetchedAt: number } = { data: {}, fetchedAt: 0 };
const shas: Partial<Record<FileName, string>> = {};
const inflight = new Map<FileName, Promise<Partial<FileData>>>();

function ghHeaders(extra: Record<string, string> = {}) {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
    'User-Agent': 'ba-coach-pro-db',
    ...extra,
  };
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function loadFile(name: FileName, force = false): Promise<Partial<FileData>> {
  if (!force && Date.now() - cache.fetchedAt < 2000 && name in cache.data) return cache.data;
  // coalesce concurrent loads
  if (inflight.has(name)) return inflight.get(name)!;

  const job = (async () => {
    const rows: Row[] = [];
    try {
      const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/db/${name}.json`, {
        headers: ghHeaders(),
        cache: 'no-store',
      });
      if (res.ok) {
        const json = (await res.json()) as { content?: string; sha?: string };
        if (json.sha) shas[name] = json.sha;
        if (json.content) {
          const parsed = JSON.parse(Buffer.from(json.content, 'base64').toString('utf8'));
          if (Array.isArray(parsed)) rows.push(...parsed);
        }
      } else if (res.status !== 404) {
        throw new Error(`ghdb load ${name}: ${res.status}`);
      }
    } catch (e) {
      console.error('[ghdb] load failed', name, e);
    }
    cache.data = { ...cache.data, [name]: rows };
    cache.fetchedAt = Date.now();
    return cache.data;
  })().finally(() => inflight.delete(name));

  inflight.set(name, job);
  return job;
}

async function saveFile(name: FileName, rows: Row[], message: string): Promise<void> {
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/db/${name}.json`, {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify({
      message,
      content: Buffer.from(JSON.stringify(rows, null, 1), 'utf8').toString('base64'),
      ...(shas[name] ? { sha: shas[name] } : {}),
    }),
    cache: 'no-store',
  });
  if (res.status === 409 || res.status === 422) {
    // stale sha (GitHub's contents API serves briefly cached metadata) —
    // mutate() re-loads fresh rows and re-applies the mutation with backoff
    throw new Error(`ghdb conflict on ${name}`);
  }
  if (!res.ok) throw new Error(`ghdb save ${name}: ${res.status}`);
  const json = (await res.json()) as { content?: { sha?: string } };
  if (json.content?.sha) shas[name] = json.content.sha;
  cache.data = { ...cache.data, [name]: rows };
  cache.fetchedAt = Date.now();
}

/**
 * Load fresh rows, apply the mutation, save. On a sha conflict (concurrent
 * writer or GitHub metadata cache lag) re-load and re-apply with backoff —
 * the callback always runs against the freshest rows, so retries converge.
 */
async function mutate(name: FileName, fn: (rows: Row[]) => Row[] | Promise<Row[]>, message: string): Promise<void> {
  for (let attempt = 0; ; attempt++) {
    const fresh = (await loadFile(name, true))[name] ?? [];
    const next = await fn([...fresh]);
    try {
      await saveFile(name, next, message);
      return;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!/conflict on /.test(msg) || attempt >= 5) throw e;
      await sleep(350 + 250 * attempt + Math.floor(Math.random() * 250));
    }
  }
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

let idCounter = 0;
function cuid(): string {
  idCounter = (idCounter + 1) % 1679616;
  return `gh${Date.now().toString(36)}${idCounter.toString(36).padStart(4, '0')}${Math.random().toString(36).slice(2, 8)}`;
}

function now() {
  return new Date();
}

function serialize(row: Row): Row {
  const out: Row = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = v instanceof Date ? v.toISOString() : v;
  }
  return out;
}

function hydrate(name: FileName, row: Row): Row {
  const dateFields: Record<FileName, string[]> = {
    students: ['createdAt', 'lastActiveAt', 'githubSyncedAt'],
    conversations: ['createdAt', 'updatedAt'],
    messages: ['createdAt'],
    quizAttempts: ['createdAt'],
    lessonProgress: ['updatedAt'],
    flashcardStats: ['updatedAt'],
  };
  const out: Row = { ...row };
  for (const f of dateFields[name]) {
    if (typeof out[f] === 'string') out[f] = new Date(out[f] as string);
  }
  return out;
}

function matches(row: Row, where?: Row): boolean {
  if (!where) return true;
  return Object.entries(where).every(([k, v]) => {
    if (v !== null && typeof v === 'object' && !(v instanceof Date)) {
      // operators like { in: [...] }, { gte }, { not } — support what we use
      const ops = v as Record<string, unknown>;
      if ('in' in ops) return (ops.in as unknown[]).includes(row[k]);
      if ('not' in ops) return row[k] !== ops.not;
      if ('gte' in ops) return new Date(row[k] as string) >= new Date(ops.gte as string);
      return false;
    }
    if (v instanceof Date) {
      return new Date(row[k] as string).getTime() === v.getTime();
    }
    return row[k] === v;
  });
}

function pick(row: Row, select?: Row): Row {
  if (!select) return row;
  const out: Row = {};
  for (const [k, v] of Object.entries(select)) if (v) out[k] = row[k];
  return out;
}

// ---------------------------------------------------------------------------
// Prisma-like adapter
// ---------------------------------------------------------------------------

function makeModel(name: FileName) {
  const commit = (message: string) => `ghdb: ${message}`;

  return {
    async create({ data }: { data: Row }) {
      const { messages: _m, ...rest } = data; // ignore nested no-op keys
      const row: Row = { id: cuid(), ...serialize(rest) };
      for (const [k, v] of Object.entries(row)) if (v === undefined) delete row[k];
      if (!('createdAt' in row) || row.createdAt === undefined) row.createdAt = now().toISOString();
      await mutate(name, rows => [...rows, row], commit(`create ${name}`));
      return hydrate(name, row);
    },

    async findUnique({ where, include }: { where: Row; include?: Row }) {
      const rows = (await loadFile(name))[name] ?? [];
      const row = rows.find(r => matches(r, where));
      if (!row) return null;
      return hydrate(name, await withIncludes(name, row, include));
    },

    async findFirst({ where, include }: { where?: Row; include?: Row }) {
      const rows = ((await loadFile(name))[name] ?? []).filter(r => matches(r, where));
      if (!rows.length) return null;
      const latest = [...rows].sort(
        (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
      )[0];
      return hydrate(name, await withIncludes(name, latest, include));
    },

    async findMany({ where, orderBy, select, take }: { where?: Row; orderBy?: Row; select?: Row; take?: number } = {}) {
      let rows = ((await loadFile(name))[name] ?? []).filter(r => matches(r, where));
      if (orderBy) {
        const [field, dir] = Object.entries(orderBy)[0] as [string, string];
        rows = [...rows].sort((a, b) => {
          const av = new Date(a[field] as string).getTime() || 0;
          const bv = new Date(b[field] as string).getTime() || 0;
          return dir === 'desc' ? bv - av : av - bv;
        });
      }
      if (take !== undefined) rows = rows.slice(0, take);
      return rows.map(r => hydrate(name, pick(r, select)));
    },

    async count({ where }: { where?: Row } = {}) {
      const rows = (await loadFile(name))[name] ?? [];
      return rows.filter(r => matches(r, where)).length;
    },

    async update({ where, data }: { where: Row; data: Row }) {
      let updated: Row | null = null;
      await mutate(name, rows => {
        const idx = rows.findIndex(r => matches(r, where));
        if (idx === -1) throw new Error(`ghdb update: record not found on ${name}`);
        const { messages: _m, ...rest } = serialize(data);
        const next = { ...rows[idx], ...rest, updatedAt: now().toISOString() };
        for (const [k, v] of Object.entries(next)) if (v === undefined) delete next[k];
        rows[idx] = next;
        updated = next;
        return rows;
      }, commit(`update ${name}`));
      return hydrate(name, updated!);
    },

    async deleteMany({ where }: { where: Row }) {
      await mutate(name, rows => rows.filter(r => !matches(r, where)), commit(`delete ${name}`));
      return { count: 0 };
    },

    async upsert({ where, update, create }: { where: Row; update: Row; create: Row }) {
      // flatten composite unique keys like { studentId_itemId: { studentId, itemId } }
      const flatWhere: Row = {};
      for (const [k, v] of Object.entries(where)) {
        if (v && typeof v === 'object' && !(v instanceof Date)) Object.assign(flatWhere, v);
        else flatWhere[k] = v;
      }
      const rows = (await loadFile(name, true))[name] ?? [];
      const existing = rows.find(r => matches(r, flatWhere));
      if (existing) {
        const model = makeModel(name);
        return model.update({ where: flatWhere, data: update });
      }
      return this.create({ data: { ...create, ...flatWhere } });
    },
  };
}

async function withIncludes(name: FileName, row: Row, include?: Row): Promise<Row> {
  if (!include) return row;
  const out: Row = { ...row };
  if (name === 'conversations' && include.messages) {
    out.messages = ((await loadFile('messages'))['messages'] ?? [])
      .filter(r => r.conversationId === row.id)
      .map(m => hydrate('messages', m));
    return out;
  }
  if (include.lessonProgress) {
    out.lessonProgress = ((await loadFile('lessonProgress'))['lessonProgress'] ?? [])
      .filter(r => r.studentId === row.id)
      .map(r => hydrate('lessonProgress', r));
  }
  if (include.quizAttempts) {
    out.quizAttempts = ((await loadFile('quizAttempts'))['quizAttempts'] ?? [])
      .filter(r => r.studentId === row.id)
      .map(r => hydrate('quizAttempts', r));
  }
  if (include.flashcardStats) {
    out.flashcardStats = ((await loadFile('flashcardStats'))['flashcardStats'] ?? [])
      .filter(r => r.studentId === row.id)
      .map(r => hydrate('flashcardStats', r));
  }
  if (include.conversations) {
    const convs = ((await loadFile('conversations'))['conversations'] ?? []).filter(r => r.studentId === row.id);
    const withMsgs: Row[] = [];
    for (const c of convs) {
      const msgs = ((await loadFile('messages'))['messages'] ?? []).filter(r => r.conversationId === c.id);
      withMsgs.push({ ...hydrate('conversations', c), messages: msgs.map(m => hydrate('messages', m)) });
    }
    out.conversations = withMsgs;
  }
  return out;
}

export const ghModels = {
  student: makeModel('students'),
  conversation: makeModel('conversations'),
  message: makeModel('messages'),
  quizAttempt: makeModel('quizAttempts'),
  lessonProgress: makeModel('lessonProgress'),
  flashcardStat: makeModel('flashcardStats'),
};
