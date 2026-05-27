import { supabase } from './client';
import { toLocalDateString } from './daily-suggestion';

export type WeeklyProgress = {
  doneDays: number;
  totalDays: 7;
  weekStart: string;
  weekEnd: string;
};

/** Monday as week start (local timezone). */
export function getLocalWeekBounds(date: Date = new Date()): { start: string; end: string } {
  const day = date.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - daysFromMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: toLocalDateString(monday), end: toLocalDateString(sunday) };
}

export async function fetchWeeklyDoneCount(
  today: string = toLocalDateString(),
): Promise<{ data: WeeklyProgress | null; error: Error | null }> {
  const { start: weekStart, end: weekEnd } = getLocalWeekBounds(
    parseLocalDate(today),
  );
  const rangeEnd = weekEnd < today ? weekEnd : today;

  const { data, error } = await supabase
    .from('user_action_logs')
    .select('action_date')
    .eq('status', 'done')
    .gte('action_date', weekStart)
    .lte('action_date', rangeEnd);

  if (error) {
    return { data: null, error };
  }

  const doneDays = new Set((data ?? []).map((row) => row.action_date as string)).size;

  return {
    data: {
      doneDays,
      totalDays: 7,
      weekStart,
      weekEnd,
    },
    error: null,
  };
}

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}
