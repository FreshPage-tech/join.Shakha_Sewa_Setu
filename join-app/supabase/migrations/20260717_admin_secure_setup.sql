-- Secure storage for Shakha Sewa Setu admin panel.
-- Run this migration in your Supabase project.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  mobile text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.interested_people (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  mobile text not null,
  age text,
  gender text,
  occupation text,
  state text not null,
  city text not null,
  zip text not null,
  preferred_distance text,
  interests text[] not null default '{}',
  selected_shakha text,
  no_shakha_nearby boolean not null default false,
  preferred_day text,
  comments text
);

create table if not exists public.shakhas_admin (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  address text not null,
  state text not null,
  city text not null,
  vibhag text,
  bhag text,
  zip_code text,
  map_link text,
  day text,
  time text,
  contact_1_name text,
  contact_1_mobile text,
  contact_1_email text,
  contact_2_name text,
  contact_2_mobile text,
  contact_2_email text,
  contact_3_name text,
  contact_3_mobile text,
  contact_3_email text
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_shakhas_admin_set_updated_at on public.shakhas_admin;
create trigger trg_shakhas_admin_set_updated_at
before update on public.shakhas_admin
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.interested_people enable row level security;
alter table public.shakhas_admin enable row level security;

-- Public inserts allowed for interest registration only.
drop policy if exists interested_people_insert_public on public.interested_people;
create policy interested_people_insert_public
on public.interested_people
for insert
to anon, authenticated
with check (true);

-- Admin-only read access to interested people.
drop policy if exists interested_people_select_admin on public.interested_people;
create policy interested_people_select_admin
on public.interested_people
for select
to authenticated
using (
  exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  )
);

-- Admin-only full access to shakha records.
drop policy if exists shakhas_admin_select_admin on public.shakhas_admin;
create policy shakhas_admin_select_admin
on public.shakhas_admin
for select
to authenticated
using (
  exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  )
);

drop policy if exists shakhas_admin_insert_admin on public.shakhas_admin;
create policy shakhas_admin_insert_admin
on public.shakhas_admin
for insert
to authenticated
with check (
  exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  )
);

drop policy if exists shakhas_admin_update_admin on public.shakhas_admin;
create policy shakhas_admin_update_admin
on public.shakhas_admin
for update
to authenticated
using (
  exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  )
);

drop policy if exists shakhas_admin_delete_admin on public.shakhas_admin;
create policy shakhas_admin_delete_admin
on public.shakhas_admin
for delete
to authenticated
using (
  exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  )
);

-- Admin users can verify themselves.
drop policy if exists admin_users_select_self on public.admin_users;
create policy admin_users_select_self
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

-- Optional seed process: insert initial admin by user_id after creating auth user.
-- insert into public.admin_users (user_id, mobile)
-- values ('<AUTH_USER_UUID>', '+919825311888')
-- on conflict (user_id) do nothing;
