begin;
alter table public.geet_tracks
  add column if not exists youtube_video_id text,
  add column if not exists youtube_sync_status text not null default 'pending',
  add column if not exists youtube_synced_at timestamptz,
  add column if not exists youtube_sync_error text;
alter table public.geet_tracks
  drop constraint if exists geet_tracks_youtube_sync_status_check;
alter table public.geet_tracks
  add constraint geet_tracks_youtube_sync_status_check
  check (youtube_sync_status in ('pending', 'syncing', 'synced', 'failed', 'skipped'));
create index if not exists idx_geet_tracks_youtube_sync
  on public.geet_tracks (youtube_sync_status, created_at)
  where is_published = true;
comment on column public.geet_tracks.youtube_video_id is
  'Existing or pipeline-created YouTube video ID. A Supabase INSERT database webhook invokes /api/geet/youtube-sync.';
commit;
