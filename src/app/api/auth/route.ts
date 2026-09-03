import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateStudentToken, normalizeToken, getAuthedStudent } from '@/lib/auth';
import { publicProviderState } from '@/lib/ai-providers';

export const maxDuration = 60;

/** POST /api/auth  { action: 'register' | 'login' } */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { action?: string; name?: string; token?: string };

    if (body.action === 'register') {
      const name = (body.name || '').trim().slice(0, 60);
      if (!name || name.length < 2) {
        return NextResponse.json({ error: 'Please enter your name (at least 2 characters).' }, { status: 400 });
      }
      const token = generateStudentToken();
      const student = await db.student.create({
        data: { name, token },
      });
      return NextResponse.json({
        student: { id: student.id, name: student.name, token, createdAt: student.createdAt, github: { paired: false, owner: null, repo: null, lastSyncAt: null, autoSync: true }, aiProvider: publicProviderState(student) },
        token,
        isNew: true,
      });
    }

    if (body.action === 'login') {
      const token = normalizeToken(body.token || '');
      if (!token) return NextResponse.json({ error: 'Please paste your secret token.' }, { status: 400 });
      const student = await db.student.findUnique({ where: { token } });
      if (!student) {
        return NextResponse.json(
          { error: 'Token not recognised. Check for typos — tokens look like BAC-XXXX-XXXX-XXXX-XXXX.' },
          { status: 401 }
        );
      }
      await db.student.update({ where: { id: student.id }, data: { lastActiveAt: new Date() } });
      return NextResponse.json({
        student: { id: student.id, name: student.name, token, createdAt: student.createdAt, github: { paired: Boolean(student.githubToken && student.githubRepo), owner: student.githubOwner, repo: student.githubRepo, lastSyncAt: student.githubSyncedAt, autoSync: student.autoSync }, aiProvider: publicProviderState(student) },
        token,
        isNew: false,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[/api/auth] error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

/** GET /api/auth (with x-student-token header) → profile + stats snapshot */
export async function GET(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const [conversations, lessonsCompleted, quizAttempts, flashcards] = await Promise.all([
    db.conversation.count({ where: { studentId: student.id } }),
    db.lessonProgress.count({ where: { studentId: student.id, completed: true } }),
    db.quizAttempt.count({ where: { studentId: student.id } }),
    db.flashcardStat.count({ where: { studentId: student.id } }),
  ]);

  return NextResponse.json({
    student: {
      id: student.id,
      name: student.name,
      token: student.token,
      createdAt: student.createdAt,
      lastActiveAt: student.lastActiveAt,
      github: {
        paired: Boolean(student.hasGithubToken && student.githubRepo),
        owner: student.githubOwner,
        repo: student.githubRepo,
        lastSyncAt: student.githubSyncedAt,
        autoSync: student.autoSync,
      },
      aiProvider: publicProviderState(student),
    },
    stats: { conversations, lessonsCompleted, quizAttempts, flashcards },
  });
}
