'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { apiFetch } from '@/lib/client-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
      const data = await res.json();
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
      const data = await res.json();
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
      const data = await res.json();
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

          <StudentTokenRow />
        </section>

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
