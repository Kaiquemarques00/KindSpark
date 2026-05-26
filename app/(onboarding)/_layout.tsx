import { Redirect, Stack } from 'expo-router';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useAppSession } from '@/features/auth';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration } from '@/theme/motion';

export default function OnboardingLayout() {
  const { session, authLoading, onboardingComplete } = useAppSession();
  const reduceMotion = useReducedMotion();

  if (authLoading || (session && onboardingComplete === null)) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (onboardingComplete) {
    return <Redirect href="/(tabs)" />;
  }

  const animationDuration = reduceMotion ? 0 : duration.default;

  return (
    <Stack
      initialRouteName="welcome"
      screenOptions={{
        headerShown: false,
        animation: reduceMotion ? 'none' : 'fade',
        animationDuration,
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="value" />
      <Stack.Screen name="notification-time" />
    </Stack>
  );
}
