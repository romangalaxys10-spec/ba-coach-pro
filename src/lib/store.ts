import { create } from 'zustand';
import { v4 as uuid } from 'uuid';

export type View = 'chat' | 'skills' | 'learn' | 'practice' | 'templates';
export type ChatMode = 'coach' | 'skill' | 'interviewer';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ConversationMeta {
  id: string;
  title: string;
  mode: string;
  skillSlug: string | null;
  updatedAt: string;
}

export interface PendingScenario {
  domain?: string;
  role?: string;
  difficulty?: string;
}

interface AppState {
  view: View;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';

  conversations: ConversationMeta[];
  conversationsLoaded: boolean;
  activeConversationId: string | null;
  messages: ChatMessage[];
  chatMode: ChatMode;
  activeSkillSlug: string | null;
  scenario: PendingScenario | null;
  thinking: boolean;
  autoSpeak: boolean;
  ttsVoice: string;

  setView: (v: View) => void;
  toggleSidebar: () => void;
  setTheme: (t: 'light' | 'dark') => void;
  setAutoSpeak: (v: boolean) => void;
  setTtsVoice: (v: string) => void;

  loadConversations: () => Promise<void>;
  openConversation: (id: string) => Promise<void>;
  newChat: () => void;
  deleteConversation: (id: string) => Promise<void>;

  startSkillCoaching: (slug: string, seedMessage?: string) => void;
  startInterviewer: (scenario: PendingScenario) => void;

  sendMessage: (
    text: string,
    opts?: { skillSlug?: string | null; mode?: ChatMode; scenario?: PendingScenario | null; silentUserMsg?: boolean }
  ) => Promise<string | null>;
  sendFeedbackRequest: () => Promise<string | null>;
}

export const useAppStore = create<AppState>((set, get) => ({
  view: 'chat',
  sidebarOpen: false,
  theme: 'dark',

  conversations: [],
  conversationsLoaded: false,
  activeConversationId: null,
  messages: [],
  chatMode: 'coach',
  activeSkillSlug: null,
  scenario: null,
  thinking: false,
  autoSpeak: false,
  ttsVoice: 'jam',

  setView: v => set({ view: v, sidebarOpen: false }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setTheme: t => {
    set({ theme: t });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', t === 'dark');
      localStorage.setItem('ba-theme', t);
    }
  },
  setAutoSpeak: v => {
    set({ autoSpeak: v });
    localStorage.setItem('ba-autospeak', v ? '1' : '0');
  },
  setTtsVoice: v => {
    set({ ttsVoice: v });
    localStorage.setItem('ba-ttsvoice', v);
  },

  loadConversations: async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      set({ conversations: data.conversations || [], conversationsLoaded: true });
    } catch {
      set({ conversationsLoaded: true });
    }
  },

  openConversation: async id => {
    set({ activeConversationId: id, view: 'chat', sidebarOpen: false, messages: [], thinking: false });
    try {
      const res = await fetch(`/api/conversations/${id}`);
      const data = await res.json();
      if (data.conversation) {
        set({
          messages: data.conversation.messages.map((m: { id: string; role: string; content: string }) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          chatMode: (data.conversation.mode as ChatMode) || 'coach',
          activeSkillSlug: data.conversation.skillSlug || null,
        });
      }
    } catch {
      /* keep empty */
    }
  },

  newChat: () =>
    set({
      activeConversationId: null,
      messages: [],
      chatMode: 'coach',
      activeSkillSlug: null,
      scenario: null,
      thinking: false,
      view: 'chat',
      sidebarOpen: false,
    }),

  deleteConversation: async id => {
    await fetch(`/api/conversations?id=${id}`, { method: 'DELETE' }).catch(() => null);
    set(s => ({
      conversations: s.conversations.filter(c => c.id !== id),
      activeConversationId: s.activeConversationId === id ? null : s.activeConversationId,
      messages: s.activeConversationId === id ? [] : s.messages,
    }));
  },

  startSkillCoaching: (slug, seedMessage) => {
    const { sendMessage } = get();
    set({
      view: 'chat',
      sidebarOpen: false,
      activeConversationId: null,
      messages: [],
      chatMode: 'skill',
      activeSkillSlug: slug,
      scenario: null,
      thinking: false,
    });
    if (seedMessage) {
      void sendMessage(seedMessage, { skillSlug: slug, mode: 'skill' });
    }
  },

  startInterviewer: scenario => {
    set({
      view: 'chat',
      sidebarOpen: false,
      activeConversationId: null,
      messages: [],
      chatMode: 'interviewer',
      activeSkillSlug: null,
      scenario,
      thinking: false,
    });
  },

  sendMessage: async (text, opts) => {
    const state = get();
    const trimmed = text.trim();
    if (!trimmed || state.thinking) return null;

    const mode = opts?.mode || state.chatMode;
    const skillSlug = opts?.skillSlug !== undefined ? opts.skillSlug : state.activeSkillSlug;
    const scenario = opts?.scenario !== undefined ? opts.scenario : state.scenario;

    const userMsg: ChatMessage = { id: uuid(), role: 'user', content: trimmed };
    set(s => ({ messages: [...s.messages, userMsg], thinking: true }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: state.activeConversationId,
          message: trimmed,
          mode,
          skillSlug,
          scenario,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Coach request failed');

      const reply: ChatMessage = { id: uuid(), role: 'assistant', content: data.reply };
      set(s => ({
        messages: [...s.messages, reply],
        thinking: false,
        activeConversationId: data.conversationId,
      }));

      // refresh conversation list (title may have changed)
      void get().loadConversations();
      return data.reply as string;
    } catch (e) {
      const errMsg: ChatMessage = {
        id: uuid(),
        role: 'assistant',
        content: `⚠️ ${e instanceof Error ? e.message : 'Something went wrong. Please try again.'}`,
      };
      set(s => ({ messages: [...s.messages, errMsg], thinking: false }));
      return null;
    }
  },

  sendFeedbackRequest: async () => {
    const state = get();
    if (!state.activeConversationId) return null;
    return get().sendMessage(
      'END_SIM — please end the simulation and give me my full debrief now.',
      { mode: 'coach' }
    );
  },
}));
