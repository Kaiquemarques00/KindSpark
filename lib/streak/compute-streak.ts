import { toLocalDateString } from '@/lib/supabase/daily-suggestion';

/** Shift a YYYY-MM-DD calendar date by `delta` days in local timezone */
export function addDaysToDateString(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return toLocalDateString(date);
}

/**
 * RF-005: consecutive calendar days with at least one `done`.
 * Active streak if today or yesterday has a done (grace until end of today).
 */
export function computeStreak(
  doneDates: Iterable<string>,
  today: string = toLocalDateString(),
): number {
  const done = new Set(doneDates);
  const yesterday = addDaysToDateString(today, -1);

  let anchor: string | null = null;
  if (done.has(today)) anchor = today;
  else if (done.has(yesterday)) anchor = yesterday;
  else return 0;

  let count = 0;
  let cursor = anchor;
  while (done.has(cursor)) {
    count += 1;
    cursor = addDaysToDateString(cursor, -1);
  }
  return count;
}
