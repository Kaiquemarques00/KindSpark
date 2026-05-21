import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ActionStatus, UserActionLog } from '@/lib/supabase/database.types';

const KEY = 'kindspark:mutation-queue';

export type QueuedMutation = {
  id: string;
  type: ActionStatus;
  actionId: string;
  actionDate: string;
  queuedAt: string;
};

export async function getMutationQueue(): Promise<QueuedMutation[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as QueuedMutation[]) : [];
  } catch {
    return [];
  }
}

async function saveMutationQueue(queue: QueuedMutation[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(queue));
}

export async function enqueueMutation(
  mutation: Omit<QueuedMutation, 'id' | 'queuedAt'>,
): Promise<QueuedMutation> {
  const queue = await getMutationQueue();
  const entry: QueuedMutation = {
    ...mutation,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    queuedAt: new Date().toISOString(),
  };
  await saveMutationQueue([...queue, entry]);
  return entry;
}

export async function removeMutation(id: string): Promise<void> {
  const queue = await getMutationQueue();
  await saveMutationQueue(queue.filter((m) => m.id !== id));
}

export async function clearMutationQueue(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

/** Optimistic log for a queued `done` on a calendar day */
export async function getPendingDoneForDate(
  actionDate: string,
): Promise<UserActionLog | null> {
  const queue = await getMutationQueue();
  const pending = queue.find((m) => m.type === 'done' && m.actionDate === actionDate);
  if (!pending) return null;

  return {
    id: `pending-${pending.id}`,
    user_id: 'offline',
    action_id: pending.actionId,
    status: 'done',
    action_date: actionDate,
    created_at: pending.queuedAt,
  };
}

export async function hasPendingDoneForDate(actionDate: string): Promise<boolean> {
  const queue = await getMutationQueue();
  return queue.some((m) => m.type === 'done' && m.actionDate === actionDate);
}
