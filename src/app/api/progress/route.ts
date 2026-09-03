import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthedStudent, unauthorized } from '@/lib/auth';
import { triggerSync } from '@/lib/github-sync';

export async function GET(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  const items = await db.lessonProgress.findMany({ where: { studentId: student.id } });
  return NextResponse.json({ progress: items });
}

export async function POST(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  const { itemId, completed } = await req.json();
  if (!itemId) return NextResponse.json({ error: 'itemId required' }, { status: 400 });

  const item = await db.lessonProgress.upsert({
    where: { studentId_itemId: { studentId: student.id, itemId } },
    update: { completed: Boolean(completed), updatedAt: new Date() },
    create: { studentId: student.id, itemId, completed: Boolean(completed) },
  });

  triggerSync(student.id, `lesson: ${itemId} ${completed ? 'completed' : 'reopened'}`);
  return NextResponse.json({ item });
}
