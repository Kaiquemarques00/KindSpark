import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useProgress } from '@/features/progress/useProgress';

function streakSubtitle(count: number): string {
  if (count === 1) return '1-day kindness streak';
  return `${count}-day kindness streak`;
}

export function ProgressScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { streak, busy, error, milestoneMessage, nextMilestone, load } = useProgress();

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
      <Text style={[styles.heading, { color: colors.text }]}>Your streak</Text>
      <Text style={[styles.subheading, { color: colors.muted }]}>
        Consecutive days with at least one kind action done.
      </Text>

      {busy ? (
        <ActivityIndicator size="large" color={colors.tint} style={styles.loader} />
      ) : null}

      {!busy && !error ? (
        <View style={[styles.streakCard, { borderColor: colors.tint }]}>
          <Text style={[styles.streakNumber, { color: colors.tint }]}>{streak}</Text>
          <Text style={[styles.streakCopy, { color: colors.text }]}>
            {streak > 0 ? streakSubtitle(streak) : 'No active streak yet'}
          </Text>
        </View>
      ) : null}

      {!busy && streak === 0 && !error ? (
        <Text style={[styles.empty, { color: colors.muted }]}>
          Complete today&apos;s kindness on the Today tab to start your streak.
        </Text>
      ) : null}

      {!busy && streak > 0 && nextMilestone && !milestoneMessage ? (
        <Text style={[styles.hint, { color: colors.muted }]}>
          {nextMilestone - streak} more {nextMilestone - streak === 1 ? 'day' : 'days'} until your{' '}
          {nextMilestone}-day milestone.
        </Text>
      ) : null}

      {!busy && milestoneMessage ? (
        <View style={[styles.milestoneCard, { backgroundColor: colors.tint }]}>
          <Text style={styles.milestoneTitle}>Milestone reached</Text>
          <Text style={styles.milestoneBody}>{milestoneMessage}</Text>
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
    gap: 16,
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
    marginTop: 32,
  },
  streakCard: {
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginTop: 8,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 72,
  },
  streakCopy: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  milestoneCard: {
    borderRadius: 12,
    padding: 20,
    gap: 8,
  },
  milestoneTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  milestoneBody: {
    color: '#fff',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
  },
  error: {
    color: '#C45C5C',
    fontSize: 14,
    textAlign: 'center',
  },
});
