/**
 * Program curriculum resolver — exposes one lesson shape for the non-BA
 * programmes (English, HRBP/L&D) so the portal can render any programme's
 * syllabus and drive AI tutoring off it. Lesson ids are already namespaced
 * per programme (en:…, hrbp:…) so they share the student progress store.
 */

import { ENGLISH_CURRICULUM, type EnLevel } from '@/data/english-data';
import { HRBP_CURRICULUM, type HrbpLevel } from '@/data/hrbp-data';
import type { ProgramId } from '@/lib/programs';

export interface ProgramLesson {
  id: string;
  title: string;
  focus: string;
  canDo: string;
  detail: string; // key vocab / core concepts
  task: string; // production task for the AI session
}

export interface ProgramUnit {
  id: string;
  title: string;
  theme: string;
  lessons: ProgramLesson[];
}

export interface ProgramLevel {
  id: string;
  name: string;
  descriptor: string;
  units: ProgramUnit[];
}

const fromEnglish = (levels: EnLevel[]): ProgramLevel[] =>
  levels.map(lv => ({
    id: lv.id,
    name: lv.name,
    descriptor: lv.descriptor,
    units: lv.units.map(u => ({
      id: u.id,
      title: u.title,
      theme: u.theme,
      lessons: u.lessons.map(l => ({
        id: l.id,
        title: l.title,
        focus: l.focus,
        canDo: l.canDo,
        detail: `Grammar: ${l.grammar}. Key vocabulary: ${l.vocab.join(', ')}.`,
        task: l.task,
      })),
    })),
  }));

const fromHrbp = (levels: HrbpLevel[]): ProgramLevel[] =>
  levels.map(lv => ({
    id: lv.id,
    name: lv.name,
    descriptor: lv.descriptor,
    units: lv.units.map(u => ({
      id: u.id,
      title: u.title,
      theme: u.theme,
      lessons: u.lessons.map(l => ({
        id: l.id,
        title: l.title,
        focus: l.focus,
        canDo: l.canDo,
        detail: `Core concepts: ${l.concepts.join(', ')}.`,
        task: l.task,
      })),
    })),
  }));

const CURRICULA: Record<Exclude<ProgramId, 'ba'>, ProgramLevel[]> = {
  english: fromEnglish(ENGLISH_CURRICULUM),
  hrbp: fromHrbp(HRBP_CURRICULUM),
};

/** Returns the syllabus for a non-BA programme, or null for BA / unknown. */
export function getProgramCurriculum(program: string | null | undefined): ProgramLevel[] | null {
  if (program === 'english' || program === 'hrbp') return CURRICULA[program];
  return null;
}

/** One tutor seed prompt per programme — keeps AI sessions on-programme. */
export const PROGRAM_PERSONA: Record<Exclude<ProgramId, 'ba'>, string> = {
  english:
    'You are the student\'s English tutor. Teach the lesson interactively: model the target language, ' +
    'correct mistakes gently with short explanations, and run the production task as a live roleplay or ' +
    'writing review. Keep your level of English matched to the lesson.',
  hrbp:
    'You are the student\'s HRBP/L&D coach — a senior HR Business Partner. Teach the lesson with real ' +
    'workplace examples, frameworks and roleplays; challenge the student to apply concepts to their own ' +
    'organisation and assess their practice task against professional standards (CIPD/SHRM style).',
};

export function programPersonaFor(program: string | null | undefined): string | null {
  if (program === 'english' || program === 'hrbp') return PROGRAM_PERSONA[program];
  return null;
}
