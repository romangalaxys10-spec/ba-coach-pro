'use client';

import { useAppStore } from '@/lib/store';
import { AppSidebar } from '@/components/app-sidebar';
import { ChatView } from '@/components/chat-view';
import { SkillsLibrary } from '@/components/skills-library';
import { LearnView } from '@/components/learn-view';
import { PracticeView } from '@/components/practice-view';
import { TemplatesView } from '@/components/templates-view';
import { GraduationCap, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  const view = useAppStore(s => s.view);
  const toggleSidebar = useAppStore(s => s.toggleSidebar);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* mobile overlay */}
      {useAppStore(s => s.sidebarOpen) && (
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
            <GraduationCap className="h-4 w-4 text-primary" /> BA Coach Pro
          </div>
        </div>

        <div className="min-h-0 flex-1">
          {view === 'chat' && <ChatView />}
          {view === 'skills' && <SkillsLibrary />}
          {view === 'learn' && <LearnView />}
          {view === 'practice' && <PracticeView />}
          {view === 'templates' && <TemplatesView />}
        </div>
      </main>
    </div>
  );
}
