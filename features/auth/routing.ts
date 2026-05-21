import type { Href } from 'expo-router';

import type { Session } from '@supabase/supabase-js';

/** Resolve bootstrap redirect from auth + onboarding state. */
export function getAppEntryHref(
  session: Session | null,
  onboardingComplete: boolean | null,
): Href | null {
  if (!session) return '/(auth)/login';
  if (onboardingComplete === false) return '/(onboarding)/notification-time';
  if (onboardingComplete === true) return '/(tabs)';
  return null;
}
