begin;
-- Keep only this admin account.
-- Everything else in app data and user accounts is removed.

do $$
declare
  keep_email text := 'freshpage.tech@gmail.com';
begin
  -- Purge app content/data.
  delete from public.event_rsvps;
  delete from public.attendance_records;
  delete from public.seva_volunteers;
  delete from public.donations;
  delete from public.family_members;
  delete from public.admin_members;

  delete from public.bauddhik_content;
  delete from public.announcements;
  delete from public.events;
  delete from public.seva_projects;
  delete from public.shakhas;

  -- Purge all non-admin profiles.
  delete from public.profiles
  where lower(coalesce(email, '')) <> keep_email;

  -- Purge all non-admin auth users.
  delete from auth.users
  where lower(coalesce(email, '')) <> keep_email;

  -- Ensure retained admin profile has admin role.
  update public.profiles
  set role = 'admin',
      status = 'active'
  where lower(coalesce(email, '')) = keep_email;
end $$;
commit;
