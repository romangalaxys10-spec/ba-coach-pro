import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSkill, BA_SKILLS } from '@/data/skills-data';
import { getAuthedStudent, unauthorized } from '@/lib/auth';
import { triggerSync } from '@/lib/github-sync';
import { callLLMForStudent } from '@/lib/provider-runtime';

export const maxDuration = 300;

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
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

    const { skillSlug, category, difficulty = 'mixed', count = 5 } = await req.json();
    const n = Math.min(10, Math.max(3, Number(count) || 5));

    let contextBlock = '';
    let quizScope = skillSlug || category || 'mixed';

    if (skillSlug && skillSlug !== 'mixed') {
      const skill = getSkill(skillSlug);
      if (!skill) return NextResponse.json({ error: 'Unknown skill' }, { status: 404 });
      quizScope = skill.slug;
      contextBlock = `The quiz must test THIS business analysis technique only:

SKILL: ${skill.name} (${skill.slug})
Purpose: ${skill.purpose}
Use when: ${skill.useWhen.join('; ')}
Procedure: ${skill.procedure.map((p, i) => `${i + 1}. ${p}`).join(' ')}
Outputs: ${skill.outputs.join('; ')}
Guardrails: ${skill.guardrails.join('; ')}`;
    } else {
      const pool = category && category !== 'mixed'
        ? BA_SKILLS.filter(s => s.category === category)
        : BA_SKILLS;
      const names = pool.map(s => `${s.slug}: ${s.purpose}`).join('\n');
      quizScope = category || 'mixed';
      contextBlock = `The quiz covers these business analysis techniques (pick ${Math.min(n, pool.length)} DIFFERENT techniques from the list and test them):

${names}`;
    }

    const system = `You are a certification-level Business Analysis exam writer (CBAP/PMI-PBA style). Write rigorous but fair multiple-choice questions.

${contextBlock}

Difficulty level: ${difficulty} (easy = recall and recognition; medium = application to scenarios; hard = judgement, trade-offs and trap options; mixed = blend).

Return ONLY valid JSON, no markdown fences, exactly this shape:
{
  "questions": [
    {
      "question": "...",
      "options": ["A text", "B text", "C text", "D text"],
      "answerIndex": 0,
      "explanation": "why the answer is right and what concept it tests"
    }
  ]
}

Rules:
- exactly ${n} questions
- each question has exactly 4 options
- answerIndex is the 0-based index of the correct option
- vary which position the correct answer occupies
- questions must be answerable from the technique knowledge provided, scenario-grounded where possible
- no "all of the above" options`;

    const raw = await callLLMForStudent(
      student,
      [
        { role: 'assistant', content: system },
        { role: 'user', content: `Generate the quiz now (${n} questions, difficulty: ${difficulty}).` },
      ]
    );

    const parsed = extractJson(raw) as { questions?: QuizQuestion[] } | QuizQuestion[];
    const questions = Array.isArray(parsed) ? parsed : parsed.questions || [];

    const clean = questions
      .filter(q => q.question && Array.isArray(q.options) && q.options.length >= 2)
      .map(q => ({
        question: q.question,
        options: q.options.slice(0, 4),
        answerIndex: Math.min(q.options.length - 1, Math.max(0, Number(q.answerIndex) || 0)),
        explanation: q.explanation || '',
      }));

    if (!clean.length) throw new Error('No valid questions generated');

    return NextResponse.json({ questions: clean, scope: quizScope });
  } catch (error) {
    console.error('[/api/quiz] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Quiz generation failed' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  // save attempt
  try {
    const student = await getAuthedStudent(req);
    if (!student) return unauthorized();

    const { skillSlug, category, score, total, details } = await req.json();
    const attempt = await db.quizAttempt.create({
      data: {
        studentId: student.id,
        skillSlug: skillSlug || (category || 'mixed'),
        category: category || 'mixed',
        score: Number(score) || 0,
        total: Number(total) || 0,
        details: JSON.stringify(details || []),
      },
    });
    triggerSync(student.id, `quiz: ${attempt.skillSlug} ${attempt.score}/${attempt.total}`);
    return NextResponse.json({ attempt });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'failed' }, { status: 500 });
  }
}
