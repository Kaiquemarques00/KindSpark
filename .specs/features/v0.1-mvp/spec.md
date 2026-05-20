# Feature spec — v0.1 MVP (KindSpark)

## Meta

Entregar o fluxo principal mobile: conta → horário de notificação → sugestão diária → "I did it" ou "Skip" → streak + histórico → retorno no dia seguinte via push.

Validar hipótese de hábito positivo com simplicidade extrema.

## Personas e histórias (rastreio)

| ID | História |
|----|----------|
| HU-001 | Receber sugestão diária simples |
| HU-002 | Solicitar nova sugestão se a atual não servir |
| HU-003 | Marcar ação como completa |
| HU-004 | Pular ação sem bloqueio |
| HU-005 | Visualizar streak |
| HU-006 | Ver histórico do que já fiz |
| HU-007 | Receber lembretes diários configuráveis |

## Requisitos funcionais

| ID | Descrição | Prioridade |
|----|-----------|------------|
| RF-001 | Exibir uma sugestão diária do catálogo curado | P0 |
| RF-002 | Permitir trocar sugestão manualmente (nova aleatória do catálogo) | P0 |
| RF-003 | Registrar conclusão ("I did it") | P0 |
| RF-004 | Registrar skip | P0 |
| RF-005 | Exibir streak atual (dias consecutivos com pelo menos um `done`) | P0 |
| RF-006 | Mostrar histórico recente (ação, data, status) | P0 |
| RF-007 | Configurar horário e habilitar/desabilitar notificação push | P0 |
| RF-008 | Mensagem motivacional ao atingir milestones de streak (3, 7, 14, 30) | P1 |

## Regras de negócio

1. **Catálogo:** 50 ações em `actions` com `active = true`; sem IA na v0.1.
2. **Sugestão do dia:** por usuário e `calendar_date` (timezone local), uma sugestão ativa; trocar substitui a ativa sem registrar done/skip automaticamente.
3. **Done:** cria `user_action_logs` com `status = done`; conta para streak do dia.
4. **Skip:** cria log com `status = skipped`; não conta para streak; não penaliza streak anterior.
5. **Streak:** dias consecutivos em que existe pelo menos um `done` por `calendar_date`; gap de um dia sem `done` zera streak.
6. **Milestones:** ao cruzar 3, 7, 14 ou 30 dias de streak, exibir mensagem motivacional única por milestone (não repetir na mesma sessão do dia).
7. **Notificação:** texto padrão tipo "Your good action for today is waiting ✨"; horário em `notification_preferences`.
8. **Privacidade:** usuário só acessa próprios logs e preferências (RLS).

## Requisitos não funcionais

| ID | Descrição |
|----|-------------|
| RNF-001 | App abre em < 3s em dispositivo médio |
| RNF-002 | Interface extremamente simples (poucas telas, hierarquia clara) |
| RNF-003 | Onboarding até primeira sugestão em < 2 min |
| RNF-004 | Funcionar offline parcialmente: ver sugestão em cache; enfileirar done/skip para sync |

## Modelo de dados (lógico)

Alinhado a `kindspark.md`:

- `users` — espelho/extensão de `auth.users` (id, email, created_at).
- `actions` — id, title, description, category, active.
- `user_action_logs` — id, user_id, action_id, status (`done` \| `skipped`), created_at, `action_date` (date normalizada).
- `notification_preferences` — id, user_id, notification_time, enabled.
- `user_daily_suggestions` (recomendado) — user_id, action_id, suggestion_date, created_at — rastreia sugestão ativa do dia e evita repetir a mesma ação no mesmo dia se possível.

## Métricas / eventos (instrumentação mínima)

- `app_installed` / `onboarding_completed`
- `daily_suggestion_shown`
- `action_done` / `action_skipped`
- `suggestion_refreshed`
- `streak_milestone_reached` (3, 7, 14, 30)
- `notification_enabled` / `notification_opened`

## Critérios de aceite (MVP "feito")

- [ ] Usuário novo: conta → escolhe horário → vê primeira sugestão em < 2 min.
- [ ] "I did it" persiste e aparece no histórico com data e status.
- [ ] "Skip" persiste sem bloquear uso nem quebrar streak por si só.
- [ ] Trocar sugestão mostra outra ação do catálogo (sem repetir a mesma no mesmo dia, se catálogo permitir).
- [ ] Streak incrementa em dias consecutivos com `done`; zera após dia sem `done`.
- [ ] Push dispara no horário configurado (teste em dev/build preview).
- [ ] Offline: sugestão em cache visível; done/skip sincroniza ao voltar online.
- [ ] Usuário A não vê dados do usuário B (RLS).

## Fora desta spec

IA, social, ranking, comunidade, monetização, web — conforme `kindspark.md`.
