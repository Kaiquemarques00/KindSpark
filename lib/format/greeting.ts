import { copy } from '@/constants/copy';

/** Local hour-based greeting for Today header (RUI-TD-01). */
export function getTimeGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return copy.today.greetingMorning;
  if (hour < 17) return copy.today.greetingAfternoon;
  return copy.today.greetingEvening;
}
