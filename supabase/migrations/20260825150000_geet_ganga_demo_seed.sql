begin;
insert into public.geet_categories (id, name, slug, description, display_order, is_active)
values
  ('10000000-0000-4000-8000-000000000001', 'Desh Bhakti', 'desh-bhakti', 'Patriotic and national songs', 1, true),
  ('10000000-0000-4000-8000-000000000002', 'Prarthana', 'prarthana', 'Prayer and devotional songs', 2, true),
  ('10000000-0000-4000-8000-000000000003', 'Prerna Geet', 'prerna-geet', 'Songs of inspiration and service', 3, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order,
  is_active = excluded.is_active;
insert into public.geet_tracks (
  id,
  category_id,
  title,
  artist,
  duration,
  s3_thumbnail_url,
  s3_audio_url,
  display_order,
  is_published
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    (select id from public.geet_categories where slug = 'desh-bhakti'),
    'Vande Mataram',
    'GeetGanga Ensemble',
    372,
    null,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    1,
    true
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    (select id from public.geet_categories where slug = 'prarthana'),
    'Sangh Prarthana',
    'Swayamsevak Choir',
    425,
    null,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    2,
    true
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    (select id from public.geet_categories where slug = 'prerna-geet'),
    'Charaiveti Charaiveti',
    'Prerna Collective',
    343,
    null,
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    3,
    true
  )
on conflict (id) do update set
  category_id = excluded.category_id,
  title = excluded.title,
  artist = excluded.artist,
  duration = excluded.duration,
  s3_thumbnail_url = excluded.s3_thumbnail_url,
  s3_audio_url = excluded.s3_audio_url,
  display_order = excluded.display_order,
  is_published = excluded.is_published;
commit;
