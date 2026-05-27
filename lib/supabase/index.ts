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
export { fetchBestStreak, fetchCurrentStreak, fetchDoneDates } from './streak';
export {
  fetchActionHistory,
  HISTORY_PAGE_SIZE,
} from './action-history';
export type {
  ActionHistoryEntry,
  FetchActionHistoryParams,
  HistoryFilter,
} from './action-history';
export { fetchActionStats, fetchTotalDoneCount } from './action-stats';
export type { ActionStats, ActionStatsPeriod } from './action-stats';
export { CALENDAR_DAYS, fetchDailyActivity } from './daily-activity';
export type { DailyActivityCell, DayActivityStatus } from './daily-activity';
export { fetchWeeklyDoneCount, getLocalWeekBounds } from './weekly-progress';
export type { WeeklyProgress } from './weekly-progress';
