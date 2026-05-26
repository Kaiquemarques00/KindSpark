# Stack — KindSpark v0.1

Stack sugerida em `kindspark.md`, adotada como baseline até revisão em `STATE.md`.

| Camada | Tecnologia |
|--------|------------|
| Mobile | React Native + Expo (SDK 54) |
| Linguagem | TypeScript |
| Navegação | Expo Router (file-based) |
| UI | Tokens em `constants/theme`; `@expo-google-fonts/inter`; `expo-linear-gradient` |
| Backend / DB / Auth | Supabase (PostgreSQL, Auth, RLS) |
| Push | Expo Notifications (+ token em Supabase) |
| Estado local / offline | AsyncStorage para cache da sugestão do dia + fila de sync |

## Premissas

- API mínima: Supabase client + RLS para dados do usuário autenticado.
- Catálogo de 50 ações: seed em migration (`actions`), sem IA.
- Auth: email/senha (decidido — ver `STATE.md`).
- Analytics: eventos mínimos (Expo ou provedor leve) para métricas de validação.

## Não incluído na v0.1

Firebase (opcional se Expo Notifications não bastar em produção), backend custom além de Edge Functions pontuais (ex.: agendar push em escala futura).
