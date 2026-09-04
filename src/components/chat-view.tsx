'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { speakText, startRecording, transcribeAudio, type RecordingSession, type TtsHandle } from '@/lib/voice-client';
import { Markdown } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ArrowUp,
  Mic,
  Square,
  Copy,
  Volume2,
  SquareStack,
  GraduationCap,
  Compass,
  MessagesSquare,
  ClipboardList,
  Target,
  Lightbulb,
  Bug,
  PencilRuler,
  BookOpenCheck,
  BrainCircuit,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { parseQuizContent, speakableText, QuizBlock } from '@/components/quiz-block';
import { programById } from '@/lib/programs';

const VOICES = [
  { id: 'jam', label: 'James (British)' },
  { id: 'kazi', label: 'Kazi (Crisp)' },
  { id: 'xiaochen', label: 'Chen (Professional)' },
  { id: 'tongtong', label: 'Tong (Warm)' },
  { id: 'douji', label: 'Dou (Natural)' },
];

const BA_SUGGESTIONS = [
  {
    icon: Compass,
    title: 'Frame a business problem',
    prompt: 'I have a messy situation: customer complaints are rising and nobody agrees on why. Help me frame the business problem properly before we jump to solutions.',
  },
  {
    icon: MessagesSquare,
    title: 'Practise an interview',
    prompt: 'I want to practise running a stakeholder interview. Set up a realistic scenario and play the stakeholder while I practise elicitation.',
  },
  {
    icon: ClipboardList,
    title: 'Sharpen requirements',
    prompt: 'Here are raw notes from a workshop: "The new portal should be fast, users want reports, managers need approvals, and it must integrate with the CRM somehow." Help me turn these into proper requirements.',
  },
  {
    icon: Target,
    title: 'Prioritise a backlog',
    prompt: 'Teach me how to prioritise requirements with MoSCoW using a worked example, then give me a practice exercise.',
  },
  {
    icon: BookOpenCheck,
    title: 'Test me',
    prompt: 'Give me a 5-question multiple-choice test on core BA technique (mix elicitation, requirements quality and prioritisation), then explain each answer.',
  },
];

const ENGLISH_SUGGESTIONS = [
  {
    icon: MessagesSquare,
    title: 'Everyday roleplay',
    prompt: 'Let\'s roleplay ordering a meal at a café. Play the waiter, correct my mistakes gently, and teach me useful phrases as we go.',
  },
  {
    icon: Compass,
    title: 'Check my writing',
    prompt: 'I\'ll write a short paragraph about my typical day — check my grammar and vocabulary, explain my mistakes, and show me a better version.',
  },
  {
    icon: ClipboardList,
    title: 'Grow my vocabulary',
    prompt: 'Teach me 8 useful intermediate words or phrases for talking about work, with examples, then quiz me on using them.',
  },
  {
    icon: Target,
    title: 'Exam speaking practice',
    prompt: 'Act as an IELTS speaking examiner. Ask me part 1 and part 2 questions, then give me band feedback and one clear improvement tip.',
  },
  {
    icon: BookOpenCheck,
    title: 'Test me',
    prompt: 'Give me a 5-question multiple-choice English test at my level — mix grammar, vocabulary and use-of-English — then explain each answer.',
  },
];

const HRBP_SUGGESTIONS = [
  {
    icon: Compass,
    title: 'Diagnose a people problem',
    prompt: 'A team is losing its best people and morale is low. Coach me through structuring a proper diagnosis before we jump to solutions.',
  },
  {
    icon: MessagesSquare,
    title: 'Rehearse a hard conversation',
    prompt: 'Roleplay a performance conversation with a defensive senior employee. Play them realistically, then debrief my approach.',
  },
  {
    icon: ClipboardList,
    title: 'Design an onboarding plan',
    prompt: 'Help me design a 30/60/90-day onboarding plan for a new HR analyst, with milestones and a check-in cadence.',
  },
  {
    icon: Target,
    title: 'Build a learning needs analysis',
    prompt: 'Teach me how to run a learning needs analysis for a struggling department, then guide me through a mock one step by step.',
  },
  {
    icon: BookOpenCheck,
    title: 'Test me',
    prompt: 'Give me a 5-question multiple-choice test on HRBP and L&D practice — mix people analytics, engagement and learning design — then explain each answer.',
  },
];

const PROGRAM_EMPTY: Record<string, { title: string; sub: string }> = {
  english: {
    title: 'Your personal English tutor',
    sub: 'Practise speaking, writing, grammar and exam skills with live corrections. Ask anything, or pick a starting point below.',
  },
  hrbp: {
    title: 'Your personal HRBP / L&D coach',
    sub: 'Master HR business partnering and learning & development — frameworks, roleplays and evidence-based practice. Ask anything, or pick a starting point below.',
  },
  ba: {
    title: 'Your personal Business Analyst coach',
    sub: 'Learn, practise and rehearse business analysis — from problem framing to delivery-ready requirements. Ask anything, or pick a starting point below.',
  },
};

const PROGRAM_COACH: Record<string, string> = {
  english: 'English Tutor',
  hrbp: 'HRBP Coach',
  ba: 'BA Coach',
};

const PROGRAM_PLACEHOLDER: Record<string, string> = {
  english: 'Ask your English tutor anything — or paste text to improve…',
  hrbp: 'Ask your HRBP coach anything…',
  ba: 'Ask your BA coach anything…',
};

const CAPABILITIES = [
  { icon: GraduationCap, label: '53 BA techniques', desc: 'Coached step-by-step from the skill library', ba: true },
  { icon: Mic, label: 'Voice conversations', desc: 'Speak to your coach, hear spoken answers', ba: false },
  { icon: BookOpenCheck, label: 'Guided learning tracks', desc: '7 structured journeys, beginner to pro', ba: true },
  { icon: BrainCircuit, label: 'Practice arena', desc: 'Quizzes, flashcards & interview simulator', ba: true },
  { icon: BookOpenCheck, label: 'Full course curriculum', desc: 'A1 to C2, business English and exam prep', ba: false, program: 'english' },
  { icon: BrainCircuit, label: 'Roleplays & feedback', desc: 'Live scenarios scored like a professional mentor', ba: false, program: 'hrbp' },
] as { icon: typeof GraduationCap; label: string; desc: string; ba?: boolean; program?: string }[];

function useAutoScroll(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
  }, [dep]);
  return ref;
}

export function ChatView() {
  const store = useAppStore();
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const recordingRef = useRef<RecordingSession | null>(null);
  const ttsRef = useRef<TtsHandle | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollRef = useAutoScroll(store.messages.length + (store.thinking ? 1 : 0));

  useEffect(() => {
    const t = localStorage.getItem('ba-theme');
    if (t === 'light' || t === 'dark') store.setTheme(t);
    store.setTtsVoice(localStorage.getItem('ba-ttsvoice') || 'jam');
    store.setAutoSpeak(localStorage.getItem('ba-autospeak') === '1');
    void store.loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 180) + 'px';
    }
  }, [input]);

  const stopSpeaking = () => {
    ttsRef.current?.stop();
    ttsRef.current = null;
    setSpeakingId(null);
  };

  const speak = (id: string, text: string) => {
    if (speakingId === id) {
      stopSpeaking();
      return;
    }
    stopSpeaking();
    const handle = speakText(text, store.ttsVoice);
    ttsRef.current = handle;
    setSpeakingId(id);
    handle.done
      .catch(() => toast({ title: 'Could not generate speech', variant: 'destructive' }))
      .finally(() => {
        if (ttsRef.current === handle) {
          ttsRef.current = null;
          setSpeakingId(null);
        }
      });
  };

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || store.thinking) return;
    setInput('');
    stopSpeaking();
    const reply = await store.sendMessage(content);
    if (reply && store.autoSpeak) {
      speak('latest', speakableText(reply) || 'I have prepared an interactive quiz for you — answer it right here in the chat.');
    }
  };

  const toggleMic = async () => {
    if (recording) {
      const session = recordingRef.current;
      setRecording(false);
      setTranscribing(true);
      try {
        const base64 = await session!.stop();
        const text = await transcribeAudio(base64);
        if (text) {
          if (store.chatMode === 'interviewer') await send(text);
          else setInput(prev => (prev ? prev + ' ' + text : text));
        } else {
          toast({ title: 'No speech detected', variant: 'destructive' });
        }
      } catch {
        toast({ title: 'Transcription failed', description: 'Please try again.', variant: 'destructive' });
      } finally {
        recordingRef.current = null;
        setTranscribing(false);
      }
      return;
    }
    try {
      const session = await startRecording();
      recordingRef.current = session;
      setRecording(true);
    } catch {
      toast({ title: 'Microphone unavailable', description: 'Check browser permissions.', variant: 'destructive' });
    }
  };

  const isEmpty = store.messages.length === 0 && !store.thinking;
  const program = programById(store.student?.program);
  const isBA = program.id === 'ba';
  const suggestions = isBA ? BA_SUGGESTIONS : program.id === 'english' ? ENGLISH_SUGGESTIONS : HRBP_SUGGESTIONS;
  const empty = PROGRAM_EMPTY[program.id] || PROGRAM_EMPTY.ba;

  const modeLabel =
    store.chatMode === 'interviewer'
      ? 'Interview Simulator'
      : store.chatMode === 'skill' && store.activeSkillSlug
        ? store.activeSkillSlug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
        : PROGRAM_COACH[program.id] || PROGRAM_COACH.ba;

  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <header className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={store.toggleSidebar} aria-label="Open menu">
          <SquareStack className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-sm">
          {store.chatMode === 'interviewer' ? (
            <Target className="h-3.5 w-3.5 text-primary" />
          ) : store.chatMode === 'skill' ? (
            <PencilRuler className="h-3.5 w-3.5 text-primary" />
          ) : (
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
          )}
          <span className="font-medium">{modeLabel}</span>
          {store.chatMode === 'interviewer' && (
            <Button
              size="sm"
              variant="outline"
              className="ml-2 h-6 rounded-full px-2.5 text-xs"
              onClick={() => void store.sendFeedbackRequest()}
              disabled={store.thinking || store.messages.length < 3}
            >
              End & get feedback
            </Button>
          )}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={store.autoSpeak ? 'secondary' : 'ghost'}
                size="sm"
                className={cn('gap-1.5 text-xs', store.autoSpeak && 'text-primary')}
              >
                <Volume2 className="h-4 w-4" />
                <span className="hidden sm:inline">Voice replies</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-3">
              <div className="mb-2 flex items-center justify-between text-sm font-medium">Spoken replies</div>
              <button
                onClick={() => store.setAutoSpeak(!store.autoSpeak)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
              >
                Auto-play replies
                <span className={cn('rounded-full px-2 py-0.5 text-xs', store.autoSpeak ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                  {store.autoSpeak ? 'On' : 'Off'}
                </span>
              </button>
              <div className="mt-2 px-2 text-xs font-medium text-muted-foreground">Coach voice</div>
              <div className="mt-1 space-y-0.5">
                {VOICES.map(v => (
                  <button
                    key={v.id}
                    onClick={() => store.setTtsVoice(v.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-accent',
                      store.ttsVoice === v.id && 'text-primary'
                    )}
                  >
                    {v.label}
                    {store.ttsVoice === v.id && <span className="text-xs">●</span>}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      {/* messages */}
      <div ref={scrollRef} className="thin-scroll flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 py-10">
            <div className="mb-6 flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">{empty.title}</h1>
              <p className="max-w-md text-sm text-muted-foreground">
                {empty.sub}
              </p>
            </div>
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {suggestions.map(s => (
                <button
                  key={s.title}
                  onClick={() => void send(s.prompt)}
                  className="group rounded-xl border border-border/70 bg-card p-4 text-left transition hover:border-primary/50 hover:shadow-md"
                >
                  <div className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                    <s.icon className="h-4 w-4 text-primary" />
                    {s.title}
                  </div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">{s.prompt}</div>
                </button>
              ))}
            </div>
            <div className="mt-8 grid w-full grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
              {CAPABILITIES.filter(c => (isBA ? c.ba : c.program === program.id)).map(c => (
                <div key={c.label} className="flex flex-col items-center gap-1 text-center">
                  <c.icon className="h-4 w-4 text-primary/80" />
                  <div className="text-xs font-medium">{c.label}</div>
                  <div className="text-[11px] leading-tight text-muted-foreground">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-6">
            {store.messages.map(m => (
              <div key={m.id} className={cn('fade-up mb-6 flex gap-3', m.role === 'user' && 'justify-end')}>
                {m.role === 'assistant' && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                )}
                <div className={cn('min-w-0', m.role === 'user' ? 'max-w-[85%]' : 'flex-1')}>
                  {m.role === 'user' ? (
                    <div className="rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground whitespace-pre-wrap">
                      {m.content}
                    </div>
                  ) : (
                    <>
                      <div className="rounded-2xl rounded-bl-md border border-border/50 bg-card px-4 py-3 text-sm">
                        {parseQuizContent(m.content).map((seg, si) =>
                          seg.kind === 'quiz' ? (
                            <QuizBlock key={si} quiz={seg.quiz} />
                          ) : seg.text.trim() ? (
                            <Markdown key={si} content={seg.text} />
                          ) : null
                        )}
                      </div>
                      <div className="mt-1.5 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 px-2 text-xs text-muted-foreground"
                          onClick={() => {
                            void navigator.clipboard.writeText(m.content);
                            toast({ title: 'Copied to clipboard' });
                          }}
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'h-7 gap-1 px-2 text-xs text-muted-foreground',
                            speakingId === m.id && 'text-primary'
                          )}
                          onClick={() => speak(m.id, speakableText(m.content) || 'This reply is an interactive quiz — answer it right here in the chat.')}
                        >
                          {speakingId === m.id ? (
                            <span className="flex h-3 items-end gap-[2px]">
                              <span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" />
                            </span>
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                          {speakingId === m.id ? 'Speaking' : 'Listen'}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            {store.thinking && (
              <div className="fade-up mb-6 flex gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border/50 bg-card px-4 py-3.5">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="ml-2 text-xs text-muted-foreground">
                    {store.chatMode === 'interviewer' ? 'Stakeholder is thinking…' : 'Coach is preparing…'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* composer */}
      <div className="border-t border-border/60 bg-background/80 px-4 pb-4 pt-3 backdrop-blur">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:border-primary/60">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={1}
              placeholder={
                store.chatMode === 'interviewer'
                  ? 'Ask your stakeholder a question… (or speak)'
                  : PROGRAM_PLACEHOLDER[program.id] || PROGRAM_PLACEHOLDER.ba
              }
              className="max-h-[180px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Message"
            />
            <Button
              size="icon"
              variant={recording ? 'destructive' : 'ghost'}
              onClick={() => void toggleMic()}
              disabled={transcribing || store.thinking}
              className={cn('h-9 w-9 shrink-0 rounded-xl', recording && 'mic-recording')}
              aria-label={recording ? 'Stop recording' : 'Record voice message'}
            >
              {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              onClick={() => void send()}
              disabled={!input.trim() || store.thinking || recording}
              className="h-9 w-9 shrink-0 rounded-xl"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {recording
              ? '● Recording — click the square to stop and transcribe'
              : transcribing
                ? 'Transcribing your voice…'
                : store.chatMode === 'interviewer'
                  ? 'Practise elicitation. Say "END_SIM" or press End & get feedback for your debrief.'
                  : isBA
                    ? 'Ada coaches with BA skill packs · Enter to send, Shift+Enter for a new line'
                    : `${program.name} coaching · Enter to send, Shift+Enter for a new line`}
          </p>
        </div>
      </div>
    </div>
  );
}

export const ChatIcons = { Lightbulb, Bug };
