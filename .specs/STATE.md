# STATE — memória persistente entre sessões

Atualizar este arquivo ao fim de cada sessão relevante de implementação ou decisão de arquitetura.

## Fase TLC

- **Atual:** `redesign-ui` — Execute concluído (R7 + UAT manual, 2026-05-25).
- **Próximo:** Release v0.1 — medição cold start em `docs/PERFORMANCE.md`, preview EAS, teste informal “acolhedor/leve” (opcional).

## Decisões tomadas

- Stack baseline: Expo + Supabase + Expo Notifications (`STACK.md`).
- Escopo v0.1 limitado a `kindspark.md` (sem IA, social, web).
- Banco de 50 ações curadas via seed migration.
- Loop MVP obrigatório: sugestão → done/skip → streak → notificação → histórico.
- Auth: email/senha.
- Dia do streak: timezone local do dispositivo (`toLocalDateString` no client).
- Sugestão diária: uma sugestão ativa por dia; trocas substituem sem contar como done.
- Skip e streak: só `done` conta; skip não quebra streak existente.
- Offline: leitura da última sugestão + fila de logs pendentes.
- UI redesign: tokens + Inter + componentes compartilhados; copy 100% EN nas telas em escopo; hooks de dados (`useTodayLoop`, `useProgress`, `useHistory`, `useSettings`) preservados.

## Bloqueios

- Nenhum.

## Deferred

- Teste informal ≥ 3/5 usuários descrevendo app como “acolhedora/leve” — pós-release.
- `redesign-ui-phase-2`: completion screen, modais, skin auth (ver `spec.md` Out of Scope).

## Última atualização

- **redesign-ui (2026-05-25):** Design system (tokens, Inter, `expo-linear-gradient`), primitivos UI, onboarding welcome + value, tab bar, Today / Progress / History / Settings redesenhados; ilustrações e a11y; gate verde; UAT manual MVP + CA-* sem regressão RF-001…RF-007.
- **v0.1 MVP (E0–E5):** Expo SDK 54 + Router; Supabase migrations + RLS + RPCs; auth/onboarding/notificações; loop Today; Progress/History; offline cache + Settings; analytics mínimo; `docs/PERFORMANCE.md`.
