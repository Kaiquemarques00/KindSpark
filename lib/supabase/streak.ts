import { addDaysToDateString, computeStreak } from '@/lib/streak/compute-streak';

import { supabase } from './client';
import { toLocalDateString } from './daily-suggestion';

const LOOKBACK_DAYS = 90;

/** Distinct calendar dates with at least one `done` in the lookback window */
export async function fetchDoneDates(
  today: string = toLocalDateString(),
): Promise<{ dates: string[]; error: Error | null }> {
  const fromDate = addDaysToDateString(today, -LOOKBACK_DAYS);

  const { data, error } = await supabase
    .from('user_action_logs')
    .select('action_date')
    .eq('status', 'done')
    .gte('action_date', fromDate)
    .order('action_date', { ascending: false });

  if (error) {
    return { dates: [], error };
  }

  const dates = [...new Set((data ?? []).map((row) => row.action_date as string))];
  return { dates, error: null };
}

export async function fetchCurrentStreak(
  today: string = toLocalDateString(),
): Promise<{ streak: number; error: Error | null }> {
  const { dates, error } = await fetchDoneDates(today);
  if (error) {
    return { streak: 0, error };
  }
  return { streak: computeStreak(dates, today), error: null };
}
