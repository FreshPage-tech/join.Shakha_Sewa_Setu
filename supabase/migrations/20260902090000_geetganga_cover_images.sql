alter table public.geetganga_songs
  add column if not exists cover_image_url text,
  add column if not exists cover_image_s3_key text;
comment on column public.geetganga_songs.cover_image_url is 'Public CDN URL for the song-specific mobile WebP cover.';
comment on column public.geetganga_songs.cover_image_s3_key is 'S3 object key for the song-specific cover image.';
