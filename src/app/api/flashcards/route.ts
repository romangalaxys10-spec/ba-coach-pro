import { NextRequest, NextResponse } from 'next/server';
import { getSkill, BA_SKILLS } from '@/data/skills-data';

export const maxDuration = 300;

interface Flashcard {
  front: string;
  back: string;
}

function extractJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/) || raw.match(/\[[\s\S]*\]/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* fallthrough */ }
    }
    throw new Error('Model did not return valid JSON');
  }
}

export async function POST(req: NextRequest) {
  try {
    const { skillSlug, category, count = 6 } = await req.json();
    const n = Math.min(12, Math.max(3, Number(count) || 6));

    let contextBlock = '';
    if (skillSlug) {
      const skill = getSkill(skillSlug);
      if (!skill) return NextResponse.json({ error: 'Unknown skill' }, { status: 404 });
      contextBlock = `Create flashcards for THIS technique only:
SKILL: ${skill.name} (${skill.slug})
Purpose: ${skill.purpose}
Use when: ${skill.useWhen.join('; ')}
Procedure: ${skill.procedure.map((p, i) => `${i + 1}. ${p}`).join(' ')}
Outputs: ${skill.outputs.join('; ')}
Guardrails: ${skill.guardrails.join('; ')}`;
    } else {
      const pool = category && category !== 'mixed' ? BA_SKILLS.filter(s => s.category === category) : BA_SKILLS;
      const names = pool.map(s => `${s.slug}: ${s.purpose}`).join('\n');
      contextBlock = `Create flashcards covering a spread of these techniques (use a DIFFERENT technique per card where possible):\n${names}`;
    }

    const system = `You are a Business Analysis study-aid generator producing spaced-repetition flashcards.

${contextBlock}

Return ONLY valid JSON, no markdown fences, exactly:
{
  "cards": [
    { "front": "question or prompt (max 120 chars)", "back": "clear answer (1-3 sentences, concrete)" }
  ]
}

Rules:
- exactly ${n} cards
- mix card types: "What is X?", "When do you use X?", "What are the steps of X?", "Give an example of X applied to <scenario>", "What is a common mistake when using X?"
- answers must be self-contained and precise
- no card numbering inside the text`;

    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: [
        { role: 'assistant', content: system },
        { role: 'user', content: `Generate ${n} flashcards now.` },
      ] as any,
      thinking: { type: 'disabled' },
    });
    const raw = completion.choices[0]?.message?.content || '';

    const parsed = extractJson(raw) as { cards?: Flashcard[] } | Flashcard[];
    const cards = Array.isArray(parsed) ? parsed : parsed.cards || [];
    const clean = cards
      .filter(c => c.front && c.back)
      .map(c => ({ front: c.front.trim(), back: c.back.trim() }))
      .slice(0, n);

    if (!clean.length) throw new Error('No valid cards generated');
    return NextResponse.json({ cards: clean });
  } catch (error) {
    console.error('[/api/flashcards] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Flashcard generation failed' },
      { status: 500 }
    );
  }
}
