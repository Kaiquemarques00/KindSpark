import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { getCategoryVisual } from '@/lib/illustrations';
import { colors, spacing } from '@/theme/tokens';

export type HistoryRowStatus = 'done' | 'skipped';

type HistoryRowProps = {
  title: string;
  dateLabel: string;
  status: HistoryRowStatus;
  category?: string | null;
};

export function HistoryRow({ title, dateLabel, status, category }: HistoryRowProps) {
  const { icon } = getCategoryVisual(category);
  const isDone = status === 'done';
  const statusLabel = isDone ? 'completed' : 'skipped';

  return (
    <View
      style={styles.row}
      accessibilityRole="text"
      accessibilityLabel={`${title}, ${dateLabel}, ${statusLabel}`}
    >
      <View style={[styles.categoryIcon, { backgroundColor: colors.peach }]} accessibilityElementsHidden>
        <Ionicons name={icon} size={18} color={colors.ctaEnd} />
      </View>
      <View style={styles.textBlock}>
        <AppText variant="body" numberOfLines={2}>
          {title}
        </AppText>
        <AppText variant="caption">{dateLabel}</AppText>
      </View>
      <View
        style={[styles.statusIcon, isDone ? styles.statusDone : styles.statusSkipped]}
        accessibilityLabel={statusLabel}
        accessibilityRole="image"
      >
        <Ionicons
          name={isDone ? 'checkmark' : 'remove'}
          size={14}
          color={isDone ? colors.white : colors.textMuted}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
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
