-- Tracks every action shown to a user on a given day (for "Another idea" without repeats)

create table public.user_daily_suggestion_seen (
  user_id uuid not null references auth.users (id) on delete cascade,
  suggestion_date date not null,
  action_id uuid not null references public.actions (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, suggestion_date, action_id)
);

create index user_daily_suggestion_seen_user_date_idx
  on public.user_daily_suggestion_seen (user_id, suggestion_date);

alter table public.user_daily_suggestion_seen enable row level security;

create policy user_daily_suggestion_seen_select_own
  on public.user_daily_suggestion_seen
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy user_daily_suggestion_seen_insert_own
  on public.user_daily_suggestion_seen
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

grant select, insert on public.user_daily_suggestion_seen to authenticated;
