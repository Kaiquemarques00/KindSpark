-- T-013: Row Level Security

alter table public.actions enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_action_logs enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.user_daily_suggestions enable row level security;
alter table public.push_tokens enable row level security;

-- actions: authenticated users can read the catalog
create policy actions_select_authenticated
  on public.actions
  for select
  to authenticated
  using (true);

-- user_profiles: own row only
create policy user_profiles_select_own
  on public.user_profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

create policy user_profiles_update_own
  on public.user_profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- user_action_logs
create policy user_action_logs_select_own
  on public.user_action_logs
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy user_action_logs_insert_own
  on public.user_action_logs
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- notification_preferences
create policy notification_preferences_select_own
  on public.notification_preferences
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy notification_preferences_insert_own
  on public.notification_preferences
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy notification_preferences_update_own
  on public.notification_preferences
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- user_daily_suggestions
create policy user_daily_suggestions_select_own
  on public.user_daily_suggestions
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy user_daily_suggestions_insert_own
  on public.user_daily_suggestions
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy user_daily_suggestions_update_own
  on public.user_daily_suggestions
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- push_tokens
create policy push_tokens_select_own
  on public.push_tokens
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy push_tokens_insert_own
  on public.push_tokens
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy push_tokens_update_own
  on public.push_tokens
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Grants for PostgREST / client
grant usage on schema public to anon, authenticated;

grant select on public.actions to authenticated;

grant select, update on public.user_profiles to authenticated;

grant select, insert on public.user_action_logs to authenticated;

grant select, insert, update on public.notification_preferences to authenticated;

grant select, insert, update on public.user_daily_suggestions to authenticated;

grant select, insert, update on public.push_tokens to authenticated;
