'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { AppSidebar } from '@/components/app-sidebar';
import { ChatView } from '@/components/chat-view';
import { SkillsLibrary } from '@/components/skills-library';
import { LearnView } from '@/components/learn-view';
import { ProgramLearnView } from '@/components/program-learn-view';
import { PracticeView } from '@/components/practice-view';
import { TemplatesView } from '@/components/templates-view';
import { SettingsView } from '@/components/settings-view';
import { AuthGate } from '@/components/auth-gate';
import { programById } from '@/lib/programs';
import { GraduationCap, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  const view = useAppStore(s => s.view);
  const authReady = useAppStore(s => s.authReady);
  const student = useAppStore(s => s.student);
  const justRegistered = useAppStore(s => s.justRegistered);
  const bootstrap = useAppStore(s => s.bootstrap);
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const toggleSidebar = useAppStore(s => s.toggleSidebar);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  if (!authReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <GraduationCap className="h-6 w-6" />
          </div>
          <p className="text-sm">Preparing your academy…</p>
        </div>
      </div>
    );
  }

  // keep AuthGate mounted after registration so the intro card (name + secret
  // token) is shown before entering the app
  if (!student || justRegistered) {
    return <AuthGate />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <AppSidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* mobile top bar */}
        <div className={cn('flex items-center gap-2 border-b border-border/60 px-3 py-2 md:hidden')}>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            {(() => {
              const p = programById(student.program);
              return (
                <>
                  {p.id === 'ba' ? <GraduationCap className="h-4 w-4 text-primary" /> : <span>{p.emoji}</span>}
                  {p.id === 'ba' ? 'BA Coach Pro' : p.name}
                </>
              );
            })()}
          </div>
        </div>

        <div className="min-h-0 flex-1">
          {view === 'chat' && <ChatView />}
          {view === 'skills' && <SkillsLibrary />}
          {view === 'learn' && (student.program === 'english' || student.program === 'hrbp') && (
            <ProgramLearnView program={student.program} />
          )}
          {view === 'learn' && student.program !== 'english' && student.program !== 'hrbp' && <LearnView />}
          {view === 'practice' && <PracticeView />}
          {view === 'templates' && <TemplatesView />}
          {view === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}
