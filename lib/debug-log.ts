/** Debug session logging — remove after verification */
export function debugLog(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown> = {},
  runId = 'pre-fix',
): void {
  // #region agent log
  fetch('http://127.0.0.1:7796/ingest/5a0e3b2c-a723-4f8a-a110-98a6c1df63a8', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': 'dab21e',
    },
    body: JSON.stringify({
      sessionId: 'dab21e',
      runId,
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}
