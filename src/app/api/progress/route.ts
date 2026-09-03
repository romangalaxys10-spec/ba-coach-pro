import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const items = await db.lessonProgress.findMany();
  return NextResponse.json({ progress: items });
}

export async function POST(req: NextRequest) {
  const { itemId, completed } = await req.json();
  if (!itemId) return NextResponse.json({ error: 'itemId required' }, { status: 400 });
  const item = await db.lessonProgress.upsert({
    where: { itemId },
    update: { completed: Boolean(completed), updatedAt: new Date() },
    create: { itemId, completed: Boolean(completed) },
  });
  return NextResponse.json({ item });
}
