import { Platform } from 'react-native';

import {
  AndroidImportance,
  cancelAllScheduledNotificationsAsync,
  getPermissionsAsync,
  PermissionStatus,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  SchedulableTriggerInputTypes,
  setNotificationChannelAsync,
  setNotificationHandler,
} from './expo-local';

export const DAILY_REMINDER_BODY = 'Your good action for today is waiting ✨';
const ANDROID_CHANNEL_ID = 'daily-reminder';

function ensureNotificationHandler(): void {
  if (Platform.OS === 'web') return;
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export function parseNotificationTime(time: string): { hour: number; minute: number } {
  const [hourPart, minutePart] = time.split(':');
  return {
    hour: parseInt(hourPart ?? '9', 10),
    minute: parseInt(minutePart ?? '0', 10),
  };
}

export function formatNotificationTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}:00`;
}

export function notificationTimeToDate(time: string): Date {
  const { hour, minute } = parseNotificationTime(time);
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Daily reminders',
    importance: AndroidImportance.DEFAULT,
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await getPermissionsAsync();
  if (existing === PermissionStatus.GRANTED) {
    return true;
  }
  const { status } = await requestPermissionsAsync();
  return status === PermissionStatus.GRANTED;
}

export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  await cancelAllScheduledNotificationsAsync();
}

export async function scheduleDailyReminder(
  notificationTime: string,
  enabled = true,
): Promise<void> {
  ensureNotificationHandler();
  await cancelDailyReminder();
  if (!enabled) return;

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await ensureAndroidChannel();
  const { hour, minute } = parseNotificationTime(notificationTime);

  await scheduleNotificationAsync({
    content: {
      title: 'KindSpark',
      body: DAILY_REMINDER_BODY,
      data: { url: '/(tabs)' },
      ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}
