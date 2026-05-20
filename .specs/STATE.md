# STATE — memória persistente entre sessões

Atualizar este arquivo ao fim de cada sessão relevante de implementação ou decisão de arquitetura.

## Fase TLC

- **Atual:** Specify + Design + Tasks preparados para v0.1 MVP.
- **Próximo:** Execute — bootstrap Expo + Supabase conforme `.specs/features/v0.1-mvp/tasks.md`.

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

## Bloqueios

- Nenhum (código ainda não iniciado).

## Última atualização

- Criação inicial da estrutura TLC Spec-Driven alinhada a `kindspark.md`.
