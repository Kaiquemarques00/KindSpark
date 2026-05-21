# KindSpark

Mobile app for daily kindness habits — Expo SDK 54 + Supabase (v0.1 MVP).

## Prerequisites

- Node.js **20.19+** (Expo SDK 54)
- npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (local Supabase)
- [Expo Go](https://expo.dev/go) or Android/iOS simulator

Optional for preview builds:

- [Expo account](https://expo.dev/signup)
- [EAS CLI](https://docs.expo.dev/build/setup/): `npm install -g eas-cli`

## Quick start

```bash
cp .env.example .env

# Local Supabase
npx supabase start
npx supabase db reset
npx supabase status   # copy API URL + anon key into .env

npm install
npx expo start
```

Press `a` / `i` for Android/iOS simulator, or scan the QR code with Expo Go.

### Environment variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |

See [supabase/README.md](supabase/README.md) for schema, migrations, and RPCs.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Expo dev server |
| `npm run android` / `ios` / `web` | Platform shortcuts |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run gate` | Full quality gate (lint + typecheck) — same as CI |
| `npm run gate:quick` | Typecheck only |

## EAS preview build (TestFlight / internal testing)

1. Log in: `eas login`
2. Configure the project (first time): `eas build:configure`
3. Create a preview build:

```bash
eas build --profile preview --platform android
# or
eas build --profile preview --platform ios
```

4. Set `EXPO_PUBLIC_*` secrets in [Expo dashboard](https://expo.dev) → your project → **Environment variables**, or in `eas.json` env for the profile.
5. Install the artifact from the build page (APK/IPA or store internal track).

Use the same Supabase project URL/anon key as your backend. For local-only dev, keep using `http://127.0.0.1:54321` with a tunnel or remote Supabase for device builds.

## Project layout

| Path | Purpose |
|------|---------|
| `app/` | Expo Router — `(auth)`, `(onboarding)`, `(tabs)` |
| `features/` | Domain modules (auth, today, progress, history, settings, offline) |
| `lib/supabase/` | Supabase client & API helpers |
| `lib/offline/` | Suggestion cache + done/skip sync queue |
| `lib/analytics/` | Minimal event logging (dev console) |
| `supabase/migrations/` | Postgres schema, RLS, seed, RPCs |
| `.specs/` | TLC specs (`features/v0.1-mvp/`) |
| `docs/PERFORMANCE.md` | Cold-start measurement checklist (T-052) |

## Offline behavior (RNF-004)

- Last **daily suggestion** is cached in AsyncStorage.
- **Done** / **Skip** while offline are queued and synced when the network returns.
- **Another idea** and fresh history require connectivity.

## Specs & roadmap

- Feature spec: [.specs/features/v0.1-mvp/spec.md](.specs/features/v0.1-mvp/spec.md)
- Tasks: [.specs/features/v0.1-mvp/tasks.md](.specs/features/v0.1-mvp/tasks.md)
- Session state: [.specs/STATE.md](.specs/STATE.md)
