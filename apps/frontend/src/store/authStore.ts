import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import type { User } from '@saj/types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialize: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const TOKEN_KEY = 'saj-pos-token';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      initialize: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return;
        set({ loading: true, token });
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data.data, token, loading: false });
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          set({ user: null, token: null, loading: false });
        }
      },

      login: async (username, password) => {
        set({ loading: true });
        try {
          const res = await api.post('/auth/login', { username, password });
          const { token, user } = res.data.data;
          localStorage.setItem(TOKEN_KEY, token);
          set({ token, user, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: async () => {
        const token = get().token;
        set({ loading: true });
        try {
          if (token) {
            await api.post('/auth/logout');
          }
        } finally {
          localStorage.removeItem(TOKEN_KEY);
          set({ user: null, token: null, loading: false });
        }
      },
    }),
    {
      name: 'saj-pos-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
