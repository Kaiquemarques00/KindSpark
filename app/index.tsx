import { Redirect } from 'expo-router';

import { LoadingScreen } from '@/components/LoadingScreen';
import { getAppEntryHref, useAppSession } from '@/features/auth';

/** Bootstrap entry — auth + onboarding guard (T-023) */
export default function Index() {
  const { session, authLoading, onboardingComplete } = useAppSession();
  const href = getAppEntryHref(session, onboardingComplete);

  if (authLoading || href === null) {
    return <LoadingScreen />;
  }

  return <Redirect href={href} />;
}
