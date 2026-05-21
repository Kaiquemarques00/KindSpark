import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

export function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  return /network|fetch failed|failed to fetch|offline|timeout|ENOTFOUND|ECONNREFUSED/i.test(
    msg,
  );
}

export async function isOnline(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return typeof navigator === 'undefined' ? true : navigator.onLine;
  }
  const state = await NetInfo.fetch();
  if (state.isConnected === false) return false;
  if (state.isInternetReachable === false) return false;
  return true;
}

export function subscribeOnline(onOnline: () => void): () => void {
  if (Platform.OS === 'web') {
    const handler = () => {
      if (navigator.onLine) onOnline();
    };
    window.addEventListener('online', handler);
    return () => window.removeEventListener('online', handler);
  }

  return NetInfo.addEventListener((state) => {
    const online =
      state.isConnected === true &&
      state.isInternetReachable !== false;
    if (online) onOnline();
  });
}
