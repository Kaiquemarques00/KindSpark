/**
 * Local-notification APIs only — deep imports avoid the main package entry,
 * which loads DevicePushTokenAutoRegistration and logs an ERROR in Expo Go (SDK 53+).
 */
import { addNotificationResponseReceivedListener } from 'expo-notifications/build/NotificationsEmitter';
import cancelAllScheduledNotificationsAsync from 'expo-notifications/build/cancelAllScheduledNotificationsAsync';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import {
  PermissionStatus,
  SchedulableTriggerInputTypes,
} from 'expo-notifications/build/Notifications.types';
import scheduleNotificationAsync from 'expo-notifications/build/scheduleNotificationAsync';
import setNotificationChannelAsync from 'expo-notifications/build/setNotificationChannelAsync';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';

export {
  addNotificationResponseReceivedListener,
  AndroidImportance,
  cancelAllScheduledNotificationsAsync,
  getPermissionsAsync,
  PermissionStatus,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  SchedulableTriggerInputTypes,
  setNotificationChannelAsync,
  setNotificationHandler,
};
