import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, spacing } from '@/theme/tokens';

export type HistoryRowStatus = 'done' | 'skipped';

type HistoryRowProps = {
  title: string;
  dateLabel: string;
  status: HistoryRowStatus;
};

export function HistoryRow({ title, dateLabel, status }: HistoryRowProps) {
  const isDone = status === 'done';

  return (
    <View style={styles.row} accessibilityLabel={`${title}, ${dateLabel}, ${status}`}>
      <View style={[styles.categoryIcon, { backgroundColor: colors.peach }]}>
        <Ionicons name="heart-outline" size={18} color={colors.ctaEnd} />
      </View>
      <View style={styles.textBlock}>
        <AppText variant="body" numberOfLines={2}>
          {title}
        </AppText>
        <AppText variant="caption">{dateLabel}</AppText>
      </View>
      <View
        style={[
          styles.statusIcon,
          isDone ? styles.statusDone : styles.statusSkipped,
        ]}
      >
        <Ionicons
          name={isDone ? 'checkmark' : 'remove'}
          size={14}
          color={isDone ? colors.white : colors.textMuted}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[2],
    minHeight: 52,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDone: {
    backgroundColor: colors.success,
  },
  statusSkipped: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
});
