import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DailySuggestion } from '@/lib/supabase/database.types';

const KEY = 'kindspark:suggestion-cache';

type CachedSuggestion = {
  suggestionDate: string;
  suggestion: DailySuggestion;
};

export async function getCachedSuggestion(
  suggestionDate: string,
): Promise<DailySuggestion | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CachedSuggestion;
    if (parsed.suggestionDate !== suggestionDate) return null;
    return parsed.suggestion;
  } catch {
    return null;
  }
}

export async function setCachedSuggestion(
  suggestionDate: string,
  suggestion: DailySuggestion,
): Promise<void> {
  const payload: CachedSuggestion = { suggestionDate, suggestion };
  await AsyncStorage.setItem(KEY, JSON.stringify(payload));
}

export async function clearSuggestionCache(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
