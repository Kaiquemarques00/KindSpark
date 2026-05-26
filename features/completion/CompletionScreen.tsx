import { AppText, ScreenShell } from '@/components/ui';
import { copy } from '@/constants/copy';

type CompletionScreenProps = {
  actionDate?: string;
  offline?: boolean;
};

export function CompletionScreen(_props: CompletionScreenProps) {
  return (
    <ScreenShell contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
      <AppText variant="title">{copy.completion.headline}</AppText>
    </ScreenShell>
  );
}
