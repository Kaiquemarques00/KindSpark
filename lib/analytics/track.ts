import type { AnalyticsEvent, AnalyticsProperties } from './events';

/**
 * T-053: structured event log (console in dev; swap for analytics SDK later).
 */
export function trackEvent(
  event: AnalyticsEvent,
  properties?: AnalyticsProperties,
): void {
  const payload = {
    event,
    ts: new Date().toISOString(),
    ...properties,
  };

  if (__DEV__) {
    console.log('[KindSpark]', payload);
  }
}
