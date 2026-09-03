import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const conversation = await db.conversation.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: 'asc' }, select: { id: true, role: true, content: true, createdAt: true } },
    },
  });
  if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ conversation });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await db.conversation.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
