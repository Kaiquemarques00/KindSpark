import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { copy } from '@/constants/copy';
import { colors } from '@/theme/tokens';

type StatsRowProps = {
  completed: number;
  skipped: number;
  completionRate: number;
};

type StatColumnProps = {
  label: string;
  value: string;
};

function StatColumn({ label, value }: StatColumnProps) {
  return (
    <View style={styles.column}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
      <AppText variant="section" style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}

export function StatsRow({ completed, skipped, completionRate }: StatsRowProps) {
  return (
    <View style={styles.row} accessibilityLabel="Progress statistics">
      <StatColumn label={copy.progress.completed} value={String(completed)} />
      <StatColumn label={copy.progress.skipped} value={String(skipped)} />
      <StatColumn
        label={copy.progress.completionRate}
        value={`${Math.round(completionRate)}%`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    textAlign: 'center',
  },
  value: {
    fontSize: 18,
    color: colors.textPrimary,
  },
});
