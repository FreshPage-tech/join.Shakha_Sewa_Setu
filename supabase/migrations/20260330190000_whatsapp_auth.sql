create table if not exists public.whatsapp_otp_codes (
  phone text primary key,
  otp_hash text not null,
  expires_at timestamptz not null,
  send_attempts integer not null default 1,
  verify_attempts integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_whatsapp_otp_codes_expires_at
  on public.whatsapp_otp_codes (expires_at);
alter table public.whatsapp_otp_codes enable row level security;
drop policy if exists "service role can manage whatsapp otp codes" on public.whatsapp_otp_codes;
create policy "service role can manage whatsapp otp codes"
  on public.whatsapp_otp_codes
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
drop function if exists public.get_auth_user_by_phone(text);
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
  select u.id, u.email, u.phone
  from auth.users u
  where u.phone = p_phone
  limit 1;
$$;
revoke all on function public.get_auth_user_by_phone(text) from public;
grant execute on function public.get_auth_user_by_phone(text) to service_role;
