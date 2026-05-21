import type { SupportedStorage } from '@supabase/auth-js';

/** Web + SSR: never import AsyncStorage (avoids `window is not defined` on Node). */
const webAuthStorage: SupportedStorage = {
  getItem: async (key) => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key, value) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};

export function getAuthStorage(): SupportedStorage {
  return webAuthStorage;
}
