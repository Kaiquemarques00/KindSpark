import { useCallback, useState } from 'react';

import { useAppSession } from '@/features/auth';
import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from '@/features/onboarding';
import { trackEvent } from '@/lib/analytics';
import {
  formatNotificationTime,
  notificationTimeToDate,
  scheduleDailyReminder,
} from '@/lib/notifications';

export function useSettings() {
  const { session } = useAppSession();
  const [time, setTime] = useState(new Date(2020, 0, 1, 9, 0));
  const [enabled, setEnabled] = useState(true);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    if (!session?.user) return;

    setBusy(true);
    setError(null);
    setSaved(false);

    try {
      const prefs = await fetchNotificationPreferences(session.user.id);
      if (prefs) {
        setTime(notificationTimeToDate(prefs.notification_time));
        setEnabled(prefs.enabled);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load settings.');
    } finally {
      setBusy(false);
    }
  }, [session?.user]);

  const save = useCallback(async () => {
    if (!session?.user) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const notificationTime = formatNotificationTime(time);
      const prefs = await updateNotificationPreferences(session.user.id, {
        notification_time: notificationTime,
        enabled,
      });

      await scheduleDailyReminder(prefs.notification_time, prefs.enabled);

      trackEvent(enabled ? 'notification_enabled' : 'notification_disabled', {
        notification_time: notificationTime,
      });

      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  }, [session?.user, time, enabled]);

  return {
    time,
    setTime,
    enabled,
    setEnabled,
    busy,
    saving,
    error,
    saved,
    load,
    save,
  };
}
