import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const conversations = await db.conversation.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, mode: true, skillSlug: true, updatedAt: true },
    take: 100,
  });
  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const conversation = await db.conversation.create({
    data: {
      title: body.title || 'New conversation',
      mode: body.mode || 'coach',
      skillSlug: body.skillSlug || null,
    },
  });
  return NextResponse.json({ conversation });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await db.conversation.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
