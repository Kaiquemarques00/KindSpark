# ROADMAP — KindSpark

## Milestone M0 — Fundação do repositório

- App Expo + TypeScript + estrutura de pastas.
- Projeto Supabase dev + migrations versionadas.
- CI mínimo (lint + typecheck).
- `.env.example` documentado.

## Milestone M1 — Identidade e onboarding

- Auth (conta simples).
- Onboarding: escolha de horário da notificação (< 2 min, RNF-003).
- Registro de preferência de push (`notification_preferences`).

## Milestone M2 — Loop principal (core MVP)

- Sugestão diária (RF-001) a partir do banco curado.
- Trocar sugestão manualmente (RF-002).
- Marcar "I did it" / "Skip" (RF-003, RF-004).
- Streak diário (RF-005).
- Mensagens motivacionais em milestones (3, 7, 14, 30 dias).

## Milestone M3 — Histórico e retenção

- Histórico recente de ações (RF-006).
- Push diário configurável (RF-007).
- Cache offline da sugestão do dia + fila de sync ao reconectar (RNF-004 parcial).

## Milestone M4 — Polimento e validação

- RNF: abertura < 3s, UI minimalista.
- Instrumentação de métricas (ativação, DAU, completion, skip, streak).
- Testes em dispositivo físico (iOS + Android).
- README: rodar local, build preview, variáveis de ambiente.

## Pós v0.1 (backlog de produto)

| Versão | Foco |
|--------|------|
| v0.2 | Sugestões enviadas por usuários, curadoria, categorias |
| v0.3 | IA para ideias e personalização |
| v0.4 | Social sharing, comunidade, votação |
| v0.5 | Gamificação expandida, achievements, desafios sazonais |
