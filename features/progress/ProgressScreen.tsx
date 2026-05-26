import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import {
  AchievementBadge,
  AppText,
  Button,
  Card,
  ScreenShell,
  StatsRow,
} from '@/components/ui';
import { copy } from '@/constants/copy';
import { useProgress } from '@/features/progress/useProgress';
import { getAchievementState } from '@/lib/streak/achievement-state';
import { STREAK_MILESTONES } from '@/lib/streak/milestones';
import { colors, spacing } from '@/theme/tokens';

const TAB_BAR_INSET = 96;

function streakLabel(count: number): string {
  if (count === 1) return copy.progress.streakSubtitleOne;
  return copy.progress.streakSubtitle.replace('{n}', String(count));
}

export function ProgressScreen() {
  const { streak, busy, error, milestoneMessage, nextMilestone, stats, load } = useProgress();

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const daysLabel =
    streak === 1 ? `1 ${copy.progress.day}` : `${streak} ${copy.progress.days}`;

  return (
    <ScreenShell
      scrollable
      contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_INSET }]}
    >
      <AppText variant="title">{copy.progress.title}</AppText>

      {busy ? (
        <ActivityIndicator size="large" color={colors.ctaEnd} style={styles.loader} />
      ) : null}

      {!busy && !error ? (
        <Card style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Ionicons name="flame" size={28} color={colors.ctaEnd} />
            <AppText variant="secondary" color={colors.textSecondary}>
              {copy.progress.currentStreak}
            </AppText>
          </View>
          <AppText variant="hero" color={colors.ctaEnd}>
            {daysLabel}
          </AppText>
          <AppText variant="bodySecondary" style={styles.centered}>
            {streak > 0 ? streakLabel(streak) : copy.progress.noStreakTitle}
          </AppText>
        </Card>
      ) : null}

      {!busy && streak === 0 && !error ? (
        <AppText variant="bodySecondary" style={styles.centered}>
          {copy.progress.noStreakBody}
        </AppText>
      ) : null}

      {!busy && stats ? (
        <StatsRow
          completed={stats.completed}
          skipped={stats.skipped}
          completionRate={stats.completionRate}
        />
      ) : null}

      {!busy && !error ? (
        <View style={styles.achievementsSection}>
          <View style={styles.achievementsHeader}>
            <AppText variant="section">{copy.progress.achievements}</AppText>
            <AppText variant="caption" color={colors.ctaEnd}>
              {copy.progress.seeAll} &gt;
            </AppText>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsRow}
          >
            {STREAK_MILESTONES.map((days) => (
              <AchievementBadge
                key={days}
                days={days}
                state={getAchievementState(streak, days, nextMilestone)}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      {!busy && streak > 0 && nextMilestone && !milestoneMessage ? (
        <AppText variant="caption" style={styles.centered}>
          {copy.progress.nextMilestoneHint
            .replace('{n}', String(nextMilestone - streak))
            .replace(
              '{unit}',
              nextMilestone - streak === 1 ? copy.progress.dayUnit : copy.progress.daysUnit,
            )
            .replace('{m}', String(nextMilestone))}
        </AppText>
      ) : null}

      {!busy && milestoneMessage ? (
        <Card style={styles.milestoneCard}>
          <AppText variant="caption" color={colors.ctaEnd}>
            {copy.progress.milestoneReached}
          </AppText>
          <AppText variant="body">{milestoneMessage}</AppText>
        </Card>
      ) : null}

      {error ? (
        <>
          <AppText variant="caption" color={colors.warning} style={styles.centered}>
            {error}
          </AppText>
          <Button label={copy.progress.retry} variant="text" onPress={load} />
        </>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[4],
  },
  loader: {
    marginVertical: spacing[6],
  },
  streakCard: {
    backgroundColor: colors.peach,
    padding: spacing[5],
    gap: spacing[2],
    alignItems: 'center',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  centered: {
    textAlign: 'center',
  },
  achievementsSection: {
    gap: spacing[3],
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  achievementsRow: {
    gap: spacing[3],
    paddingVertical: spacing[1],
  },
  milestoneCard: {
    padding: spacing[4],
    gap: spacing[2],
    backgroundColor: colors.peach,
  },
});
