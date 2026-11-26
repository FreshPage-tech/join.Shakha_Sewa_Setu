create table if not exists public.geet_user_pins (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  track_id uuid not null references public.geet_tracks(id) on delete cascade,
  pinned_at timestamptz not null default now()
);
alter table public.geet_user_pins enable row level security;
drop policy if exists geet_user_pins_owner_all on public.geet_user_pins;
create policy geet_user_pins_owner_all on public.geet_user_pins
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
