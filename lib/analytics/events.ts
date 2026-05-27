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
  | 'offline_sync_completed'
  | 'completion_screen_shown'
  | 'completion_screen_dismissed'
  | 'completion_cta_progress'
  | 'completion_cta_history'
  | 'progress_screen_viewed'
  | 'history_screen_viewed'
  | 'achievement_viewed'
  | 'history_filter_changed'
  | 'calendar_day_tapped';

export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;
