import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import { getAuthStorage } from './auth-storage';
import type { Database } from './database.types';
import { getSupabaseConfig } from './env';

const { url, anonKey } = getSupabaseConfig();
const isBrowser = typeof window !== 'undefined';

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    storage: getAuthStorage(),
    autoRefreshToken: isBrowser,
    persistSession: isBrowser,
    detectSessionInUrl: Platform.OS === 'web' && isBrowser,
  },
});
