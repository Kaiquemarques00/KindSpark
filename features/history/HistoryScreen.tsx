import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { AppText, Button, HistoryRow, Illustration, ScreenShell } from '@/components/ui';
import { copy } from '@/constants/copy';
import { useHistory } from '@/features/history/useHistory';
import { formatRelativeDate } from '@/lib/format/relative-date';
import type { ActionHistoryEntry } from '@/lib/supabase/action-history';
import { colors, spacing } from '@/theme/tokens';

const TAB_BAR_INSET = 96;

export function HistoryScreen() {
  const { entries, busy, error, load } = useHistory();

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const renderItem = ({ item }: { item: ActionHistoryEntry }) => (
    <HistoryRow
      title={item.title}
      dateLabel={formatRelativeDate(item.action_date)}
      status={item.status}
      category={item.category}
    />
  );

  return (
    <ScreenShell style={styles.shell} contentContainerStyle={styles.shellContent}>
      <FlatList
        style={styles.list}
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="title">{copy.history.title}</AppText>
            {busy ? (
              <ActivityIndicator size="large" color={colors.ctaEnd} style={styles.loader} />
            ) : null}
            {!busy && entries.length === 0 && !error ? (
              <View style={styles.emptyBlock}>
                <Illustration
                  size="empty"
                  placeholderIcon="time-outline"
                  accessibilityLabel="Empty history illustration"
                />
                <AppText variant="bodySecondary" style={styles.empty}>
                  {copy.history.empty}
                </AppText>
              </View>
            ) : null}
            {error ? (
              <View style={styles.errorBlock}>
                <AppText variant="caption" color={colors.warning} style={styles.centered}>
                  {error}
                </AppText>
                <Button label={copy.history.retry} variant="text" onPress={load} />
              </View>
            ) : null}
          </View>
        }
        contentContainerStyle={[styles.listContent, { paddingBottom: TAB_BAR_INSET }]}
        showsVerticalScrollIndicator={false}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  shellContent: {
    flex: 1,
    paddingVertical: 0,
  },
  header: {
    gap: spacing[3],
    paddingBottom: spacing[4],
  },
  loader: {
    marginVertical: spacing[4],
  },
  emptyBlock: {
    alignItems: 'center',
    gap: spacing[4],
    marginTop: spacing[4],
  },
  empty: {
    textAlign: 'center',
  },
  centered: {
    textAlign: 'center',
  },
  errorBlock: {
    gap: spacing[2],
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  separator: {
    height: spacing[3],
  },
});
