/** Minimal analytics events from v0.1 spec (T-053) */
export type AnalyticsEvent =
  | 'app_installed'
  | 'onboarding_completed'
  | 'daily_suggestion_shown'
  | 'action_done'
  | 'action_skipped'
  | 'suggestion_refreshed'
  | 'streak_milestone_reached'
  | 'notification_enabled'
  | 'notification_disabled'
  | 'notification_opened'
  | 'offline_sync_completed';

export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;
