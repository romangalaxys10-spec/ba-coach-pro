'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSkill } from '@/data/skills-data';
import { useAppStore } from '@/lib/store';
import { apiFetch, readJson } from '@/lib/client-api';
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
  Compass,
  Briefcase,
  Users,
  MessagesSquare,
  ListChecks,
  GitBranch,
  ShieldCheck,
  ChevronRight,
  Play,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  name: string;
  icon: typeof Compass;
  color: string;
  description: string;
  skills: string[];
}

const TRACKS: Track[] = [
  {
    id: 'foundations',
    name: 'Foundations & Problem Framing',
    icon: Compass,
    color: 'bg-teal-600/15 text-teal-700 dark:text-teal-300',
    description: 'Turn messy situations into well-framed problems. Start here if you are new to business analysis.',
    skills: ['business-problem-framing', 'problem-statement-refiner', 'see-i-clarifier', 'catwoe-root-definition', 'ssm-analysis', 'assumption-extractor', 'constraint-detector'],
  },
  {
    id: 'strategy',
    name: 'Strategy & Business Context',
    icon: Briefcase,
    color: 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300',
    description: 'Analyse the external and competitive context before committing to any solution.',
    skills: ['pestle-analysis', 'porters-five-forces', 'swot-prioritisation', 'value-proposition-analysis', 'strategy-analysis'],
  },
  {
    id: 'stakeholders',
    name: 'Stakeholder Engagement',
    icon: Users,
    color: 'bg-amber-600/15 text-amber-700 dark:text-amber-300',
    description: 'Map, analyse, engage and communicate with the people who decide success or failure.',
    skills: ['stakeholder-analysis', 'stakeholder-register', 'power-interest-grid', 'raci-matrix', 'raci-rasci-builder', 'interview-design', 'questionnaire-design', 'workshop-design', 'breakout-structure-designer', 'stakeholder-communication-planner'],
  },
  {
    id: 'elicitation',
    name: 'Elicitation Mastery',
    icon: MessagesSquare,
    color: 'bg-orange-600/15 text-orange-700 dark:text-orange-300',
    description: 'Advanced questioning structures and techniques that pull out what stakeholders cannot articulate.',
    skills: ['probe-question-generator', 'pyramid-funnel-diamond-interviewer', 'observation-study-plan', 'prototype-elicitation', 'questionnaire-pilot-checker'],
  },
  {
    id: 'requirements',
    name: 'Requirements Engineering',
    icon: ListChecks,
    color: 'bg-cyan-600/15 text-cyan-700 dark:text-cyan-300',
    description: 'The full requirements lifecycle: discover, interrogate, specify, validate, prioritise, trace and package.',
    skills: ['requirements-elicitation', 'requirements-interrogator', 'proto-requirements-normalizer', 'ambiguity-hunter', 'acceptance-criteria-writer', 'edge-case-elicitor', 'functional-vs-nonfunctional-splitter', 'requirements-conflict-checker', 'requirements-gap-auditor', 'requirements-prioritizer', 'moscow-prioritisation', 'requirements-traceability-starter', 'requirements-packager'],
  },
  {
    id: 'process',
    name: 'Process Improvement & Benefits',
    icon: GitBranch,
    color: 'bg-violet-600/15 text-violet-700 dark:text-violet-300',
    description: 'Investigate current processes, design better ones, extract rules and prove the benefits.',
    skills: ['as-is-process-investigator', 'process-model-spec', 'to-be-process-designer', 'business-rule-extractor', 'benefit-hypothesis-writer', 'process-modelling-and-improvement', 'use-case-specification'],
  },
  {
    id: 'quality',
    name: 'Quality & Professional Rigour',
    icon: ShieldCheck,
    color: 'bg-rose-600/15 text-rose-700 dark:text-rose-300',
    description: 'The review passes that separate professional BAs from amateurs. Run these before every sign-off.',
    skills: ['requirements-quality-check', 'critical-thinking-bias-check', 'assumptions-constraints-log', 'evidence-gap-review', 'deliverable-consistency-check', 'definition-of-done-drafter'],
  },
];

export function LearnView() {
  const store = useAppStore();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [openTrack, setOpenTrack] = useState<Track | null>(null);

  useEffect(() => {
    void apiFetch('/api/progress')
      .then(r => readJson<{ progress?: { itemId: string; completed: boolean }[] }>(r))
      .then(data => {
        const map: Record<string, boolean> = {};
        (data.progress || []).forEach((p: { itemId: string; completed: boolean }) => {
          map[p.itemId] = p.completed;
        });
        setCompleted(map);
      })
      .catch(() => null);
  }, []);

  const toggleComplete = async (skillSlug: string, value: boolean) => {
    setCompleted(prev => ({ ...prev, [skillSlug]: value }));
    await apiFetch('/api/progress', {
      method: 'POST',
      body: JSON.stringify({ itemId: skillSlug, completed: value }),
    }).catch(() => null);
  };

  const totalSkills = useMemo(() => TRACKS.reduce((n, t) => n + t.skills.length, 0), []);
  const doneCount = useMemo(
    () => Object.values(completed).filter(Boolean).length,
    [completed]
  );

  const learnSkill = (slug: string) => {
    setOpenTrack(null);
    const skill = getSkill(slug);
    store.startSkillCoaching(
      slug,
      `Teach me "${skill?.name || slug}" as a lesson: explain what it is and when to use it, walk me through the procedure step by step with a worked example, show the typical outputs, list common mistakes — then give me one practice exercise to check my understanding.`
    );
  };

  return (
    <div className="thin-scroll h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Learning Tracks</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Seven structured journeys covering all {totalSkills} skills in order. Each lesson is taught live
            by your coach, with a worked example and a practice exercise.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3">
            <Trophy className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="flex justify-between text-xs font-medium">
                <span>Overall progress</span>
                <span className="text-muted-foreground">{doneCount} / {totalSkills} skills</span>
              </div>
              <Progress value={(doneCount / totalSkills) * 100} className="mt-1.5 h-1.5" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {TRACKS.map(track => {
            const done = track.skills.filter(s => completed[s]).length;
            const pct = Math.round((done / track.skills.length) * 100);
            return (
              <div key={track.id} className="flex flex-col rounded-xl border border-border/70 bg-card p-5">
                <div className="mb-3 flex items-start gap-3">
                  <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', track.color)}>
                    <track.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold leading-snug">{track.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{track.description}</p>
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-3">
                  <Progress value={pct} className="h-1.5 flex-1" />
                  <span className="text-[11px] font-medium text-muted-foreground">{done}/{track.skills.length}</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {track.skills.length} lessons
                  </Badge>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setOpenTrack(track)}>
                    View track <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* track detail */}
      <Dialog open={!!openTrack} onOpenChange={open => !open && setOpenTrack(null)}>
        <DialogContent className="thin-scroll max-h-[85vh] overflow-y-auto sm:max-w-xl">
          {openTrack && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <openTrack.icon className="h-5 w-5 text-primary" />
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
                        onCheckedChange={v => void toggleComplete(slug, v === true)}
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
