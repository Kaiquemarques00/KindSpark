import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import {
  AchievementBadge,
  ActivityCalendar,
  AppText,
  Button,
  Card,
  LightAchievementRow,
  ScreenShell,
  StatsRow,
} from '@/components/ui';
import { copy } from '@/constants/copy';
import { useProgress } from '@/features/progress/useProgress';
import { trackEvent } from '@/lib/analytics';
import { getAchievementState } from '@/lib/streak/achievement-state';
import type { LightAchievementId } from '@/lib/streak/light-achievements';
import { STREAK_MILESTONES } from '@/lib/streak/milestones';
import type { DayActivityStatus } from '@/lib/supabase';
import { colors, spacing } from '@/theme/tokens';

const TAB_BAR_INSET = 96;

function streakLabel(count: number): string {
  if (count === 1) return copy.progress.streakSubtitleOne;
  return copy.progress.streakSubtitle.replace('{n}', String(count));
}

function bestStreakLabel(count: number): string {
  if (count === 1) return copy.progress.bestStreakOne;
  return copy.progress.bestStreak.replace('{n}', String(count));
}

function weeklySummaryLine(doneDays: number, totalDays: number): string {
  if (doneDays === 0) return copy.progress.weeklySummaryZero;
  return copy.progress.weeklySummary
    .replace('{done}', String(doneDays))
    .replace('{total}', String(totalDays));
}

export function ProgressScreen() {
  const viewedRef = useRef(false);
  const {
    streak,
    bestStreak,
    busy,
    error,
    milestoneMessage,
    nextMilestone,
    stats,
    weekly,
    activity,
    lightAchievements,
    isEmptyJourney,
    load,
  } = useProgress();

  useFocusEffect(
    useCallback(() => {
      if (!viewedRef.current) {
        viewedRef.current = true;
        trackEvent('progress_screen_viewed');
      }
      load();
      return () => {
        viewedRef.current = false;
      };
    }, [load]),
  );

  const handleDayPress = useCallback((date: string, status: Exclude<DayActivityStatus, 'none'>) => {
    trackEvent('calendar_day_tapped', { action_date: date, status });
  }, []);

  const handleAchievementPress = useCallback((id: LightAchievementId) => {
    trackEvent('achievement_viewed', { achievement_id: id });
  }, []);

  const daysLabel =
    streak === 1 ? `1 ${copy.progress.day}` : `${streak} ${copy.progress.days}`;

  const showActivity = !busy && !error && activity.length > 0;

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
          {bestStreak > 0 ? (
            <AppText variant="caption" color={colors.textSecondary} style={styles.centered}>
              {bestStreakLabel(bestStreak)}
            </AppText>
          ) : null}
        </Card>
      ) : null}

      {!busy && isEmptyJourney && !error ? (
        <AppText variant="bodySecondary" style={styles.centered}>
          {copy.progress.emptyJourney}
        </AppText>
      ) : null}

      {!busy && !isEmptyJourney && streak === 0 && !error ? (
        <AppText variant="bodySecondary" style={styles.centered}>
          {copy.progress.noStreakBody}
        </AppText>
      ) : null}

      {!busy && weekly && !error ? (
        <AppText variant="bodySecondary" style={styles.centered}>
          {weeklySummaryLine(weekly.doneDays, weekly.totalDays)}
        </AppText>
      ) : null}

      {!busy && stats ? (
        <StatsRow
          completed={stats.completed}
          skipped={stats.skipped}
          completionRate={stats.completionRate}
        />
      ) : null}

      {showActivity ? (
        <View style={styles.section}>
          <AppText variant="section">{copy.progress.activityTitle}</AppText>
          <ActivityCalendar cells={activity} onDayPress={handleDayPress} />
        </View>
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

      {!busy && !error ? (
        <View style={styles.section}>
          <AppText variant="section">{copy.progress.lightAchievements.title}</AppText>
          <LightAchievementRow
            achievements={lightAchievements}
            onAchievementPress={handleAchievementPress}
          />
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
  section: {
    gap: spacing[3],
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
