alter table if exists public.profiles
  add column if not exists deletion_requested_at timestamptz,
  add column if not exists deletion_scheduled_for timestamptz;
create index if not exists idx_profiles_deletion_scheduled_for
  on public.profiles(deletion_scheduled_for)
  where deletion_scheduled_for is not null;
