import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupportedStorage } from '@supabase/auth-js';

export function getAuthStorage(): SupportedStorage {
  return AsyncStorage;
}
