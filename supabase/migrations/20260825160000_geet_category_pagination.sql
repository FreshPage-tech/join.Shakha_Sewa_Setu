create or replace function public.get_geet_tracks_by_category_paginated(
  p_category_id uuid,
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
  select track.id, track.title, track.artist, track.duration,
         track.s3_thumbnail_url, track.s3_audio_url
  from public.geet_tracks track
  where track.is_published = true and track.category_id = p_category_id
  order by track.display_order asc, track.created_at desc, track.id asc
  limit least(greatest(coalesce(p_limit, 10), 1), 10)
  offset greatest(coalesce(p_offset, 0), 0);
$$;
revoke all on function public.get_geet_tracks_by_category_paginated(uuid, integer, integer) from public;
grant execute on function public.get_geet_tracks_by_category_paginated(uuid, integer, integer) to authenticated;
