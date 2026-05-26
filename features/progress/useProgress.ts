import { useCallback, useState } from 'react';

import { trackEvent } from '@/lib/analytics';
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
  fetchCurrentStreak,
  toLocalDateString,
  type ActionStats,
} from '@/lib/supabase';

export function useProgress() {
  const today = toLocalDateString();
  const [streak, setStreak] = useState(0);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<ActionStats | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    setMilestoneMessage(null);
    setStats(null);

    const [streakResult, statsResult] = await Promise.all([
      fetchCurrentStreak(today),
      fetchActionStats('month'),
    ]);

    const { streak: value, error: streakError } = streakResult;

    if (streakError) {
      setError(streakError.message);
      setBusy(false);
      return;
    }

    setStreak(value);

    if (!statsResult.error && statsResult.data) {
      setStats(statsResult.data);
    }

    const active = getActiveMilestone(value);
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
    busy,
    error,
    milestoneMessage,
    nextMilestone,
    stats,
    load,
  };
}
