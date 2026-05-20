# Tasks — v0.1 MVP (atomic + verificação)

Legenda: **[P]** paralelizável na mesma fase; deps por ID.

---

## Fase E0 — Bootstrap

| ID | Task | Deps | Verificação |
|----|------|------|-------------|
| T-001 | Inicializar Expo + TypeScript + Expo Router | — | `npx expo start` ok |
| T-002 | Conectar Supabase client (`.env.example`) | T-001 | Sessão dev autentica |
| T-003 | CI: lint + typecheck | T-001 | Pipeline verde |
| T-004 | Estrutura de pastas conforme `design.md` | T-001 | Rotas base navegam |

---

## Fase E1 — Schema, seed e RLS

| ID | Task | Deps | Verificação |
|----|------|------|-------------|
| T-010 | Migration: `user_profiles`, `actions`, `user_action_logs`, `notification_preferences` | T-002 | `supabase db reset` local ok |
| T-011 | Migration: `user_daily_suggestions` + índices/unique | T-010 | — |
| T-012 | Seed: 50 ações curadas | T-010 | `SELECT count(*) FROM actions` = 50 |
| T-013 | Policies RLS conforme `design.md` | T-010–T-011 | Dois usuários isolados manualmente |
| T-014 | Query/RPC: sortear sugestão excluindo já usada no dia | T-012, T-013 | Nova sugestão diferente após refresh |

---

## Fase E2 — Auth e onboarding

| ID | Task | Deps | Verificação |
|----|------|------|-------------|
| T-020 | Telas login/registro/logout | T-002, T-004 | Fluxo auth completo |
| T-021 | Onboarding: horário + salvar `notification_preferences` (RF-007, RNF-003) | T-020, T-013 | < 2 min até primeira sugestão |
| T-022 | Solicitar permissão push + agendar notificação local | T-021 | Notificação dispara no horário de teste |
| T-023 | Guard: não autenticado → auth; sem onboarding → onboarding | T-020 | Deep links respeitam estado |

---

## Fase E3 — Loop Today (core)

| ID | Task | Deps | Verificação |
|----|------|------|-------------|
| T-030 | Carregar/criar sugestão do dia (RF-001) | T-014, T-021 | Sugestão aparece na abertura |
| T-031 | Botão "Another idea" (RF-002, HU-002) | T-030 | Nova ação sem done automático |
| T-032 | "I did it" → log `done` (RF-003, HU-003) | T-030 | Histórico e streak atualizam |
| T-033 | "Skip" → log `skipped` (RF-004, HU-004) | T-030 | Skip no histórico; streak não incrementa |
| T-034 | Regra: um done por dia conta streak; não duplicar done | T-032 | Segundo done mesmo dia tratado |

---

## Fase E4 — Progresso e histórico

| ID | Task | Deps | Verificação |
|----|------|------|-------------|
| T-040 | Cálculo e UI de streak (RF-005, HU-005) | T-032 | 2 dias done consecutivos → streak 2 |
| T-041 | Milestones 3/7/14/30 + copy motivacional (RF-008) | T-040 | Mensagem ao cruzar 3 dias |
| T-042 | Tela histórico recente (RF-006, HU-006) | T-032, T-033 | Lista com ação, data, status |
| T-043 | Empty states e microcopy minimalista (RNF-002) | T-030, T-042 | — |

---

## Fase E5 — Offline, settings e polimento

| ID | Task | Deps | Verificação |
|----|------|------|-------------|
| T-050 | Cache sugestão + fila sync done/skip (RNF-004) | T-032, T-033 | Avião mode: done sync ao online |
| T-051 | Settings: alterar horário/notificação on-off | T-022, T-021 | Novo horário reflete no agendamento |
| T-052 | Performance: cold start < 3s alvo (RNF-001) | T-030 | Medição manual documentada |
| T-053 | Instrumentar eventos da spec | T-030, T-032 | Eventos em log/analytics |
| T-054 | README: Expo + Supabase local + EAS preview | T-001 | Novo dev segue doc |

---

## Ordem sugerida (Execute)

`E0 → E1 → E2 → E3 → E4 → E5`

Paralelização: após T-013, T-020 pode avançar em paralelo a refinamentos de migration sem breaking changes.

---

## Definition of Done (release v0.1)

- Todos os critérios de aceite em `spec.md` marcados.
- RLS validada com dois usuários.
- Push local testado em dispositivo físico.
- Decisões em `STATE.md` resolvidas ou limitações documentadas.
- Métricas mínimas instrumentadas para validação do hábito.
