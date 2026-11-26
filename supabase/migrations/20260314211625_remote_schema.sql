-- RSS Sangh - Production schema migration
-- Generated for go-live baseline

begin;
create extension if not exists pgcrypto;
-- ============================================
-- Enums
-- ============================================
do $$
begin
	if not exists (select 1 from pg_type where typname = 'app_user_role') then
		create type public.app_user_role as enum ('user', 'admin');
	end if;

	if not exists (select 1 from pg_type where typname = 'account_status') then
		create type public.account_status as enum ('active', 'suspended', 'deleted');
	end if;

	if not exists (select 1 from pg_type where typname = 'event_status') then
		create type public.event_status as enum ('pending', 'approved', 'rejected');
	end if;

	if not exists (select 1 from pg_type where typname = 'attendance_status') then
		create type public.attendance_status as enum ('present', 'absent', 'late');
	end if;

	if not exists (select 1 from pg_type where typname = 'seva_status') then
		create type public.seva_status as enum ('active', 'completed', 'upcoming');
	end if;

	if not exists (select 1 from pg_type where typname = 'donation_type') then
		create type public.donation_type as enum ('one-time', 'recurring');
	end if;

	if not exists (select 1 from pg_type where typname = 'donation_status') then
		create type public.donation_status as enum ('pending', 'completed', 'failed');
	end if;

	if not exists (select 1 from pg_type where typname = 'content_type') then
		create type public.content_type as enum ('audio', 'video', 'text');
	end if;

	if not exists (select 1 from pg_type where typname = 'announcement_priority') then
		create type public.announcement_priority as enum ('high', 'medium', 'low');
	end if;

	if not exists (select 1 from pg_type where typname = 'admin_member_status') then
		create type public.admin_member_status as enum ('pending', 'approved', 'suspended');
	end if;
end $$;
-- ============================================
-- Utility trigger function
-- ============================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;
-- ============================================
-- Users and profiles
-- ============================================
create table if not exists public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	email text unique,
	phone text,
	name text,
	role public.app_user_role not null default 'user',
	status public.account_status not null default 'active',
	last_active timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_status on public.profiles(status);
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_phone on public.profiles(phone);
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();
create table if not exists public.family_members (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.profiles(id) on delete cascade,
	name text not null,
	relation text not null,
	age integer check (age is null or age >= 0),
	phone text,
	email text,
	shakha text,
	is_primary boolean not null default false,
	profile_image text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create index if not exists idx_family_members_user_id on public.family_members(user_id);
drop trigger if exists trg_family_members_updated_at on public.family_members;
create trigger trg_family_members_updated_at
before update on public.family_members
for each row
execute function public.set_updated_at();
-- ============================================
-- Shakha and attendance
-- ============================================
create table if not exists public.shakhas (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	location text not null,
	city text,
	state text,
	timing text,
	days text[] not null default '{}',
	latitude numeric(10, 7),
	longitude numeric(10, 7),
	contact_person text,
	contact_phone text,
	attendance_count integer not null default 0,
	created_by uuid references public.profiles(id) on delete set null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create index if not exists idx_shakhas_name on public.shakhas(name);
create index if not exists idx_shakhas_city on public.shakhas(city);
create index if not exists idx_shakhas_created_by on public.shakhas(created_by);
drop trigger if exists trg_shakhas_updated_at on public.shakhas;
create trigger trg_shakhas_updated_at
before update on public.shakhas
for each row
execute function public.set_updated_at();
create table if not exists public.attendance_records (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.profiles(id) on delete cascade,
	shakha_id uuid not null references public.shakhas(id) on delete cascade,
	line_id text,
	attendance_date date not null,
	status public.attendance_status not null,
	created_at timestamptz not null default now(),
	unique(user_id, shakha_id, attendance_date)
);
create index if not exists idx_attendance_user_id on public.attendance_records(user_id);
create index if not exists idx_attendance_shakha_id on public.attendance_records(shakha_id);
create index if not exists idx_attendance_date on public.attendance_records(attendance_date);
-- ============================================
-- Events
-- ============================================
create table if not exists public.events (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	description text,
	event_date date not null,
	event_time text,
	location text not null,
	category text,
	type text,
	status public.event_status not null default 'pending',
	organizer_id uuid references public.profiles(id) on delete set null,
	attendee_count integer not null default 0,
	max_attendees integer,
	image_url text,
	created_by uuid references public.profiles(id) on delete set null,
	approved_by uuid references public.profiles(id) on delete set null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_events_date on public.events(event_date);
create index if not exists idx_events_organizer_id on public.events(organizer_id);
create index if not exists idx_events_created_by on public.events(created_by);
drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();
create table if not exists public.event_rsvps (
	id uuid primary key default gen_random_uuid(),
	event_id uuid not null references public.events(id) on delete cascade,
	user_id uuid not null references public.profiles(id) on delete cascade,
	created_at timestamptz not null default now(),
	unique(event_id, user_id)
);
create index if not exists idx_event_rsvps_event_id on public.event_rsvps(event_id);
create index if not exists idx_event_rsvps_user_id on public.event_rsvps(user_id);
-- ============================================
-- Seva projects and volunteers
-- ============================================
create table if not exists public.seva_projects (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	description text,
	category text not null,
	target_amount numeric(12, 2) default 0,
	current_amount numeric(12, 2) not null default 0,
	volunteers_needed integer not null default 0,
	volunteers_enrolled integer not null default 0,
	location text,
	start_date date,
	end_date date,
	status public.seva_status not null default 'active',
	created_by uuid references public.profiles(id) on delete set null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create index if not exists idx_seva_status on public.seva_projects(status);
create index if not exists idx_seva_category on public.seva_projects(category);
create index if not exists idx_seva_created_by on public.seva_projects(created_by);
drop trigger if exists trg_seva_projects_updated_at on public.seva_projects;
create trigger trg_seva_projects_updated_at
before update on public.seva_projects
for each row
execute function public.set_updated_at();
create table if not exists public.seva_volunteers (
	id uuid primary key default gen_random_uuid(),
	project_id uuid not null references public.seva_projects(id) on delete cascade,
	user_id uuid not null references public.profiles(id) on delete cascade,
	created_at timestamptz not null default now(),
	unique(project_id, user_id)
);
create index if not exists idx_seva_volunteers_project_id on public.seva_volunteers(project_id);
create index if not exists idx_seva_volunteers_user_id on public.seva_volunteers(user_id);
-- ============================================
-- Donations
-- ============================================
create table if not exists public.donations (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.profiles(id) on delete cascade,
	project_id uuid references public.seva_projects(id) on delete set null,
	amount numeric(12, 2) not null check (amount > 0),
	type public.donation_type not null,
	status public.donation_status not null default 'pending',
	payment_method text,
	transaction_id text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create index if not exists idx_donations_user_id on public.donations(user_id);
create index if not exists idx_donations_project_id on public.donations(project_id);
create index if not exists idx_donations_status on public.donations(status);
create index if not exists idx_donations_created_at on public.donations(created_at desc);
drop trigger if exists trg_donations_updated_at on public.donations;
create trigger trg_donations_updated_at
before update on public.donations
for each row
execute function public.set_updated_at();
-- ============================================
-- Bauddhik and announcements
-- ============================================
create table if not exists public.bauddhik_content (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	type public.content_type not null,
	category text not null,
	description text,
	author text,
	duration text,
	url text,
	thumbnail text,
	created_by uuid references public.profiles(id) on delete set null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create index if not exists idx_bauddhik_type on public.bauddhik_content(type);
create index if not exists idx_bauddhik_category on public.bauddhik_content(category);
create index if not exists idx_bauddhik_created_by on public.bauddhik_content(created_by);
drop trigger if exists trg_bauddhik_content_updated_at on public.bauddhik_content;
create trigger trg_bauddhik_content_updated_at
before update on public.bauddhik_content
for each row
execute function public.set_updated_at();
create table if not exists public.announcements (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	message text not null,
	priority public.announcement_priority not null default 'medium',
	category text default 'Shakha',
	target_user_id uuid references public.profiles(id) on delete set null,
	created_by uuid references public.profiles(id) on delete set null,
	published_at timestamptz not null default now(),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create index if not exists idx_announcements_priority on public.announcements(priority);
create index if not exists idx_announcements_target_user_id on public.announcements(target_user_id);
create index if not exists idx_announcements_created_at on public.announcements(created_at desc);
drop trigger if exists trg_announcements_updated_at on public.announcements;
create trigger trg_announcements_updated_at
before update on public.announcements
for each row
execute function public.set_updated_at();
-- ============================================
-- Admin module support
-- ============================================
create table if not exists public.admin_members (
	id uuid primary key default gen_random_uuid(),
	profile_id uuid references public.profiles(id) on delete set null,
	name text not null,
	shakha text not null,
	registration_date date not null,
	attendance integer not null default 0,
	status public.admin_member_status not null default 'pending',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create index if not exists idx_admin_members_profile_id on public.admin_members(profile_id);
create index if not exists idx_admin_members_status on public.admin_members(status);
create index if not exists idx_admin_members_registration_date on public.admin_members(registration_date desc);
drop trigger if exists trg_admin_members_updated_at on public.admin_members;
create trigger trg_admin_members_updated_at
before update on public.admin_members
for each row
execute function public.set_updated_at();
-- ============================================
-- Derived counters
-- ============================================
create or replace function public.refresh_event_attendee_count()
returns trigger
language plpgsql
as $$
begin
	if tg_op = 'INSERT' then
		update public.events
		set attendee_count = (
			select count(*) from public.event_rsvps where event_id = new.event_id
		)
		where id = new.event_id;
		return new;
	elsif tg_op = 'DELETE' then
		update public.events
		set attendee_count = (
			select count(*) from public.event_rsvps where event_id = old.event_id
		)
		where id = old.event_id;
		return old;
	end if;

	return null;
end;
$$;
drop trigger if exists trg_event_rsvps_refresh_count_insert on public.event_rsvps;
create trigger trg_event_rsvps_refresh_count_insert
after insert on public.event_rsvps
for each row
execute function public.refresh_event_attendee_count();
drop trigger if exists trg_event_rsvps_refresh_count_delete on public.event_rsvps;
create trigger trg_event_rsvps_refresh_count_delete
after delete on public.event_rsvps
for each row
execute function public.refresh_event_attendee_count();
create or replace function public.refresh_seva_volunteer_count()
returns trigger
language plpgsql
as $$
begin
	if tg_op = 'INSERT' then
		update public.seva_projects
		set volunteers_enrolled = (
			select count(*) from public.seva_volunteers where project_id = new.project_id
		)
		where id = new.project_id;
		return new;
	elsif tg_op = 'DELETE' then
		update public.seva_projects
		set volunteers_enrolled = (
			select count(*) from public.seva_volunteers where project_id = old.project_id
		)
		where id = old.project_id;
		return old;
	end if;

	return null;
end;
$$;
drop trigger if exists trg_seva_volunteers_refresh_count_insert on public.seva_volunteers;
create trigger trg_seva_volunteers_refresh_count_insert
after insert on public.seva_volunteers
for each row
execute function public.refresh_seva_volunteer_count();
drop trigger if exists trg_seva_volunteers_refresh_count_delete on public.seva_volunteers;
create trigger trg_seva_volunteers_refresh_count_delete
after delete on public.seva_volunteers
for each row
execute function public.refresh_seva_volunteer_count();
-- ============================================
-- RLS
-- ============================================
alter table public.profiles enable row level security;
alter table public.family_members enable row level security;
alter table public.shakhas enable row level security;
alter table public.attendance_records enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.seva_projects enable row level security;
alter table public.seva_volunteers enable row level security;
alter table public.donations enable row level security;
alter table public.bauddhik_content enable row level security;
alter table public.announcements enable row level security;
alter table public.admin_members enable row level security;
-- Profiles
drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
for select
to authenticated
using (id = auth.uid());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());
drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
for insert
to authenticated
with check (id = auth.uid());
-- Family members
drop policy if exists family_members_owner_all on public.family_members;
create policy family_members_owner_all on public.family_members
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
-- Shakhas, events, seva, bauddhik, announcements: readable by all authenticated users
drop policy if exists shakhas_authenticated_read on public.shakhas;
create policy shakhas_authenticated_read on public.shakhas
for select
to authenticated
using (true);
drop policy if exists events_authenticated_read on public.events;
create policy events_authenticated_read on public.events
for select
to authenticated
using (status = 'approved' or created_by = auth.uid());
drop policy if exists seva_authenticated_read on public.seva_projects;
create policy seva_authenticated_read on public.seva_projects
for select
to authenticated
using (true);
drop policy if exists bauddhik_authenticated_read on public.bauddhik_content;
create policy bauddhik_authenticated_read on public.bauddhik_content
for select
to authenticated
using (true);
drop policy if exists announcements_authenticated_read on public.announcements;
create policy announcements_authenticated_read on public.announcements
for select
to authenticated
using (target_user_id is null or target_user_id = auth.uid());
-- User-owned writes
drop policy if exists attendance_owner_insert on public.attendance_records;
create policy attendance_owner_insert on public.attendance_records
for insert
to authenticated
with check (user_id = auth.uid());
drop policy if exists attendance_owner_read on public.attendance_records;
create policy attendance_owner_read on public.attendance_records
for select
to authenticated
using (user_id = auth.uid());
drop policy if exists event_owner_insert on public.events;
create policy event_owner_insert on public.events
for insert
to authenticated
with check (created_by = auth.uid());
drop policy if exists event_owner_update on public.events;
create policy event_owner_update on public.events
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());
drop policy if exists event_rsvp_owner_all on public.event_rsvps;
create policy event_rsvp_owner_all on public.event_rsvps
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
drop policy if exists seva_project_creator_insert on public.seva_projects;
create policy seva_project_creator_insert on public.seva_projects
for insert
to authenticated
with check (created_by = auth.uid());
drop policy if exists seva_project_creator_update on public.seva_projects;
create policy seva_project_creator_update on public.seva_projects
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());
drop policy if exists seva_volunteer_owner_all on public.seva_volunteers;
create policy seva_volunteer_owner_all on public.seva_volunteers
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
drop policy if exists donations_owner_all on public.donations;
create policy donations_owner_all on public.donations
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
drop policy if exists bauddhik_creator_insert on public.bauddhik_content;
create policy bauddhik_creator_insert on public.bauddhik_content
for insert
to authenticated
with check (created_by = auth.uid());
drop policy if exists announcements_creator_insert on public.announcements;
create policy announcements_creator_insert on public.announcements
for insert
to authenticated
with check (created_by = auth.uid());
drop policy if exists admin_members_read_all on public.admin_members;
create policy admin_members_read_all on public.admin_members
for select
to authenticated
using (true);
commit;
