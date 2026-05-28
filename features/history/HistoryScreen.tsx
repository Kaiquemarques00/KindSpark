import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  HistoryFilterBar,
  HistoryRow,
  Illustration,
  ScreenShell,
} from '@/components/ui';
import { copy } from '@/constants/copy';
import { useHistory } from '@/features/history/useHistory';
import { trackEvent } from '@/lib/analytics';
import { formatRelativeDate } from '@/lib/format/relative-date';
import type { ActionHistoryEntry } from '@/lib/supabase';
import { colors, spacing } from '@/theme/tokens';

const TAB_BAR_INSET = 96;
const END_REACHED_THRESHOLD = 0.4;

export function HistoryScreen() {
  const viewedRef = useRef(false);
  const {
    entries,
    filter,
    setFilter,
    busy,
    loadingMore,
    error,
    hasMore,
    load,
    loadMore,
  } = useHistory();

  useFocusEffect(
    useCallback(() => {
      if (!viewedRef.current) {
        viewedRef.current = true;
        trackEvent('history_screen_viewed');
      }
      load();
      return () => {
        viewedRef.current = false;
      };
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

  const showGlobalEmpty = !busy && !error && entries.length === 0 && filter === 'all';
  const showFilterEmpty = !busy && !error && entries.length === 0 && filter !== 'all';

  const ListFooter = () => {
    if (loadingMore) {
      return <ActivityIndicator size="small" color={colors.ctaEnd} style={styles.footerLoader} />;
    }
    return null;
  };

  return (
    <ScreenShell style={styles.shell} contentContainerStyle={styles.shellContent}>
      <FlatList
        style={styles.list}
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={() => {
          if (hasMore) void loadMore();
        }}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="title">{copy.history.title}</AppText>
            <HistoryFilterBar value={filter} onChange={setFilter} />
            {busy ? (
              <ActivityIndicator size="large" color={colors.ctaEnd} style={styles.loader} />
            ) : null}
            {showGlobalEmpty ? (
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
            {showFilterEmpty ? (
              <AppText variant="bodySecondary" style={styles.empty}>
                {copy.history.emptyFilter}
              </AppText>
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
        ListFooterComponent={entries.length > 0 ? ListFooter : null}
        contentContainerStyle={[styles.listContent, { paddingBottom: TAB_BAR_INSET }]}
        showsVerticalScrollIndicator={false}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    paddingBottom: spacing[6],
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
  footerLoader: {
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
