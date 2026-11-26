begin;
alter table if exists public.profiles
  add column if not exists shakha_id uuid references public.shakhas(id) on delete set null;
create index if not exists idx_profiles_shakha_id on public.profiles(shakha_id);
commit;
