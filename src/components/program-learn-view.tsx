'use client';

import { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { programById, isProgramId } from '@/lib/programs';
import { getProgramCurriculum, type ProgramLevel, type ProgramUnit, type ProgramLesson } from '@/lib/program-curriculum';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Play, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function unitDone(unit: ProgramUnit, completed: Record<string, boolean>): number {
  return unit.lessons.filter(l => completed[l.id]).length;
}

function lessonSeed(programName: string, lesson: ProgramLesson, unit: ProgramUnit): string {
  return (
    `Teach me the ${programName} lesson "${lesson.title}" (unit: ${unit.title}).\n` +
    `Learning outcome: ${lesson.canDo}\nFocus: ${lesson.focus}\nCover: ${lesson.detail}\n\n` +
    `Teach it step by step with examples, then run this practice task with me and give feedback: ${lesson.task}`
  );
}

export function ProgramLearnView({ program }: { program: string }) {
  const store = useAppStore();
  const completed = store.progressMap;
  const [openUnit, setOpenUnit] = useState<string | null>(null);
  const info = programById(program);
  const levels = useMemo(() => getProgramCurriculum(program) || [], [program]);

  const { done, total } = useMemo(() => {
    let d = 0;
    let t = 0;
    (levels as ProgramLevel[]).forEach(lv =>
      lv.units.forEach(u =>
        u.lessons.forEach(l => {
          t += 1;
          if (completed[l.id]) d += 1;
        })
      )
    );
    return { done: d, total: t };
  }, [levels, completed]);

  const learnLesson = (lesson: ProgramLesson, unit: ProgramUnit) => {
    store.startSkillCoaching(lesson.id, lessonSeed(info.name, lesson, unit));
  };

  const toggleComplete = (lessonId: string, value: boolean) => {
    void store.toggleLesson(lessonId, value);
  };

  if (!isProgramId(program) || program === 'ba' || !levels.length) return null;

  return (
    <div className="thin-scroll h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{info.emoji}</span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{info.name} Programme</h1>
              <p className="text-sm text-muted-foreground">{info.tagline}</p>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{info.description}</p>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3">
            <Progress value={total ? (done / total) * 100 : 0} className="h-1.5 flex-1" />
            <span className="text-xs font-medium text-muted-foreground">{done} / {total} lessons</span>
          </div>
        </header>

        {levels.map(lv => {
          const lvTotal = lv.units.reduce((n, u) => n + u.lessons.length, 0);
          const lvDone = lv.units.reduce((n, u) => n + unitDone(u, completed), 0);
          return (
            <section key={lv.id} className="mb-10">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">{lv.name}</h2>
                    <Badge variant="outline" className="text-[10px]">
                      {lvDone}/{lvTotal} lessons
                    </Badge>
                  </div>
                  <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-muted-foreground">{lv.descriptor}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {lv.units.map(u => {
                  const uDone = unitDone(u, completed);
                  const isOpen = openUnit === u.id;
                  return (
                    <div key={u.id} className={cn('flex flex-col rounded-xl border border-border/70 bg-card p-5', uDone === u.lessons.length && 'border-primary/40 bg-primary/5')}>
                      <button
                        type="button"
                        className="flex items-start gap-3 text-left"
                        onClick={() => setOpenUnit(isOpen ? null : u.id)}
                        aria-expanded={isOpen}
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold leading-snug">{u.title}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{u.theme}</p>
                        </div>
                        <ChevronDown className={cn('mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
                      </button>

                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={(uDone / u.lessons.length) * 100} className="h-1.5 flex-1" />
                        <span className="text-[11px] font-medium text-muted-foreground">{uDone}/{u.lessons.length}</span>
                      </div>

                      {isOpen && (
                        <ol className="mt-4 space-y-2">
                          {u.lessons.map((l, i) => {
                            const isDone = !!completed[l.id];
                            return (
                              <li
                                key={l.id}
                                className={cn(
                                  'flex items-start gap-3 rounded-xl border border-border/60 p-3 transition',
                                  isDone && 'border-primary/40 bg-primary/5'
                                )}
                              >
                                <Checkbox
                                  checked={isDone}
                                  onCheckedChange={v => toggleComplete(l.id, v === true)}
                                  className="mt-0.5"
                                  aria-label={`Mark ${l.title} complete`}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 text-sm font-medium">
                                    <span className="text-xs text-muted-foreground">{i + 1}.</span>
                                    {l.title}
                                    {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                                  </div>
                                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{l.canDo}</p>
                                  <Badge variant="secondary" className="mt-1.5 text-[10px] font-normal">{l.focus}</Badge>
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => learnLesson(l, u)}>
                                  <Play className="h-3 w-3" /> Learn
                                </Button>
                              </li>
                            );
                          })}
                        </ol>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
