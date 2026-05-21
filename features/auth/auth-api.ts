import type { AuthError, Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export type AuthResult = { session: Session | null; error: AuthError | null };

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { session: data.session, error };
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  // #region agent log
  const { debugLog } = await import('@/lib/debug-log');
  debugLog('D', 'features/auth/auth-api.ts:signUp', 'signUp start', {
    emailLen: email.length,
  });
  // #endregion
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    // #region agent log
    debugLog('D', 'features/auth/auth-api.ts:signUp', 'signUp result', {
      hasSession: !!data.session,
      errorMessage: error?.message ?? null,
      errorStatus: error?.status ?? null,
    });
    // #endregion
    return { session: data.session, error };
  } catch (e) {
    // #region agent log
    debugLog('D', 'features/auth/auth-api.ts:signUp', 'signUp threw', {
      errorName: e instanceof Error ? e.name : 'unknown',
      errorMessage: e instanceof Error ? e.message : String(e),
    });
    // #endregion
    throw e;
  }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}
