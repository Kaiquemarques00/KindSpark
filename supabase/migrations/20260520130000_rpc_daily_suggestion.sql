-- T-014: RPC to get or refresh daily suggestion (excludes actions already used that day)

create or replace function public.pick_random_action_for_date(
  p_user_id uuid,
  p_suggestion_date date,
  p_exclude_action_id uuid default null
)
returns uuid
language plpgsql
stable
set search_path = public
as $$
declare
  v_action_id uuid;
begin
  select a.id into v_action_id
  from public.actions a
  where a.active = true
    and a.id is distinct from p_exclude_action_id
    and a.id not in (
      select seen.action_id
      from public.user_daily_suggestion_seen seen
      where seen.user_id = p_user_id
        and seen.suggestion_date = p_suggestion_date
    )
  order by random()
  limit 1;

  if v_action_id is not null then
    return v_action_id;
  end if;

  -- All catalog actions were tried today: allow any active action except current
  select a.id into v_action_id
  from public.actions a
  where a.active = true
    and a.id is distinct from p_exclude_action_id
  order by random()
  limit 1;

  return v_action_id;
end;
$$;

create or replace function public.record_suggestion_seen(
  p_user_id uuid,
  p_suggestion_date date,
  p_action_id uuid
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.user_daily_suggestion_seen (user_id, suggestion_date, action_id)
  values (p_user_id, p_suggestion_date, p_action_id)
  on conflict do nothing;
end;
$$;

create or replace function public.get_or_create_daily_suggestion(
  p_suggestion_date date default (current_date)
)
returns table (
  suggestion_id uuid,
  action_id uuid,
  suggestion_date date,
  title text,
  description text,
  category text,
  created_at timestamptz
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_action_id uuid;
  v_suggestion_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select uds.id, uds.action_id
  into v_suggestion_id, v_action_id
  from public.user_daily_suggestions uds
  where uds.user_id = v_user_id
    and uds.suggestion_date = p_suggestion_date;

  if v_action_id is not null then
    return query
    select
      uds.id,
      a.id,
      uds.suggestion_date,
      a.title,
      a.description,
      a.category,
      uds.created_at
    from public.user_daily_suggestions uds
    inner join public.actions a on a.id = uds.action_id
    where uds.id = v_suggestion_id;
    return;
  end if;

  v_action_id := public.pick_random_action_for_date(v_user_id, p_suggestion_date);

  if v_action_id is null then
    raise exception 'No active actions in catalog' using errcode = 'P0001';
  end if;

  insert into public.user_daily_suggestions (user_id, action_id, suggestion_date)
  values (v_user_id, v_action_id, p_suggestion_date)
  returning id into v_suggestion_id;

  perform public.record_suggestion_seen(v_user_id, p_suggestion_date, v_action_id);

  return query
  select
    v_suggestion_id,
    a.id,
    p_suggestion_date,
    a.title,
    a.description,
    a.category,
    now()
  from public.actions a
  where a.id = v_action_id;
end;
$$;

create or replace function public.refresh_daily_suggestion(
  p_suggestion_date date default (current_date)
)
returns table (
  suggestion_id uuid,
  action_id uuid,
  suggestion_date date,
  title text,
  description text,
  category text,
  created_at timestamptz
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_current_action_id uuid;
  v_new_action_id uuid;
  v_suggestion_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select uds.id, uds.action_id
  into v_suggestion_id, v_current_action_id
  from public.user_daily_suggestions uds
  where uds.user_id = v_user_id
    and uds.suggestion_date = p_suggestion_date;

  v_new_action_id := public.pick_random_action_for_date(
    v_user_id,
    p_suggestion_date,
    v_current_action_id
  );

  if v_new_action_id is null then
    raise exception 'No active actions in catalog' using errcode = 'P0001';
  end if;

  if v_suggestion_id is null then
    insert into public.user_daily_suggestions (user_id, action_id, suggestion_date)
    values (v_user_id, v_new_action_id, p_suggestion_date)
    returning id into v_suggestion_id;
  else
    perform public.record_suggestion_seen(v_user_id, p_suggestion_date, v_current_action_id);

    update public.user_daily_suggestions
    set action_id = v_new_action_id,
        updated_at = now()
    where id = v_suggestion_id;
  end if;

  perform public.record_suggestion_seen(v_user_id, p_suggestion_date, v_new_action_id);

  return query
  select
    uds.id,
    a.id,
    uds.suggestion_date,
    a.title,
    a.description,
    a.category,
    uds.created_at
  from public.user_daily_suggestions uds
  inner join public.actions a on a.id = uds.action_id
  where uds.id = v_suggestion_id;
end;
$$;

grant execute on function public.get_or_create_daily_suggestion(date) to authenticated;
grant execute on function public.refresh_daily_suggestion(date) to authenticated;

-- pick_random_action_for_date is internal; no grant to clients
