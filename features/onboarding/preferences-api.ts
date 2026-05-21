import { supabase } from '@/lib/supabase';
import type { NotificationPreferences } from '@/lib/supabase/database.types';

export async function fetchNotificationPreferences(
  userId: string,
): Promise<NotificationPreferences | null> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const prefs = await fetchNotificationPreferences(userId);
  return prefs !== null;
}

export async function saveNotificationPreferences(
  userId: string,
  notificationTime: string,
  enabled = true,
): Promise<NotificationPreferences> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert(
      {
        user_id: userId,
        notification_time: notificationTime,
        enabled,
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNotificationPreferences(
  userId: string,
  updates: { notification_time?: string; enabled?: boolean },
): Promise<NotificationPreferences> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
