import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { normalizeToken, getAuthedStudent, unauthorized } from '@/lib/auth';
import { verifyGitHubToken, ensurePrivateRepo, syncStudentToGitHub, restoreStudentFromGitHub } from '@/lib/github-sync';

export const maxDuration = 300;

type Action = 'pair' | 'unpair' | 'sync' | 'restore' | 'autosync';

/**
 * POST /api/github
 *   { action: 'pair', patToken, repoName }  → verify PaT, create private repo, first sync
 *   { action: 'sync' }                      → force full sync now
 *   { action: 'restore' }                   → rebuild local progress from repo export
 *   { action: 'unpair' }                    → forget token + repo
 *   { action: 'autosync', enabled }         → toggle real-time auto sync
 */
export async function POST(req: NextRequest) {
  const authed = await getAuthedStudent(req);
  if (!authed) return unauthorized();

  try {
    const body = (await req.json()) as { action?: Action; patToken?: string; repoName?: string; enabled?: boolean };
    const rawToken = normalizeToken(req.headers.get('x-student-token') || '');
    const student = await db.student.findUnique({ where: { token: rawToken } });
    if (!student) return unauthorized();

    switch (body.action) {
      case 'pair': {
        const pat = (body.patToken || '').trim();
        const repoName = (body.repoName || '').trim();
        if (!pat) return NextResponse.json({ error: 'Paste your GitHub Personal Access Token (PaT).' }, { status: 400 });
        if (!/^[A-Za-z0-9._-]{1,100}$/.test(repoName)) {
          return NextResponse.json({ error: 'Repo name can only contain letters, numbers, dots, dashes and underscores.' }, { status: 400 });
        }

        const identity = await verifyGitHubToken(pat);
        if (!identity) {
          return NextResponse.json(
            { error: 'GitHub rejected this token. Make sure it is valid and has the "repo" (classic) or Contents+Administration (fine-grained) scope.' },
            { status: 400 }
          );
        }

        const repo = await ensurePrivateRepo(pat, identity.login, repoName);
        if (!repo.ok) {
          return NextResponse.json({ error: `Could not create repo: ${repo.error}` }, { status: 400 });
        }

        await db.student.update({
          where: { id: student.id },
          data: {
            githubToken: pat,
            githubOwner: identity.login,
            githubRepo: repoName,
            githubSyncedAt: null,
          },
        });

        // First full sync
        const sync = await syncStudentToGitHub(student.id, 'initial sync after pairing');
        return NextResponse.json({
          ok: true,
          repoCreated: repo.created,
          owner: identity.login,
          repo: repoName,
          sync,
          repoUrl: `https://github.com/${identity.login}/${repoName}`,
        });
      }

      case 'sync': {
        const sync = await syncStudentToGitHub(student.id, 'manual sync');
        if (!sync.ok) return NextResponse.json({ error: sync.error }, { status: 400 });
        return NextResponse.json({ ok: true, syncedAt: new Date().toISOString() });
      }

      case 'restore': {
        const result = await restoreStudentFromGitHub(student.id);
        if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
        return NextResponse.json(result);
      }

      case 'unpair': {
        await db.student.update({
          where: { id: student.id },
          data: { githubToken: null, githubOwner: null, githubRepo: null, githubSyncedAt: null },
        });
        return NextResponse.json({ ok: true });
      }

      case 'autosync': {
        await db.student.update({ where: { id: student.id }, data: { autoSync: Boolean(body.enabled) } });
        return NextResponse.json({ ok: true, autoSync: Boolean(body.enabled) });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[/api/github] error:', error);
    return NextResponse.json({ error: 'GitHub operation failed' }, { status: 500 });
  }
}
