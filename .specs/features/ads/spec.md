# Feature spec — ads (KindSpark)

## Meta

| Campo | Valor |
|-------|--------|
| **Feature** | `ads` |
| **Status** | Done (2026-05-28) |
| **Tipo** | Large — integração SDK nativo + config Expo + UI component + docs |
| **Formato inicial** | Banner apenas (sem interstitial / rewarded) |
| **Copy de UI** | Inglês (apenas a11y label; sem strings visíveis) |
| **Rastreio MVP** | Monetização futura (fora do MVP v0.1), mas com guardrails de UX |

## Problem Statement

O app já tem um placeholder de anúncio (`AdBannerShell`) no final da Today. Para monetizar de forma incremental e com risco baixo, precisamos integrar um provedor real de anúncios com:

- configuração nativa correta (Expo SDK 54 + EAS build),
- uma API simples para renderizar banner em pontos específicos,
- fallback seguro em ambientes onde ads não funcionam (Expo Go, web, builds sem IDs),
- regras de UX que não prejudiquem o loop principal de hábito.

## Goals

- [ ] Substituir o placeholder por um banner real via **Google Mobile Ads** (AdMob) em iOS/Android.
- [ ] Garantir **fallback**: sem crash e sem bloqueio do fluxo se ads estiverem indisponíveis.
- [ ] Estruturar como feature (`features/ads`) com provider + config + hook.
- [ ] Documentar setup (IDs, env vars, EAS build) e restrições (Expo Go).

## Out of Scope (nesta entrega)

| Item | Motivo |
|------|--------|
| Interstitial ads | Evitar fricção; risco alto de UX e policy. |
| Rewarded ads | Precisa economia/recompensa clara no produto. |
| Mediation networks | Complexidade de setup e compliance. |
| Consent management (UMP) | Requer UX/legal; planejar fase dedicada. |
| Remote config / A/B | Prematuro; adiciona infra. |
| Ads em Completion Screen | Preservar BR-004 (sem ads intrusivos no pós-done). |

---

## User Stories

### P1: Banner ad na Today (baixo risco) ⭐ MVP desta feature

**User Story**: Como usuário, posso ver um banner no final da tela Today sem bloquear minhas ações, para que o app monetize de forma leve.

**Acceptance Criteria**:

1. WHEN a Today é renderizada THEN o app SHALL tentar mostrar um banner no rodapé de conteúdo (abaixo das ações).
2. WHEN o ad não carrega THEN o app SHALL renderizar um fallback discreto (layout equivalente ao shell) e SHALL NOT quebrar o layout.
3. WHEN o usuário estiver no Expo Go ou no Web THEN o app SHALL renderizar o fallback e SHALL NOT tentar inicializar o SDK nativo.

**Requisitos**: `ADS-01` … `ADS-07`

---

## Guardrails / Business rules

| ID | Regra | Nota |
|----|-------|------|
| BR-ADS-01 | Não mostrar interstitial antes/depois de "I did it" | Mantém o espírito do BR-004 da Completion. |
| BR-ADS-02 | Banner não pode bloquear CTAs principais | Sem sobreposição ou sticky agressivo. |
| BR-ADS-03 | Ads devem ser opt-out via env flag | Permite desativar rapidamente em builds. |

---

## Requisitos consolidados (IDs rastreáveis)

| ID | Descrição | Prioridade | Status |
|----|-----------|------------|--------|
| ADS-01 | Integrar `react-native-google-mobile-ads` (Expo SDK 54) | P0 | Draft |
| ADS-02 | Configurar plugin Expo com AdMob App IDs (iOS/Android) | P0 | Draft |
| ADS-03 | Provider para inicialização única do SDK (guard por plataforma/ambiente) | P0 | Draft |
| ADS-04 | Componente `AdBanner` com fallback (`AdBannerShell`) | P0 | Draft |
| ADS-05 | Variáveis `EXPO_PUBLIC_*` para ad unit ids + flag enable/disable | P0 | Draft |
| ADS-06 | Mostrar banner na Today (ponto existente) | P0 | Draft |
| ADS-07 | Docs: setup + dev/prod + EAS build + limitações (Expo Go) | P0 | Draft |
| ADS-08 | (deferred) Consent (GDPR/EEA) via UMP | P2 | Deferred |

---

## Critérios de aceite (feature "feito")

- [ ] **CA-ADS-01**: Android/iOS (dev build EAS) mostra banner usando test ad unit id. *(smoke manual — ver [verification.md](verification.md))*
- [x] **CA-ADS-02**: Expo Go e Web não crasham e renderizam fallback.
- [ ] **CA-ADS-03**: `EXPO_PUBLIC_ADS_ENABLED=false` desliga ads e mantém layout. *(smoke manual opcional)*
- [x] **CA-ADS-04**: `npm run gate` passa.

