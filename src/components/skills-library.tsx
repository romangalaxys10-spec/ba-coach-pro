'use client';

import { useMemo, useState } from 'react';
import { BA_SKILLS, CATEGORY_META, type BASkill } from '@/data/skills-data';
import { useAppStore } from '@/lib/store';
import { BA_LEVELS, SKILL_LEVEL, levelById, type LevelId } from '@/lib/levels';
import { Markdown } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Play, Globe2, ListChecks, Workflow, ShieldCheck, Puzzle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, typeof Puzzle> = {
  workflow: Workflow,
  atomic: Puzzle,
  requirements: ListChecks,
  elicitation: Globe2,
  quality: ShieldCheck,
};

export function SkillsLibrary() {
  const store = useAppStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [level, setLevel] = useState<LevelId | 'all'>('all');
  const [selected, setSelected] = useState<BASkill | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return BA_SKILLS.filter(s => {
      if (category !== 'all' && s.category !== category) return false;
      if (level !== 'all' && SKILL_LEVEL[s.slug] !== level) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.blurb.toLowerCase().includes(q) ||
        s.purpose.toLowerCase().includes(q)
      );
    });
  }, [query, category, level]);

  const coach = (skill: BASkill) => {
    setSelected(null);
    store.startSkillCoaching(
      skill.slug,
      `I want to learn and apply "${skill.name}". Teach it to me: when to use it, the steps, a small worked example, common mistakes — then coach me through applying it to my own situation.`
    );
  };

  return (
    <div className="thin-scroll h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Skill Library</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            All {BA_SKILLS.length} techniques from the business-analysis-skills pack, ready to be coached.
            Open any skill to study its procedure and guardrails — then practise it live with your coach.
          </p>
        </header>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search skills (e.g. stakeholder, MoSCoW, acceptance)…"
              className="pl-9"
            />
          </div>
        </div>

        {/* career level filter */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Level</span>
          <button
            onClick={() => setLevel('all')}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
              level === 'all'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            All <span className={cn('rounded-full px-1.5 text-[10px]', level === 'all' ? 'bg-white/20' : 'bg-muted')}>{BA_SKILLS.length}</span>
          </button>
          {BA_LEVELS.map(lv => {
            const count = BA_SKILLS.filter(s => SKILL_LEVEL[s.slug] === lv.id).length;
            const Icon = lv.icon;
            return (
              <button
                key={lv.id}
                onClick={() => setLevel(lv.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                  level === lv.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {lv.short}
                <span className={cn('rounded-full px-1.5 text-[10px]', level === lv.id ? 'bg-white/20' : 'bg-muted')}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <CategoryChip
            active={category === 'all'}
            onClick={() => setCategory('all')}
            label="All"
            count={BA_SKILLS.length}
          />
          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const Icon = CATEGORY_ICONS[key];
            return (
              <CategoryChip
                key={key}
                active={category === key}
                onClick={() => setCategory(key)}
                label={meta.label}
                count={BA_SKILLS.filter(s => s.category === key).length}
                icon={<Icon className="h-3.5 w-3.5" />}
              />
            );
          })}
        </div>

        {category !== 'all' && CATEGORY_META[category] && (
          <p className="mb-5 text-sm text-muted-foreground">{CATEGORY_META[category].description}</p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(skill => {
            const Icon = CATEGORY_ICONS[skill.category] || Puzzle;
            const skillLevel = SKILL_LEVEL[skill.slug] ? levelById(SKILL_LEVEL[skill.slug]) : null;
            const LevelIcon = skillLevel?.icon;
            return (
              <button
                key={skill.slug}
                onClick={() => setSelected(skill)}
                className="group flex h-full flex-col rounded-xl border border-border/70 bg-card p-4 text-left transition hover:border-primary/50 hover:shadow-md"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <Badge variant="outline" className="text-[10px] font-medium">
                    {CATEGORY_META[skill.category]?.label}
                  </Badge>
                  {skillLevel && LevelIcon && (
                    <span className={cn('ml-auto flex items-center gap-1 text-[10px] font-semibold', skillLevel.color)}>
                      <LevelIcon className="h-3 w-3" />
                      {skillLevel.short}
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold leading-snug">{skill.name}</div>
                <p className="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {skill.blurb}
                </p>
                <span className="mt-3 flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  Study this skill <ChevronRight className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">No skills match “{query}”.</p>
        )}
      </div>

      {/* detail dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="thin-scroll max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{CATEGORY_META[selected.category]?.label}</Badge>
                  <Badge variant="outline" className="font-mono text-[10px]">{selected.slug}</Badge>
                  {SKILL_LEVEL[selected.slug] && (() => {
                    const lv = levelById(SKILL_LEVEL[selected.slug]);
                    const LIcon = lv.icon;
                    return (
                      <span className={cn('flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold', lv.color)}>
                        <LIcon className="h-3 w-3" /> {lv.name}
                      </span>
                    );
                  })()}
                </div>
                <DialogTitle className="text-xl">{selected.name}</DialogTitle>
                <DialogDescription className="text-sm">{selected.blurb}</DialogDescription>
              </DialogHeader>

              <div className="space-y-5 text-sm">
                <Section title="Purpose">{selected.purpose}</Section>

                {selected.useWhen.length > 0 && (
                  <Section title="Use when">
                    <ul className="list-disc space-y-1 pl-4">
                      {selected.useWhen.map((u, i) => <li key={i}>{u}</li>)}
                    </ul>
                  </Section>
                )}

                {selected.procedure.length > 0 && (
                  <Section title="Procedure">
                    <ol className="list-decimal space-y-1.5 pl-4">
                      {selected.procedure.map((p, i) => <li key={i}>{p}</li>)}
                    </ol>
                  </Section>
                )}

                {selected.outputs.length > 0 && (
                  <Section title="Outputs">
                    <div className="flex flex-wrap gap-1.5">
                      {selected.outputs.map((o, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">{o}</Badge>
                      ))}
                    </div>
                  </Section>
                )}

                {selected.guardrails.length > 0 && (
                  <Section title="Guardrails">
                    <ul className="list-disc space-y-1 pl-4">
                      {selected.guardrails.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                  </Section>
                )}

                {selected.completion.length > 0 && (
                  <Section title="Completion criteria">
                    <ul className="list-disc space-y-1 pl-4">
                      {selected.completion.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </Section>
                )}

                <Button onClick={() => coach(selected)} className="w-full gap-2">
                  <Play className="h-4 w-4" /> Coach me through this skill
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
      )}
    >
      {icon}
      {label}
      <span className={cn('rounded-full px-1.5 text-[10px]', active ? 'bg-white/20' : 'bg-muted')}>{count}</span>
    </button>
  );
}
