import { useCallback, useEffect, useRef, useState } from 'react';

import { trackEvent } from '@/lib/analytics';
import {
  fetchActionHistory,
  type ActionHistoryEntry,
  type HistoryFilter,
} from '@/lib/supabase';

export function useHistory() {
  const [filter, setFilterState] = useState<HistoryFilter>('all');
  const [entries, setEntries] = useState<ActionHistoryEntry[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filterRef = useRef(filter);

  const load = useCallback(async () => {
    const activeFilter = filterRef.current;
    setBusy(true);
    setError(null);

    const { data, nextCursor: cursor, error: fetchError } = await fetchActionHistory({
      filter: activeFilter,
    });

    if (fetchError) {
      setError(fetchError.message);
      setBusy(false);
      return;
    }

    setEntries(data);
    setNextCursor(cursor);
    setBusy(false);
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore || busy) return;

    setLoadingMore(true);

    const { data, nextCursor: cursor, error: fetchError } = await fetchActionHistory({
      filter: filterRef.current,
      cursor: nextCursor,
    });

    if (fetchError) {
      setError(fetchError.message);
      setLoadingMore(false);
      return;
    }

    setEntries((prev) => {
      const ids = new Set(prev.map((entry) => entry.id));
      const appended = data.filter((entry) => !ids.has(entry.id));
      return [...prev, ...appended];
    });
    setNextCursor(cursor);
    setLoadingMore(false);
  }, [busy, loadingMore, nextCursor]);

  const setFilter = useCallback((next: HistoryFilter) => {
    if (next === filterRef.current) return;
    trackEvent('history_filter_changed', { filter: next });
    filterRef.current = next;
    setFilterState(next);
    setEntries([]);
    setNextCursor(null);
  }, []);

  useEffect(() => {
    filterRef.current = filter;
    void load();
  }, [filter, load]);

  const hasMore = nextCursor !== null;

  return {
    entries,
    filter,
    setFilter,
    busy,
    loadingMore,
    error,
    hasMore,
    load,
    loadMore,
  };
}
