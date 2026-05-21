import type { DailySuggestion } from './database.types';
import { supabase } from './client';

/** Calendar date in local timezone (YYYY-MM-DD) — pass from device for streak/suggestion day */
export function toLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function firstRow(rows: DailySuggestion[] | null): DailySuggestion | null {
  if (!rows?.length) return null;
  return rows[0];
}

/** RF-001: load or create today's active suggestion */
export async function getOrCreateDailySuggestion(
  suggestionDate: string = toLocalDateString(),
): Promise<{ data: DailySuggestion | null; error: Error | null }> {
  const { data, error } = await supabase.rpc('get_or_create_daily_suggestion', {
    p_suggestion_date: suggestionDate,
  });

  if (error) {
    return { data: null, error };
  }

  return { data: firstRow(data as DailySuggestion[]), error: null };
}

/** RF-002: replace today's suggestion (excludes actions already shown today) */
export async function refreshDailySuggestion(
  suggestionDate: string = toLocalDateString(),
): Promise<{ data: DailySuggestion | null; error: Error | null }> {
  const { data, error } = await supabase.rpc('refresh_daily_suggestion', {
    p_suggestion_date: suggestionDate,
  });

  if (error) {
    return { data: null, error };
  }

  return { data: firstRow(data as DailySuggestion[]), error: null };
}
