import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { hitSlop44 } from '@/components/ui/a11y';
import { copy } from '@/constants/copy';
import type { HistoryFilter } from '@/lib/supabase/action-history';
import { colors, radius, spacing } from '@/theme/tokens';

export type { HistoryFilter };

const FILTER_ORDER: HistoryFilter[] = [
  'all',
  'done',
  'skipped',
  'last_7_days',
  'last_30_days',
];

const FILTER_LABELS: Record<HistoryFilter, string> = {
  all: copy.history.filters.all,
  done: copy.history.filters.done,
  skipped: copy.history.filters.skipped,
  last_7_days: copy.history.filters.last7,
  last_30_days: copy.history.filters.last30,
};

export type HistoryFilterBarProps = {
  value: HistoryFilter;
  onChange: (filter: HistoryFilter) => void;
};

export function HistoryFilterBar({ value, onChange }: HistoryFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FILTER_ORDER.map((filter) => {
        const selected = filter === value;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            style={[styles.chip, selected && styles.chipSelected]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={FILTER_LABELS[filter]}
            hitSlop={hitSlop44}
          >
            <AppText
              variant="caption"
              color={selected ? colors.white : colors.textSecondary}
            >
              {FILTER_LABELS[filter]}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing[2],
    paddingVertical: spacing[1],
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.peach,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.ctaEnd,
    borderColor: colors.ctaEnd,
  },
});
