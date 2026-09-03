'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { apiFetch, readJson } from '@/lib/client-api';
import { AI_PROVIDER_PRESETS, getPreset } from '@/lib/ai-providers';
import type { FastestResult } from '@/lib/model-speed';
import { BA_LEVELS, computeCareerProgress, levelById } from '@/lib/levels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Github,
  KeyRound,
  Copy,
  Check,
  RefreshCcw,
  CloudUpload,
  CloudCheck,
  Link2,
  Unlink,
  ExternalLink,
  Loader2,
  ShieldCheck,
  MessagesSquare,
  Trophy,
  BookOpenCheck,
  Layers,
  CalendarDays,
  Clock,
  RotateCcw,
  TriangleAlert,
  GraduationCap,
  Bot,
  Plug,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsView() {
  const student = useAppStore(s => s.student);
  const stats = useAppStore(s => s.stats);
  const refreshStudent = useAppStore(s => s.refreshStudent);

  const [pat, setPat] = useState('');
  const [repoName, setRepoName] = useState('ba-coach-progress');
  const [pairing, setPairing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [confirmUnpair, setConfirmUnpair] = useState(false);

  useEffect(() => {
    void refreshStudent();
  }, [refreshStudent]);

  if (!student) return null;

  const github = student.github;
  const paired = github?.paired;

  const pair = async () => {
    setMsg(null);
    setPairing(true);
    try {
      const res = await apiFetch('/api/github', {
        method: 'POST',
        body: JSON.stringify({ action: 'pair', patToken: pat.trim(), repoName: repoName.trim() }),
      });
      const data = await readJson<{ error?: string; repoCreated?: boolean; owner?: string; repo?: string; sync?: { ok?: boolean } }>(res);
      if (!res.ok) throw new Error(data.error || 'Pairing failed');
      setPat('');
      await refreshStudent();
      setMsg({ kind: 'ok', text: `Paired! Private repo ${data.repoCreated ? 'created' : 'found'} → github.com/${data.owner}/${data.repo}. First sync ${data.sync?.ok ? 'finished' : 'queued'}.` });
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Pairing failed' });
    } finally {
      setPairing(false);
    }
  };

  const runSync = async () => {
    setMsg(null);
    setSyncing(true);
    try {
      const res = await apiFetch('/api/github', {
        method: 'POST',
        body: JSON.stringify({ action: 'sync' }),
      });
      const data = await readJson<{ error?: string }>(res);
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      await refreshStudent();
      setMsg({ kind: 'ok', text: 'Full backup synced to your GitHub repo.' });
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Sync failed' });
    } finally {
      setSyncing(false);
    }
  };

  const runRestore = async () => {
    setMsg(null);
    setRestoring(true);
    try {
      const res = await apiFetch('/api/github', {
        method: 'POST',
        body: JSON.stringify({ action: 'restore' }),
      });
      const data = await readJson<{ error?: string; restored?: { conversations?: number; lessons?: number; quizzes?: number } }>(res);
      if (!res.ok) throw new Error(data.error || 'Restore failed');
      await refreshStudent();
      setMsg({
        kind: 'ok',
        text: `Restored from GitHub: ${data.restored?.conversations ?? 0} conversations, ${data.restored?.lessons ?? 0} lesson entries, ${data.restored?.quizzes ?? 0} quiz attempts.`,
      });
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Restore failed' });
    } finally {
      setRestoring(false);
    }
  };

  const unpair = async () => {
    setConfirmUnpair(false);
    await apiFetch('/api/github', { method: 'POST', body: JSON.stringify({ action: 'unpair' }) }).catch(() => null);
    await refreshStudent();
    setMsg({ kind: 'ok', text: 'GitHub pairing removed. Your local data stays intact.' });
  };

  const toggleAutoSync = async (enabled: boolean) => {
    await apiFetch('/api/github', { method: 'POST', body: JSON.stringify({ action: 'autosync', enabled }) }).catch(() => null);
    await refreshStudent();
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
        {/* header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your identity, your data, your backups — all under your control.
          </p>
        </div>

        {/* profile card */}
        <section className="rounded-2xl border border-border/70 bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{student.name}</h2>
                  <Badge variant="outline" className="border-primary/40 bg-primary/10 text-[10px] text-primary">
                    <ShieldCheck className="mr-1 h-3 w-3" /> enrolled
                  </Badge>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> enrolled {new Date(student.createdAt).toLocaleDateString()}</span>
                  {github?.lastSyncAt && (
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> last GitHub sync {new Date(github.lastSyncAt).toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: MessagesSquare, label: 'Conversations', value: stats?.conversations ?? 0 },
              { icon: BookOpenCheck, label: 'Lessons done', value: stats?.lessonsCompleted ?? 0 },
              { icon: Trophy, label: 'Quiz attempts', value: stats?.quizAttempts ?? 0 },
              { icon: Layers, label: 'Card decks', value: stats?.flashcards ?? 0 },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <s.icon className="h-4 w-4 text-primary" />
                <div className="mt-1.5 text-xl font-bold tabular-nums">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <CareerLevelRow />

          <StudentTokenRow />
        </section>

        {/* Custom AI provider */}
        <AiProviderSection />

        {/* GitHub pairing */}
        <section className="rounded-2xl border border-border/70 bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', paired ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground')}>
                <Github className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">GitHub backup & sync</h2>
                <p className="text-xs text-muted-foreground">
                  Mirror every chat, score and lesson into your own private repo — in real time.
                </p>
              </div>
            </div>
            {paired && <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" variant="secondary"><CloudCheck className="mr-1 h-3 w-3" /> paired</Badge>}
          </div>

          {!paired ? (
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="gh-pat" className="text-xs font-medium text-muted-foreground">Personal Access Token (PaT)</label>
                  <Input
                    id="gh-pat"
                    type="password"
                    placeholder="ghp_… or github_pat_…"
                    value={pat}
                    onChange={e => setPat(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Classic token needs the <code className="rounded bg-muted px-1">repo</code> scope; fine-grained needs Contents + Administration on your account. Stored server-side, used only for your repo.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="gh-repo" className="text-xs font-medium text-muted-foreground">Private repo name</label>
                  <Input
                    id="gh-repo"
                    placeholder="ba-coach-progress"
                    value={repoName}
                    onChange={e => setRepoName(e.target.value)}
                  />
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    We&apos;ll auto-create it as a <strong>private</strong> repo under your account if it doesn&apos;t exist yet.
                  </p>
                </div>
              </div>
              <Button onClick={pair} disabled={pairing || !pat.trim() || !repoName.trim()}>
                {pairing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying & syncing…</> : <><Link2 className="mr-2 h-4 w-4" /> Pair account with GitHub</>}
              </Button>
              <p className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <KeyRound className="mt-0.5 h-3 w-3 shrink-0" />
                The token never leaves this platform&apos;s database. You can unpair at any time below — the repo stays yours.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
                <CloudCheck className="h-5 w-5 text-emerald-500" />
                <div className="min-w-0 flex-1">
                  <a
                    href={`https://github.com/${github.owner}/${github.repo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-mono text-sm font-medium text-primary hover:underline"
                  >
                    {github.owner}/{github.repo} <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-[11px] text-muted-foreground">private · README + full JSON export + every conversation as Markdown</p>
                </div>
                {github.lastSyncAt && (
                  <span className="text-[11px] text-muted-foreground">synced {new Date(github.lastSyncAt).toLocaleString()}</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" onClick={runSync} disabled={syncing}>
                  {syncing ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <CloudUpload className="mr-2 h-3.5 w-3.5" />}
                  Sync now
                </Button>
                <Button variant="outline" size="sm" onClick={runRestore} disabled={restoring}>
                  {restoring ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="mr-2 h-3.5 w-3.5" />}
                  Restore from GitHub
                </Button>
                <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-1.5">
                  <Switch
                    checked={github.autoSync}
                    onCheckedChange={toggleAutoSync}
                    aria-label="Toggle real-time auto sync"
                  />
                  <span className="text-xs text-muted-foreground">Real-time auto-sync</span>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto text-destructive hover:text-destructive" onClick={() => setConfirmUnpair(true)}>
                  <Unlink className="mr-1.5 h-3.5 w-3.5" /> Unpair
                </Button>
              </div>

              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Auto-sync fires after every chat reply, quiz attempt and lesson toggle (debounced & serialized to respect GitHub rate limits).
                <em> Restore</em> rebuilds your progress on this platform from the repo — perfect after switching devices or starting a fresh instance.
              </p>
            </div>
          )}

          {msg && (
            <div className={cn(
              'mt-4 flex items-start gap-2 rounded-lg border p-3 text-xs leading-relaxed',
              msg.kind === 'ok'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-destructive/30 bg-destructive/10 text-destructive'
            )}>
              {msg.kind === 'ok' ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
              {msg.text}
            </div>
          )}
        </section>
      </div>

      {/* unpair confirm */}
      <Dialog open={confirmUnpair} onOpenChange={setConfirmUnpair}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Unpair GitHub?</DialogTitle>
            <DialogDescription>
              We&apos;ll forget your token and repo. Your platform data stays untouched; the existing repo
              and its synced snapshots remain on GitHub.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setConfirmUnpair(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={unpair}>Unpair</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** career level snapshot — mirrors the level journey from Learning Tracks */
function CareerLevelRow() {
  const progressMap = useAppStore(s => s.progressMap);
  const setView = useAppStore(s => s.setView);
  const career = computeCareerProgress(progressMap);
  const current = levelById(career.currentLevelId);
  const CurrentIcon = current.icon;

  return (
    <div className="mt-5 rounded-xl border border-border/60 bg-muted/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CurrentIcon className={cn('h-5 w-5', current.color)} />
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Career level</div>
            <div className="text-sm font-semibold">
              {current.name} · {current.tagline}
              <span className={cn('ml-2', current.color)}>{career.levels.find(l => l.id === current.id)?.pct}%</span>
            </div>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => setView('learn')}>
          Continue the programme
        </Button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {BA_LEVELS.map(lv => {
          const lp = career.levels.find(l => l.id === lv.id);
          const LIcon = lv.icon;
          const isCurrent = lv.id === current.id;
          return (
            <div key={lv.id} className={cn('rounded-lg border p-2.5', isCurrent ? 'border-primary/40 bg-primary/5' : 'border-border/50')}>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                <LIcon className={cn('h-3 w-3', lv.color)} />
                <span className={isCurrent ? lv.color : 'text-muted-foreground'}>{lv.short}</span>
                <span className="ml-auto tabular-nums text-muted-foreground">{lp?.pct ?? 0}%</span>
              </div>
              <Progress value={lp?.pct ?? 0} className="mt-1.5 h-1" />
              <div className="mt-1 text-[10px] text-muted-foreground">
                {lp?.status === 'locked' ? 'Locked' : lp?.status === 'complete' ? 'Mastered' : `${lp?.done ?? 0}/${lp?.total ?? 0} lessons`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** masked student token with copy affordance */
function StudentTokenRow() {
  const token = useAppStore(s => s.student?.token ?? '');
  const [copied, setCopied] = useState(false);
  if (!token) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* noop */ }
  };

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4">
      <div className="flex items-center gap-2.5">
        <KeyRound className="h-4 w-4 text-primary" />
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Your secret token</div>
          <code className="font-mono text-sm font-bold tracking-wider text-primary">{maskToken(token)}</code>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={copy}>
          {copied ? <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(`BA Coach Pro — student logins\ntoken: ${token}\nKeep this safe: it is the only way to log back in.\n`)}`}
            download="ba-coach-token.txt"
          >
            Save .txt
          </a>
        </Button>
      </div>
    </div>
  );
}

function maskToken(t: string): string {
  if (t.length < 12) return t;
  return t.slice(0, 8) + '••••' + t.slice(-4);
}

/* ------------------------------------------------------------------ */
/* Custom AI provider section                                          */
/* ------------------------------------------------------------------ */

type TestResult = { ok: boolean; reply?: string; latencyMs?: number; error?: string };

function AiProviderSection() {
  const student = useAppStore(s => s.student);
  const saveAiProvider = useAppStore(s => s.saveAiProvider);
  const clearAiProvider = useAppStore(s => s.clearAiProvider);

  const saved = student?.aiProvider && student.aiProvider.configured ? student.aiProvider : null;
  const [selected, setSelected] = useState<string>('default');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [aiMsg, setAiMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // fastest-models panel state (NVIDIA-style providers with a live model list)
  const [fast, setFast] = useState<FastestResult | null>(null);
  const [fastLoading, setFastLoading] = useState(false);
  const [fastMsg, setFastMsg] = useState<string | null>(null);
  const modelTouched = useRef(false);

  // keep the picker in sync with what's actually saved
  useEffect(() => {
    if (saved?.providerId) setSelected(saved.providerId);
  }, [saved?.providerId]);

  const pick = (id: string) => {
    setSelected(id);
    setAiMsg(null);
    setResult(null);
    modelTouched.current = false;
    const preset = getPreset(id);
    if (preset) {
      // prefill from the preset unless the saved config IS this preset
      if (saved?.providerId === id) {
        setBaseUrl(saved.baseUrl || preset.baseUrl);
        setModel(saved.model || preset.defaultModel);
      } else {
        setBaseUrl(preset.baseUrl);
        setModel(preset.defaultModel);
      }
    } else {
      // deployment default
      setBaseUrl('');
      setModel('');
    }
    setApiKey('');
  };

  const preset = getPreset(selected);
  const editingSaved = Boolean(saved && selected === saved.providerId);

  /* ---------- fastest models (auto-fetch + live benchmark) ---------- */

  const fetchFastest = async (opts?: { refresh?: boolean; withKey?: boolean }) => {
    if (!preset?.fastModels) return;
    if (!baseUrl.trim() && !preset.baseUrl) {
      setFast(null);
      setFastMsg('Type your endpoint base URL first — then models can be fetched and ranked.');
      return;
    }
    setFastLoading(true);
    setFastMsg(null);
    try {
      const res = await apiFetch('/api/ai-provider/fastest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: selected,
          baseUrl: baseUrl.trim() || undefined,
          // key only travels when the student explicitly measures; otherwise
          // the server falls back to the stored key, else estimate-only mode
          apiKey: opts?.withKey ? apiKey.trim() || undefined : undefined,
          refresh: opts?.refresh,
        }),
      });
      const data = await readJson<FastestResult & { error?: string }>(res);
      setFast(data);
      if (!data.ok) {
        setFastMsg(data.message || data.error || 'Could not fetch the provider model list.');
      } else if (data.estimated) {
        setFastMsg(data.message || null);
        // auto-suggest the fastest known model while the field is untouched
        if (data.suggested && !modelTouched.current) setModel(data.suggested);
      } else {
        setFastMsg(data.message || null);
        if (data.suggested && (!modelTouched.current || model === preset.defaultModel)) {
          setModel(data.suggested);
        }
      }
    } catch (e) {
      setFastMsg(e instanceof Error ? e.message : 'Fastest-models fetch failed.');
    } finally {
      setFastLoading(false);
    }
  };

  useEffect(() => {
    if (preset?.fastModels) {
      void fetchFastest();
    } else {
      setFast(null);
      setFastMsg(null);
    }
    // re-run when the picked preset changes
  }, [selected]);

  const saveAndTest = async () => {
    setAiMsg(null);
    setResult(null);
    setSaving(true);
    const out = await saveAiProvider({
      providerId: selected,
      baseUrl: baseUrl.trim() || undefined,
      apiKey: apiKey.trim() || undefined, // empty → keep stored key
      model: model.trim() || undefined,
    });
    setSaving(false);
    if (!out.ok) {
      setAiMsg({ kind: 'err', text: out.error || 'Could not save the provider.' });
      return;
    }
    setApiKey('');
    await runTest();
  };

  const runTest = async () => {
    setAiMsg(null);
    setResult(null);
    setTesting(true);
    try {
      const res = await apiFetch('/api/ai-provider/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: selected,
          baseUrl: baseUrl.trim() || undefined,
          apiKey: apiKey.trim() || undefined, // empty → use stored key
          model: model.trim() || undefined,
        }),
      });
      const data = await readJson<TestResult>(res);
      setResult(data);
      if (data.ok) {
        setAiMsg({ kind: 'ok', text: `Connected to ${model || 'model'} in ${((data.latencyMs || 0) / 1000).toFixed(1)}s — your provider is now used for chats, quizzes and flashcards.` });
      }
    } catch (e) {
      setResult({ ok: false, error: e instanceof Error ? e.message : 'Test failed' });
    } finally {
      setTesting(false);
    }
  };

  const removeProvider = async () => {
    setAiMsg(null);
    setResult(null);
    const out = await clearAiProvider();
    if (out.ok) {
      setSelected('default');
      setBaseUrl('');
      setModel('');
      setApiKey('');
      setAiMsg({ kind: 'ok', text: 'Custom provider removed — back to the deployment default AI.' });
    } else {
      setAiMsg({ kind: 'err', text: out.error || 'Could not remove the provider.' });
    }
  };

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', saved ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">AI provider</h2>
            <p className="text-xs text-muted-foreground">
              Bring your own OpenAI-compatible key — it powers your chats, quizzes and flashcards.
            </p>
          </div>
        </div>
        {saved ? (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" variant="secondary">
            <Check className="mr-1 h-3 w-3" /> {getPreset(saved.providerId)?.name || 'Custom'}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-[10px] text-muted-foreground">deployment default</Badge>
        )}
      </div>

      {/* current status */}
      {saved && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium"><Plug className="h-3.5 w-3.5 text-primary" /> {saved.model}</span>
          <span className="font-mono text-muted-foreground">{saved.baseUrl?.replace(/^https?:\/\//, '')}</span>
          <span className="font-mono text-muted-foreground">key {saved.keyMasked}</span>
          {saved.verifiedAt ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><ShieldCheck className="h-3.5 w-3.5" /> verified {new Date(saved.verifiedAt).toLocaleDateString()}</span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400">not verified yet — press Test</span>
          )}
        </div>
      )}

      {/* preset cards */}
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <PresetCard
          id="default"
          emoji="🏫"
          name="Deployment AI"
          tagline={saved ? 'Switch back to the shared AI' : 'The platform’s built-in AI'}
          active={selected === 'default'}
          onClick={() => pick('default')}
        />
        {AI_PROVIDER_PRESETS.map(p => (
          <PresetCard
            key={p.id}
            id={p.id}
            emoji={p.emoji}
            name={p.name}
            tagline={p.tagline}
            active={selected === p.id}
            onClick={() => pick(p.id)}
            free={p.freeTier}
          />
        ))}
      </div>

      {/* form */}
      {preset ? (
        <div className="mt-5 space-y-4">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {preset.note} Get a key at{' '}
            <a href={preset.signupUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-primary hover:underline">
              {preset.signupUrl.replace(/^https?:\/\//, '')} <ExternalLink className="h-3 w-3" />
            </a>
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="ai-base" className="text-xs font-medium text-muted-foreground">Base URL</label>
              <Input
                id="ai-base"
                placeholder="https://…/v1"
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">Paste the full endpoint if unsure — /chat/completions is trimmed automatically.</p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="ai-model" className="text-xs font-medium text-muted-foreground">Model</label>
              <Input
                id="ai-model"
                list="ai-model-options"
                placeholder="e.g. glm-4.7"
                value={model}
                onChange={e => {
                  modelTouched.current = true;
                  setModel(e.target.value);
                }}
                className="font-mono text-xs"
              />
              <datalist id="ai-model-options">
                {(fast?.results.map(r => r.model) ?? [])
                  .concat(preset.models)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .map(m => <option key={m} value={m} />)}
              </datalist>
              <p className="text-[11px] text-muted-foreground">
                {preset.fastModels
                  ? 'Ranked fastest-first below — click one to use it, or type any model id.'
                  : preset.models.length
                    ? `Suggested: ${preset.models.slice(0, 3).join(', ')}`
                    : 'Type any model id your provider supports.'}
              </p>
            </div>
          </div>

          {preset.fastModels && (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Fastest models right now
                  {fast?.results.length ? (
                    <span className="font-normal text-muted-foreground">
                      · {fast.estimated ? 'estimated' : 'measured live'} · {fast.totalModels} models fetched
                      {fast.benchmarked ? `, ${fast.benchmarked} benchmarked` : ''}
                      {fast.cached ? ' · cached' : ''}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-[11px]"
                    onClick={() => void fetchFastest({ refresh: true })}
                    disabled={fastLoading}
                  >
                    {fastLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCcw className="h-3 w-3" />}
                    Refresh
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[11px]"
                    onClick={() => void fetchFastest({ refresh: true, withKey: true })}
                    disabled={fastLoading}
                  >
                    <Zap className="h-3 w-3" />
                    Measure real speed
                  </Button>
                </div>
              </div>

              {fastMsg && <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{fastMsg}</p>}

              {fastLoading && !fast?.results.length && (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Fetching the live model list…
                </p>
              )}

              {fast?.results.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {fast.results.map((r, i) => (
                    <button
                      key={r.model}
                      type="button"
                      onClick={() => {
                        modelTouched.current = true;
                        setModel(r.model);
                      }}
                      className={cn(
                        'rounded-lg border px-2 py-1 text-left text-[11px] transition-colors',
                        model === r.model
                          ? 'border-amber-500/60 bg-amber-500/15'
                          : 'border-border/60 bg-card hover:border-amber-500/40'
                      )}
                    >
                      <span className="flex items-center gap-1 font-mono font-medium">
                        {i === 0 && <Zap className="h-3 w-3 shrink-0 text-amber-500" />}
                        {r.model}
                      </span>
                      <span className="block text-[10px] text-muted-foreground">
                        {r.estimated
                          ? r.note || 'estimated'
                          : `${r.tokPerSec} tok/s · ${((r.latencyMs || 0) / 1000).toFixed(1)}s`}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}

              {fast?.errors?.length ? (
                <details className="mt-2 text-[11px] text-muted-foreground">
                  <summary className="cursor-pointer">
                    {fast.errors.length} model{fast.errors.length > 1 ? 's' : ''} could not be benchmarked
                  </summary>
                  <ul className="mt-1 space-y-0.5 pl-3">
                    {fast.errors.map(e => (
                      <li key={e.model} className="font-mono">{e.model} — {e.error}</li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="ai-key" className="text-xs font-medium text-muted-foreground">API key</label>
            <Input
              id="ai-key"
              type="password"
              placeholder={editingSaved && saved?.keyMasked ? `Stored (${saved.keyMasked}) — leave blank to keep` : preset.keyHint}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="font-mono text-xs"
              autoComplete="off"
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Stored on your student account, never displayed again and never synced to GitHub. Your key is only used for your own AI calls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button onClick={saveAndTest} disabled={saving || testing || (!baseUrl.trim() && !preset.baseUrl) || !model.trim()}>
              {saving || testing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {saving ? 'Saving…' : 'Testing…'}</> : <><Check className="mr-2 h-4 w-4" /> Save & test connection</>}
            </Button>
            {editingSaved && (
              <Button variant="outline" onClick={runTest} disabled={testing || saving}>
                {testing ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="mr-2 h-3.5 w-3.5" />}
                Test saved config
              </Button>
            )}
            {saved && (
              <Button variant="ghost" className="ml-auto text-destructive hover:text-destructive" onClick={removeProvider} disabled={saving}>
                <Unlink className="mr-1.5 h-3.5 w-3.5" /> Remove provider
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            The deployment AI is used for everyone (tunnel / server key / sandbox). Pick a provider above to use
            your own key instead — your choice wins for your account, on any device you log into.
          </p>
          {saved && (
            <Button variant="outline" onClick={removeProvider} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Unlink className="mr-1.5 h-3.5 w-3.5" />}
              Remove provider & use deployment AI
            </Button>
          )}
        </div>
      )}

      {/* test result */}
      {result && !result.ok && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs leading-relaxed text-destructive">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {result.error || 'Test failed.'}
        </div>
      )}
      {aiMsg && (
        <div className={cn(
          'mt-4 flex items-start gap-2 rounded-lg border p-3 text-xs leading-relaxed',
          aiMsg.kind === 'ok'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'border-destructive/30 bg-destructive/10 text-destructive'
        )}>
          {aiMsg.kind === 'ok' ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
          {aiMsg.text}
        </div>
      )}
    </section>
  );
}

function PresetCard({
  id: _id,
  emoji,
  name,
  tagline,
  active,
  onClick,
  free,
}: {
  id: string;
  emoji: string;
  name: string;
  tagline: string;
  active: boolean;
  onClick: () => void;
  free?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl border p-3 text-left transition-colors',
        active
          ? 'border-primary/60 bg-primary/10 ring-1 ring-primary/40'
          : 'border-border/60 bg-muted/20 hover:border-primary/30 hover:bg-primary/5'
      )}
    >
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <span>{emoji}</span> {name}
        {free && <span className="ml-auto rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">free tier</span>}
      </div>
      <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{tagline}</div>
    </button>
  );
}
