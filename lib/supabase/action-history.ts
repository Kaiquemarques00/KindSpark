import { addDaysToDateString } from '@/lib/streak/compute-streak';

import type { Action, ActionStatus, UserActionLog } from './database.types';
import { supabase } from './client';
import { toLocalDateString } from './daily-suggestion';

export type ActionHistoryEntry = {
  id: string;
  action_date: string;
  status: ActionStatus;
  created_at: string;
  title: string;
  category: string;
};

export type HistoryFilter =
  | 'all'
  | 'done'
  | 'skipped'
  | 'last_7_days'
  | 'last_30_days';

export type FetchActionHistoryParams = {
  limit?: number;
  cursor?: string;
  filter?: HistoryFilter;
};

export const HISTORY_PAGE_SIZE = 25;

type HistoryLogRow = Pick<
  UserActionLog,
  'id' | 'action_id' | 'action_date' | 'status' | 'created_at'
>;

function encodeCursor(row: HistoryLogRow): string {
  return `${row.action_date}|${row.created_at}|${row.id}`;
}

function parseCursor(cursor: string): { action_date: string; created_at: string; id: string } {
  const [action_date, created_at, id] = cursor.split('|');
  if (!action_date || !created_at || !id) {
    throw new Error('Invalid history cursor');
  }
  return { action_date, created_at, id };
}

function applyHistoryFilter(
  query: ReturnType<typeof supabase.from>,
  filter: HistoryFilter,
  today: string,
) {
  if (filter === 'done') {
    return query.eq('status', 'done');
  }
  if (filter === 'skipped') {
    return query.eq('status', 'skipped');
  }
  if (filter === 'last_7_days') {
    return query.gte('action_date', addDaysToDateString(today, -6));
  }
  if (filter === 'last_30_days') {
    return query.gte('action_date', addDaysToDateString(today, -29));
  }
  return query;
}

async function resolveHistoryEntries(rows: HistoryLogRow[]): Promise<ActionHistoryEntry[]> {
  if (rows.length === 0) {
    return [];
  }

  const actionIds = [...new Set(rows.map((r) => r.action_id))];
  const { data: actions, error: actionsError } = await supabase
    .from('actions')
    .select('id, title, category')
    .in('id', actionIds);

  if (actionsError) {
    throw actionsError;
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

  return entries;
}

/** RF-006: paginated logs with action title, status, and optional filters */
export async function fetchActionHistory(
  params: FetchActionHistoryParams = {},
): Promise<{ data: ActionHistoryEntry[]; nextCursor: string | null; error: Error | null }> {
  const today = toLocalDateString();
  const limit = params.limit ?? HISTORY_PAGE_SIZE;
  const filter = params.filter ?? 'all';

  let query = supabase
    .from('user_action_logs')
    .select('id, action_id, action_date, status, created_at')
    .order('action_date', { ascending: false })
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit + 1);

  query = applyHistoryFilter(query, filter, today);

  if (params.cursor) {
    const { action_date, created_at, id } = parseCursor(params.cursor);
    query = query.or(
      `action_date.lt.${action_date},and(action_date.eq.${action_date},created_at.lt.${created_at}),and(action_date.eq.${action_date},created_at.eq.${created_at},id.lt.${id})`,
    );
  }

  const { data: logs, error: logsError } = await query;

  if (logsError) {
    return { data: [], nextCursor: null, error: logsError };
  }

  const rows = (logs ?? []) as HistoryLogRow[];
  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;

  try {
    const data = await resolveHistoryEntries(pageRows);
    const nextCursor =
      hasMore && pageRows.length > 0 ? encodeCursor(pageRows[pageRows.length - 1]) : null;
    return { data, nextCursor, error: null };
  } catch (error) {
    return {
      data: [],
      nextCursor: null,
      error: error instanceof Error ? error : new Error('Failed to load history'),
    };
  }
}
