begin;
create extension if not exists pgcrypto;
create table if not exists public.geet_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.geet_tracks (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.geet_categories(id) on delete set null,
  title text not null,
  artist text not null,
  duration integer not null check (duration >= 0),
  s3_thumbnail_url text,
  s3_audio_url text not null,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint geet_tracks_thumbnail_https check (
    s3_thumbnail_url is null or s3_thumbnail_url ~ '^https://'
  ),
  constraint geet_tracks_audio_https check (s3_audio_url ~ '^https://')
);
create table if not exists public.geet_playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- A normalized join keeps ordering stable and preserves foreign-key integrity.
create table if not exists public.geet_playlist_tracks (
  playlist_id uuid not null references public.geet_playlists(id) on delete cascade,
  track_id uuid not null references public.geet_tracks(id) on delete cascade,
  position integer not null default 0 check (position >= 0),
  added_at timestamptz not null default now(),
  primary key (playlist_id, track_id)
);
create index if not exists idx_geet_categories_active_order
  on public.geet_categories (is_active, display_order, name);
create index if not exists idx_geet_tracks_feed
  on public.geet_tracks (is_published, display_order, created_at desc);
create index if not exists idx_geet_tracks_category
  on public.geet_tracks (category_id);
create index if not exists idx_geet_playlists_user
  on public.geet_playlists (user_id, updated_at desc);
create index if not exists idx_geet_playlist_tracks_order
  on public.geet_playlist_tracks (playlist_id, position);
drop trigger if exists trg_geet_categories_updated_at on public.geet_categories;
create trigger trg_geet_categories_updated_at
before update on public.geet_categories
for each row execute function public.set_updated_at();
drop trigger if exists trg_geet_tracks_updated_at on public.geet_tracks;
create trigger trg_geet_tracks_updated_at
before update on public.geet_tracks
for each row execute function public.set_updated_at();
drop trigger if exists trg_geet_playlists_updated_at on public.geet_playlists;
create trigger trg_geet_playlists_updated_at
before update on public.geet_playlists
for each row execute function public.set_updated_at();
alter table public.geet_categories enable row level security;
alter table public.geet_tracks enable row level security;
alter table public.geet_playlists enable row level security;
alter table public.geet_playlist_tracks enable row level security;
drop policy if exists geet_categories_authenticated_read on public.geet_categories;
create policy geet_categories_authenticated_read on public.geet_categories
for select to authenticated using (is_active);
drop policy if exists geet_categories_admin_write on public.geet_categories;
create policy geet_categories_admin_write on public.geet_categories
for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
drop policy if exists geet_tracks_authenticated_read on public.geet_tracks;
create policy geet_tracks_authenticated_read on public.geet_tracks
for select to authenticated using (is_published);
drop policy if exists geet_tracks_admin_write on public.geet_tracks;
create policy geet_tracks_admin_write on public.geet_tracks
for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
drop policy if exists geet_playlists_visible_read on public.geet_playlists;
create policy geet_playlists_visible_read on public.geet_playlists
for select to authenticated using (user_id = auth.uid() or is_public);
drop policy if exists geet_playlists_owner_insert on public.geet_playlists;
create policy geet_playlists_owner_insert on public.geet_playlists
for insert to authenticated
with check (user_id = auth.uid());
drop policy if exists geet_playlists_owner_update on public.geet_playlists;
create policy geet_playlists_owner_update on public.geet_playlists
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
drop policy if exists geet_playlists_owner_delete on public.geet_playlists;
create policy geet_playlists_owner_delete on public.geet_playlists
for delete to authenticated using (user_id = auth.uid());
drop policy if exists geet_playlist_tracks_visible_read on public.geet_playlist_tracks;
create policy geet_playlist_tracks_visible_read on public.geet_playlist_tracks
for select to authenticated using (
  exists (
    select 1 from public.geet_playlists playlist
    where playlist.id = playlist_id
      and (playlist.user_id = auth.uid() or playlist.is_public)
  )
);
drop policy if exists geet_playlist_tracks_owner_insert on public.geet_playlist_tracks;
create policy geet_playlist_tracks_owner_insert on public.geet_playlist_tracks
for insert to authenticated with check (
  exists (
    select 1 from public.geet_playlists playlist
    where playlist.id = playlist_id and playlist.user_id = auth.uid()
  )
);
drop policy if exists geet_playlist_tracks_owner_update on public.geet_playlist_tracks;
create policy geet_playlist_tracks_owner_update on public.geet_playlist_tracks
for update to authenticated
using (
  exists (
    select 1 from public.geet_playlists playlist
    where playlist.id = playlist_id and playlist.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.geet_playlists playlist
    where playlist.id = playlist_id and playlist.user_id = auth.uid()
  )
);
drop policy if exists geet_playlist_tracks_owner_delete on public.geet_playlist_tracks;
create policy geet_playlist_tracks_owner_delete on public.geet_playlist_tracks
for delete to authenticated using (
  exists (
    select 1 from public.geet_playlists playlist
    where playlist.id = playlist_id and playlist.user_id = auth.uid()
  )
);
create or replace function public.get_geet_tracks_paginated(
  p_limit integer default 10,
  p_offset integer default 0
)
returns table (
  id uuid,
  title text,
  artist text,
  duration integer,
  s3_thumbnail_url text,
  s3_audio_url text
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    track.id,
    track.title,
    track.artist,
    track.duration,
    track.s3_thumbnail_url,
    track.s3_audio_url
  from public.geet_tracks track
  where track.is_published = true
  order by track.display_order asc, track.created_at desc, track.id asc
  limit least(greatest(coalesce(p_limit, 10), 1), 10)
  offset greatest(coalesce(p_offset, 0), 0);
$$;
revoke all on function public.get_geet_tracks_paginated(integer, integer) from public;
grant execute on function public.get_geet_tracks_paginated(integer, integer) to authenticated;
commit;
