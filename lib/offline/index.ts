export { isOnline, isNetworkError, subscribeOnline } from './network';
export { getCachedSuggestion, setCachedSuggestion, clearSuggestionCache } from './suggestion-cache';
export {
  enqueueMutation,
  getPendingDoneForDate,
  hasPendingDoneForDate,
  getMutationQueue,
  clearMutationQueue,
} from './mutation-queue';
export { flushMutationQueue } from './sync';
export type { QueuedMutation } from './mutation-queue';
export type { SyncResult } from './sync';
