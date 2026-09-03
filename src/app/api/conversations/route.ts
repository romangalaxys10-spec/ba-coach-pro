import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthedStudent, unauthorized } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  const conversations = await db.conversation.findMany({
    where: { studentId: student.id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, mode: true, skillSlug: true, updatedAt: true },
    take: 100,
  });
  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const conversation = await db.conversation.create({
    data: {
      studentId: student.id,
      title: body.title || 'New conversation',
      mode: body.mode || 'coach',
      skillSlug: body.skillSlug || null,
    },
  });
  return NextResponse.json({ conversation });
}

export async function DELETE(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.conversation.deleteMany({ where: { id, studentId: student.id } });
  return NextResponse.json({ ok: true });
}
