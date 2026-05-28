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

## Android para testers (grátis, sem Play Store)

O perfil `preview` em [`eas.json`](eas.json) gera um **APK** que qualquer pessoa instala pelo link do Expo — sem conta Google Play.

### Pré-requisitos (uma vez)

1. Conta gratuita em [expo.dev/signup](https://expo.dev/signup).
2. Supabase **na nuvem** (não `127.0.0.1`) — testers usam o celular fora da sua rede; copie URL + anon key do [dashboard Supabase](https://supabase.com/dashboard) → **Project Settings → API**.
3. EAS CLI: `npm install -g eas-cli`

### Passo a passo

**1. Login no Expo**

```bash
eas login
```

**2. Vincular o projeto (só na primeira vez)**

```bash
eas init
```

Confirme criar o projeto `kindspark` no Expo. Isso adiciona `extra.eas.projectId` no `app.json` — commite essa alteração depois.

**3. Variáveis de ambiente no build**

No [expo.dev](https://expo.dev) → projeto **KindSpark** → **Environment variables**:

| Nome | Valor |
|------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | sua anon key |

Marque o ambiente **preview** (ou **All**).

**4. Gerar o APK**

```bash
eas build --profile preview --platform android
```

Na primeira vez, aceite **Generate new keystore** (fica salvo no Expo, sem custo). O build leva alguns minutos.

**5. Enviar para os testers**

Abra o link do terminal ou **expo.dev → Builds**. Com status **Finished**, baixe o APK ou copie o link de instalação e envie (WhatsApp, e-mail, etc.).

**6. No celular do tester**

1. Abrir o link no Chrome.
2. Baixar e instalar o APK.
3. Se bloquear: permitir instalar apps de fontes desconhecidas nas configurações.
4. Abrir **KindSpark** e testar.

### Atualizar o app

Suba `"version"` em `app.json` e rode de novo `eas build --profile preview --platform android`. Envie o novo link; pode ser necessário desinstalar a versão anterior.

### Custos

| Item | Custo |
|------|--------|
| Expo + APK `preview` | R$ 0 |
| Google Play / Apple | não usado |

Use Supabase na nuvem nas env vars — `http://127.0.0.1:54321` não funciona no celular dos testers.

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
