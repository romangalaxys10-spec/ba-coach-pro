import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildCoachPrompt, buildInterviewerScenario, type ChatMode } from '@/lib/coach-prompt';

export const maxDuration = 300;

interface ChatBody {
  conversationId?: string;
  message: string;
  mode?: ChatMode;
  skillSlug?: string | null;
  scenario?: { domain?: string; role?: string; difficulty?: string };
}

async function callLLM(messages: { role: string; content: string }[], retries = 2): Promise<string> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const completion = await zai.chat.completions.create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages: messages as any,
        thinking: { type: 'disabled' },
      });
      const content = completion.choices[0]?.message?.content;
      if (!content || !content.trim()) throw new Error('Empty response from model');
      return content;
    } catch (e) {
      lastErr = e;
      if (attempt < retries) await new Promise(r => setTimeout(r, 1200 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('LLM call failed');
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatBody;
    const message = (body.message || '').trim();
    const mode: ChatMode = body.mode || 'coach';

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // ---- resolve conversation ----
    let conversation = body.conversationId
      ? await db.conversation.findUnique({ where: { id: body.conversationId }, include: { messages: true } })
      : null;

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
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

    const history = await db.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 40,
    });

    const llmMessages = [
      { role: 'assistant', content: systemPrompt },
      ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
    ];

    const reply = await callLLM(llmMessages);

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
