# Stack — KindSpark v0.1

Stack sugerida em `kindspark.md`, adotada como baseline até revisão em `STATE.md`.

| Camada | Tecnologia |
|--------|------------|
| Mobile | React Native + Expo (SDK estável LTS) |
| Linguagem | TypeScript |
| Navegação | Expo Router (file-based) |
| Backend / DB / Auth | Supabase (PostgreSQL, Auth, RLS) |
| Push | Expo Notifications (+ token em Supabase) |
| Estado local / offline | AsyncStorage ou SQLite (Expo) para cache da sugestão do dia |

## Premissas

- API mínima: Supabase client + RLS para dados do usuário autenticado.
- Catálogo de 50 ações: seed em migration (`actions`), sem IA.
- Auth: email/senha ou magic link (decidir em `STATE.md` na Execute).
- Analytics: eventos mínimos (Expo ou provedor leve) para métricas de validação.

## Não incluído na v0.1

Firebase (opcional se Expo Notifications não bastar em produção), backend custom além de Edge Functions pontuais (ex.: agendar push em escala futura).
