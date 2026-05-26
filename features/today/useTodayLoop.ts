import { useCallback, useState } from 'react';

import { trackEvent } from '@/lib/analytics';
import {
  enqueueMutation,
  flushMutationQueue,
  getCachedSuggestion,
  getPendingDoneForDate,
  hasPendingSkipForAction,
  isNetworkError,
  isOnline,
  setCachedSuggestion,
} from '@/lib/offline';
import {
  fetchDoneLogForDate,
  fetchSkippedLogForAction,
  getOrCreateDailySuggestion,
  logActionDone,
  logActionSkipped,
  refreshDailySuggestion,
  toLocalDateString,
  type DailySuggestion,
  type UserActionLog,
} from '@/lib/supabase';

export type TodayBusyAction = 'load' | 'done' | 'skip' | 'refresh' | null;

async function resolveSuggestionSkipped(
  actionId: string,
  actionDate: string,
  checkServer: boolean,
): Promise<boolean> {
  if (await hasPendingSkipForAction(actionId, actionDate)) {
    return true;
  }
  if (!checkServer) {
    return false;
  }
  const { data } = await fetchSkippedLogForAction(actionId, actionDate);
  return data !== null;
}

export function useTodayLoop() {
  const today = toLocalDateString();
  const [suggestion, setSuggestion] = useState<DailySuggestion | null>(null);
  const [todayDone, setTodayDone] = useState<UserActionLog | null>(null);
  const [busy, setBusy] = useState<TodayBusyAction>('load');
  const [error, setError] = useState<string | null>(null);
  const [currentSuggestionSkipped, setCurrentSuggestionSkipped] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSync, setPendingSync] = useState(false);

  const syncSkippedState = useCallback(
    async (active: DailySuggestion | null, done: UserActionLog | null, checkServer: boolean) => {
      if (!active || done) {
        setCurrentSuggestionSkipped(false);
        return;
      }
      const skipped = await resolveSuggestionSkipped(active.action_id, today, checkServer);
      setCurrentSuggestionSkipped(skipped);
    },
    [today],
  );

  const loadFromCache = useCallback(async () => {
    const cached = await getCachedSuggestion(today);
    const pendingDone = await getPendingDoneForDate(today);
    if (!cached) {
      setError(
        'You’re offline. Open the app once with internet to cache today’s suggestion.',
      );
      setSuggestion(null);
      setTodayDone(pendingDone);
      setCurrentSuggestionSkipped(false);
      setIsOffline(true);
      setPendingSync(pendingDone !== null);
      return false;
    }
    setSuggestion(cached);
    setTodayDone(pendingDone);
    const skipped = await resolveSuggestionSkipped(cached.action_id, today, false);
    setCurrentSuggestionSkipped(skipped);
    setIsOffline(true);
    setPendingSync(
      pendingDone !== null || (await hasPendingSkipForAction(cached.action_id, today)),
    );
    return true;
  }, [today]);

  const load = useCallback(async () => {
    setBusy('load');
    setError(null);
    setIsOffline(false);
    setPendingSync(false);

    const online = await isOnline();

    if (!online) {
      await loadFromCache();
      setBusy(null);
      return;
    }

    await flushMutationQueue();

    const [suggestionResult, doneResult] = await Promise.all([
      getOrCreateDailySuggestion(today),
      fetchDoneLogForDate(today),
    ]);

    const networkFailure =
      isNetworkError(suggestionResult.error) || isNetworkError(doneResult.error);

    if (networkFailure) {
      await loadFromCache();
      setBusy(null);
      return;
    }

    if (suggestionResult.error || doneResult.error) {
      setError(
        (suggestionResult.error ?? doneResult.error)?.message ??
          'Could not load today’s suggestion.',
      );
      setBusy(null);
      return;
    }

    if (suggestionResult.data) {
      await setCachedSuggestion(today, suggestionResult.data);
    }

    setSuggestion(suggestionResult.data);
    setTodayDone(doneResult.data);
    await syncSkippedState(suggestionResult.data, doneResult.data, true);

    if (suggestionResult.data) {
      trackEvent('daily_suggestion_shown', {
        action_id: suggestionResult.data.action_id,
        suggestion_date: today,
      });
    }

    setBusy(null);
  }, [today, loadFromCache, syncSkippedState]);

  const handleDone = useCallback(async () => {
    if (!suggestion || todayDone || currentSuggestionSkipped) return;

    setBusy('done');
    setError(null);

    const online = await isOnline();

    if (!online) {
      await enqueueMutation({
        type: 'done',
        actionId: suggestion.action_id,
        actionDate: today,
      });
      const pending = await getPendingDoneForDate(today);
      setTodayDone(pending);
      setPendingSync(true);
      setIsOffline(true);
      trackEvent('action_done', { offline: true, action_date: today });
      setBusy(null);
      return;
    }

    const { data, error: doneError, alreadyDone } = await logActionDone(
      suggestion.action_id,
      today,
    );

    if (doneError) {
      if (isNetworkError(doneError)) {
        await enqueueMutation({
          type: 'done',
          actionId: suggestion.action_id,
          actionDate: today,
        });
        const pending = await getPendingDoneForDate(today);
        setTodayDone(pending);
        setPendingSync(true);
        setIsOffline(true);
        trackEvent('action_done', { offline: true, action_date: today });
        setBusy(null);
        return;
      }
      setError(doneError.message);
      setBusy(null);
      return;
    }

    setTodayDone(data);
    setCurrentSuggestionSkipped(false);
    trackEvent('action_done', { action_date: today, already_done: alreadyDone });
    setBusy(null);

    if (alreadyDone) {
      setError('You already logged kindness for today.');
    }
  }, [suggestion, today, todayDone, currentSuggestionSkipped]);

  const handleSkip = useCallback(async () => {
    if (!suggestion || todayDone || currentSuggestionSkipped) return;

    setBusy('skip');
    setError(null);

    const online = await isOnline();

    if (!online) {
      await enqueueMutation({
        type: 'skipped',
        actionId: suggestion.action_id,
        actionDate: today,
      });
      setCurrentSuggestionSkipped(true);
      setPendingSync(true);
      setIsOffline(true);
      trackEvent('action_skipped', { offline: true, action_date: today });
      setBusy(null);
      return;
    }

    const { error: skipError } = await logActionSkipped(suggestion.action_id, today);

    if (skipError) {
      if (isNetworkError(skipError)) {
        await enqueueMutation({
          type: 'skipped',
          actionId: suggestion.action_id,
          actionDate: today,
        });
        setCurrentSuggestionSkipped(true);
        setPendingSync(true);
        setIsOffline(true);
        trackEvent('action_skipped', { offline: true, action_date: today });
        setBusy(null);
        return;
      }
      setError(skipError.message);
      setBusy(null);
      return;
    }

    trackEvent('action_skipped', { action_date: today });
    setCurrentSuggestionSkipped(true);
    setBusy(null);
  }, [suggestion, today, todayDone, currentSuggestionSkipped]);

  const handleRefresh = useCallback(async () => {
    if (todayDone) return;

    const online = await isOnline();
    if (!online) {
      setError('Connect to the internet to get another idea.');
      return;
    }

    setBusy('refresh');
    setError(null);

    const { data, error: refreshError } = await refreshDailySuggestion(today);

    if (refreshError) {
      if (isNetworkError(refreshError)) {
        setError('Connect to the internet to get another idea.');
      } else {
        setError(refreshError.message);
      }
      setBusy(null);
      return;
    }

    if (data) {
      await setCachedSuggestion(today, data);
    }

    setSuggestion(data);
    await syncSkippedState(data, todayDone, true);
    trackEvent('suggestion_refreshed', { suggestion_date: today });
    setBusy(null);
  }, [today, todayDone, syncSkippedState]);

  return {
    today,
    suggestion,
    todayDone,
    busy,
    error,
    currentSuggestionSkipped,
    isOffline,
    pendingSync,
    load,
    handleDone,
    handleSkip,
    handleRefresh,
    isCompleted: todayDone !== null,
  };
}
