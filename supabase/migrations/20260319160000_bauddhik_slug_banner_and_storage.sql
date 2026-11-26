-- Bauddhik library SEO and banner support
-- Adds clean URL slug and banner URL fields, and provisions a storage bucket for banner uploads.

alter table if exists public.bauddhik_content
  add column if not exists slug text,
  add column if not exists banner_url text;
-- Backfill slugs for existing content where slug is missing.
update public.bauddhik_content
set slug = trim(both '-' from regexp_replace(lower(coalesce(title, 'content') || '-' || id::text), '[^a-z0-9]+', '-', 'g'))
where (slug is null or btrim(slug) = '');
create index if not exists idx_bauddhik_content_slug on public.bauddhik_content (slug);
-- Optional uniqueness for SEO routes where slug has a value.
create unique index if not exists uq_bauddhik_content_slug_nonempty
on public.bauddhik_content (slug)
where slug is not null and btrim(slug) <> '';
-- Create public bucket used by the Add Content form for banner uploads.
insert into storage.buckets (id, name, public)
values ('library-banners', 'library-banners', true)
on conflict (id) do nothing;
-- Public read policy for banner images.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'library-banners-public-read'
  ) then
    create policy "library-banners-public-read"
      on storage.objects
      for select
      using (bucket_id = 'library-banners');
  end if;
end $$;
-- Authenticated upload/update/delete policy for banner images.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'library-banners-auth-write'
  ) then
    create policy "library-banners-auth-write"
      on storage.objects
      for all
      to authenticated
      using (bucket_id = 'library-banners')
      with check (bucket_id = 'library-banners');
  end if;
end $$;
