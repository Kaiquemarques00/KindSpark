import { Screen } from '@/components/Screen';

export default function TodayScreen() {
  return (
    <Screen
      title="Today's kindness"
      subtitle="Your daily suggestion will appear here. (T-030)"
      links={[
        { href: '/(onboarding)/notification-time', label: 'Onboarding' },
        { href: '/(auth)/login', label: 'Auth' },
      ]}
    />
  );
}
