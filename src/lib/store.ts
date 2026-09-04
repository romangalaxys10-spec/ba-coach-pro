import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { apiFetch, getStoredToken, setStoredToken, clearStoredToken, readJson } from '@/lib/client-api';
import type { ProviderDiscovery, SavedModelState } from '@/lib/ai-providers';

export type View = 'chat' | 'skills' | 'learn' | 'practice' | 'templates' | 'settings';
export type ChatMode = 'coach' | 'skill' | 'interviewer';

/** English / HRBP students land on their programme course; BA students on the coach chat. */
const landingView = (program?: string): View => (program === 'english' || program === 'hrbp' ? 'learn' : 'chat');

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

export interface AiProviderInfo {
  configured: boolean;
  providerId: string | null;
  baseUrl: string | null;
  model: string | null;
  keyMasked: string | null;
  verifiedAt: string | null;
}

export interface StudentInfo {
  id: string;
  name: string;
  program?: string; // 'ba' | 'english' | 'hrbp' — chosen at enrolment
  token?: string;
  createdAt: string;
  github: {
    paired: boolean;
    owner?: string | null;
    repo?: string | null;
    lastSyncAt?: string | null;
    autoSync: boolean;
  };
  aiProvider?: AiProviderInfo | null;
}

export interface StudentStats {
  conversations: number;
  lessonsCompleted: number;
  quizAttempts: number;
  flashcards: number;
}

interface AppState {
  // auth
  authReady: boolean;
  student: StudentInfo | null;
  stats: StudentStats | null;
  justRegistered: boolean; // show the "intro card with token" once after registering
  freshToken: string;

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

  // lesson progress (skills, track lessons, level unlock overrides)
  progressMap: Record<string, boolean>;
  progressLoaded: boolean;

  // auth actions
  bootstrap: () => Promise<void>;
  register: (name: string, program?: string) => Promise<{ ok: boolean; error?: string }>;
  login: (token: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  dismissIntroCard: () => void;
  refreshStudent: () => Promise<void>;
  saveAiProvider: (cfg: { providerId: string; baseUrl?: string; apiKey?: string; model?: string }) => Promise<{
    ok: boolean;
    error?: string;
    provider?: AiProviderInfo | null;
    discovery?: ProviderDiscovery;
    savedModel?: SavedModelState;
    notice?: string;
  }>;
  fetchProviderModels: (force?: boolean) => Promise<{
    ok: boolean;
    error?: string;
    discovery?: ProviderDiscovery;
    savedModel?: SavedModelState;
    provider?: AiProviderInfo | null;
  }>;
  clearAiProvider: () => Promise<{ ok: boolean; error?: string }>;

  setView: (v: View) => void;
  toggleSidebar: () => void;
  setTheme: (t: 'light' | 'dark') => void;
  setAutoSpeak: (v: boolean) => void;
  setTtsVoice: (v: string) => void;

  loadProgress: () => Promise<void>;
  toggleLesson: (itemId: string, completed: boolean) => Promise<void>;

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
  authReady: false,
  student: null,
  stats: null,
  justRegistered: false,
  freshToken: '',

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

  progressMap: {},
  progressLoaded: false,

  bootstrap: async () => {
    // theme / prefs
    const theme = (localStorage.getItem('ba-theme') as 'light' | 'dark') || 'dark';
    set({ theme, autoSpeak: localStorage.getItem('ba-autospeak') === '1', ttsVoice: localStorage.getItem('ba-ttsvoice') || 'jam' });
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // a page load is never "just registered" — avoids re-showing the intro card
    set({ justRegistered: false, freshToken: '' });

    // session restore
    const token = getStoredToken();
    if (!token) {
      set({ authReady: true });
      return;
    }
    try {
      const res = await apiFetch('/api/auth');
      if (res.ok) {
        const data = await readJson<{ student?: StudentInfo; stats?: StudentStats }>(res);
        set({ student: data.student, stats: data.stats, authReady: true, view: landingView(data.student?.program) });
        void get().loadConversations();
        void get().loadProgress();
      } else {
        clearStoredToken();
        set({ authReady: true });
      }
    } catch {
      set({ authReady: true });
    }
  },

  register: async (name, program) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name, program }),
      });
      const data = await readJson<{ error?: string; token?: string; student?: StudentInfo }>(res);
      if (!res.ok) return { ok: false, error: data.error || 'Registration failed' };
      if (!data.token) return { ok: false, error: 'Registration failed' };
      setStoredToken(data.token);
      set({ student: data.student, justRegistered: true, freshToken: data.token, stats: { conversations: 0, lessonsCompleted: 0, quizAttempts: 0, flashcards: 0 }, view: landingView(data.student?.program) });
      void get().loadConversations();
      void get().loadProgress();
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error — please try again.' };
    }
  },

  login: async token => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', token }),
      });
      const data = await readJson<{ error?: string; token?: string; student?: StudentInfo }>(res);
      if (!res.ok) return { ok: false, error: data.error || 'Login failed' };
      if (!data.token) return { ok: false, error: 'Login failed' };
      setStoredToken(data.token);
      set({ student: data.student, justRegistered: false, freshToken: '', view: landingView(data.student?.program) });
      // fetch profile with stats
      void get().refreshStudent().then(() => {
        void get().loadConversations();
        void get().loadProgress();
      });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error — please try again.' };
    }
  },

  logout: () => {
    clearStoredToken();
    set({
      student: null,
      stats: null,
      conversations: [],
      conversationsLoaded: false,
      activeConversationId: null,
      messages: [],
      view: 'chat',
      justRegistered: false,
      freshToken: '',
      progressMap: {},
      progressLoaded: false,
    });
  },

  dismissIntroCard: () => set({ justRegistered: false, freshToken: '' }),

  refreshStudent: async () => {
    try {
      const res = await apiFetch('/api/auth');
      if (res.ok) {
        const data = await readJson<{ student?: StudentInfo; stats?: StudentStats }>(res);
        set({ student: data.student, stats: data.stats });
      }
    } catch {
      /* silent */
    }
  },

  saveAiProvider: async cfg => {
    try {
      const res = await apiFetch('/api/ai-provider', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      const data = await readJson<{
        ok?: boolean;
        error?: string;
        provider?: AiProviderInfo;
        discovery?: ProviderDiscovery;
        savedModel?: SavedModelState;
        notice?: string;
      }>(res);
      if (!res.ok) return { ok: false, error: data.error || `Save failed (${res.status})` };
      const s = get().student;
      if (s && data.provider) set({ student: { ...s, aiProvider: data.provider } });
      return { ok: true, provider: data.provider || null, discovery: data.discovery, savedModel: data.savedModel, notice: data.notice, error: data.error };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
    }
  },

  fetchProviderModels: async (force = true) => {
    try {
      const res = await apiFetch('/api/ai-provider/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force }),
      });
      const data = await readJson<{
        ok?: boolean;
        error?: string;
        provider?: AiProviderInfo;
        discovery?: ProviderDiscovery;
        savedModel?: SavedModelState;
      }>(res);
      if (!res.ok) return { ok: false, error: data.error || `Refresh failed (${res.status})` };
      const s = get().student;
      if (s && data.provider) set({ student: { ...s, aiProvider: data.provider } });
      return { ok: Boolean(data.ok), discovery: data.discovery, savedModel: data.savedModel, provider: data.provider || null, error: data.error };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Refresh failed' };
    }
  },

  clearAiProvider: async () => {
    try {
      const res = await apiFetch('/api/ai-provider', { method: 'DELETE' });
      const data = await readJson<{ ok?: boolean; error?: string }>(res);
      if (!res.ok) return { ok: false, error: data.error || `Reset failed (${res.status})` };
      const s = get().student;
      if (s) set({ student: { ...s, aiProvider: null } });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Reset failed' };
    }
  },

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

  loadProgress: async () => {
    try {
      const res = await apiFetch('/api/progress');
      const data = await readJson<{ progress?: { itemId: string; completed: boolean }[] }>(res);
      const map: Record<string, boolean> = {};
      (data.progress || []).forEach((p: { itemId: string; completed: boolean }) => {
        map[p.itemId] = p.completed;
      });
      set({ progressMap: map, progressLoaded: true });
    } catch {
      set({ progressLoaded: true });
    }
  },

  toggleLesson: async (itemId, completed) => {
    set(s => ({ progressMap: { ...s.progressMap, [itemId]: completed } }));
    try {
      await apiFetch('/api/progress', {
        method: 'POST',
        body: JSON.stringify({ itemId, completed }),
      });
      // keep the sidebar stats honest
      void get().refreshStudent();
    } catch {
      /* optimistic; next load will reconcile */
    }
  },

  loadConversations: async () => {
    try {
      const res = await apiFetch('/api/conversations');
      const data = await readJson<{ conversations?: ConversationMeta[] }>(res);
      set({ conversations: data.conversations || [], conversationsLoaded: true });
    } catch {
      set({ conversationsLoaded: true });
    }
  },

  openConversation: async id => {
    set({ activeConversationId: id, view: 'chat', sidebarOpen: false, messages: [], thinking: false });
    try {
      const res = await apiFetch(`/api/conversations/${id}`);
      const data = await readJson<{ conversation?: { mode?: string; skillSlug?: string | null; messages: { id: string; role: string; content: string }[] } }>(res);
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
    await apiFetch(`/api/conversations?id=${id}`, { method: 'DELETE' }).catch(() => null);
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
      const res = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          conversationId: state.activeConversationId,
          message: trimmed,
          mode,
          skillSlug,
          scenario,
        }),
      });
      const data = await readJson<{ error?: string; reply?: string; conversationId?: string }>(res);
      if (!res.ok || data.error) throw new Error(data.error || 'Coach request failed');

      const reply: ChatMessage = { id: uuid(), role: 'assistant', content: data.reply || '' };
      set(s => ({
        messages: [...s.messages, reply],
        thinking: false,
        activeConversationId: data.conversationId || s.activeConversationId,
      }));

      // refresh conversation list (title may have changed) + stats snapshot
      void get().loadConversations();
      void get().refreshStudent();
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
