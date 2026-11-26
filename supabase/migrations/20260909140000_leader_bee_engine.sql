-- Public event configuration. Only service-role / SQL administrators may publish branches.
create table if not exists public.leader_bee_branches (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 200),
  shakha_id text unique,
  name text not null,
  address text not null,
  timing text not null,
  start_date date,
  coordinator_name text not null default '',
  whatsapp_number text not null default '',
  email text not null default '',
  is_demo boolean not null default false,
  registration_enabled boolean not null default false,
  fee_cents integer not null default 1000 check (fee_cents >= 0),
  check (not is_demo or not registration_enabled)
);
alter table public.leader_bee_branches enable row level security;
create policy "Read published branch details" on public.leader_bee_branches for select to anon, authenticated using (true);
grant select on public.leader_bee_branches to anon, authenticated;
revoke insert, update, delete on public.leader_bee_branches from anon, authenticated;

insert into public.leader_bee_branches (slug, name, address, timing, start_date, coordinator_name, whatsapp_number, email, is_demo)
values
 ('morganville-nj', 'Keshav Shakha', 'Sample Community Hall, Morganville, NJ', 'Sundays, 4:00–5:30 PM (sample)', '2026-10-04', 'Morganville Demo Coordinator', '+12025550101', 'morganville@example.com', true),
 ('edison-nj', 'Madhav Shakha', 'Sample Community Hall, Edison, NJ', 'Saturdays, 10:00–11:30 AM (sample)', '2026-10-03', 'Edison Demo Coordinator', '+12025550102', 'edison@example.com', true),
 ('jersey-city-nj', 'Vivekanand Shakha', 'Sample Community Hall, Jersey City, NJ', 'Sundays, 9:00–10:30 AM (sample)', '2026-10-04', 'Jersey City Demo Coordinator', '+12025550103', 'jersey-city@example.com', true)
on conflict (slug) do nothing;

alter table public.leader_bee_registrations
  add column if not exists user_id uuid references auth.users(id),
  add column if not exists phone_verified_at timestamptz;
create index if not exists leader_bee_verified_tenant_user_idx on public.leader_bee_registrations (shakha_slug, user_id);

create table public.leader_bee_curriculum (
  shakha_slug text not null,
  week integer not null check (week between 1 and 10),
  title text not null,
  objective text not null,
  activities jsonb not null check (jsonb_typeof(activities) = 'array'),
  primary key (shakha_slug, week)
);
alter table public.leader_bee_curriculum enable row level security;
-- Content is returned only by the registration-aware RPC below.
revoke all on public.leader_bee_curriculum from anon, authenticated;

insert into public.leader_bee_curriculum (shakha_slug, week, title, objective, activities) values
 ('national', 1, 'Belonging & shared purpose', 'Introduce yourself, listen to others, and build a welcoming team.', '["Opening Aachar Padhati and introductions", "Learn a Geet together", "Name-and-team relay", "Reflection and joint Sangha Prarthana"]'),
 ('national', 2, 'Focus & discipline', 'Practice attention and develop one small daily habit.', '["Shlok practice", "Key & Lock focus game", "Discuss a habit to practice at home"]'),
 ('national', 3, 'Stories & choices', 'Notice how choices affect yourself and others.', '["Explore a Panchatantra story", "Compare possible endings in small groups", "Share a Subhashit and its meaning"]'),
 ('national', 4, 'Teamwork in action', 'Share roles, encourage teammates, and work toward a common goal.', '["Lagori teamwork game", "Rotate leadership roles", "Discuss what helped the team"]'),
 ('national', 5, 'Think ahead', 'Plan a simple strategy and adapt when circumstances change.', '["Age-appropriate Chanakya wisdom discussion", "Plan and play a relay challenge", "Reflect on strategy and fairness"]'),
 ('national', 6, 'Courage & responsibility', 'Understand courage as thoughtful action and responsibility.', '["Discuss a story of Chhatrapati Shivaji Maharaj", "Practice speaking for your group", "Connect an Amrutvachan to daily life"]'),
 ('national', 7, 'Curiosity & problem solving', 'Ask useful questions and try more than one solution.', '["Discuss an age-appropriate Jeff Bezos case study", "Design a simple solution in teams", "Share what you would improve"]'),
 ('national', 8, 'Communicate with care', 'Speak clearly, listen actively, and disagree respectfully.', '["Partner listening activity", "Explain the rules of a team game", "Practice Geet and Shlok together"]'),
 ('national', 9, 'Leadership through service', 'Identify a small way to help your family or community.', '["Plan an age-appropriate service activity", "Assign shared responsibilities", "Discuss how to include everyone"]'),
 ('national', 10, 'Reflect & celebrate', 'Recognize growth and choose a next step.', '["Team presentations and reflections", "Favorite leadership Khel", "Family celebration and joint Sangha Prarthana"]');

create or replace function public.register_leader_bee_verified(
 p_submission_key uuid, p_shakha_slug text, p_parent_name text,
 p_parent_email text, p_parent_phone text, p_children jsonb
) returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare
 v_user uuid := auth.uid(); v_phone text; v_confirmed timestamptz;
 v_branch public.leader_bee_branches%rowtype; v_existing public.leader_bee_registrations%rowtype;
 v_id uuid; v_count integer;
begin
 if v_user is null then raise exception 'Verify your WhatsApp number before registering.'; end if;
 select phone, phone_confirmed_at into v_phone, v_confirmed from auth.users where id = v_user;
 if v_confirmed is null or regexp_replace(coalesce(v_phone,''), '[^0-9]', '', 'g') <> regexp_replace(coalesce(p_parent_phone,''), '[^0-9]', '', 'g') then
  raise exception 'The parent phone must match your verified WhatsApp number.';
 end if;
 if p_parent_phone !~ '^\+[1-9][0-9]{7,14}$' then raise exception 'Enter an international phone number.'; end if;
 select * into v_branch from public.leader_bee_branches where slug = p_shakha_slug;
 if not found or not v_branch.registration_enabled or v_branch.is_demo then raise exception 'Registration is not open for this branch.'; end if;
 if length(trim(coalesce(p_parent_name,''))) not between 2 and 150 or length(coalesce(p_parent_email,'')) > 254 or coalesce(p_parent_email,'') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Enter valid parent contact details.'; end if;
 if p_children is null or jsonb_typeof(p_children) <> 'array' then raise exception 'Student details are required.'; end if;
 v_count := jsonb_array_length(p_children);
 if v_count not between 1 and 10 then raise exception 'Register between 1 and 10 children.'; end if;
 if exists (select 1 from jsonb_array_elements(p_children) child where jsonb_typeof(child) <> 'object' or length(trim(coalesce(child->>'name',''))) not between 2 and 150 or coalesce(child->>'grade','') !~ '^Grade (K|[1-8])$') then raise exception 'Each student needs a name and grade K–8.'; end if;
 select * into v_existing from public.leader_bee_registrations where submission_key = p_submission_key;
 if found then
  if v_existing.user_id is distinct from v_user or v_existing.shakha_slug <> p_shakha_slug then raise exception 'Registration reference is already in use.'; end if;
  return v_existing.id;
 end if;
 insert into public.leader_bee_registrations (submission_key, shakha_slug, user_id, phone_verified_at, parent_name, parent_email, parent_phone, children, child_count, participant_count, amount_cents, payment_status)
 values (p_submission_key, p_shakha_slug, v_user, now(), trim(p_parent_name), lower(trim(p_parent_email)), p_parent_phone, p_children, v_count, v_count, v_count * v_branch.fee_cents, case when v_branch.fee_cents = 0 then 'not_required' else 'pending' end)
 returning id into v_id;
 return v_id;
end;
$$;
revoke all on function public.register_leader_bee_verified(uuid,text,text,text,text,jsonb) from public, anon;
grant execute on function public.register_leader_bee_verified(uuid,text,text,text,text,jsonb) to authenticated;

create or replace function public.get_leader_bee_curriculum(p_shakha_slug text)
returns table (week integer, title text, objective text, activities jsonb)
language plpgsql security definer set search_path = public, pg_temp as $$
begin
 if auth.uid() is null or not exists (select 1 from public.leader_bee_registrations r where r.user_id = auth.uid() and r.shakha_slug = p_shakha_slug and r.phone_verified_at is not null) then
  raise exception 'Register with a verified WhatsApp number for this branch to view the curriculum.';
 end if;
 return query select distinct on (c.week) c.week, c.title, c.objective, c.activities from public.leader_bee_curriculum c where c.shakha_slug in ('national', p_shakha_slug) order by c.week, (c.shakha_slug = p_shakha_slug) desc;
end;
$$;
revoke all on function public.get_leader_bee_curriculum(text) from public, anon;
grant execute on function public.get_leader_bee_curriculum(text) to authenticated;

-- Verified registration identity and price are immutable, including through legacy service-role endpoints.
create function public.protect_verified_leader_bee_registration() returns trigger
language plpgsql set search_path = public, pg_temp as $$
begin
 if old.phone_verified_at is not null and (
  new.user_id is distinct from old.user_id or new.phone_verified_at is distinct from old.phone_verified_at or
  new.shakha_slug is distinct from old.shakha_slug or new.parent_phone is distinct from old.parent_phone or
  new.parent_name is distinct from old.parent_name or new.parent_email is distinct from old.parent_email or
  new.children is distinct from old.children or new.amount_cents is distinct from old.amount_cents or
  new.child_count is distinct from old.child_count or new.participant_count is distinct from old.participant_count or
  new.submission_key is distinct from old.submission_key
 ) then raise exception 'Verified registration details cannot be replaced.'; end if;
 return new;
end;
$$;
create trigger protect_verified_leader_bee_registration before update on public.leader_bee_registrations
for each row execute function public.protect_verified_leader_bee_registration();

create function public.get_leader_bee_registration_status(p_shakha_slug text, p_registration_id uuid default null)
returns table (id uuid, payment_status text, amount_cents integer)
language sql security definer set search_path = public, pg_temp as $$
 select r.id, r.payment_status, r.amount_cents from public.leader_bee_registrations r
 where r.user_id = auth.uid() and r.shakha_slug = p_shakha_slug and r.phone_verified_at is not null
 and (p_registration_id is null or r.id = p_registration_id)
 order by r.created_at desc limit 1;
$$;
revoke all on function public.get_leader_bee_registration_status(text,uuid) from public, anon;
grant execute on function public.get_leader_bee_registration_status(text,uuid) to authenticated;
