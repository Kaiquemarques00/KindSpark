-- T-034: at most one `done` log per user per calendar day (streak day)

create unique index user_action_logs_one_done_per_day_idx
  on public.user_action_logs (user_id, action_date)
  where (status = 'done');

create or replace function public.log_action_done(
  p_action_id uuid,
  p_action_date date default (current_date)
)
returns public.user_action_logs
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_row public.user_action_logs;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select *
  into v_row
  from public.user_action_logs
  where user_id = v_user_id
    and action_date = p_action_date
    and status = 'done'
  limit 1;

  if found then
    return v_row;
  end if;

  insert into public.user_action_logs (user_id, action_id, status, action_date)
  values (v_user_id, p_action_id, 'done', p_action_date)
  returning * into v_row;

  return v_row;
exception
  when unique_violation then
    select *
    into v_row
    from public.user_action_logs
    where user_id = v_user_id
      and action_date = p_action_date
      and status = 'done'
    limit 1;

    return v_row;
end;
$$;

grant execute on function public.log_action_done(uuid, date) to authenticated;
