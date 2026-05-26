export { supabase } from './client';
export { getSupabaseConfig } from './env';
export type { Action, ActionStatus, DailySuggestion, Database, UserActionLog } from './database.types';
export {
  fetchDoneLogForDate,
  fetchSkippedLogForAction,
  logActionDone,
  logActionSkipped,
} from './action-logs';
export {
  getOrCreateDailySuggestion,
  refreshDailySuggestion,
  toLocalDateString,
} from './daily-suggestion';
export { fetchCurrentStreak, fetchDoneDates } from './streak';
export { fetchActionHistory } from './action-history';
export type { ActionHistoryEntry } from './action-history';
export { fetchActionStats } from './action-stats';
export type { ActionStats, ActionStatsPeriod } from './action-stats';
