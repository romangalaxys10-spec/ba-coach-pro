import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthedStudent, unauthorized } from '@/lib/auth';

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  const { id } = await ctx.params;
  const conversation = await db.conversation.findFirst({
    where: { id, studentId: student.id },
    include: {
      messages: { orderBy: { createdAt: 'asc' }, select: { id: true, role: true, content: true, createdAt: true } },
    },
  });
  if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ conversation });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();

  const { id } = await ctx.params;
  await db.conversation.deleteMany({ where: { id, studentId: student.id } });
  return NextResponse.json({ ok: true });
}
