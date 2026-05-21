# KindSpark

Mobile app for daily kindness habits — Expo + Supabase (v0.1 MVP).

## Prerequisites

- Node.js 20.19+ (recommended for Expo SDK 54)
- npm
- [Expo Go](https://expo.dev/go) on a device, or Android/iOS simulator

## Quick start

```bash
cp .env.example .env

# Database (Docker Desktop required)
npx supabase start
npx supabase db reset
npx supabase status   # copy URL + anon key into .env

npm install
npx expo start
```

See [supabase/README.md](supabase/README.md) for schema and RPC details.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Expo dev server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Project layout

- `app/` — Expo Router screens (`(auth)`, `(onboarding)`, `(tabs)`)
- `features/` — Domain modules (auth, today, progress, …)
- `lib/supabase/` — Supabase client
- `.specs/` — TLC spec-driven docs

Specs: `.specs/features/v0.1-mvp/`.
