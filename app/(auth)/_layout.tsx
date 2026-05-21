import { Redirect, Stack } from 'expo-router';

import { LoadingScreen } from '@/components/LoadingScreen';
import { getAppEntryHref, useAppSession } from '@/features/auth';

export default function AuthLayout() {
  const { session, authLoading, onboardingComplete } = useAppSession();

  if (authLoading || (session && onboardingComplete === null)) {
    return <LoadingScreen />;
  }

  if (session) {
    const href = getAppEntryHref(session, onboardingComplete);
    if (href && href !== '/(auth)/login') {
      return <Redirect href={href} />;
    }
  }

  return (
    <Stack screenOptions={{ headerShown: true, title: 'KindSpark' }}>
      <Stack.Screen name="login" options={{ title: 'Sign in' }} />
      <Stack.Screen name="register" options={{ title: 'Create account' }} />
    </Stack>
  );
}
