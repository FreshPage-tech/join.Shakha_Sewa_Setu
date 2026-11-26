begin;
alter table if exists public.profiles
  add column if not exists date_of_birth date,
  add column if not exists blood_group text,
  add column if not exists occupation text,
  add column if not exists education text,
  add column if not exists address text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists pincode text,
  add column if not exists shakha text,
  add column if not exists region text,
  add column if not exists member_since text,
  add column if not exists emergency_contact text,
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_relation text,
  add column if not exists bio text;
commit;
