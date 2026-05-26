import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Illustration } from '@/components/ui/Illustration';
import { PaginationDots } from '@/components/ui/PaginationDots';
import { ScreenShell } from '@/components/ui/ScreenShell';
import { copy } from '@/constants/copy';
import { spacing } from '@/theme/tokens';

export function ValueScreen() {
  const router = useRouter();

  return (
    <ScreenShell contentContainerStyle={styles.container}>
      <View style={styles.top}>
        <AppText variant="title" style={styles.centered}>
          {copy.onboarding.valueHeadline}
        </AppText>
      </View>

      <Illustration
        size="onboarding"
        placeholderIcon="sunny"
        accessibilityLabel="Value illustration"
      />

      <View style={styles.bottom}>
        <PaginationDots count={2} activeIndex={1} />
        <Button
          label={copy.onboarding.continue}
          variant="primary"
          onPress={() => router.push('/(onboarding)/notification-time')}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[2],
  },
  centered: {
    textAlign: 'center',
  },
  bottom: {
    gap: spacing[5],
    paddingBottom: spacing[2],
  },
});
