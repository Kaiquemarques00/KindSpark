import { addDaysToDateString } from './compute-streak';

/** Longest run of consecutive calendar days with at least one `done`. */
export function computeBestStreak(doneDates: Iterable<string>): number {
  const sorted = [...new Set(doneDates)].sort();
  if (sorted.length === 0) return 0;

  let best = 1;
  let run = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const next = addDaysToDateString(prev, 1);
    if (sorted[i] === next) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }

  return best;
}
