import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import { debugLog } from '@/lib/debug-log';

import { getAuthStorage } from './auth-storage';
import type { Database } from './database.types';
import { getSupabaseConfig } from './env';

const { url, anonKey } = getSupabaseConfig();
const isBrowser = typeof window !== 'undefined';

// #region agent log
debugLog('B', 'lib/supabase/client.ts:init', 'supabase client init', {
  platform: Platform.OS,
  isBrowser,
  storageKind: Platform.OS === 'web' ? 'webAuthStorage' : 'AsyncStorage',
  persistSession: isBrowser,
});
// #endregion

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    storage: getAuthStorage(),
    autoRefreshToken: isBrowser,
    persistSession: isBrowser,
    detectSessionInUrl: Platform.OS === 'web' && isBrowser,
  },
});
