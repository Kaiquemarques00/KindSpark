import { useEffect } from 'react';

import { trackEvent } from '@/lib/analytics';
import { subscribeOnline } from '@/lib/offline/network';
import { flushMutationQueue } from '@/lib/offline/sync';

/** Sync pending mutations when connectivity returns */
export function useOfflineSync(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const runSync = async () => {
      const { synced, failed } = await flushMutationQueue();
      if (synced > 0) {
        trackEvent('offline_sync_completed', { synced, failed });
      }
    };

    void runSync();

    const unsubscribe = subscribeOnline(() => {
      void runSync();
    });

    return unsubscribe;
  }, [enabled]);
}
