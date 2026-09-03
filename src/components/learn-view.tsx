'use client';

import { useMemo, useState } from 'react';
import { getSkill } from '@/data/skills-data';
import { useAppStore } from '@/lib/store';
import {
  BA_LEVELS,
  computeCareerProgress,
  unlockItemId,
  levelById,
  type BATrack,
  type LevelId,
} from '@/lib/levels';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ChevronRight,
  Play,
  CheckCircle2,
  Trophy,
  Lock,
  ArrowRight,
  Flag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<string, string> = {
  complete: 'border-primary/40 bg-primary/10 text-primary',
  in_progress: 'border-primary/40 bg-primary/10 text-primary',
  available: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  locked: 'border-border bg-muted/40 text-muted-foreground',
};

const STATUS_LABEL: Record<string, string> = {
  complete: 'Complete',
  in_progress: 'In progress',
  available: 'Unlocked',
  locked: 'Locked',
};

export function LearnView() {
  const store = useAppStore();
  const completed = store.progressMap;
  const [openTrack, setOpenTrack] = useState<BATrack | null>(null);
  const [gateLevel, setGateLevel] = useState<LevelId | null>(null);

  const career = useMemo(() => computeCareerProgress(completed), [completed]);

  const toggleComplete = (skillSlug: string, value: boolean) => {
    void store.toggleLesson(skillSlug, value);
  };

  const jumpAhead = (levelId: LevelId) => {
    void store.toggleLesson(unlockItemId(levelId), true);
    setGateLevel(null);
  };

  const learnSkill = (slug: string) => {
    setOpenTrack(null);
    const skill = getSkill(slug);
    store.startSkillCoaching(
      slug,
      `Teach me "${skill?.name || slug}" as a lesson: explain what it is and when to use it, walk me through the procedure step by step with a worked example, show the typical outputs, list common mistakes — then give me one practice exercise to check my understanding.`
    );
  };

  const openOrGate = (track: BATrack) => {
    const level = career.levels.find(l => l.id === track.levelId);
    if (level && !level.unlocked) setGateLevel(track.levelId);
    else setOpenTrack(track);
  };

  return (
    <div className="thin-scroll h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Learning Tracks</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            The BA programme runs on three career levels — Junior, Middle and Senior. Finish {career.levels[0].total} Junior
            lessons to unlock Middle, and Middle to unlock Senior. Each lesson is taught live by your coach,
            with a worked example and a practice exercise.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3">
            <Trophy className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="flex justify-between text-xs font-medium">
                <span>Overall progress</span>
                <span className="text-muted-foreground">{career.overallDone} / {career.overallTotal} lessons</span>
              </div>
              <Progress value={career.overallPct} className="mt-1.5 h-1.5" />
            </div>
          </div>
        </header>

        {/* ---- level journey strip ---- */}
        <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          {career.levels.map((lv, i) => {
            const isCurrent = lv.id === career.currentLevelId && lv.status !== 'complete';
            return (
              <button
                key={lv.id}
                onClick={() => {
                  if (!lv.unlocked) setGateLevel(lv.id);
                  else document.getElementById(`level-section-${lv.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={cn(
                  'flex flex-col rounded-2xl border p-4 text-left transition',
                  lv.unlocked
                    ? 'border-border/70 bg-card hover:border-primary/40 hover:shadow-md'
                    : 'border-dashed border-border/60 bg-muted/30',
                  isCurrent && 'border-primary/60 ring-2 ring-primary/25'
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className={cn('flex items-center gap-2 text-sm font-semibold', lv.color)}>
                    <lv.icon className="h-4 w-4" />
                    {lv.name}
                  </span>
                  <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-medium', STATUS_STYLE[lv.status])}>
                    {lv.status === 'locked' && <Lock className="mr-1 inline h-2.5 w-2.5" />}
                    {STATUS_LABEL[lv.status]}
                  </span>
                </div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{lv.tagline}</div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={lv.pct} className="h-1.5 flex-1" />
                  <span className="text-[11px] font-medium text-muted-foreground">{lv.pct}%</span>
                </div>
                <div className="mt-1.5 text-[11px] text-muted-foreground">
                  {lv.done} / {lv.total} lessons · {lv.tracks.length} tracks
                </div>
                {!lv.unlocked && lv.gateLabel && (
                  <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-muted/60 px-2 py-1.5 text-[11px] leading-snug text-muted-foreground">
                    <Lock className="mt-0.5 h-3 w-3 shrink-0" />
                    {lv.gateLabel}
                  </div>
                )}
                {lv.status === 'complete' && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-primary">
                    <CheckCircle2 className="h-3 w-3" /> Level mastered
                  </div>
                )}
                {isCurrent && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-primary">
                    <Flag className="h-3 w-3" /> You are here
                  </div>
                )}
                {i < 2 && null}
              </button>
            );
          })}
        </div>

        {/* ---- level sections with tracks ---- */}
        {career.levels.map(lv => {
          const LevelIcon = lv.icon;
          return (
            <section key={lv.id} id={`level-section-${lv.id}`} className="mb-10 scroll-mt-6">
              <div className={cn('mb-4 flex flex-wrap items-center gap-3', !lv.unlocked && 'opacity-70')}>
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-card', lv.color)}>
                  <LevelIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">{lv.name}</h2>
                    <Badge variant="outline" className={cn('text-[10px]', lv.color)}>
                      {lv.tagline}
                    </Badge>
                    <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-medium', STATUS_STYLE[lv.status])}>
                      {lv.status === 'locked' && <Lock className="mr-1 inline h-2.5 w-2.5" />}
                      {STATUS_LABEL[lv.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-muted-foreground">{lv.description}</p>
                </div>
                <div className="text-right">
                  <div className={cn('text-lg font-bold leading-none', lv.color)}>{lv.pct}%</div>
                  <div className="text-[10px] text-muted-foreground">{lv.done}/{lv.total} lessons</div>
                </div>
              </div>

              {!lv.unlocked && lv.gateLabel && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    {lv.gateLabel}. Finish your current level — or jump ahead if you already work at this level.
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setGateLevel(lv.id)}>
                    Jump ahead anyway <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', !lv.unlocked && 'opacity-60')}>
                {lv.tracks.map(track => {
                  const done = track.done;
                  const pct = track.pct;
                  const TrackIcon = track.track.icon;
                  return (
                    <div key={track.track.id} className="flex flex-col rounded-xl border border-border/70 bg-card p-5">
                      <div className="mb-3 flex items-start gap-3">
                        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', track.track.color)}>
                          <TrackIcon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold leading-snug">{track.track.name}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{track.track.description}</p>
                        </div>
                      </div>
                      <div className="mb-3 flex items-center gap-3">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-[11px] font-medium text-muted-foreground">{done}/{track.total}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          {track.total} lessons · {lv.short}
                        </Badge>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => openOrGate(track.track)}>
                          {lv.unlocked ? 'View track' : 'Preview'} <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* ---- locked-level gate dialog ---- */}
      <Dialog open={!!gateLevel} onOpenChange={open => !open && setGateLevel(null)}>
        <DialogContent className="sm:max-w-md">
          {gateLevel && (() => {
            const lv = levelById(gateLevel);
            const lp = career.levels.find(l => l.id === gateLevel);
            const GateIcon = lv.icon;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg">
                    <GateIcon className={cn('h-5 w-5', lv.color)} />
                    {lv.name} is gated
                  </DialogTitle>
                  <DialogDescription>
                    The programme unlocks {lv.short} when your previous level reaches {lv.unlockPct}% — that is how the
                    Junior → Middle → Senior flow builds real skill on top of skill.
                  </DialogDescription>
                </DialogHeader>
                {lp && (
                  <div className="rounded-xl border border-border/60 bg-card p-4 text-sm">
                    <div className="mb-2 text-xs font-medium text-muted-foreground">{lp.gateLabel}</div>
                    <Progress value={lp.pct === 0 ? 0 : Math.min(100, (career.levels[career.levels.indexOf(lp) - 1]?.pct || 0))} className="h-1.5" />
                  </div>
                )}
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {lv.outcomes.map((o, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      {o}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline" className="flex-1" onClick={() => setGateLevel(null)}>
                    Keep working on my level
                  </Button>
                  <Button className="flex-1" onClick={() => jumpAhead(gateLevel)}>
                    I work at this level — jump ahead
                  </Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ---- track detail ---- */}
      <Dialog open={!!openTrack} onOpenChange={open => !open && setOpenTrack(null)}>
        <DialogContent className="thin-scroll max-h-[85vh] overflow-y-auto sm:max-w-xl">
          {openTrack && (() => {
            const lv = levelById(openTrack.levelId);
            const TrackIcon = openTrack.icon;
            return (
              <>
                <DialogHeader>
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline" className={cn('text-[10px]', lv.color)}>
                      {lv.name} · {lv.tagline}
                    </Badge>
                  </div>
                  <DialogTitle className="flex items-center gap-2 text-lg">
                    <TrackIcon className={cn('h-5 w-5', lv.color)} />
                    {openTrack.name}
                  </DialogTitle>
                  <DialogDescription>{openTrack.description}</DialogDescription>
                </DialogHeader>
                <ol className="space-y-2">
                  {openTrack.skills.map((slug, i) => {
                    const skill = getSkill(slug);
                    if (!skill) return null;
                    const isDone = completed[slug];
                    return (
                      <li
                        key={slug}
                        className={cn(
                          'flex items-start gap-3 rounded-xl border border-border/60 p-3 transition',
                          isDone && 'border-primary/40 bg-primary/5'
                        )}
                      >
                        <Checkbox
                          checked={!!isDone}
                          onCheckedChange={v => toggleComplete(slug, v === true)}
                          className="mt-0.5"
                          aria-label={`Mark ${skill.name} complete`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-xs text-muted-foreground">{i + 1}.</span>
                            {skill.name}
                            {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{skill.blurb}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => learnSkill(slug)}>
                          <Play className="h-3 w-3" /> Learn
                        </Button>
                      </li>
                    );
                  })}
                </ol>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
