# Supabase — KindSpark

## Local development (requires Docker Desktop)

```bash
npx supabase start
npx supabase db reset   # applies migrations + seed (50 actions)
npx supabase status     # API URL + anon key for .env
```

Copy local keys into `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase status>
```

## Migrations (order)

| File | Task |
|------|------|
| `20260520100000_core_schema.sql` | T-010, T-011 — tables + triggers |
| `20260520105000_suggestion_seen.sql` | Seen actions per day (no repeat on refresh) |
| `20260520110000_rls_policies.sql` | T-013 — RLS |
| `20260520120000_seed_actions.sql` | T-012 — 50 actions |
| `20260520130000_rpc_daily_suggestion.sql` | T-014 — RPC |
| `20260521100000_one_done_per_day.sql` | T-034 — one `done` per day + `log_action_done` |

## Verify after reset

```sql
select count(*) from public.actions;  -- expect 50

-- As authenticated user (SQL editor or app):
select * from public.get_or_create_daily_suggestion(current_date);
select * from public.refresh_daily_suggestion(current_date);
-- second call should return a different action_id when catalog allows
```

## Remote project

```bash
npx supabase link --project-ref <your-ref>
npx supabase db push
```
