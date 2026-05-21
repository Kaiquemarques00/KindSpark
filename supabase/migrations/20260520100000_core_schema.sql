-- T-010 / T-011: core tables, indexes, auth profile trigger

create extension if not exists pgcrypto with schema extensions;

-- Catalog of kindness actions (global, read via RLS)
create table public.actions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 120),
  description text not null check (char_length(trim(description)) between 1 and 500),
  category text not null check (char_length(trim(category)) between 1 and 50),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index actions_active_category_idx on public.actions (active, category)
  where active = true;

-- Mirror of auth.users
create table public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- Done / skip logs
create table public.user_action_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  action_id uuid not null references public.actions (id) on delete restrict,
  status text not null check (status in ('done', 'skipped')),
  action_date date not null,
  created_at timestamptz not null default now()
);

create index user_action_logs_user_id_action_date_idx
  on public.user_action_logs (user_id, action_date desc);

create index user_action_logs_user_id_status_date_idx
  on public.user_action_logs (user_id, status, action_date desc);

-- Daily notification preferences (one row per user)
create table public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  notification_time time not null default '09:00:00',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Active suggestion per user per calendar day
create table public.user_daily_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  action_id uuid not null references public.actions (id) on delete restrict,
  suggestion_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_daily_suggestions_user_date_unique unique (user_id, suggestion_date)
);

create index user_daily_suggestions_user_id_date_idx
  on public.user_daily_suggestions (user_id, suggestion_date);

-- Optional: Expo push token for future remote push
create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  expo_push_token text not null check (char_length(trim(expo_push_token)) between 1 and 255),
  updated_at timestamptz not null default now()
);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger notification_preferences_updated_at
  before update on public.notification_preferences
  for each row execute function public.set_updated_at();

create trigger user_daily_suggestions_updated_at
  before update on public.user_daily_suggestions
  for each row execute function public.set_updated_at();

create trigger push_tokens_updated_at
  before update on public.push_tokens
  for each row execute function public.set_updated_at();

-- Create profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
