-- Library metadata-only upgrade for hybrid infrastructure
-- Stores media references as CDN URLs / YouTube IDs and avoids binary payloads in Postgres.

begin;
alter table if exists public.bauddhik_content
  add column if not exists category_id text,
  add column if not exists file_url text,
  add column if not exists youtube_video_id text;
-- Backfill: preserve existing category as category_id and url as file_url when possible.
update public.bauddhik_content
set
  category_id = coalesce(nullif(category_id, ''), category),
  file_url = coalesce(nullif(file_url, ''), url)
where true;
-- Enforce URL hygiene and prevent data/blob payloads from being persisted in table text fields.
alter table public.bauddhik_content
  drop constraint if exists chk_bauddhik_banner_url_http,
  drop constraint if exists chk_bauddhik_file_url_http,
  drop constraint if exists chk_bauddhik_no_data_urls;
alter table public.bauddhik_content
  add constraint chk_bauddhik_banner_url_http
    check (banner_url is null or banner_url ~* '^https?://'),
  add constraint chk_bauddhik_file_url_http
    check (file_url is null or file_url ~* '^https?://'),
  add constraint chk_bauddhik_no_data_urls
    check (
      coalesce(lower(banner_url), '') not like 'data:%'
      and coalesce(lower(file_url), '') not like 'data:%'
      and coalesce(lower(url), '') not like 'data:%'
      and coalesce(lower(thumbnail), '') not like 'data:%'
    );
create index if not exists idx_bauddhik_category_id on public.bauddhik_content (category_id);
create index if not exists idx_bauddhik_youtube_video_id on public.bauddhik_content (youtube_video_id);
comment on column public.bauddhik_content.banner_url is 'CloudFront CDN URL for banner image';
comment on column public.bauddhik_content.file_url is 'CloudFront CDN URL for media/pdf/audio resource';
comment on column public.bauddhik_content.youtube_video_id is 'YouTube video ID for linked video content';
comment on column public.bauddhik_content.category_id is 'Stable category identifier used by mobile/web clients';
commit;
