'use client';

/**
 * Interactive in-chat tests. The coach emits a fenced ```quiz JSON block when a
 * student asks to be tested; we swap that block for a real answerable quiz —
 * selectable options, submit, per-question explanations, score and a one-click
 * "share results with coach" follow-up. Works for all programmes (BA/English/HRBP)
 * because the quiz content itself comes from the programme-aware coach prompt.
 */

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Check, ListChecks, RotateCcw, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain?: string;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

const QUIZ_FENCE = /```quiz[^\S\n]*\n?([\s\S]*?)```/g;

function parseQuizJson(raw: string): Quiz | null {
  try {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end <= start) return null;
    const obj = JSON.parse(raw.slice(start, end + 1)) as {
      title?: unknown;
      questions?: unknown;
    };
    if (!obj || !Array.isArray(obj.questions) || obj.questions.length === 0) return null;
    const questions: QuizQuestion[] = [];
    for (const item of obj.questions) {
      const q = item as { q?: unknown; options?: unknown; answer?: unknown; explain?: unknown };
      if (!q || typeof q.q !== 'string') return null;
      const options = Array.isArray(q.options) ? q.options.map(o => String(o)) : [];
      if (options.length < 2) return null;
      const answer = Math.max(0, Math.min(options.length - 1, Math.round(Number(q.answer) || 0)));
      questions.push({
        q: q.q,
        options,
        answer,
        explain: typeof q.explain === 'string' && q.explain.trim() ? q.explain.trim() : undefined,
      });
    }
    if (questions.length === 0) return null;
    return {
      title: typeof obj.title === 'string' && obj.title.trim() ? obj.title.trim() : 'Knowledge check',
      questions,
    };
  } catch {
    return null;
  }
}

export type QuizSegment = { kind: 'md'; text: string } | { kind: 'quiz'; quiz: Quiz };

/** Split an assistant reply into markdown segments and interactive quiz blocks. */
export function parseQuizContent(content: string): QuizSegment[] {
  const segments: QuizSegment[] = [];
  let last = 0;
  for (const m of content.matchAll(QUIZ_FENCE)) {
    const idx = m.index ?? 0;
    if (idx > last) segments.push({ kind: 'md', text: content.slice(last, idx) });
    const quiz = parseQuizJson(m[1]);
    if (quiz) segments.push({ kind: 'quiz', quiz });
    else segments.push({ kind: 'md', text: content.slice(idx, idx + m[0].length) });
    last = idx + m[0].length;
  }
  if (last < content.length) segments.push({ kind: 'md', text: content.slice(last) });
  return segments;
}

/** Reply text with quiz blocks stripped, so TTS never reads JSON aloud. */
export function speakableText(content: string): string {
  return content.replace(QUIZ_FENCE, '').trim();
}

const LETTERS = 'ABCDEFGH';

export function QuizBlock({ quiz }: { quiz: Quiz }) {
  const store = useAppStore();
  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [shared, setShared] = useState(false);

  const total = quiz.questions.length;
  const answered = answers.filter(a => a !== null).length;
  const score = quiz.questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round((score / total) * 100);

  const choose = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers(prev => prev.map((a, i) => (i === qi ? oi : a)));
  };

  const retake = () => {
    setAnswers(quiz.questions.map(() => null));
    setSubmitted(false);
    setShared(false);
  };

  const shareResults = () => {
    const missed = quiz.questions
      .map((q, i) => ({ q, i, picked: answers[i] }))
      .filter(({ q, picked }) => picked !== q.answer)
      .map(({ q, i, picked }) =>
        `Q${i + 1}: "${q.q}" — I chose "${picked !== null ? q.options[picked] : 'nothing'}", the correct answer is "${q.options[q.answer]}".`
      )
      .join('\n');
    const summary = missed
      ? `I scored ${score}/${total} on the quiz "${quiz.title}". Please review my mistakes and coach me on them:\n${missed}`
      : `I scored ${score}/${total} on the quiz "${quiz.title}" — everything correct! Give me one harder follow-up question on this topic.`;
    setShared(true);
    void store.sendMessage(summary);
  };

  return (
    <div className="not-prose my-3 overflow-hidden rounded-xl border border-primary/25 bg-primary/[0.04]">
      {/* header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-primary/15 px-4 py-2.5">
        <ListChecks className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">{quiz.title}</span>
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
          {submitted ? `Score ${score}/${total} · ${pct}%` : `Question ${Math.min(answered + (submitted ? 0 : 1), total)} of ${total}`}
        </span>
      </div>

      {/* questions */}
      <div className="space-y-4 px-4 py-3">
        {quiz.questions.map((q, qi) => (
          <div key={qi}>
            <div className="mb-2 flex items-start gap-2 text-sm font-medium">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                {qi + 1}
              </span>
              <span>{q.q}</span>
            </div>
            <div className="ml-7 space-y-1.5">
              {q.options.map((opt, oi) => {
                const isCorrect = submitted && oi === q.answer;
                const isWrongPick = submitted && answers[qi] === oi && oi !== q.answer;
                return (
                  <button
                    key={oi}
                    onClick={() => choose(qi, oi)}
                    disabled={submitted}
                    className={cn(
                      'flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-[13px] transition',
                      isCorrect && 'border-emerald-500/70 bg-emerald-500/10',
                      isWrongPick && 'border-red-500/70 bg-red-500/10',
                      !submitted && answers[qi] === oi && 'border-primary bg-primary/10',
                      !submitted && answers[qi] !== oi && 'border-border/70 bg-card hover:border-primary/50',
                      submitted && !isCorrect && !isWrongPick && 'border-border/50 opacity-55'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold',
                        isCorrect
                          ? 'bg-emerald-500 text-white'
                          : isWrongPick
                            ? 'bg-red-500 text-white'
                            : answers[qi] === oi
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {LETTERS[oi]}
                    </span>
                    <span className="min-w-0 flex-1">{opt}</span>
                    {isCorrect && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
                    {isWrongPick && <X className="h-4 w-4 shrink-0 text-red-600" />}
                  </button>
                );
              })}
              {submitted && q.explain && (
                <p className="rounded-lg bg-muted/60 px-3 py-2 text-[12px] leading-snug text-muted-foreground">
                  <span className="font-semibold text-foreground">Why: </span>
                  {q.explain}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* footer */}
      <div className="flex flex-wrap items-center gap-2 border-t border-primary/15 px-4 py-3">
        {!submitted ? (
          <>
            <Button size="sm" onClick={() => setSubmitted(true)} disabled={answered < total}>
              Submit answers
            </Button>
            <span className="text-xs text-muted-foreground">
              {answered < total ? `${answered}/${total} answered — pick an option for every question` : 'Ready — check your score'}
            </span>
          </>
        ) : (
          <>
            <span
              className={cn(
                'text-sm font-semibold',
                pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500'
              )}
            >
              {score}/{total} correct ({pct}%)
            </span>
            <span className="text-xs text-muted-foreground">
              {pct >= 80 ? 'Excellent — you know this topic.' : pct >= 50 ? 'Good effort — read the explanations above.' : 'Keep practising — review the explanations and retake.'}
            </span>
            <div className="ml-auto flex gap-1.5">
              <Button size="sm" variant="outline" onClick={retake}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Retake
              </Button>
              <Button size="sm" variant="secondary" onClick={shareResults} disabled={shared}>
                <Send className="mr-1.5 h-3.5 w-3.5" /> {shared ? 'Shared ✓' : 'Review with coach'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
