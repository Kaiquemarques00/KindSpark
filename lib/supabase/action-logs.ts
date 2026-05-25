import type { ActionStatus, UserActionLog } from './database.types';
import { supabase } from './client';
import { toLocalDateString } from './daily-suggestion';

export async function fetchDoneLogForDate(
  actionDate: string = toLocalDateString(),
): Promise<{ data: UserActionLog | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('user_action_logs')
    .select('*')
    .eq('action_date', actionDate)
    .eq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function fetchSkippedLogForAction(
  actionId: string,
  actionDate: string = toLocalDateString(),
): Promise<{ data: UserActionLog | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('user_action_logs')
    .select('*')
    .eq('action_id', actionId)
    .eq('action_date', actionDate)
    .eq('status', 'skipped')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/** RF-003 / T-034: idempotent — one `done` per calendar day */
export async function logActionDone(
  actionId: string,
  actionDate: string = toLocalDateString(),
): Promise<{ data: UserActionLog | null; error: Error | null; alreadyDone: boolean }> {
  const { data: existing } = await fetchDoneLogForDate(actionDate);
  if (existing) {
    return { data: existing, error: null, alreadyDone: true };
  }

  const { data: skipped } = await fetchSkippedLogForAction(actionId, actionDate);
  if (skipped) {
    return {
      data: null,
      error: new Error('You skipped this idea. Try another idea first.'),
      alreadyDone: false,
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError ?? new Error('Not authenticated'), alreadyDone: false };
  }

  const { data, error } = await supabase
    .from('user_action_logs')
    .insert({
      user_id: user.id,
      action_id: actionId,
      status: 'done' as ActionStatus,
      action_date: actionDate,
    })
    .select()
    .single();

  if (error) {
    if ((error as { code?: string }).code === '23505') {
      const { data: again, error: fetchError } = await fetchDoneLogForDate(actionDate);
      if (!fetchError && again) {
        return { data: again, error: null, alreadyDone: true };
      }
    }
    return { data: null, error, alreadyDone: false };
  }

  return { data, error: null, alreadyDone: false };
}

/** RF-004: record skip for current suggestion */
export async function logActionSkipped(
  actionId: string,
  actionDate: string = toLocalDateString(),
): Promise<{ data: UserActionLog | null; error: Error | null }> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError ?? new Error('Not authenticated') };
  }

  const { data, error } = await supabase
    .from('user_action_logs')
    .insert({
      user_id: user.id,
      action_id: actionId,
      status: 'skipped' as ActionStatus,
      action_date: actionDate,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}
