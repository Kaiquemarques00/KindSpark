import { useCallback, useState } from 'react';

import { fetchCurrentStreak } from '@/lib/supabase';

export function useStreakBadge() {
  const [streak, setStreak] = useState(0);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    const { streak: value, error } = await fetchCurrentStreak();
    if (!error) {
      setStreak(value);
    }
    setBusy(false);
  }, []);

  return { streak, busy, load };
}
