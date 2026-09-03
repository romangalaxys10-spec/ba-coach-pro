/**
 * BA CAREER LEVELS — Junior / Middle / Senior
 *
 * Single source of truth for the programme structure. Every section of the app
 * (Learning Tracks, Skill Library, Practice Arena, sidebar, coach chat, profile)
 * derives its level awareness from this file.
 *
 * The 7 learning tracks are grouped into 3 career levels:
 *   Junior — Foundation    (Foundations & Problem Framing, Elicitation Mastery)          = 12 lessons
 *   Middle — Practitioner  (Stakeholder Engagement, Requirements Engineering, Quality)   = 29 lessons
 *   Senior — Strategist    (Process Improvement & Benefits, Strategy & Business Context) = 12 lessons
 *
 * Progression: the next level unlocks when the previous level reaches UNLOCK_PCT
 * (80%). Experienced students can jump ahead explicitly (stored as a per-student
 * progress item `unlock:<level>`, so it persists and syncs to GitHub like any
 * lesson progress).
 */
import {
  Compass,
  Briefcase,
  Users,
  MessagesSquare,
  ListChecks,
  GitBranch,
  ShieldCheck,
  Sprout,
  ArrowUpRight,
  Award,
  type LucideIcon,
} from 'lucide-react';

export type LevelId = 'junior' | 'middle' | 'senior';

export type TrackId =
  | 'foundations'
  | 'strategy'
  | 'stakeholders'
  | 'elicitation'
  | 'requirements'
  | 'process'
  | 'quality';

/* ------------------------------------------------------------------ */
/* Tracks (moved here from learn-view so all sections share one map)   */
/* ------------------------------------------------------------------ */

export interface BATrack {
  id: TrackId;
  name: string;
  icon: typeof Compass;
  color: string;
  description: string;
  skills: string[];
  levelId: LevelId;
}

export const BA_TRACKS: BATrack[] = [
  {
    id: 'foundations',
    levelId: 'junior',
    name: 'Foundations & Problem Framing',
    icon: Compass,
    color: 'bg-teal-600/15 text-teal-700 dark:text-teal-300',
    description: 'Turn messy situations into well-framed problems. Start here if you are new to business analysis.',
    skills: ['business-problem-framing', 'problem-statement-refiner', 'see-i-clarifier', 'catwoe-root-definition', 'ssm-analysis', 'assumption-extractor', 'constraint-detector'],
  },
  {
    id: 'elicitation',
    levelId: 'junior',
    name: 'Elicitation Mastery',
    icon: MessagesSquare,
    color: 'bg-orange-600/15 text-orange-700 dark:text-orange-300',
    description: 'Questioning structures and techniques that pull out what stakeholders cannot articulate — the bread and butter of every BA.',
    skills: ['probe-question-generator', 'pyramid-funnel-diamond-interviewer', 'observation-study-plan', 'prototype-elicitation', 'questionnaire-pilot-checker'],
  },
  {
    id: 'stakeholders',
    levelId: 'middle',
    name: 'Stakeholder Engagement',
    icon: Users,
    color: 'bg-amber-600/15 text-amber-700 dark:text-amber-300',
    description: 'Map, analyse, engage and communicate with the people who decide success or failure.',
    skills: ['stakeholder-analysis', 'stakeholder-register', 'power-interest-grid', 'raci-matrix', 'raci-rasci-builder', 'interview-design', 'questionnaire-design', 'workshop-design', 'breakout-structure-designer', 'stakeholder-communication-planner'],
  },
  {
    id: 'requirements',
    levelId: 'middle',
    name: 'Requirements Engineering',
    icon: ListChecks,
    color: 'bg-cyan-600/15 text-cyan-700 dark:text-cyan-300',
    description: 'The full requirements lifecycle: discover, interrogate, specify, validate, prioritise, trace and package.',
    skills: ['requirements-elicitation', 'requirements-interrogator', 'proto-requirements-normalizer', 'ambiguity-hunter', 'acceptance-criteria-writer', 'edge-case-elicitor', 'functional-vs-nonfunctional-splitter', 'requirements-conflict-checker', 'requirements-gap-auditor', 'requirements-prioritizer', 'moscow-prioritisation', 'requirements-traceability-starter', 'requirements-packager'],
  },
  {
    id: 'quality',
    levelId: 'middle',
    name: 'Quality & Professional Rigour',
    icon: ShieldCheck,
    color: 'bg-rose-600/15 text-rose-700 dark:text-rose-300',
    description: 'The review passes that separate professional BAs from amateurs. Run these before every sign-off.',
    skills: ['requirements-quality-check', 'critical-thinking-bias-check', 'assumptions-constraints-log', 'evidence-gap-review', 'deliverable-consistency-check', 'definition-of-done-drafter'],
  },
  {
    id: 'process',
    levelId: 'senior',
    name: 'Process Improvement & Benefits',
    icon: GitBranch,
    color: 'bg-violet-600/15 text-violet-700 dark:text-violet-300',
    description: 'Lead improvement: investigate current processes, design better ones, extract rules and prove the benefits.',
    skills: ['as-is-process-investigator', 'process-model-spec', 'to-be-process-designer', 'business-rule-extractor', 'benefit-hypothesis-writer', 'process-modelling-and-improvement', 'use-case-specification'],
  },
  {
    id: 'strategy',
    levelId: 'senior',
    name: 'Strategy & Business Context',
    icon: Briefcase,
    color: 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300',
    description: 'Analyse the external and competitive context before committing to any solution.',
    skills: ['pestle-analysis', 'porters-five-forces', 'swot-prioritisation', 'value-proposition-analysis', 'strategy-analysis'],
  },
];

/* ------------------------------------------------------------------ */
/* Levels                                                              */
/* ------------------------------------------------------------------ */

export interface BALevel {
  id: LevelId;
  name: string;
  short: string;
  tagline: string;
  icon: typeof Sprout;
  /** tailwind color classes for the level accent */
  color: string;
  /** solid dot color for mini progress bars */
  bar: string;
  description: string;
  outcomes: string[];
  tracks: TrackId[];
  /** previous level completion % required to unlock (unless jumped ahead) */
  unlockPct: number;
}

export const UNLOCK_PCT = 80;

export const BA_LEVELS: BALevel[] = [
  {
    id: 'junior',
    name: 'Junior BA',
    short: 'Junior',
    tagline: 'Foundation',
    icon: Sprout,
    color: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500',
    description:
      'Learn the craft of understanding. Frame messy problems precisely and master the elicitation techniques that get stakeholders to tell you what they actually need.',
    outcomes: [
      'Frame a business problem with objectives, scope and success criteria',
      'Run structured interviews and choose the right elicitation technique',
      'Separate facts, assumptions and unknowns in any situation',
    ],
    tracks: ['foundations', 'elicitation'],
    unlockPct: 0,
  },
  {
    id: 'middle',
    name: 'Middle BA',
    short: 'Middle',
    tagline: 'Practitioner',
    icon: ArrowUpRight,
    color: 'text-sky-600 dark:text-sky-400',
    bar: 'bg-sky-500',
    description:
      'Deliver with rigour. Own the requirements lifecycle end to end, manage the stakeholders around them, and hold your deliverables to a professional quality bar.',
    outcomes: [
      'Engineer requirements through the full lifecycle — to traceable, sign-off-ready packages',
      'Map power and influence, and plan engagement that keeps stakeholders aligned',
      'Run quality passes (ambiguity, bias, evidence, consistency) before every delivery',
    ],
    tracks: ['stakeholders', 'requirements', 'quality'],
    unlockPct: UNLOCK_PCT,
  },
  {
    id: 'senior',
    name: 'Senior BA',
    short: 'Senior',
    tagline: 'Strategist',
    icon: Award,
    color: 'text-amber-600 dark:text-amber-400',
    bar: 'bg-amber-500',
    description:
      'Lead change and shape strategy. Read the competitive context, design the improved operating model, and prove the benefits the business case promised.',
    outcomes: [
      'Analyse strategy with PESTLE, Five Forces and value propositions before solutioning',
      'Lead as-is / to-be process redesign and extract the business rules that govern it',
      'Write benefit hypotheses that connect change to measurable business outcomes',
    ],
    tracks: ['process', 'strategy'],
    unlockPct: UNLOCK_PCT,
  },
];

/* ------------------------------------------------------------------ */
/* Derived maps & helpers                                              */
/* ------------------------------------------------------------------ */

export const tracksOfLevel = (levelId: LevelId): BATrack[] =>
  BA_TRACKS.filter(t => t.levelId === levelId);

export const trackById = (id: TrackId): BATrack | undefined =>
  BA_TRACKS.find(t => t.id === id);

/** skill slug → level id (derived from track membership) */
export const SKILL_LEVEL: Record<string, LevelId> = (() => {
  const map: Record<string, LevelId> = {};
  for (const t of BA_TRACKS) for (const s of t.skills) map[s] = t.levelId;
  return map;
})();

export const levelOfSkill = (slug: string): LevelId | undefined => SKILL_LEVEL[slug];

export const levelById = (id: LevelId): BALevel =>
  BA_LEVELS.find(l => l.id === id) as BALevel;

/** Case-method difficulty → career level */
export const caseLevel = (difficulty: string): LevelId =>
  difficulty === 'Foundational' ? 'junior' : difficulty === 'Intermediate' ? 'middle' : 'senior';

/** Quiz difficulty value → career level id (recall → Junior, apply → Middle, judge → Senior) */
export const quizLevel = (difficulty: string): LevelId =>
  difficulty === 'easy' ? 'junior' : difficulty === 'hard' ? 'senior' : 'middle';

/** progress item ids used to store explicit "jump ahead" unlocks */
export const unlockItemId = (levelId: LevelId) => `unlock:${levelId}`;

/* ------------------------------------------------------------------ */
/* Progress computation                                                */
/* ------------------------------------------------------------------ */

export type LevelStatus = 'locked' | 'available' | 'in_progress' | 'complete';

export interface TrackProgress {
  track: BATrack;
  done: number;
  total: number;
  pct: number;
}

export interface LevelProgress {
  id: LevelId;
  name: string;
  short: string;
  tagline: string;
  icon: typeof Sprout;
  color: string;
  bar: string;
  description: string;
  done: number;
  total: number;
  pct: number;
  status: LevelStatus;
  unlocked: boolean;
  gateLabel: string | null;
  tracks: TrackProgress[];
}

export interface CareerProgress {
  levels: LevelProgress[];
  currentLevelId: LevelId;
  overallDone: number;
  overallTotal: number;
  overallPct: number;
  /** the gate the student is currently working towards, if any */
  nextGate: { to: LevelId; have: number; need: number; fromPct: number } | null;
}

/**
 * Compute level progress from a completed-lesson map.
 * @param completed  map of progress itemId → completed (lesson slugs + `unlock:*` overrides)
 */
export function computeCareerProgress(completed: Record<string, boolean>): CareerProgress {
  const levels: LevelProgress[] = [];
  let prev: LevelProgress | null = null;

  for (const level of BA_LEVELS) {
    const tracks = tracksOfLevel(level.id).map(t => {
      const done = t.skills.filter(s => completed[s]).length;
      const total = t.skills.length;
      return { track: t, done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    });
    const done = tracks.reduce((n, t) => n + t.done, 0);
    const total = tracks.reduce((n, t) => n + t.total, 0);
    const pct = total ? Math.round((done / total) * 100) : 0;

    const jumped = Boolean(completed[unlockItemId(level.id)]);
    const unlocked =
      level.id === 'junior' ||
      jumped ||
      Boolean(prev && (prev.pct >= level.unlockPct || prev.status === 'complete'));

    const status: LevelStatus =
      !unlocked ? 'locked' : pct >= 100 ? 'complete' : done > 0 ? 'in_progress' : 'available';

    levels.push({
      id: level.id,
      name: level.name,
      short: level.short,
      tagline: level.tagline,
      icon: level.icon,
      color: level.color,
      bar: level.bar,
      description: level.description,
      done,
      total,
      pct,
      status,
      unlocked,
      gateLabel:
        unlocked || !prev
          ? null
          : `${prev.short} level ${level.unlockPct}% complete unlocks ${level.short} — ${Math.max(
              0,
              Math.ceil((level.unlockPct / 100) * prev.total) - prev.done
            )} lessons to go`,
      tracks,
    });
    prev = levels[levels.length - 1];
  }

  const overallDone = levels.reduce((n, l) => n + l.done, 0);
  const overallTotal = levels.reduce((n, l) => n + l.total, 0);
  const overallPct = overallTotal ? Math.round((overallDone / overallTotal) * 100) : 0;

  const firstOpen = levels.find(l => l.status === 'available' || l.status === 'in_progress');
  const currentLevelId = firstOpen ? firstOpen.id : 'senior';

  const gate = levels.find(l => !l.unlocked);
  const gatePrev = gate ? levels[levels.indexOf(gate) - 1] : null;
  const nextGate =
    gate && gatePrev
      ? {
          to: gate.id,
          have: gatePrev.pct,
          need: levelById(gate.id).unlockPct,
          fromPct: gatePrev.pct,
        }
      : null;

  return { levels, currentLevelId, overallDone, overallTotal, overallPct, nextGate };
}

/** Short human label for a skill, e.g. "Middle" — used in badges across sections */
export const levelShort = (slug: string): string | null => {
  const id = SKILL_LEVEL[slug];
  return id ? levelById(id).short : null;
};
