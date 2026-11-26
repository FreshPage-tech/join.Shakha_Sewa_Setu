create or replace function public.get_auth_user_by_phone(p_phone text)
returns table (
  id uuid,
  email text,
  phone text
)
language sql
security definer
set search_path = public, auth
as $$
  with normalized as (
    select regexp_replace(coalesce(p_phone, ''), '\\D', '', 'g') as digits
  )
  select u.id, u.email, u.phone
  from auth.users u
  cross join normalized n
  where u.phone = p_phone
     or regexp_replace(coalesce(u.phone, ''), '\\D', '', 'g') = n.digits
     or regexp_replace(coalesce(u.raw_user_meta_data ->> 'phone', ''), '\\D', '', 'g') = n.digits
  order by u.created_at desc
  limit 1;
$$;
revoke all on function public.get_auth_user_by_phone(text) from public;
grant execute on function public.get_auth_user_by_phone(text) to service_role;
