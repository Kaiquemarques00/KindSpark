import type { ActionStatus } from './database.types';
import { supabase } from './client';
import { toLocalDateString } from './daily-suggestion';

export type ActionStats = {
  completed: number;
  skipped: number;
  completionRate: number;
};

export type ActionStatsPeriod = 'month' | 'all';

function getLocalMonthBounds(date: Date = new Date()): { start: string; end: string } {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = toLocalDateString(new Date(year, month, 1));
  const lastDay = new Date(year, month + 1, 0).getDate();
  const end = toLocalDateString(new Date(year, month, lastDay));
  return { start, end };
}

function aggregateStats(rows: { status: ActionStatus }[]): ActionStats {
  let completed = 0;
  let skipped = 0;

  for (const row of rows) {
    if (row.status === 'done') completed += 1;
    else if (row.status === 'skipped') skipped += 1;
  }

  const total = completed + skipped;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, skipped, completionRate };
}

export async function fetchActionStats(
  period: ActionStatsPeriod = 'month',
): Promise<{ data: ActionStats | null; error: Error | null }> {
  let query = supabase.from('user_action_logs').select('status').in('status', ['done', 'skipped']);

  if (period === 'month') {
    const { start, end } = getLocalMonthBounds();
    query = query.gte('action_date', start).lte('action_date', end);
  }

  const { data, error } = await query;

  if (error) {
    return { data: null, error };
  }

  return {
    data: aggregateStats((data ?? []) as { status: ActionStatus }[]),
    error: null,
  };
}

export async function fetchTotalDoneCount(): Promise<{ count: number; error: Error | null }> {
  const { count, error } = await supabase
    .from('user_action_logs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'done');

  if (error) {
    return { count: 0, error };
  }

  return { count: count ?? 0, error: null };
}
