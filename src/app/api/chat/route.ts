import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildCoachPrompt, buildInterviewerScenario, type ChatMode } from '@/lib/coach-prompt';
import { getAuthedStudent, unauthorized } from '@/lib/auth';
import { triggerSync } from '@/lib/github-sync';
import { callLLMForStudent } from '@/lib/provider-runtime';

export const maxDuration = 300;

interface ChatBody {
  conversationId?: string;
  message: string;
  mode?: ChatMode;
  skillSlug?: string | null;
  scenario?: { domain?: string; role?: string; difficulty?: string };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatBody;
    const message = (body.message || '').trim();
    const mode: ChatMode = body.mode || 'coach';

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const student = await getAuthedStudent(req);
    if (!student) return unauthorized();

    // ---- resolve conversation ----
    let conversation = body.conversationId
      ? await db.conversation.findFirst({
          where: { id: body.conversationId, studentId: student.id },
          include: { messages: true },
        })
      : null;

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          studentId: student.id,
          title: 'New conversation',
          mode,
          skillSlug: body.skillSlug || null,
          messages: {},
        },
        include: { messages: true },
      });
    }

    // ---- save user message ----
    await db.message.create({
      data: { conversationId: conversation.id, role: 'user', content: message },
    });

    // ---- build LLM messages ----
    const systemPrompt =
      mode === 'interviewer'
        ? buildCoachPrompt('interviewer') + '\n\n' + buildInterviewerScenario(body.scenario?.domain, body.scenario?.role, body.scenario?.difficulty)
        : mode === 'feedback'
          ? buildCoachPrompt('feedback')
          : buildCoachPrompt(mode, body.skillSlug || conversation.skillSlug);

    const msgCount = await db.message.count({ where: { conversationId: conversation.id } });
    const history = await db.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      // last 40 messages (includes the user message just saved)
      skip: Math.max(0, msgCount - 40),
      take: 40,
    });

    const llmMessages = [
      { role: 'assistant', content: systemPrompt },
      ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
    ];

    const reply = await callLLMForStudent(student, llmMessages);

    await db.message.create({
      data: { conversationId: conversation.id, role: 'assistant', content: reply },
    });

    // ---- title: derive from first user message ----
    let title = conversation.title;
    if (title === 'New conversation') {
      const raw = message.replace(/\s+/g, ' ').slice(0, 48);
      title = raw.length < message.length ? raw + '…' : raw;
      if (mode === 'interviewer') title = '🎯 ' + title;
      else if (mode === 'skill' && body.skillSlug) title = '🧩 ' + title;
    }

    await db.conversation.update({
      where: { id: conversation.id },
      data: { title, mode, skillSlug: body.skillSlug || conversation.skillSlug, updatedAt: new Date() },
    });

    // ---- real-time backup to the student's paired GitHub repo ----
    triggerSync(student.id, `chat: ${title}`);

    return NextResponse.json({
      conversationId: conversation.id,
      title,
      reply,
    });
  } catch (error) {
    console.error('[/api/chat] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get coach response' },
      { status: 500 }
    );
  }
}
