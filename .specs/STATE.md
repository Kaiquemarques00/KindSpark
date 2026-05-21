# STATE — memória persistente entre sessões

Atualizar este arquivo ao fim de cada sessão relevante de implementação ou decisão de arquitetura.

## Fase TLC

- **Atual:** Execute — fase E5 (offline, settings, polimento) concluída.
- **Próximo:** Release v0.1 — validar critérios de aceite em `spec.md`, medição cold start em `docs/PERFORMANCE.md`, preview EAS.

## Decisões abertas (resolver na primeira sprint de Execute)

1. **Auth:** email/senha vs. magic link only — impacto no onboarding mobile.
2. **"Dia" do streak:** timezone do dispositivo vs. UTC fixo — recomendação inicial: timezone local do usuário (documentar edge case de viagem).
3. **Sugestão diária:** uma por `calendar_date` fixa por usuário vs. permitir múltiplas trocas no mesmo dia (recomendação: uma sugestão "ativa" por dia; trocas substituem a ativa sem contar como done).
4. **Skip e streak:** skip não incrementa streak mas não quebra? (recomendação: só `done` conta para streak; skip não quebra streak existente, mas não avança).
5. **Offline:** apenas leitura da última sugestão + fila de logs pendentes vs. full read-only do histórico.

## Decisões tomadas

- Stack baseline: Expo + Supabase + Expo Notifications (`STACK.md`).
- Escopo v0.1 limitado a `kindspark.md` (sem IA, social, web).
- Banco de 50 ações curadas via seed migration.
- Loop MVP obrigatório: sugestão → done/skip → streak → notificação → histórico.
- Para Auth email/senha.
- Dia do streak deve ter o timezone do dispositivo.
- Sugestão diária - uma sugestão "ativa" por dia; trocas substituem a ativa sem contar como done.
- Skip e streak dever só `done` conta para streak; skip não quebra streak existente, mas não avança.
- Sistem offline deve apenas fazer a leitura da última sugestão e a fila de logs pendentes.

## Bloqueios

- Nenhum.

## Última atualização

- E0 bootstrap: Expo SDK 54 + Router, rotas `(auth)` / `(onboarding)` / `(tabs)`, client Supabase, CI lint/typecheck.
- E1 database: migrations em `supabase/migrations/` (tabelas, RLS, 50 ações seed, RPC `get_or_create_daily_suggestion` / `refresh_daily_suggestion`). Timezone do dia: **local do dispositivo** (`toLocalDateString` no client). Tabela `user_daily_suggestion_seen` evita repetir ação no mesmo dia ao trocar sugestão.
- E2 auth/onboarding: email/senha (login, registro, logout), `AppSessionProvider` + guards em `index` e layouts, onboarding salva `notification_preferences`, `expo-notifications` agenda lembrete diário local, deep link da notificação → `/(tabs)`.
- E3 loop Today: tela `TodayScreen` carrega/cria sugestão (`get_or_create_daily_suggestion`), "Another idea" (`refresh_daily_suggestion`), "I did it" / "Skip" (`log_action_done` idempotente + insert skip), índice único parcial um `done` por dia (T-034).
- E4 progresso/histórico: streak calculado no client a partir de `done` nos últimos 90 dias (`computeStreak`, timezone local); aba Progress com milestones 3/7/14/30 (mensagem única por dia via AsyncStorage); aba History com lista recente (ação, data, status).
- E5 offline/settings: cache de sugestão + fila done/skip (`lib/offline/`, NetInfo + sync ao reconectar); Settings com horário e toggle de notificação; analytics mínimo (`lib/analytics/track.ts`); README + `docs/PERFORMANCE.md` para onboarding de dev e medição cold start.
