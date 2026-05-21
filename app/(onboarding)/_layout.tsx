import { Redirect, Stack } from 'expo-router';

import { LoadingScreen } from '@/components/LoadingScreen';
import { useAppSession } from '@/features/auth';

export default function OnboardingLayout() {
  const { session, authLoading, onboardingComplete } = useAppSession();

  if (authLoading || (session && onboardingComplete === null)) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (onboardingComplete) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: true, title: 'KindSpark' }}>
      <Stack.Screen
        name="notification-time"
        options={{ title: 'Daily reminder', headerBackVisible: false }}
      />
    </Stack>
  );
}
