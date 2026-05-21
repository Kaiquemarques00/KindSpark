export type ActionStatus = 'done' | 'skipped';

export type Action = {
  id: string;
  title: string;
  description: string;
  category: string;
  active: boolean;
  created_at: string;
};

export type DailySuggestion = {
  suggestion_id: string;
  action_id: string;
  suggestion_date: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
};

export type UserActionLog = {
  id: string;
  user_id: string;
  action_id: string;
  status: ActionStatus;
  action_date: string;
  created_at: string;
};

export type NotificationPreferences = {
  id: string;
  user_id: string;
  notification_time: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

type DailySuggestionRow = {
  suggestion_id: string;
  action_id: string;
  suggestion_date: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      actions: {
        Row: Action;
        Insert: Omit<Action, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Action>;
        Relationships: [];
      };
      user_profiles: {
        Row: { id: string; email: string | null; created_at: string };
        Insert: { id: string; email?: string | null; created_at?: string };
        Update: { email?: string | null };
        Relationships: [];
      };
      user_action_logs: {
        Row: UserActionLog;
        Insert: Omit<UserActionLog, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<UserActionLog>;
        Relationships: [];
      };
      notification_preferences: {
        Row: NotificationPreferences;
        Insert: Omit<NotificationPreferences, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<NotificationPreferences>;
        Relationships: [];
      };
      user_daily_suggestions: {
        Row: {
          id: string;
          user_id: string;
          action_id: string;
          suggestion_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          action_id: string;
          suggestion_date: string;
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: { action_id?: string; updated_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_or_create_daily_suggestion: {
        Args: { p_suggestion_date: string };
        Returns: DailySuggestionRow[];
      };
      refresh_daily_suggestion: {
        Args: { p_suggestion_date: string };
        Returns: DailySuggestionRow[];
      };
      log_action_done: {
        Args: { p_action_id: string; p_action_date: string };
        Returns: UserActionLog;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
