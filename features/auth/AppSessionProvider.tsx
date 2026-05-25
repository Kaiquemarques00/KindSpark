import type { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { signOut as signOutApi } from '@/features/auth/auth-api';
import { useOfflineSync } from '@/features/offline';
import { hasCompletedOnboarding } from '@/features/onboarding/preferences-api';
import { trackAppInstalledOnce, trackEvent } from '@/lib/analytics';
import { clearMutationQueue, clearSuggestionCache } from '@/lib/offline';
import { addNotificationResponseReceivedListener } from '@/lib/notifications/expo-local';
import { cancelDailyReminder } from '@/lib/notifications';
import { supabase } from '@/lib/supabase';

type AppSessionContextValue = {
  session: Session | null;
  authLoading: boolean;
  onboardingComplete: boolean | null;
  refreshAppState: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AppSessionContext = createContext<AppSessionContextValue | null>(null);

export function AppSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  const refreshOnboarding = useCallback(async (userId: string) => {
    const complete = await hasCompletedOnboarding(userId);
    setOnboardingComplete(complete);
  }, []);

  const refreshAppState = useCallback(async () => {
    const {
      data: { session: current },
    } = await supabase.auth.getSession();
    setSession(current);
    if (current?.user) {
      await refreshOnboarding(current.user.id);
    } else {
      setOnboardingComplete(null);
    }
  }, [refreshOnboarding]);

  const signOut = useCallback(async () => {
    await cancelDailyReminder();
    await clearMutationQueue();
    await clearSuggestionCache();
    await signOutApi();
    setSession(null);
    setOnboardingComplete(null);
    router.replace('/(auth)/login');
  }, [router]);

  useOfflineSync(Boolean(session && onboardingComplete));

  useEffect(() => {
    void trackAppInstalledOnce();
    refreshAppState().finally(() => setAuthLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        await refreshOnboarding(nextSession.user.id);
      } else {
        setOnboardingComplete(null);
        await cancelDailyReminder();
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshAppState, refreshOnboarding]);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = addNotificationResponseReceivedListener(() => {
      trackEvent('notification_opened');
      router.push('/(tabs)');
    });
    return () => sub.remove();
  }, [router]);

  const value = useMemo(
    () => ({
      session,
      authLoading,
      onboardingComplete,
      refreshAppState,
      signOut,
    }),
    [session, authLoading, onboardingComplete, refreshAppState, signOut],
  );

  return <AppSessionContext.Provider value={value}>{children}</AppSessionContext.Provider>;
}

export function useAppSession(): AppSessionContextValue {
  const ctx = useContext(AppSessionContext);
  if (!ctx) {
    throw new Error('useAppSession must be used within AppSessionProvider');
  }
  return ctx;
}
