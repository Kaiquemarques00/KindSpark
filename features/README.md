# Feature modules (v0.1)

Domain logic lives here; screens stay in `app/` (Expo Router).

| Module | Path | Responsibility |
|--------|------|----------------|
| auth | `features/auth/` | Login, register, session |
| onboarding | `features/onboarding/` | Notification time, push permission |
| today | `features/today/` | Daily suggestion, done/skip, refresh |
| progress | `features/progress/` | Streak, milestones |
| history | `features/history/` | Recent action logs |
| settings | `features/settings/` | Preferences, logout |
| offline | `features/offline/` | Cache + mutation queue |

Shared Supabase client: `lib/supabase/`.
