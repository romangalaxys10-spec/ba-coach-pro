'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PROGRAM_CATALOG, type ProgramId } from '@/lib/programs';
import {
  GraduationCap,
  KeyRound,
  UserRound,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Github,
  RefreshCcw,
  Sparkles,
  BookOpenCheck,
  Mic2,
  MessagesSquare,
  Trophy,
  CloudUpload,
  TriangleAlert,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AuthGate() {
  const register = useAppStore(s => s.register);
  const login = useAppStore(s => s.login);
  const justRegistered = useAppStore(s => s.justRegistered);
  const freshToken = useAppStore(s => s.freshToken);
  const student = useAppStore(s => s.student);

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [program, setProgram] = useState<ProgramId>('ba');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (justRegistered && student) {
    return <IntroCard name={student.name} program={student.program} token={freshToken} />;
  }

  const submit = async () => {
    setError('');
    setBusy(true);
    const res = mode === 'register' ? await register(name, program) : await login(token);
    setBusy(false);
    if (!res.ok) setError(res.error || 'Something went wrong');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* ---------- brand / value panel ---------- */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">BA Coach Pro</h1>
              <p className="text-xs text-muted-foreground">Business Analysis Mastery Platform</p>
            </div>
          </div>

          <div className="space-y-3">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              <Sparkles className="mr-1 h-3 w-3" /> AI coaching, Harvard-portal style
            </Badge>
            <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Learn business analysis the way
              <span className="text-primary"> professionals practise it.</span>
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              53 expert skills, 7 guided learning tracks, exam-grade drills, live stakeholder
              interview simulation with AI, voice conversations — and a permanent, portable record
              of every step you take.
            </p>
          </div>

          <div className="grid max-w-md grid-cols-2 gap-3">
            {[
              { icon: MessagesSquare, title: 'Coach chat', desc: 'Ada, your AI mentor' },
              { icon: Mic2, title: 'Voice mode', desc: 'Speak & listen' },
              { icon: Trophy, title: 'Practice arena', desc: 'Quizzes & drills' },
              { icon: BookOpenCheck, title: 'Track progress', desc: 'Saved forever' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-3">
                <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <div className="text-sm font-semibold">{f.title}</div>
                  <div className="text-xs text-muted-foreground">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CloudUpload className="h-3.5 w-3.5 text-primary" />
            Optional: pair your account with a private GitHub repo — every chat & progress point
            auto-syncs in real time.
          </div>
        </div>

        {/* ---------- auth card ---------- */}
        <div className="flex items-center">
          <div className="w-full rounded-2xl border border-border/70 bg-card p-6 shadow-xl shadow-black/5 sm:p-8">
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all',
                  mode === 'register' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <UserRound className="h-4 w-4" /> New student
              </button>
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all',
                  mode === 'login' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LogIn className="h-4 w-4" /> I have a token
              </button>
            </div>

            {mode === 'register' ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold">Create your student record</h3>
                  <p className="text-sm text-muted-foreground">
                    Pick your education programme, enter your name — we&apos;ll issue you a personal
                    secret token that unlocks your progress from any device, forever.
                  </p>
                </div>
                {/* ---- programme selection: BA / English / HRBP-L&D ---- */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Your programme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PROGRAM_CATALOG.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setProgram(p.id)}
                        className={cn(
                          'flex flex-col items-start gap-1 rounded-xl border p-2.5 text-left transition',
                          program === p.id
                            ? 'border-primary/60 bg-primary/5 ring-2 ring-primary/25'
                            : 'border-border/60 bg-muted/30 hover:border-primary/40'
                        )}
                        aria-pressed={program === p.id}
                      >
                        <span className="text-base leading-none">{p.emoji}</span>
                        <span className="text-xs font-semibold leading-tight">{p.name}</span>
                        <span className="text-[10px] leading-snug text-muted-foreground">{p.tagline}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {PROGRAM_CATALOG.find(p => p.id === program)?.description}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="name">Your full name</label>
                  <Input
                    id="name"
                    placeholder="e.g. Roman Markov"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && name.trim().length >= 2 && submit()}
                    autoFocus
                  />
                </div>
                <Button className="w-full" onClick={submit} disabled={busy || name.trim().length < 2}>
                  {busy ? 'Creating your record…' : 'Register & get my token'} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  No email, no password. Your identity on this platform is your name + secret token.
                  Keep the token safe — it is the only key to your learning history.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold">Welcome back</h3>
                  <p className="text-sm text-muted-foreground">
                    Paste the secret token you received at registration to restore your full
                    progress, chats and streaks.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="token">Secret token</label>
                  <Input
                    id="token"
                    placeholder="BAC-XXXX-XXXX-XXXX-XXXX"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && token.trim() && submit()}
                    className="font-mono tracking-wider"
                    autoFocus
                  />
                </div>
                <Button className="w-full" onClick={submit} disabled={busy || !token.trim()}>
                  {busy ? 'Restoring your progress…' : 'Continue my education'} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Intro card shown right after registration: name + secret token      */
/* ------------------------------------------------------------------ */

function IntroCard({ name, program, token }: { name: string; program?: string; token: string }) {
  const dismiss = useAppStore(s => s.dismissIntroCard);
  const [copied, setCopied] = useState(false);
  const chosen = PROGRAM_CATALOG.find(p => p.id === program);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Enrolment complete 🎓</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome to the academy, <span className="font-semibold text-foreground">{name}</span>.
          </p>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-xl shadow-primary/5">
          <div className="mb-4 flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Your student logins</h2>
          </div>

          <dl className="space-y-4">
            {chosen && (
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Programme</dt>
                <dd className="mt-1 flex items-center gap-2 text-lg font-semibold">
                  <span>{chosen.emoji}</span> {chosen.name}
                </dd>
              </div>
            )}
            <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Student name</dt>
              <dd className="mt-1 flex items-center gap-2 text-lg font-semibold">
                <UserRound className="h-4 w-4 text-primary" /> {name}
              </dd>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Secret token — your only login key</dt>
              <dd className="mt-2 flex items-center justify-between gap-3">
                <code className="select-all font-mono text-base font-bold tracking-wider text-primary">{token}</code>
                <Button size="sm" variant="outline" onClick={copy} className="shrink-0">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-600 dark:text-amber-400">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong>Write this token down now.</strong> There is no password reset and no email
              recovery. Anyone holding this token can access your progress; without it, no one —
              including us — can.
            </span>
          </div>

          <div className="mt-5 space-y-2.5 text-sm">
            {[
              { icon: RefreshCcw, text: 'Your chats, quiz scores and lesson progress are saved to the platform database permanently.' },
              { icon: Github, text: 'Optional next step: pair a private GitHub repo in Settings for a real-time personal backup.' },
            ].map((row, i) => (
              <div key={i} className="flex items-start gap-2.5 text-muted-foreground">
                <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{row.text}</span>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={dismiss}>
          Enter the academy <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
