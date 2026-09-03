'use client';

import { useState } from 'react';
import { BA_SKILLS, CATEGORY_META } from '@/data/skills-data';
import { BA_CASES } from '@/data/cases-data';
import { useAppStore } from '@/lib/store';
import { apiFetch, readJson } from '@/lib/client-api';
import { Markdown } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Dumbbell,
  BrainCircuit,
  Layers,
  Target,
  Briefcase,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  FlipHorizontal2,
  GraduationCap,
  Play,
  Loader2,
  BookOpen,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'quiz' | 'flashcards' | 'interview' | 'cases';

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

interface Flashcard {
  front: string;
  back: string;
}

export function PracticeView() {
  const [tab, setTab] = useState<Tab>('quiz');

  return (
    <div className="thin-scroll h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight">Practice Arena</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Sharpen your craft the way serious analysts do: exam-style drills, spaced-repetition flashcards,
            live stakeholder rehearsal, and case-method analysis.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          <TabChip active={tab === 'quiz'} onClick={() => setTab('quiz')} icon={BrainCircuit} label="Skill Quizzes" />
          <TabChip active={tab === 'flashcards'} onClick={() => setTab('flashcards')} icon={Layers} label="Flashcards" />
          <TabChip active={tab === 'interview'} onClick={() => setTab('interview')} icon={Target} label="Interview Simulator" />
          <TabChip active={tab === 'cases'} onClick={() => setTab('cases')} icon={Briefcase} label="Case Method" harvard />
        </div>

        {tab === 'quiz' && <QuizTab />}
        {tab === 'flashcards' && <FlashcardsTab />}
        {tab === 'interview' && <InterviewTab />}
        {tab === 'cases' && <CasesTab />}
      </div>
    </div>
  );
}

function TabChip({ active, onClick, icon: Icon, label, harvard }: { active: boolean; onClick: () => void; icon: typeof Layers; label: string; harvard?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      {harvard && <span className="rounded bg-[#a51c30] px-1 text-[9px] font-bold text-white">CASE</span>}
    </button>
  );
}

/* ---------------- shared scope selector ---------------- */

function SkillScopeSelect({ value, onChange, allowMixed = true }: { value: string; onChange: (v: string) => void; allowMixed?: boolean }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-72">
        <SelectValue placeholder="Choose a skill…" />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {allowMixed && <SelectItem value="mixed">Mixed — all 53 skills</SelectItem>}
        {Object.entries(CATEGORY_META).map(([cat, meta]) => (
          <SelectGroup key={cat}>
            <SelectLabel>{meta.label}</SelectLabel>
            {BA_SKILLS.filter(s => s.category === cat).map(s => (
              <SelectItem key={s.slug} value={s.slug}>
                {s.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ---------------- quiz ---------------- */

function QuizTab() {
  const [scope, setScope] = useState('mixed');
  const [difficulty, setDifficulty] = useState('mixed');
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ q: string; chosen: number; correct: number; ok: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const generate = async () => {
    setLoading(true);
    setQuestions(null);
    setFinished(false);
    setIdx(0);
    setChosen(null);
    setAnswers([]);
    try {
      const isCategory = ['mixed', ...Object.keys(CATEGORY_META)].includes(scope);
      const res = await apiFetch('/api/quiz', {
        method: 'POST',
        body: JSON.stringify({
          skillSlug: isCategory ? undefined : scope,
          category: isCategory ? scope : undefined,
          difficulty,
          count: 5,
        }),
      });
      const data = await readJson<{ error?: string; questions?: QuizQuestion[] }>(res);
      if (!res.ok || data.error) throw new Error(data.error);
      setQuestions(data.questions || []);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    if (chosen === null || !questions) return;
    const q = questions[idx];
    const ok = chosen === q.answerIndex;
    setAnswers(a => [...a, { q: q.question, chosen, correct: q.answerIndex, ok }]);
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setChosen(null);
    } else {
      setFinished(true);
    }
  };

  const score = answers.filter(a => a.ok).length;
  const pct = answers.length ? Math.round((score / answers.length) * 100) : 0;

  return (
    <div>
      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Scope</label>
            <SkillScopeSelect value={scope} onChange={setScope} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Difficulty</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy — recall</SelectItem>
                <SelectItem value="medium">Medium — apply</SelectItem>
                <SelectItem value="hard">Hard — judge</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => void generate()} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? 'Writing exam…' : 'Generate quiz'}
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Five CBAP-style multiple-choice questions written fresh by your coach every time.
        </p>
      </div>

      {loading && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Your coach is writing fresh exam questions…
        </div>
      )}

      {questions && questions.length === 0 && !loading && (
        <div className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          Quiz generation failed. Please try again.
        </div>
      )}

      {questions && questions.length > 0 && !finished && (
        <div className="mt-6 rounded-2xl border border-border/70 bg-card p-6">
          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Question {idx + 1} of {questions.length}</span>
            <span>Score {score}/{answers.length}</span>
          </div>
          <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((idx + (chosen !== null ? 1 : 0)) / questions.length) * 100}%` }} />
          </div>
          <h3 className="mb-4 mt-4 text-base font-medium leading-snug">{questions[idx].question}</h3>
          <div className="space-y-2">
            {questions[idx].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setChosen(i)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition',
                  chosen === i
                    ? 'border-primary bg-primary/10'
                    : 'border-border/70 hover:border-primary/40 hover:bg-accent/40'
                )}
              >
                <span className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                  chosen === i ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
          <Button className="mt-5 w-full" onClick={submit} disabled={chosen === null}>
            {idx + 1 === questions.length ? 'Finish quiz' : 'Next question'}
          </Button>
        </div>
      )}

      {finished && questions && (
        <div className="mt-6 rounded-2xl border border-border/70 bg-card p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold',
              pct >= 80 ? 'bg-primary/15 text-primary' : pct >= 50 ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-destructive/15 text-destructive'
            )}>
              {pct}%
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {pct >= 80 ? 'Outstanding — coach level.' : pct >= 50 ? 'Solid — keep drilling.' : 'Worth revisiting this skill.'}
              </h3>
              <p className="text-sm text-muted-foreground">You scored {score} out of {questions.length}.</p>
            </div>
          </div>
          <div className="mb-5 space-y-3">
            {answers.map((a, i) => (
              <div key={i} className={cn('rounded-xl border p-3 text-sm', a.ok ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5')}>
                <div className="mb-1 flex items-start gap-2 font-medium">
                  {a.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}
                  {a.q}
                </div>
                {!a.ok && (
                  <p className="pl-6 text-xs text-muted-foreground">
                    Correct: <span className="font-medium text-foreground">{String.fromCharCode(65 + a.correct)}. {questions[i]?.options[a.correct]}</span>
                    {questions[i]?.explanation ? ` — ${questions[i].explanation}` : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => void generate()} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Try a fresh quiz
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------------- flashcards ---------------- */

function FlashcardsTab() {
  const [scope, setScope] = useState('mixed');
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const generate = async () => {
    setLoading(true);
    setCards(null);
    setIdx(0);
    setFlipped(false);
    setKnown(new Set());
    try {
      const isCategory = ['mixed', ...Object.keys(CATEGORY_META)].includes(scope);
      const res = await apiFetch('/api/flashcards', {
        method: 'POST',
        body: JSON.stringify({
          skillSlug: isCategory ? undefined : scope,
          category: isCategory ? scope : undefined,
          count: 8,
        }),
      });
      const data = await readJson<{ error?: string; cards?: Flashcard[] }>(res);
      if (!res.ok || data.error) throw new Error(data.error);
      setCards(data.cards || []);
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const mark = (knew: boolean) => {
    if (!cards) return;
    const next = new Set(known);
    if (knew) next.add(idx);
    else next.delete(idx);
    setKnown(next);
    if (idx + 1 < cards.length) {
      setIdx(idx + 1);
      setFlipped(false);
    }
  };

  return (
    <div>
      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Deck scope</label>
            <SkillScopeSelect value={scope} onChange={setScope} />
          </div>
          <Button onClick={() => void generate()} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
            {loading ? 'Preparing deck…' : 'Generate flashcards'}
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Spaced-repetition style cards, freshly generated per skill.</p>
      </div>

      {loading && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Preparing your deck…
        </div>
      )}

      {cards && cards.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Card {idx + 1} of {cards.length}</span>
            <span className="flex items-center gap-1 text-primary"><CheckCircle2 className="h-3.5 w-3.5" /> {known.size} known</span>
          </div>
          <div className="flip-scene h-64 w-full" onClick={() => setFlipped(f => !f)} role="button" aria-label="Flip card">
            <div className={cn('flip-inner', flipped && 'flipped')}>
              <div className="flip-face flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm">
                <Badge variant="outline" className="mb-4 text-[10px]">PROMPT</Badge>
                <p className="text-lg font-medium leading-snug">{cards[idx].front}</p>
                <span className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FlipHorizontal2 className="h-3.5 w-3.5" /> Click to reveal
                </span>
              </div>
              <div className="flip-face flip-face-back flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-primary/40 bg-primary/8 p-8 text-center shadow-sm">
                <Badge variant="outline" className="mb-4 text-[10px]">ANSWER</Badge>
                <p className="text-sm leading-relaxed">{cards[idx].back}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => mark(false)}>
              <RotateCcw className="h-4 w-4" /> Review again
            </Button>
            <Button className="gap-2" onClick={() => mark(true)}>
              <CheckCircle2 className="h-4 w-4" /> I knew this
            </Button>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="ghost" size="icon" disabled={idx === 0} onClick={() => { setIdx(idx - 1); setFlipped(false); }} aria-label="Previous card">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled={idx === cards.length - 1} onClick={() => { setIdx(idx + 1); setFlipped(false); }} aria-label="Next card">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {cards && cards.length === 0 && !loading && (
        <div className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">Card generation failed. Please try again.</div>
      )}
    </div>
  );
}

/* ---------------- interview simulator ---------------- */

const SCENARIO_DOMAINS = ['Auto — surprise me', 'Insurance claims overhaul', 'Hospital onboarding system', 'Retail loyalty redesign', 'Local government approvals', 'Telecom billing disputes', 'Logistics inventory upgrade'];
const ROLES = ['Auto — surprise me', 'Operations manager', 'Front-line team leader', 'Finance controller', 'Customer service rep', 'IT support lead', 'Compliance officer'];

function InterviewTab() {
  const store = useAppStore();
  const [difficulty, setDifficulty] = useState('medium');
  const [domain, setDomain] = useState('Auto — surprise me');
  const [role, setRole] = useState('Auto — surprise me');

  const start = () => {
    store.startInterviewer({
      difficulty,
      domain: domain.startsWith('Auto') ? undefined : domain,
      role: role.startsWith('Auto') ? undefined : role,
    });
    // opening line kicks the simulation off
    setTimeout(() => {
      void store.sendMessage(
        'Hello — I am the business analyst on this project. Thank you for making time. Could we start with you walking me through your typical day and where things cause you the most friction?',
        { mode: 'interviewer' }
      );
    }, 60);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border/70 bg-card p-6">
        <div className="mb-1 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Rehearse a live stakeholder interview</h3>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Your coach plays a realistic stakeholder — busy, vague, sometimes guarded. Practise open questions,
          probing, funnel structure and rapport. Ask for <code className="rounded bg-muted px-1 font-mono text-xs">END_SIM</code> any time
          to receive a full debrief with a score and missed opportunities. Voice mode recommended: turn on
          the mic and spoken replies in chat.
        </p>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Stakeholder disposition</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Friendly — cooperative but vague</SelectItem>
                <SelectItem value="medium">Busy — cooperative, scattered</SelectItem>
                <SelectItem value="hard">Guarded — sceptical, defensive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Scenario domain</label>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SCENARIO_DOMAINS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Stakeholder role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={start} className="w-full gap-2">
            <Play className="h-4 w-4" /> Start the simulation
          </Button>
        </div>
      </div>
      <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 to-transparent p-6">
        <h4 className="mb-3 text-sm font-semibold">What good looks like</h4>
        <ul className="space-y-2.5 text-sm text-muted-foreground">
          <li className="flex gap-2"><span className="text-primary">1.</span> Open with context-setting and permission, not interrogation.</li>
          <li className="flex gap-2"><span className="text-primary">2.</span> Use the funnel: broad open questions first, narrow with probes, confirm with summaries.</li>
          <li className="flex gap-2"><span className="text-primary">3.</span> Hunt for the workflow: &quot;walk me through the last time…&quot; beats &quot;do you like the system?&quot;</li>
          <li className="flex gap-2"><span className="text-primary">4.</span> Chase exceptions: &quot;what happens when…&quot;, &quot;what if it fails…&quot;, &quot;who handles it then?&quot;</li>
          <li className="flex gap-2"><span className="text-primary">5.</span> Quantify: volumes, frequencies, time lost — evidence, not adjectives.</li>
          <li className="flex gap-2"><span className="text-primary">6.</span> Close by checking understanding and agreeing next steps.</li>
        </ul>
      </div>
    </div>
  );
}

/* ---------------- case method ---------------- */

function CasesTab() {
  const store = useAppStore();
  const [openCase, setOpenCase] = useState<(typeof BA_CASES)[number] | null>(null);

  const analyse = (c: (typeof BA_CASES)[number]) => {
    setOpenCase(null);
    store.startSkillCoaching(
      c.focusSkills[0],
      `CASE ANALYSIS — ${c.code}: ${c.title}\n\n${c.narrative}\n\nMY ROLE: ${c.yourRole}\n\nPlease run this as a Harvard-style case discussion: (1) ask me 1-2 penetrating questions about how I read the situation before giving me anything, (2) after I respond, coach me through a structured BA approach using ${c.focusSkills.join(', ')} — correct my reasoning where it is weak, (3) finish with a model answer outline I can compare against.`
    );
  };

  return (
    <div>
      <div className="mb-5 rounded-2xl border border-border/70 bg-gradient-to-br from-[#a51c30]/10 to-transparent p-5">
        <div className="mb-1 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#a51c30]" />
          <h3 className="font-display font-semibold">The Case Method, applied to Business Analysis</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Inspired by the Harvard Business School classroom: no right answers on a slide — you defend a
          position, your coach challenges your reasoning Socratically, and technique emerges from the case.
          Six original cases across sectors, each mapped to the skills it exercises.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {BA_CASES.map(c => (
          <div key={c.id} className="flex flex-col rounded-xl border border-border/70 bg-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-[#a51c30]">{c.code}</span>
              <Badge variant="outline" className="text-[10px]">{c.difficulty}</Badge>
            </div>
            <h3 className="font-display text-base font-semibold leading-snug">{c.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{c.sector}</p>
            <p className="mt-3 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">{c.narrative}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {c.focusSkills.slice(0, 3).map(s => (
                <Badge key={s} variant="secondary" className="text-[10px] font-normal">{s.split('-').join(' ')}</Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={() => setOpenCase(c)}>
              <BookOpen className="h-3.5 w-3.5" /> Read & analyse in classroom
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!openCase} onOpenChange={open => !open && setOpenCase(null)}>
        <DialogContent className="thin-scroll max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {openCase && (
            <>
              <DialogHeader>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#a51c30]">{openCase.code}</span>
                  <Badge variant="outline" className="text-[10px]">{openCase.difficulty}</Badge>
                </div>
                <DialogTitle className="font-display text-xl">{openCase.title}</DialogTitle>
                <DialogDescription>
                  {openCase.sector} · Learning objective: {openCase.learningObjective}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 text-sm">
                <div>
                  <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">The situation</h4>
                  <Markdown content={openCase.narrative} />
                </div>
                <div>
                  <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your role</h4>
                  <p className="leading-relaxed">{openCase.yourRole}</p>
                </div>
                <div>
                  <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Discussion questions</h4>
                  <ol className="list-decimal space-y-1.5 pl-4 leading-relaxed">
                    {openCase.discussionQuestions.map((q, i) => <li key={i}>{q}</li>)}
                  </ol>
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Award className="h-4 w-4 text-primary" /> How the classroom works
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Your coach will open Socratically — expect questions before answers. Defend your read of
                    the case, get challenged, and finish with a model-answer outline mapped to the focus skills.
                  </p>
                </div>
                <Button onClick={() => analyse(openCase)} className="w-full gap-2">
                  <GraduationCap className="h-4 w-4" /> Enter the classroom
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
