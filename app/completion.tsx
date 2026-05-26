import { useLocalSearchParams } from 'expo-router';

import { CompletionScreen } from '@/features/completion';

export default function CompletionRoute() {
  const { actionDate, offline } = useLocalSearchParams<{
    actionDate?: string;
    offline?: string;
  }>();

  return (
    <CompletionScreen
      actionDate={typeof actionDate === 'string' ? actionDate : undefined}
      offline={offline === 'true'}
    />
  );
}
