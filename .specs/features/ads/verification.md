# ads — Verificação (Phase 4)

**Feature**: `ads`  
**Data**: 2026-05-28  
**Gate automático**: `npm run gate` ✅ (lint + typecheck)

---

## Critérios de aceite (CA-ADS)

| ID | Critério | Como verificar | Status |
|----|----------|----------------|--------|
| CA-ADS-01 | Dev build (EAS APK) mostra banner com test unit id | Instalar APK `preview`/dev build; abrir Today; ver banner de teste (“Sample Ad”) ou shell se no-fill | Manual — tester |
| CA-ADS-02 | Expo Go e Web não crasham; fallback | `npx expo start` + Expo Go: app abre, Today mostra placeholder “Ad”; `npm run web`: idem | Manual — ✅ código (guards + lazy import) |
| CA-ADS-03 | `EXPO_PUBLIC_ADS_ENABLED=false` desliga ads | `.env` com flag `false`; rebuild ou restart com env; Today mostra só shell | Manual — opcional |
| CA-ADS-04 | `npm run gate` passa | `npm run gate` no repo | ✅ Automático |

---

## Smoke manual (Android)

Pré-requisitos: conta Expo, EAS CLI, build com plugin `react-native-google-mobile-ads` (App IDs em `app.json`).

### 1. Gerar APK de teste

```bash
eas login
eas build --profile preview --platform android
```

Configure no [expo.dev](https://expo.dev) → Environment variables (profile **preview**):

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

(Opcional para ads — defaults usam IDs de teste do Google.)

### 2. Instalar e abrir

1. Baixar APK pelo link do EAS.
2. Instalar no dispositivo (permitir fontes desconhecidas se necessário).
3. Abrir KindSpark → login → aba **Today**.

### 3. Checklist na Today

- [ ] App não crasha ao abrir.
- [ ] Rodapé da Today: área de anúncio visível (banner de teste **ou** placeholder “Ad” se no-fill).
- [ ] CTAs “I did it” / Skip / New idea permanecem clicáveis (banner não sobrepõe).
- [ ] Navegar History / Progress / Settings: sem crash (barrel `ui` não carrega SDK).

### 4. Expo Go (regressão)

1. `npx expo start` → abrir no Expo Go.
2. [ ] App abre sem erro `RNGoogleMobileAdsModule`.
3. [ ] Today mostra placeholder “Ad” (sem anúncio real).

---

## IDs: teste vs produção

| Tipo | Formato | Onde |
|------|---------|------|
| App ID | `ca-app-pub-XXXX~YYYY` | `app.json` → plugin `react-native-google-mobile-ads` |
| Banner unit | `ca-app-pub-XXXX/ZZZZ` | `.env` → `EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID_ANDROID` (e iOS) |

**Desenvolvimento**: manter App IDs de teste do Google em `app.json` (atual).  
**Produção** (após smoke OK): substituir App IDs e unit IDs reais do AdMob → **novo** `eas build`.

Exemplo produção (KindSpark):

- App: `ca-app-pub-7558114019131187~5008910980`
- Banner Today (Android): `ca-app-pub-7558114019131187/4615679225`

---

## Arquivos da feature

| Path | Papel |
|------|--------|
| `features/ads/` | `AdsProvider`, `useAds`, `ads-config` |
| `components/ui/AdBanner*.tsx` | Banner nativo + fallback (import direto, não no barrel `ui`) |
| `features/today/TodayScreen.tsx` | `AdBanner placement="today_bottom"` |
| `app/_layout.tsx` | `AdsProvider` no root |

---

## Notas conhecidas

- Blocos AdMob novos podem levar horas para servir fill → shell “Ad” é esperado até ativar.
- Não misturar App ID de teste com unit ID de produção no mesmo build.
- Interstitial/rewarded e UMP (consent) ficam fora do escopo (ADS-08 deferred).
