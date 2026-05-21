import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { ActionHistoryEntry } from '@/lib/supabase/action-history';
import { useHistory } from '@/features/history/useHistory';

function formatActionDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function statusLabel(status: ActionHistoryEntry['status']): string {
  return status === 'done' ? 'Done' : 'Skipped';
}

export function HistoryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { entries, busy, error, load } = useHistory();

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.heading, { color: colors.text }]}>History</Text>
      <Text style={[styles.subheading, { color: colors.muted }]}>
        Recent actions you&apos;ve done or skipped.
      </Text>

      {busy ? (
        <ActivityIndicator size="large" color={colors.tint} style={styles.loader} />
      ) : null}

      {!busy && entries.length === 0 && !error ? (
        <Text style={[styles.empty, { color: colors.muted }]}>
          Nothing here yet. Mark today&apos;s action as done or skip it to see your history.
        </Text>
      ) : null}

      {!busy && entries.length > 0 ? (
        <View style={styles.list}>
          {entries.map((entry) => (
            <View
              key={entry.id}
              style={[styles.row, { borderColor: colors.muted }]}
            >
              <View style={styles.rowMain}>
                <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={2}>
                  {entry.title}
                </Text>
                <Text style={[styles.rowMeta, { color: colors.muted }]}>
                  {formatActionDate(entry.action_date)} · {entry.category}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  entry.status === 'done'
                    ? { backgroundColor: colors.tint }
                    : styles.badgeSkipped,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    entry.status === 'done' ? styles.badgeTextDone : { color: colors.muted },
                  ]}
                >
                  {statusLabel(entry.status)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  heading: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  loader: {
    marginTop: 24,
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 16,
  },
  list: {
    gap: 0,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowMain: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  rowMeta: {
    fontSize: 13,
    lineHeight: 18,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeSkipped: {
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextDone: {
    color: '#fff',
  },
  error: {
    color: '#C45C5C',
    fontSize: 14,
    textAlign: 'center',
  },
});
