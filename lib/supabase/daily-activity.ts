import { addDaysToDateString } from '@/lib/streak/compute-streak';

import type { ActionStatus } from './database.types';
import { supabase } from './client';
import { toLocalDateString } from './daily-suggestion';

export type DayActivityStatus = 'done' | 'skipped' | 'none';

export type DailyActivityCell = {
  action_date: string;
  status: DayActivityStatus;
};

export const CALENDAR_DAYS = 35;

export async function fetchDailyActivity(
  today: string = toLocalDateString(),
  days: number = CALENDAR_DAYS,
): Promise<{ data: DailyActivityCell[]; error: Error | null }> {
  const startDate = addDaysToDateString(today, -(days - 1));

  const { data, error } = await supabase
    .from('user_action_logs')
    .select('action_date, status')
    .gte('action_date', startDate)
    .lte('action_date', today)
    .in('status', ['done', 'skipped']);

  if (error) {
    return { data: [], error };
  }

  const byDate = new Map<string, DayActivityStatus>();
  for (const row of (data ?? []) as { action_date: string; status: ActionStatus }[]) {
    const date = row.action_date;
    const existing = byDate.get(date);
    if (row.status === 'done') {
      byDate.set(date, 'done');
    } else if (row.status === 'skipped' && existing !== 'done') {
      byDate.set(date, 'skipped');
    }
  }

  const cells: DailyActivityCell[] = [];
  for (let i = 0; i < days; i++) {
    const action_date = addDaysToDateString(startDate, i);
    cells.push({
      action_date,
      status: byDate.get(action_date) ?? 'none',
    });
  }

  return { data: cells, error: null };
}
