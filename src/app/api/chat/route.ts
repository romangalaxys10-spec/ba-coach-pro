import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildCoachPrompt, buildInterviewerScenario, buildLevelCalibration, QUIZ_PROTOCOL, type ChatMode } from '@/lib/coach-prompt';
import { programPersonaFor } from '@/lib/program-curriculum';
import { getAuthedStudent, unauthorized } from '@/lib/auth';
import { triggerSync } from '@/lib/github-sync';
import { streamLLM } from '@/lib/ai';
import { studentAIOverride } from '@/lib/ai-providers';

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
    // level-aware coaching: derive the student's career level from lesson progress
    const levelBlock = await db.lessonProgress
      .findMany({ where: { studentId: student.id } })
      .then(rows => {
        const map: Record<string, boolean> = {};
        rows.forEach(r => {
          map[r.itemId] = r.completed;
        });
        return buildLevelCalibration(map);
      })
      .catch(() => '');

    // programme persona: English / HRBP students get a subject tutor, BA keeps the coach
    const personaBlock = programPersonaFor(student.program);

    const systemPrompt =
      (personaBlock ? personaBlock + '\n\n' : '') +
      (mode === 'interviewer'
        ? buildCoachPrompt('interviewer', undefined, levelBlock) + '\n\n' + buildInterviewerScenario(body.scenario?.domain, body.scenario?.role, body.scenario?.difficulty)
        : mode === 'feedback'
          ? buildCoachPrompt('feedback', undefined, levelBlock)
          : buildCoachPrompt(mode, body.skillSlug || conversation.skillSlug, levelBlock)) +
      // interactive in-chat tests: coach may emit ```quiz blocks for any programme
      (mode === 'feedback' ? '' : QUIZ_PROTOCOL);

    const msgCount = await db.message.count({ where: { conversationId: conversation.id } });
    const history = await db.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      // last 40 messages (includes the user message just saved)
      skip: Math.max(0, msgCount - 40),
      take: 40,
    });

    const llmMessages = [
      // OpenAI-compatible providers require the instructions to come as the
      // `system` role — `assistant`-first histories break or confuse them.
      { role: 'system', content: systemPrompt },
      ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
    ];

    // ---- title: derive from first user message ----
    let title = conversation.title;
    if (title === 'New conversation') {
      const raw = message.replace(/\s+/g, ' ').slice(0, 48);
      title = raw.length < message.length ? raw + '…' : raw;
      if (mode === 'interviewer') title = '🎯 ' + title;
      else if (mode === 'skill' && body.skillSlug) title = '🧩 ' + title;
    }

    // ---- streaming SSE response: meta → text chunks → done ----
    // The assistant message is persisted (and GitHub-synced) once the stream
    // completes, so the durable state matches the non-streaming behaviour.
    const encoder = new TextEncoder();
    const sse = (obj: unknown) => encoder.encode(`data: ${JSON.stringify(obj)}\n\n`);

    const conversationId = conversation.id;
    const studentId = student.id;
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let reply = '';
        try {
          controller.enqueue(sse({ type: 'meta', conversationId, title }));
          for await (const chunk of streamLLM(llmMessages, studentAIOverride(student))) {
            reply += chunk;
            controller.enqueue(sse({ type: 'chunk', text: chunk }));
          }
          if (!reply.trim()) throw new Error('Empty response from the coach');

          await db.message.create({
            data: { conversationId, role: 'assistant', content: reply },
          });
          await db.conversation.update({
            where: { id: conversationId },
            data: { title, mode, skillSlug: body.skillSlug || conversation.skillSlug, updatedAt: new Date() },
          });
          triggerSync(studentId, `chat: ${title}`);
          controller.enqueue(sse({ type: 'done', conversationId, title }));
        } catch (error) {
          console.error('[/api/chat stream] error:', error);
          controller.enqueue(
            sse({ type: 'error', message: error instanceof Error ? error.message : 'Failed to get coach response' })
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('[/api/chat] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get coach response' },
      { status: 500 }
    );
  }
}
