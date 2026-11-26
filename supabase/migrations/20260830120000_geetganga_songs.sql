create table if not exists public.geetganga_songs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  language text,
  category text,
  source_url text,
  lyrics text not null default '',
  audio_url text not null,
  lyrics_url text,
  audio_s3_key text not null,
  lyrics_s3_key text,
  duration text,
  is_published boolean not null default true,
  youtube_video_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_geetganga_songs_title on public.geetganga_songs using gin (to_tsvector('simple', title));
create index if not exists idx_geetganga_songs_language on public.geetganga_songs (language);
create index if not exists idx_geetganga_songs_category on public.geetganga_songs (category);
create index if not exists idx_geetganga_songs_published on public.geetganga_songs (is_published);
alter table public.geetganga_songs enable row level security;
drop policy if exists "geetganga_public_read" on public.geetganga_songs;
create policy "geetganga_public_read"
on public.geetganga_songs for select
to anon, authenticated
using (is_published = true);
grant select on public.geetganga_songs to anon, authenticated;
grant all on public.geetganga_songs to service_role;
comment on table public.geetganga_songs is 'Public Geet Ganga audio and lyrics catalog backed by S3/CloudFront.';
