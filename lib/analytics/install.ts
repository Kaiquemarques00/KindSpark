import AsyncStorage from '@react-native-async-storage/async-storage';

import { trackEvent } from './track';

const KEY = 'kindspark:install-tracked';

export async function trackAppInstalledOnce(): Promise<void> {
  const tracked = await AsyncStorage.getItem(KEY);
  if (tracked) return;
  trackEvent('app_installed');
  await AsyncStorage.setItem(KEY, '1');
}
