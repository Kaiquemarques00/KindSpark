import { useCallback, useRef, useState } from 'react';

import { trackEvent } from '@/lib/analytics';
import { computeLightAchievements, type LightAchievement } from '@/lib/streak/light-achievements';
import {
  getActiveMilestone,
  getMilestoneMessage,
  getNextMilestone,
} from '@/lib/streak/milestones';
import {
  getShownMilestonesToday,
  markMilestoneShownToday,
} from '@/lib/streak/milestone-storage';
import {
  fetchActionStats,
  fetchBestStreak,
  fetchCurrentStreak,
  fetchDailyActivity,
  fetchTotalDoneCount,
  fetchWeeklyDoneCount,
  toLocalDateString,
  type ActionStats,
  type DailyActivityCell,
  type WeeklyProgress,
} from '@/lib/supabase';

export function useProgress() {
  const today = toLocalDateString();
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<ActionStats | null>(null);
  const [weekly, setWeekly] = useState<WeeklyProgress | null>(null);
  const [activity, setActivity] = useState<DailyActivityCell[]>([]);
  const [lightAchievements, setLightAchievements] = useState<LightAchievement[]>(() =>
    computeLightAchievements({ totalDone: 0, currentStreak: 0, bestStreak: 0 }),
  );
  const [isEmptyJourney, setIsEmptyJourney] = useState(false);
  const bestStreakRef = useRef(0);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    setMilestoneMessage(null);

    const [
      streakResult,
      bestResult,
      statsResult,
      weeklyResult,
      activityResult,
      totalDoneResult,
    ] = await Promise.all([
      fetchCurrentStreak(today),
      fetchBestStreak(today),
      fetchActionStats('month'),
      fetchWeeklyDoneCount(today),
      fetchDailyActivity(today),
      fetchTotalDoneCount(),
    ]);

    if (streakResult.error) {
      setError(streakResult.error.message);
      setBusy(false);
      return;
    }

    const currentStreak = streakResult.streak;
    setStreak(currentStreak);

    if (!statsResult.error && statsResult.data) {
      setStats(statsResult.data);
    } else {
      setStats(null);
    }

    if (!weeklyResult.error && weeklyResult.data) {
      setWeekly(weeklyResult.data);
    } else {
      setWeekly(null);
    }

    if (!activityResult.error) {
      setActivity(activityResult.data);
    }

    let resolvedBest = bestStreakRef.current;
    if (!bestResult.error) {
      resolvedBest = bestResult.best;
      bestStreakRef.current = bestResult.best;
      setBestStreak(bestResult.best);
    }

    const totalDone = totalDoneResult.error ? null : totalDoneResult.count;

    if (totalDone !== null) {
      setIsEmptyJourney(totalDone === 0);
    }

    setLightAchievements(
      computeLightAchievements({
        totalDone: totalDone ?? 0,
        currentStreak,
        bestStreak: resolvedBest,
      }),
    );

    const active = getActiveMilestone(currentStreak);
    if (active) {
      const shown = await getShownMilestonesToday(today);
      if (!shown.includes(active)) {
        setMilestoneMessage(getMilestoneMessage(active));
        await markMilestoneShownToday(today, active);
        trackEvent('streak_milestone_reached', { days: active });
      }
    }

    setBusy(false);
  }, [today]);

  const nextMilestone = getNextMilestone(streak);

  return {
    today,
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
  };
}
