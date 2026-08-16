create extension if not exists pgcrypto;

create table if not exists public.shakhas (
  id uuid primary key default gen_random_uuid(),
  shakha_name text not null check (length(btrim(shakha_name)) > 0),
  country text not null default 'USA',
  state_or_region text,
  city text,
  address text,
  contact_person text,
  contact_phone text,
  source_url text,
  updated_at timestamp with time zone not null default now(),
  constraint shakhas_name_city_country_key unique nulls not distinct (shakha_name, city, country)
);

create index if not exists shakhas_state_city_idx on public.shakhas (state_or_region, city);

alter table public.shakhas enable row level security;

comment on table public.shakhas is
  'Normalized shakha directory records, synchronized by the service-role scraper.';
