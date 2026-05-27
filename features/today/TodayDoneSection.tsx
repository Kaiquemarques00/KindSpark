import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Illustration } from '@/components/ui';
import { copy } from '@/constants/copy';
import { formatRelativeDate } from '@/lib/format/relative-date';
import type { DailySuggestion, UserActionLog } from '@/lib/supabase/database.types';
import { colors, spacing } from '@/theme/tokens';

type TodayDoneSectionProps = {
  todayDone: UserActionLog;
  suggestion: DailySuggestion | null;
};

export function TodayDoneSection({ todayDone, suggestion }: TodayDoneSectionProps) {
  const router = useRouter();
  const showRecap =
    suggestion !== null && suggestion.action_id === todayDone.action_id;
  const loggedDateLabel = formatRelativeDate(todayDone.action_date);

  const handleSeeProgress = useCallback(() => {
    router.replace('/(tabs)/progress');
  }, [router]);

  const handleSeeHistory = useCallback(() => {
    router.replace('/(tabs)/history');
  }, [router]);

  return (
    <View style={styles.block}>
      <Illustration
        size="empty"
        placeholderIcon="checkmark-circle"
        accessibilityLabel="Kindness completed today"
        style={styles.illustration}
      />
      <AppText variant="title" style={styles.centered}>
        {copy.today.completedTitle}
      </AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.centered}>
        {copy.today.loggedFor} {loggedDateLabel}
      </AppText>
      <AppText variant="bodySecondary" style={styles.centered}>
        {copy.today.completedSubtitle}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing[4],
    alignItems: 'stretch',
    marginTop: spacing[8],
  },
  illustration: {
    alignSelf: 'center',
  },
  centered: {
    textAlign: 'center',
  }
});
