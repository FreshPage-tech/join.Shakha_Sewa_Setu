create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  marketing_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_user_settings_updated_at on public.user_settings;
create trigger trg_user_settings_updated_at
before update on public.user_settings
for each row
execute function public.set_updated_at();
alter table public.user_settings enable row level security;
drop policy if exists user_settings_self_select on public.user_settings;
create policy user_settings_self_select on public.user_settings
for select
using (auth.uid() = user_id);
drop policy if exists user_settings_self_insert on public.user_settings;
create policy user_settings_self_insert on public.user_settings
for insert
with check (auth.uid() = user_id);
drop policy if exists user_settings_self_update on public.user_settings;
create policy user_settings_self_update on public.user_settings
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
