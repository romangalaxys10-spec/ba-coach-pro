import { db } from '@/lib/db';

/**
 * GitHub personal-backup sync.
 *
 * Each student can pair their account with a PRIVATE GitHub repo by
 * providing a fine-grained/classic Personal Access Token (PaT) and a
 * repo name. The platform will:
 *   1. Validate the token against the GitHub API (GET /user)
 *   2. Auto-create the private repo if it does not exist
 *   3. Mirror ALL of the student's learning state into it:
 *        README.md                      — human-readable progress report
 *        export/ba-coach-export.json    — full machine-readable export (restore-ready)
 *        progress/lessons.json          — completed learning-track items
 *        progress/quiz-attempts.json    — quiz history
 *        progress/flashcards.json       — flashcard stats
 *        conversations/<slug>.md        — every coaching / interview chat as Markdown
 *
 * Sync is debounced + serialized per student, and runs automatically
 * after every chat message, quiz attempt and lesson toggle.
 */

const GH_API = 'https://api.github.com';

export interface GitHubIdentity {
  login: string;
  token: string;
}

function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
    'User-Agent': 'ba-coach-pro',
  };
}

async function ghFetch(url: string, token: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, headers: ghHeaders(token) });
  return res;
}

/** Validate a PaT and return the login it belongs to. */
export async function verifyGitHubToken(token: string): Promise<GitHubIdentity | null> {
  try {
    const res = await ghFetch(`${GH_API}/user`, token);
    if (!res.ok) return null;
    const data = (await res.json()) as { login?: string };
    return data.login ? { login: data.login, token } : null;
  } catch {
    return null;
  }
}

/** Create the private repo if it doesn't exist yet. Returns ok. */
export async function ensurePrivateRepo(
  token: string,
  owner: string,
  repoName: string
): Promise<{ ok: boolean; created: boolean; error?: string }> {
  try {
    const check = await ghFetch(`${GH_API}/repos/${owner}/${repoName}`, token);
    if (check.ok) return { ok: true, created: false };

    const res = await ghFetch(`${GH_API}/user/repos`, token, {
      method: 'POST',
      body: JSON.stringify({
        name: repoName,
        private: true,
        description: 'BA Coach Pro — personal learning archive (auto-synced)',
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        auto_init: false,
      }),
    });
    if (res.ok) return { ok: true, created: true };
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    return { ok: false, created: false, error: err.message || `GitHub responded ${res.status}` };
  } catch (e) {
    return { ok: false, created: false, error: e instanceof Error ? e.message : 'network error' };
  }
}

/** Create or update a single file in the repo. */
async function putFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string
): Promise<void> {
  let sha: string | undefined;
  const existing = await ghFetch(`${GH_API}/repos/${owner}/${repo}/contents/${encodeURI(path)}`, token);
  if (existing.ok) {
    const data = (await existing.json()) as { sha?: string };
    sha = data.sha;
  }
  const res = await ghFetch(`${GH_API}/repos/${owner}/${repo}/contents/${encodeURI(path)}`, token, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok && res.status !== 422) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(`putFile(${path}): ${err.message || res.status}`);
  }
}

// ---------------------------------------------------------------------------
// Data export builders
// ---------------------------------------------------------------------------

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9\u0400-\u04ff]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'chat'
  );
}

function conversationToMarkdown(conv: { title: string; mode: string; createdAt: Date } & { messages: { role: string; content: string; createdAt: Date }[] }): string {
  const lines: string[] = [
    `# ${conv.title}`,
    '',
    `> Mode: **${conv.mode}** · Exported: ${new Date().toISOString()} · Messages: ${conv.messages.length}`,
    '',
  ];
  for (const m of conv.messages) {
    const who = m.role === 'user' ? '🙋 Student' : '🧠 Coach (Ada)';
    lines.push(`## ${who} — ${new Date(m.createdAt).toISOString()}`);
    lines.push('');
    lines.push(m.content);
    lines.push('');
  }
  return lines.join('\n');
}

function dateOnly(d: Date | null): string | null {
  return d ? d.toISOString().slice(0, 10) : null;
}

export async function buildStudentExport(studentId: string) {
  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      lessonProgress: { orderBy: { updatedAt: 'desc' } },
      quizAttempts: { orderBy: { createdAt: 'desc' }, take: 200 },
      flashcardStats: { orderBy: { updatedAt: 'desc' } },
      conversations: {
        orderBy: { updatedAt: 'desc' },
        take: 100,
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      },
    },
  });
  if (!student) return null;

  const exportPayload = {
    app: 'BA Coach Pro',
    version: 1,
    exportedAt: new Date().toISOString(),
    student: {
      name: student.name,
      token: student.token,
      createdAt: student.createdAt,
      registeredAt: student.createdAt,
      lastActiveAt: student.lastActiveAt,
      // custom AI provider — the API key is intentionally NOT exported (secret)
      aiProvider: {
        providerId: student.aiProviderId,
        baseUrl: student.aiBaseUrl,
        model: student.aiModel,
        keyMasked: student.aiApiKey ? `${student.aiApiKey.slice(0, 4)}••••` : null,
      },
    },
    progress: {
      lessons: student.lessonProgress.map(l => ({ itemId: l.itemId, completed: l.completed, updatedAt: l.updatedAt })),
      quizAttempts: student.quizAttempts.map(q => ({
        skillSlug: q.skillSlug,
        category: q.category,
        score: q.score,
        total: q.total,
        createdAt: q.createdAt,
      })),
      flashcards: student.flashcardStats.map(f => ({
        skillSlug: f.skillSlug,
        known: f.known,
        total: f.total,
        updatedAt: f.updatedAt,
      })),
    },
    conversations: student.conversations.map(c => ({
      title: c.title,
      mode: c.mode,
      skillSlug: c.skillSlug,
      createdAt: c.createdAt,
      messages: c.messages.map(m => ({ role: m.role, content: m.content, createdAt: m.createdAt })),
    })),
  };

  // README (human-readable report)
  const completed = student.lessonProgress.filter(l => l.completed).length;
  const avgQuiz =
    student.quizAttempts.length > 0
      ? Math.round(
          (student.quizAttempts.reduce((a, q) => a + (q.total ? q.score / q.total : 0), 0) /
            student.quizAttempts.length) *
            100
        )
      : null;

  const readme = [
    `# 🎓 ${student.name} — BA Coach Pro Learning Archive`,
    '',
    `> This private repository is automatically synced from [BA Coach Pro](${process.env.NEXT_PUBLIC_APP_URL || 'https://ba-coach-pro.vercel.app'}) — an AI-powered business-analysis coaching platform.`,
    '',
    '| Metric | Value |',
    '| --- | --- |',
    `| Registered | ${dateOnly(student.createdAt) ?? '—'} |`,
    `| Last active | ${dateOnly(student.lastActiveAt) ?? '—'} |`,
    `| Lessons completed | ${completed} |`,
    `| Quiz attempts | ${student.quizAttempts.length} |`,
    `| Average quiz score | ${avgQuiz !== null ? avgQuiz + '%' : '—'} |`,
    `| Conversations archived | ${student.conversations.length} |`,
    '',
    '## 📁 What lives here',
    '',
    '- `export/ba-coach-export.json` — full account export (used to restore progress anywhere)',
    '- `progress/` — lessons, quiz attempts and flashcard stats as JSON',
    '- `conversations/` — every coaching & interview-simulator chat as readable Markdown',
    '',
    '## ♻️ Restore',
    '',
    'Paste this repo\'s details in **Settings → GitHub** on any BA Coach Pro instance and press *Restore from GitHub* to rebuild your progress.',
    '',
    '---',
    '',
    '_Auto-generated by BA Coach Pro sync. Do not edit by hand — changes will be overwritten on the next sync._',
  ].join('\n');

  return {
    student,
    readme,
    exportJson: JSON.stringify(exportPayload, null, 2),
    files: {
      'progress/lessons.json': JSON.stringify(exportPayload.progress.lessons, null, 2),
      'progress/quiz-attempts.json': JSON.stringify(exportPayload.progress.quizAttempts, null, 2),
      'progress/flashcards.json': JSON.stringify(exportPayload.progress.flashcards, null, 2),
    },
    conversations: student.conversations,
  };
}

// ---------------------------------------------------------------------------
// Sync engine (serialized per student, in-memory queue)
// ---------------------------------------------------------------------------

const syncing = new Set<string>();
const queued = new Set<string>();

export async function syncStudentToGitHub(studentId: string, reason = 'auto-sync'): Promise<{ ok: boolean; error?: string }> {
  if (syncing.has(studentId)) {
    queued.add(studentId); // coalesce concurrent triggers into one follow-up run
    return { ok: true };
  }
  syncing.add(studentId);
  try {
    const built = await buildStudentExport(studentId);
    if (!built) return { ok: false, error: 'student not found' };

    const { student, readme, exportJson, files, conversations } = built;
    if (!student.githubToken || !student.githubRepo || !student.githubOwner) {
      return { ok: false, error: 'GitHub not paired' };
    }

    const stamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const commitMsg = `auto-sync: ${reason} — ${stamp}`;

    await putFile(student.githubToken, student.githubOwner, student.githubRepo, 'README.md', readme, commitMsg);
    await putFile(student.githubToken, student.githubOwner, student.githubRepo, 'export/ba-coach-export.json', exportJson, commitMsg);
    for (const [path, content] of Object.entries(files)) {
      await putFile(student.githubToken, student.githubOwner, student.githubRepo, path, content, commitMsg);
    }
    for (let i = 0; i < conversations.length; i++) {
      const c = conversations[i];
      const idx = String(conversations.length - i).padStart(3, '0');
      const path = `conversations/${idx}-${slugify(c.title)}.md`;
      await putFile(student.githubToken, student.githubOwner, student.githubRepo, path, conversationToMarkdown(c), commitMsg);
    }

    await db.student.update({ where: { id: studentId }, data: { githubSyncedAt: new Date() } });
    return { ok: true };
  } catch (e) {
    console.error('[github-sync] failed:', e);
    return { ok: false, error: e instanceof Error ? e.message : 'sync failed' };
  } finally {
    syncing.delete(studentId);
    if (queued.has(studentId)) {
      queued.delete(studentId);
      // run the coalesced follow-up
      void syncStudentToGitHub(studentId, 'auto-sync (coalesced)');
    }
  }
}

/** Fire-and-forget trigger used by chat/quiz/progress routes. */
export function triggerSync(studentId: string, reason: string): void {
  void (async () => {
    try {
      const student = await db.student.findUnique({ where: { id: studentId }, select: { autoSync: true, githubToken: true } });
      if (!student?.autoSync || !student.githubToken) return;
      await syncStudentToGitHub(studentId, reason);
    } catch {
      /* silent — sync is best-effort */
    }
  })();
}

/** Restore a student's progress from their paired GitHub repo. */
export async function restoreStudentFromGitHub(
  studentId: string
): Promise<{ ok: boolean; restored?: { conversations: number; lessons: number; quizzes: number }; error?: string }> {
  try {
    const student = await db.student.findUnique({ where: { id: studentId } });
    if (!student?.githubToken || !student.githubOwner || !student.githubRepo) {
      return { ok: false, error: 'GitHub not paired' };
    }
    const res = await ghFetch(
      `${GH_API}/repos/${student.githubOwner}/${student.githubRepo}/contents/export/ba-coach-export.json`,
      student.githubToken
    );
    if (!res.ok) return { ok: false, error: `Cannot read export file (${res.status})` };
    const data = (await res.json()) as { content?: string; encoding?: string };
    if (!data.content || data.encoding !== 'base64') return { ok: false, error: 'Unexpected export format' };

    const payload = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8')) as {
      progress?: {
        lessons?: { itemId: string; completed: boolean }[];
        quizAttempts?: { skillSlug: string; category: string; score: number; total: number; createdAt?: string }[];
      };
      conversations?: { title: string; mode: string; skillSlug?: string | null; createdAt?: string; messages: { role: string; content: string; createdAt?: string }[] }[];
    };

    let lessons = 0;
    for (const l of payload.progress?.lessons || []) {
      await db.lessonProgress.upsert({
        where: { studentId_itemId: { studentId, itemId: l.itemId } },
        create: { studentId, itemId: l.itemId, completed: l.completed },
        update: { completed: l.completed },
      });
      lessons++;
    }

    const existingQuizzes = await db.quizAttempt.count({ where: { studentId } });
    let quizzes = 0;
    if (existingQuizzes === 0) {
      for (const q of payload.progress?.quizAttempts || []) {
        await db.quizAttempt.create({
          data: {
            studentId,
            skillSlug: q.skillSlug,
            category: q.category,
            score: q.score,
            total: q.total,
            createdAt: q.createdAt ? new Date(q.createdAt) : new Date(),
          },
        });
        quizzes++;
      }
    }

    const existingConvs = await db.conversation.count({ where: { studentId } });
    let conversationsRestored = 0;
    if (existingConvs === 0) {
      for (const c of payload.conversations || []) {
        const conv = await db.conversation.create({
          data: {
            studentId,
            title: c.title || 'Restored conversation',
            mode: c.mode || 'coach',
            skillSlug: c.skillSlug || null,
            createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
          },
        });
        for (const m of c.messages || []) {
          await db.message.create({
            data: {
              conversationId: conv.id,
              role: m.role,
              content: m.content,
              createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
            },
          });
        }
        conversationsRestored++;
      }
    }

    return { ok: true, restored: { conversations: conversationsRestored, lessons, quizzes } };
  } catch (e) {
    console.error('[github-restore] failed:', e);
    return { ok: false, error: e instanceof Error ? e.message : 'restore failed' };
  }
}
