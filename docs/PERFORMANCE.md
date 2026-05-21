# Performance — v0.1 (T-052)

**Target (RNF-001):** cold start &lt; 3 seconds on a mid-range device.

## What we optimize today

- **Splash screen** — hidden only after fonts load (`app/_layout.tsx`), avoiding layout flash.
- **Parallel fetches** — Today loads suggestion + done log in one `Promise.all`.
- **Streak** — client-side over last 90 days of `done` dates (no heavy RPC).
- **Offline cache** — last suggestion in AsyncStorage avoids blocking network on repeat opens when offline.

## Manual measurement (required for T-052 sign-off)

1. Build a **preview** binary (EAS) or use a **release** build on a physical device — dev mode is slower and not representative.
2. Force-quit the app completely.
3. Start a stopwatch and tap the app icon.
4. Stop when the **Today** tab shows the suggestion card (or empty/error state), not when the splash first disappears.
5. Repeat 3 times; record median.

| Run | Time (s) | Device | Build |
|-----|----------|--------|-------|
| 1   |          |        |       |
| 2   |          |        |       |
| 3   |          |        |       |

**Median:** _____ s — pass if &lt; 3 s.

## If over 3 s

- Profile with React DevTools / Expo dev tools.
- Check Supabase latency (local vs remote).
- Defer non-critical work (analytics, offline flush) after first paint — already async post-mount.

## Notes

- First launch after install includes onboarding — measure **returning user** path for apples-to-apples comparison.
- Web target is secondary for v0.1; mobile physical device is the source of truth.
