alter table public.shakhas_admin
  add column if not exists banner_url text,
  add column if not exists profile_image_url text,
  add column if not exists leaders jsonb not null default '[]'::jsonb;

comment on column public.shakhas_admin.leaders is
  'Per-shakha leadership entries: role, name, mobile, and email.';
