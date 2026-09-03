'use client';

import { useAppStore, type View } from '@/lib/store';
import { getSkill } from '@/data/skills-data';
import { computeCareerProgress, levelById } from '@/lib/levels';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  GraduationCap,
  Plus,
  MessageSquare,
  Library,
  Route,
  Dumbbell,
  FileText,
  Trash2,
  Sun,
  Moon,
  X,
  Target,
  PencilRuler,
  Settings,
  LogOut,
  CircleUserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV: { view: View; label: string; icon: typeof Library; hint?: string }[] = [
  { view: 'chat', label: 'Coach Chat', icon: MessageSquare },
  { view: 'skills', label: 'Skill Library', icon: Library, hint: '53' },
  { view: 'learn', label: 'Learning Tracks', icon: Route },
  { view: 'practice', label: 'Practice Arena', icon: Dumbbell },
  { view: 'templates', label: 'BA Templates', icon: FileText, hint: '9' },
  { view: 'settings', label: 'Profile & GitHub', icon: Settings },
];

export function AppSidebar() {
  const store = useAppStore();
  const career = computeCareerProgress(store.progressMap);
  const currentLevel = levelById(career.currentLevelId);
  const currentPct = career.levels.find(l => l.id === career.currentLevelId)?.pct ?? 0;
  const levelComplete = career.levels.find(l => l.id === career.currentLevelId)?.status === 'complete';

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 md:static md:translate-x-0',
        store.sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      )}
    >
      {/* brand */}
      <div className="flex items-center gap-2.5 px-4 pb-3 pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight">BA Coach Pro</div>
          <div className="truncate text-[11px] text-muted-foreground">Learn · Practise · Deliver</div>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={store.toggleSidebar} aria-label="Close menu">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* new chat */}
      <div className="px-3">
        <Button
          onClick={() => store.newChat()}
          className="w-full justify-start gap-2 rounded-xl"
          variant="secondary"
        >
          <Plus className="h-4 w-4" /> New chat
        </Button>
      </div>

      {/* nav */}
      <nav className="mt-4 px-3">
        {NAV.map(item => (
          <button
            key={item.view}
            onClick={() => store.setView(item.view)}
            className={cn(
              'mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition',
              store.view === item.view
                ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
            {item.hint && (
              <span className="ml-auto rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {item.hint}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* career level card */}
      <button
        onClick={() => store.setView('learn')}
        className="mx-3 mt-4 rounded-xl border border-sidebar-border bg-card/60 p-3 text-left transition hover:border-primary/40"
        title="Open Learning Tracks"
      >
        <div className="flex items-center gap-2">
          <currentLevel.icon className={cn('h-4 w-4 shrink-0', currentLevel.color)} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Career level
          </span>
          <span className={cn('ml-auto text-[11px] font-bold', currentLevel.color)}>
            {currentLevel.short} · {currentPct}%
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn('h-full rounded-full transition-all', currentLevel.bar)}
            style={{ width: `${currentPct}%` }}
          />
        </div>
        <div className="mt-1.5 text-[10px] text-muted-foreground">
          {levelComplete
            ? 'Level mastered — next level unlocked'
            : career.overallDone === 0
              ? 'Start the Junior track to begin'
              : `${career.overallDone}/${career.overallTotal} programme lessons done`}
        </div>
      </button>

      <div className="mx-4 mt-4 border-t border-sidebar-border" />
      <div className="px-4 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Recent conversations
      </div>

      <ScrollArea className="min-h-0 flex-1 px-3">
        <div className="pb-2">
          {store.conversations.length === 0 && (
            <p className="px-2 py-3 text-xs text-muted-foreground">No conversations yet. Start one above.</p>
          )}
          {store.conversations.map(c => {
            const Icon = c.mode === 'interviewer' ? Target : c.mode === 'skill' ? PencilRuler : MessageSquare;
            return (
              <div
                key={c.id}
                className={cn(
                  'group mb-0.5 flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition',
                  store.activeConversationId === c.id && store.view === 'chat'
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/60'
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <button
                  onClick={() => void store.openConversation(c.id)}
                  className="min-w-0 flex-1 truncate text-left text-[13px]"
                  title={c.title}
                >
                  {c.title}
                </button>
                <button
                  onClick={() => void store.deleteConversation(c.id)}
                  className="hidden shrink-0 rounded p-1 text-muted-foreground hover:text-destructive group-hover:block"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* footer */}
      <div className="border-t border-sidebar-border p-3">
        {/* student card */}
        <div className="mb-2 flex items-center gap-2.5 rounded-xl border border-sidebar-border bg-card/60 px-2.5 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <CircleUserRound className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold">{store.student?.name || 'Student'}</div>
            <div className="truncate text-[10px] text-muted-foreground">
              {store.student?.github?.paired ? 'GitHub backup on' : 'token-secured account'}
            </div>
          </div>
          <button
            onClick={() => store.setView('settings')}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            aria-label="Open settings"
            title="Settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={store.logout}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Log out"
            title="Log out (keep your token!)"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          onClick={() => store.setTheme(store.theme === 'dark' ? 'light' : 'dark')}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent/60"
        >
          {store.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {store.theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <p className="px-2.5 pt-2 text-[10px] leading-snug text-muted-foreground">
          Built on the open-source business-analysis-skills pack (MIT) — 53 coaching skills.
        </p>
      </div>
    </aside>
  );
}
