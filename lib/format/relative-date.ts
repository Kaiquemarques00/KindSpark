import { copy } from '@/constants/copy';

function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Calendar-day difference: reference midnight minus action_date midnight. */
export function daysSinceActionDate(actionDate: string, reference: Date = new Date()): number {
  const actionMidnight = startOfLocalDay(parseLocalDateString(actionDate));
  const refMidnight = startOfLocalDay(reference);
  const diffMs = refMidnight.getTime() - actionMidnight.getTime();
  return Math.floor(diffMs / (24 * 60 * 60 * 1000));
}

/** Formats YYYY-MM-DD (local calendar) as Today / Yesterday / N days ago. */
export function formatRelativeDate(actionDate: string, reference: Date = new Date()): string {
  const days = daysSinceActionDate(actionDate, reference);
  if (days === 0) return copy.history.today;
  if (days === 1) return copy.history.yesterday;
  return copy.history.daysAgo.replace('{n}', String(days));
}
