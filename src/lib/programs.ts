/**
 * Education programmes available at portal entry (registration).
 * Each programme gets its own curriculum view inside the portal;
 * progress items are namespaced per programme so they never collide.
 */

export type ProgramId = 'ba' | 'english' | 'hrbp';

export interface ProgramInfo {
  id: ProgramId;
  name: string;
  short: string;
  tagline: string;
  description: string;
  emoji: string;
  accent: string; // tailwind text color class
}

export const PROGRAM_CATALOG: ProgramInfo[] = [
  {
    id: 'ba',
    name: 'Business Analysis',
    short: 'BA',
    tagline: 'The full BA career path',
    description:
      '53 expert skills across 7 learning tracks — requirements, process modelling, stakeholder management, agile, data and strategy — from Junior to Senior.',
    emoji: '📊',
    accent: 'text-primary',
  },
  {
    id: 'english',
    name: 'English Language',
    short: 'English',
    tagline: 'General → Business → Exams',
    description:
      'A complete CEFR A1→C2 pathway with Business English and IELTS/TOEFL exam prep. Every lesson is taught live by your AI tutor: vocabulary, grammar, and a production task.',
    emoji: '🇬🇧',
    accent: 'text-sky-500 dark:text-sky-400',
  },
  {
    id: 'hrbp',
    name: 'HRBP / L&D',
    short: 'HRBP',
    tagline: 'People & development mastery',
    description:
      'HR Business Partnering and Learning & Development — talent management, org design, performance, learning strategy and people analytics, taught by your AI coach.',
    emoji: '🤝',
    accent: 'text-violet-500 dark:text-violet-400',
  },
];

export const programById = (id: string | null | undefined): ProgramInfo =>
  PROGRAM_CATALOG.find(p => p.id === id) || PROGRAM_CATALOG[0];

export const isProgramId = (v: unknown): v is ProgramId =>
  typeof v === 'string' && PROGRAM_CATALOG.some(p => p.id === v);
