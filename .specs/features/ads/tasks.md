# Tasks — ads (atomic + verificação)

**Spec**: `.specs/features/ads/spec.md`  
**Design**: `.specs/features/ads/design.md`  
**Status**: Phase 2 concluída — Phase 3 pendente (2026-05-28)

Legenda: **[P]** paralelizável na mesma fase (sem deps cruzadas); deps por ID.

**Gate padrão:** `npm run gate` (Full — lint + typecheck, igual CI). Quick: `npm run gate:quick`.

**Testes:** Matriz em `.specs/TESTING.md` — telas/features = manual + gate estático.

---

## Execution Plan

### Phase 1 — Dependency + Expo config (sequential)

```
ADS-T-001 → ADS-T-002
```

**Phase 1**:

- [x] ADS-T-001 — done
- [x] ADS-T-002 — done

### Phase 2 — Feature module + UI (parallel após Phase 1)

```
ADS-T-002 ──┬→ ADS-T-003 [P]
            └→ ADS-T-004 [P]
```

**Phase 2**:

- [x] ADS-T-003 — done
- [x] ADS-T-004 — done

### Phase 3 — Integration (sequential)

```
ADS-T-003 + ADS-T-004 → ADS-T-005
```

### Phase 4 — Verify (sequential)

```
ADS-T-005 → ADS-T-006
```

---

## Task Breakdown

### ADS-T-001: Adicionar dependência `react-native-google-mobile-ads`

**What**: Instalar a lib via `npx expo install react-native-google-mobile-ads` (compatível com SDK 54).  
**Where**: `package.json`, `package-lock.json`  
**Depends on**: None  
**Reuses**: `npx expo install` (padrão Expo)  
**Requirements**: `ADS-01`

**Done when**:

- [x] Dependência adicionada e lockfile atualizado
- [x] `npm run gate:quick` passa

**Tests**: none  
**Gate**: quick  
**Commit**: `feat(ads): add google mobile ads dependency`

---

### ADS-T-002: Configurar plugin Expo + App IDs (test) no `app.json`

**What**: Adicionar config plugin `react-native-google-mobile-ads` em `expo.plugins` com App IDs de teste.  
**Where**: `app.json`  
**Depends on**: ADS-T-001  
**Reuses**: plugin config pattern do projeto  
**Requirements**: `ADS-02`, `ADS-07`

**Done when**:

- [x] Plugin adicionado no `plugins` array (sem quebrar outros plugins)
- [x] App IDs de teste presentes (Android/iOS)
- [x] Docs/README menciona necessidade de rebuild (EAS dev build)

**Tests**: none  
**Gate**: quick  
**Commit**: `chore(ads): configure expo plugin for mobile ads`

---

### ADS-T-003: Implementar `features/ads` (provider + hook + config) [P]

**What**: Criar módulo com `AdsProvider`, `useAds`, e `ads-config` com guards (Expo Go/web/env flag).  
**Where**: `features/ads/*`  
**Depends on**: ADS-T-002  
**Reuses**: padrão `features/*/index.ts`, `lib/*/env.ts`  
**Requirements**: `ADS-03`, `ADS-05`

**Done when**:

- [x] `AdsProvider` inicializa SDK uma vez (quando permitido)
- [x] `useAds()` expõe `{ enabled, ready, reason? }`
- [x] Defaults seguros (test ids) quando env vars ausentes
- [x] Export via `features/ads/index.ts`
- [x] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(ads): add ads provider and config`

---

### ADS-T-004: Criar `AdBanner` UI com fallback [P]

**What**: Criar `components/ui/AdBanner.tsx` usando `BannerAd`, com fallback para `AdBannerShell`.  
**Where**: `components/ui/AdBanner.tsx`, `components/ui/index.ts`  
**Depends on**: ADS-T-003  
**Reuses**: `AdBannerShell`, tokens/layout existente (50px)  
**Requirements**: `ADS-04`

**Done when**:

- [x] Renderiza `BannerAd` quando `useAds().ready` e plataforma mobile
- [x] Renderiza `AdBannerShell` em web/Expo Go/disabled/not-ready
- [x] Export `AdBanner` em `components/ui/index.ts`
- [x] `npm run gate` passa

**Tests**: none  
**Gate**: full  
**Commit**: `feat(ads): add banner component with safe fallback`

---

### ADS-T-005: Integrar banner na Today + init no root

**What**: Trocar placeholder por `AdBanner` e envolver root com provider.  
**Where**: `features/today/TodayScreen.tsx`, `app/_layout.tsx`  
**Depends on**: ADS-T-003, ADS-T-004  
**Reuses**: ponto de renderização atual (`AdBannerShell` no final)  
**Requirements**: `ADS-06`

**Done when**:

- [ ] Today usa `AdBanner` sem alterar layout/spacing percebido
- [ ] Root inicializa ads via `AdsProvider`
- [ ] `npm run gate` passa

**Tests**: manual (dev build) + gate  
**Gate**: full  
**Commit**: `feat(ads): integrate banner into today`

---

### ADS-T-006: Verificação final (gate + smoke)

**What**: Rodar gate e checklist CA-ADS-*; documentar passos de build (EAS).  
**Where**: `.specs/features/ads/*`, `README.md`, `.env.example` (se necessário)  
**Depends on**: ADS-T-005  
**Reuses**: `.specs/TESTING.md`  
**Requirements**: `CA-ADS-01` … `CA-ADS-04`

**Done when**:

- [ ] `npm run gate` passa
- [ ] Checklist de smoke manual documentado

**Tests**: manual + gate  
**Gate**: full  
**Commit**: `docs(ads): add verification notes`

