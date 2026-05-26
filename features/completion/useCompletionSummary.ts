import { useCallback, useEffect, useState } from 'react';

import { fetchActionStats, fetchCurrentStreak, toLocalDateString } from '@/lib/supabase';

export function useCompletionSummary() {
  const today = toLocalDateString();
  const [streak, setStreak] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [streakResult, statsResult] = await Promise.all([
      fetchCurrentStreak(today),
      fetchActionStats('month'),
    ]);

    let streakOk = false;
    let statsOk = false;

    if (!streakResult.error) {
      setStreak(streakResult.streak);
      streakOk = true;
    }

    if (!statsResult.error && statsResult.data) {
      setCompletedCount(statsResult.data.completed);
      statsOk = true;
    }

    if (!streakOk && !statsOk) {
      setError(
        streakResult.error?.message ??
          statsResult.error?.message ??
          'Could not load summary.',
      );
    }

    setLoading(false);
  }, [today]);

  useEffect(() => {
    void load();
  }, [load]);

  return { streak, completedCount, loading, error };
}
