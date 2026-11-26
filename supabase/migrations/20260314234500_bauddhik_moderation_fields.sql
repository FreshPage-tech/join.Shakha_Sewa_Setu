-- Bauddhik moderation and publishing workflow fields
alter table if exists public.bauddhik_content
  add column if not exists status text not null default 'published',
  add column if not exists verified_by uuid references public.profiles(id) on delete set null,
  add column if not exists verified_at timestamptz,
  add column if not exists published_at timestamptz;
-- Backfill published_at for existing records already considered published
update public.bauddhik_content
set published_at = coalesce(published_at, created_at)
where status = 'published' and published_at is null;
alter table if exists public.bauddhik_content
  drop constraint if exists bauddhik_content_status_check;
alter table if exists public.bauddhik_content
  add constraint bauddhik_content_status_check
  check (status in ('pending', 'verified', 'published', 'rejected'));
create index if not exists idx_bauddhik_status on public.bauddhik_content(status);
create index if not exists idx_bauddhik_published_at on public.bauddhik_content(published_at desc);
