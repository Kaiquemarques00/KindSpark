import { useCallback, useState } from 'react';

import { fetchActionHistory, type ActionHistoryEntry } from '@/lib/supabase/action-history';

export function useHistory() {
  const [entries, setEntries] = useState<ActionHistoryEntry[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);

    const { data, error: fetchError } = await fetchActionHistory();

    if (fetchError) {
      setError(fetchError.message);
      setBusy(false);
      return;
    }

    setEntries(data);
    setBusy(false);
  }, []);

  return { entries, busy, error, load };
}
