import { create } from 'zustand';
import type { User, UserStats, Injection, Achievement, InjectionCreate } from '@/types';
import { api } from '@/api/client';

interface AppState {
  // Data
  user: User | null;
  stats: UserStats | null;
  history: Injection[];
  achievements: Achievement[];
  cursor: string | null;
  hasMore: boolean;

  // UI State
  isLoading: boolean;
  error: string | null;
  lastAchievement: Achievement | null;
  showAchievement: boolean;

  // Actions
  init: () => Promise<void>;
  recordInjection: (payload: InjectionCreate) => Promise<void>;
  loadHistory: () => Promise<void>;
  loadMoreHistory: () => Promise<void>;
  dismissAchievement: () => void;
  clearError: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  stats: null,
  history: [],
  achievements: [],
  cursor: null,
  hasMore: false,
  isLoading: false,
  error: null,
  lastAchievement: null,
  showAchievement: false,

  init: async () => {
    set({ isLoading: true, error: null });
    try {
      const [user, stats] = await Promise.all([
        api.getUser(),
        api.getStats(),
      ]);
      set({ user, stats, isLoading: false });
    } catch (err) {
      set({ error: 'Не удалось загрузить данные', isLoading: false });
    }
  },

  recordInjection: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createInjection(payload);
      const newAchievements = response.new_achievements || [];

      // Refresh stats
      const stats = await api.getStats();

      set({
        stats,
        isLoading: false,
      });

      // Show achievement popup if any
      if (newAchievements.length > 0) {
        set({
          lastAchievement: newAchievements[0],
          showAchievement: true,
          achievements: [...get().achievements, ...newAchievements],
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Ошибка при записи';
      set({ error: msg, isLoading: false });
    }
  },

  loadHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getHistory();
      set({
        history: response.items,
        cursor: response.next_cursor,
        hasMore: response.has_more,
        isLoading: false,
      });
    } catch (err) {
      set({ error: 'Не удалось загрузить историю', isLoading: false });
    }
  },

  loadMoreHistory: async () => {
    const { cursor, hasMore, history, isLoading } = get();
    if (!hasMore || !cursor || isLoading) return;

    set({ isLoading: true });
    try {
      const response = await api.getHistory(cursor);
      set({
        history: [...history, ...response.items],
        cursor: response.next_cursor,
        hasMore: response.has_more,
        isLoading: false,
      });
    } catch (err) {
      set({ error: 'Не удалось загрузить ещё', isLoading: false });
    }
  },

  dismissAchievement: () => {
    set({ showAchievement: false, lastAchievement: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
