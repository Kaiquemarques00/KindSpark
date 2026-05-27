import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { hitSlop44 } from '@/components/ui/a11y';
import { copy } from '@/constants/copy';
import type { DailyActivityCell, DayActivityStatus } from '@/lib/supabase/daily-activity';
import { colors, spacing } from '@/theme/tokens';

const COLUMNS = 7;
const EXPECTED_CELLS = 35;

type ActivityCalendarProps = {
  cells: DailyActivityCell[];
  onDayPress?: (date: string, status: Exclude<DayActivityStatus, 'none'>) => void;
  showLegend?: boolean;
};

function statusA11yLabel(status: DayActivityStatus, date: string): string {
  const legend = copy.progress.activityLegend;
  const statusText =
    status === 'done' ? legend.done : status === 'skipped' ? legend.skipped : legend.none;
  return `${date}, ${statusText}`;
}

function cellStyle(status: DayActivityStatus) {
  if (status === 'done') return styles.cellDone;
  if (status === 'skipped') return styles.cellSkipped;
  return styles.cellNone;
}

function CalendarCell({
  cell,
  onDayPress,
}: {
  cell: DailyActivityCell;
  onDayPress?: ActivityCalendarProps['onDayPress'];
}) {
  const { action_date, status } = cell;
  const label = statusA11yLabel(status, action_date);
  const visual = <View style={[styles.cell, cellStyle(status)]} />;

  if (status !== 'none' && onDayPress) {
    return (
      <Pressable
        style={styles.cellPressable}
        onPress={() => onDayPress(action_date, status)}
        hitSlop={hitSlop44}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {visual}
      </Pressable>
    );
  }

  return (
    <View style={styles.cellPressable} accessibilityRole="text" accessibilityLabel={label}>
      {visual}
    </View>
  );
}

function chunkRows(items: DailyActivityCell[]): DailyActivityCell[][] {
  const rows: DailyActivityCell[][] = [];
  for (let i = 0; i < items.length; i += COLUMNS) {
    rows.push(items.slice(i, i + COLUMNS));
  }
  return rows;
}

export function ActivityCalendar({
  cells,
  onDayPress,
  showLegend = true,
}: ActivityCalendarProps) {
  const rows = chunkRows(cells.slice(0, EXPECTED_CELLS));

  return (
    <View style={styles.container}>
      {showLegend ? (
        <View style={styles.legend} accessibilityRole="text">
          <LegendItem color={colors.success} label={copy.progress.activityLegend.done} />
          <LegendItem
            color={colors.textMuted}
            label={copy.progress.activityLegend.skipped}
            bordered
          />
          <LegendItem color={colors.background} label={copy.progress.activityLegend.none} bordered />
        </View>
      ) : null}
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell) => (
              <View key={cell.action_date} style={styles.cellSlot}>
                <CalendarCell cell={cell} onDayPress={onDayPress} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function LegendItem({
  color,
  label,
  bordered = false,
}: {
  color: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendSwatch,
          { backgroundColor: color },
          bordered && styles.legendSwatchBordered,
        ]}
      />
      <AppText variant="caption" color={colors.textSecondary}>
        {label}
      </AppText>
    </View>
  );
}

const CELL_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    gap: spacing[3],
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendSwatchBordered: {
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  grid: {
    gap: spacing[2],
  },
  row: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  cellSlot: {
    flex: 1,
    alignItems: 'center',
  },
  cellPressable: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 6,
  },
  cellDone: {
    backgroundColor: colors.success,
  },
  cellSkipped: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  cellNone: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.peach,
  },
});
