import { logActionDone, logActionSkipped } from '@/lib/supabase/action-logs';

import { getMutationQueue, removeMutation } from './mutation-queue';
import { isOnline } from './network';

export type SyncResult = {
  synced: number;
  failed: number;
};

/** Flush queued done/skip mutations when online (idempotent done per day). */
export async function flushMutationQueue(): Promise<SyncResult> {
  if (!(await isOnline())) {
    return { synced: 0, failed: 0 };
  }

  const queue = await getMutationQueue();
  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    if (item.type === 'done') {
      const { error } = await logActionDone(item.actionId, item.actionDate);
      if (error) {
        failed += 1;
        continue;
      }
    } else {
      const { error } = await logActionSkipped(item.actionId, item.actionDate);
      if (error) {
        failed += 1;
        continue;
      }
    }
    await removeMutation(item.id);
    synced += 1;
  }

  return { synced, failed };
}
