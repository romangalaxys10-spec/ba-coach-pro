import { NextRequest, NextResponse } from 'next/server';
import { getSkill, BA_SKILLS } from '@/data/skills-data';
import { db } from '@/lib/db';
import { getAuthedStudent, unauthorized } from '@/lib/auth';
import { triggerSync } from '@/lib/github-sync';
import { callLLMForStudent } from '@/lib/provider-runtime';

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
    const student = await getAuthedStudent(req);
    if (!student) return unauthorized();

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

    const raw = await callLLMForStudent(
      student,
      [
        { role: 'system', content: system },
        { role: 'user', content: `Generate ${n} flashcards now.` },
      ]
    );

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

/** PUT /api/flashcards — persist spaced-repetition stats { skillSlug, known, total } */
export async function PUT(req: NextRequest) {
  try {
    const student = await getAuthedStudent(req);
    if (!student) return unauthorized();

    const { skillSlug, known, total } = await req.json();
    if (!skillSlug) return NextResponse.json({ error: 'skillSlug required' }, { status: 400 });

    const stat = await db.flashcardStat.upsert({
      where: { studentId_skillSlug: { studentId: student.id, skillSlug } },
      update: { known: Math.max(0, Number(known) || 0), total: Math.max(0, Number(total) || 0), updatedAt: new Date() },
      create: { studentId: student.id, skillSlug, known: Math.max(0, Number(known) || 0), total: Math.max(0, Number(total) || 0) },
    });
    triggerSync(student.id, `flashcards: ${skillSlug}`);
    return NextResponse.json({ stat });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'failed' }, { status: 500 });
  }
}

/** GET /api/flashcards — saved stats for the student */
export async function GET(req: NextRequest) {
  const student = await getAuthedStudent(req);
  if (!student) return unauthorized();
  const stats = await db.flashcardStat.findMany({ where: { studentId: student.id } });
  return NextResponse.json({ stats });
}
