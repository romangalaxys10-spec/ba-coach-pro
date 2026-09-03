'use client';

import { useState } from 'react';
import { BA_TEMPLATES } from '@/data/skills-data';
import { useAppStore } from '@/lib/store';
import { Markdown } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Copy, MessageSquarePlus, FileCheck2, Ruler, ShieldAlert, ListChecks, Table2, GitCommitHorizontal, HelpCircle, ClipboardList, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TEMPLATE_ICONS: Record<string, typeof FileText> = {
  'definition-of-done': FileCheck2,
  questionnaire: HelpCircle,
  'problem-statement': Ruler,
  'acceptance-criteria': ListChecks,
  'business-rules': Table2,
  'requirements-register': ClipboardList,
  'process-analysis': GitCommitHorizontal,
  'benefit-hypothesis': BarChart3,
  'assumptions-and-constraints': ShieldAlert,
};

export function TemplatesView() {
  const store = useAppStore();
  const [selected, setSelected] = useState<(typeof BA_TEMPLATES)[number] | null>(null);

  const coachWithTemplate = (tpl: (typeof BA_TEMPLATES)[number]) => {
    setSelected(null);
    store.startSkillCoaching(
      'requirements-packager',
      `I want to complete the "${tpl.name}" for my project. Here is the official template:\n\n${tpl.content.slice(0, 1500)}\n\nAsk me for my project context section by section and help me fill this template properly, producing the finished document in Markdown at the end.`
    );
  };

  return (
    <div className="thin-scroll h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight">BA Templates</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Nine production-ready document templates from the skill pack. Open one to study it, copy it, or
            have your coach walk you through filling it in section by section.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BA_TEMPLATES.map(tpl => {
            const Icon = TEMPLATE_ICONS[tpl.slug.replace('-template', '')] || FileText;
            return (
              <button
                key={tpl.slug}
                onClick={() => setSelected(tpl)}
                className="group flex flex-col rounded-xl border border-border/70 bg-card p-5 text-left transition hover:border-primary/50 hover:shadow-md"
              >
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="text-sm font-semibold leading-snug">{tpl.name}</div>
                <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {tpl.content.split('\n').find(l => l.trim() && !l.startsWith('#'))?.slice(0, 110) || 'Structured document template'}
                </p>
                <span className="mt-3 text-[11px] font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  Open template →
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="thin-scroll max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" /> {selected.name}
                </DialogTitle>
                <DialogDescription>Official template from the business-analysis-skills pack.</DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border border-border/70 bg-card p-5 text-sm">
                <Markdown content={selected.content} />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => {
                    void navigator.clipboard.writeText(selected.content);
                    toast({ title: 'Template copied to clipboard' });
                  }}
                >
                  <Copy className="h-4 w-4" /> Copy markdown
                </Button>
                <Button className="flex-1 gap-2" onClick={() => coachWithTemplate(selected)}>
                  <MessageSquarePlus className="h-4 w-4" /> Fill it in with your coach
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
