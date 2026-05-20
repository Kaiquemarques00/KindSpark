# Design técnico — v0.1 MVP

## Visão arquitetural

```
[Expo App — React Native + TS]
        |
        +-- Expo Notifications (local + push token)
        |
        v
[Supabase: Auth | PostgREST | RLS]
        |
   [PostgreSQL]
```

- **RLS** em todas as tabelas de domínio; policies `user_id = auth.uid()`.
- Sem backend custom obrigatório; Edge Function opcional apenas para push server-side em escala futura (v0.1: agendamento local via Expo).

## Módulos do app (sugerido)

| Área | Responsabilidade |
|------|-------------------|
| `auth` | Login, registro, sessão Supabase |
| `onboarding` | Horário de notificação, permissão push |
| `today` | Sugestão do dia, done/skip, refresh |
| `progress` | Streak, milestones, mensagens motivacionais |
| `history` | Lista recente de logs |
| `settings` | Notificação on/off, horário, logout |
| `offline` | Cache da sugestão + fila de mutações |

## Navegação (Expo Router)

```
app/
  (auth)/
    login.tsx
    register.tsx
  (onboarding)/
    notification-time.tsx
  (tabs)/
    index.tsx          # Today — sugestão + ações
    progress.tsx       # Streak + milestones
    history.tsx        # Histórico
    settings.tsx       # Preferências
```

Fluxo primeira abertura: `(auth)` → `(onboarding)` → `(tabs)`.

## Banco de dados e RLS

### Tabelas

```sql
-- actions (catálogo global, leitura pública para autenticados)
-- user_profiles (id = auth.users.id, email, created_at)
-- user_daily_suggestions (user_id, action_id, suggestion_date)
-- user_action_logs (user_id, action_id, status, action_date, created_at)
-- notification_preferences (user_id, notification_time, enabled)
-- push_tokens (opcional v0.1: user_id, expo_push_token, updated_at)
```

### Policies (diretrizes)

1. `actions`: `SELECT` para `authenticated`.
2. Demais tabelas: `SELECT/INSERT/UPDATE` apenas onde `user_id = auth.uid()`.
3. Índices: `(user_id, action_date DESC)` em logs; `(user_id, suggestion_date)` único em daily suggestions.

### Seed

- Migration com 50 ações categorizadas (gentileza, gratidão, saúde, conexão, etc.).
- Função SQL ou query client: sortear ação `active` excluindo ids já usados na `suggestion_date` atual.

## Streak (cálculo)

- **Opção A (recomendada v0.1):** view ou função RPC `get_user_streak(user_id)` que percorre `action_date` consecutivos com `done`.
- **Opção B:** calcular no client a partir dos últimos N logs (aceitável se N ≤ 90 dias).

Documentar timezone em `STATE.md` ao implementar.

## Notificações

1. Onboarding solicita permissão (`expo-notifications`).
2. Agendar notificação local diária com `notification_time` (HH:mm) do usuário.
3. Ao abrir app via notificação, deep link para tela Today.
4. Persistir token Expo em `push_tokens` se for usar push remoto depois; v0.1 pode ser só local scheduled.

## Offline (RNF-004)

| Cenário | Comportamento |
|---------|----------------|
| Abrir app offline | Mostrar última `user_daily_suggestions` + texto da ação em cache (AsyncStorage) |
| Done/Skip offline | Enfileirar em fila local; sync ao reconectar (insert com `action_date` do dia local) |
| Histórico offline | Últimos N logs em cache; refresh ao online |

Conflito: se já existe log `done` no servidor para o dia, descartar duplicata na sync.

## Segurança

- Anon key no app; service role só em CI/migrations.
- Validar tamanho de campos; rate limit implícito via RLS (sem inserts alheios).

## UX (diretrizes)

- Tela Today: título da ação, descrição curta, botões primário "I did it" e secundário "Skip", link "Another idea".
- Progress: número grande do streak + copy "7-day kindness streak".
- Paleta calma, tipografia legível, animações mínimas.

## Deploy e ambientes

- **Supabase:** projeto dev + prod; `supabase/migrations`.
- **Mobile:** EAS Build para preview/TestFlight/Play Internal; variáveis `EXPO_PUBLIC_SUPABASE_URL` e `ANON_KEY`.
