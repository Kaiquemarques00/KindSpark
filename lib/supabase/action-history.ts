import type { Action, ActionStatus, UserActionLog } from './database.types';
import { supabase } from './client';

export type ActionHistoryEntry = {
  id: string;
  action_date: string;
  status: ActionStatus;
  created_at: string;
  title: string;
  category: string;
};

const HISTORY_LIMIT = 50;

/** RF-006: recent logs with action title and status */
export async function fetchActionHistory(
  limit: number = HISTORY_LIMIT,
): Promise<{ data: ActionHistoryEntry[]; error: Error | null }> {
  const { data: logs, error: logsError } = await supabase
    .from('user_action_logs')
    .select('id, action_id, action_date, status, created_at')
    .order('action_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (logsError) {
    return { data: [], error: logsError };
  }

  const rows = (logs ?? []) as Pick<
    UserActionLog,
    'id' | 'action_id' | 'action_date' | 'status' | 'created_at'
  >[];

  if (rows.length === 0) {
    return { data: [], error: null };
  }

  const actionIds = [...new Set(rows.map((r) => r.action_id))];
  const { data: actions, error: actionsError } = await supabase
    .from('actions')
    .select('id, title, category')
    .in('id', actionIds);

  if (actionsError) {
    return { data: [], error: actionsError };
  }

  const byId = new Map(
    ((actions ?? []) as Pick<Action, 'id' | 'title' | 'category'>[]).map((a) => [a.id, a]),
  );

  const entries: ActionHistoryEntry[] = [];
  for (const row of rows) {
    const action = byId.get(row.action_id);
    if (!action) continue;
    entries.push({
      id: row.id,
      action_date: row.action_date,
      status: row.status,
      created_at: row.created_at,
      title: action.title,
      category: action.category,
    });
  }

  return { data: entries, error: null };
}
