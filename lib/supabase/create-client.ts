import { createClient, type RealtimeClientOptions } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import { getAuthStorage } from './auth-storage';
import type { Database } from './database.types';
import { getSupabaseConfig } from './env';

export function createSupabaseClient(realtime?: RealtimeClientOptions) {
  const { url, anonKey } = getSupabaseConfig();
  const isBrowser = typeof window !== 'undefined';

  return createClient<Database>(url, anonKey, {
    auth: {
      storage: getAuthStorage(),
      autoRefreshToken: isBrowser,
      persistSession: isBrowser,
      detectSessionInUrl: Platform.OS === 'web' && isBrowser,
    },
    ...(realtime ? { realtime } : {}),
  });
}
