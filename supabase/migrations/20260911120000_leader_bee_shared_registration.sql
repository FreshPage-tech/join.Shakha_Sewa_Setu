-- Shared live-page form: keep family details and charge only K–8 participants.
-- The existing six-argument RPC remains available for older deployed clients.
alter table public.leader_bee_registrations
  add column if not exists registration_details jsonb not null default '{}'::jsonb;

create or replace function public.register_leader_bee_verified(
 p_submission_key uuid, p_shakha_slug text, p_parent_name text,
 p_parent_email text, p_parent_phone text, p_children jsonb, p_details jsonb
) returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare
 v_user uuid := auth.uid(); v_phone text; v_confirmed timestamptz;
 v_branch public.leader_bee_branches%rowtype; v_existing public.leader_bee_registrations%rowtype;
 v_id uuid; v_count integer; v_participants integer;
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
 if exists (select 1 from jsonb_array_elements(p_children) child where jsonb_typeof(child) <> 'object' or length(trim(coalesce(child->>'name',''))) not between 2 and 150 or coalesce(child->>'grade','') !~ '^Grade (K|[1-9]|1[0-2])$') then raise exception 'Each student needs a name and grade K–12.'; end if;
 if p_details is null or jsonb_typeof(p_details) <> 'object'
   or length(trim(coalesce(p_details->>'parentFirstName',''))) not between 1 and 70
   or length(trim(coalesce(p_details->>'parentLastName',''))) not between 1 and 70
   or length(trim(coalesce(p_details->>'city',''))) not between 1 and 100
   or length(trim(coalesce(p_details->>'state',''))) not between 1 and 100
   or length(coalesce(p_details->>'notes','')) > 2000
   or (p_details->'parentAttendanceConsent') is distinct from 'true'::jsonb then
   raise exception 'Enter parent names, city, state, and confirm parent attendance.';
 end if;
 select count(*) into v_participants from jsonb_array_elements(p_children) child where child->>'grade' ~ '^Grade (K|[1-8])$';
 select * into v_existing from public.leader_bee_registrations where submission_key = p_submission_key;
 if found then
  if v_existing.user_id is distinct from v_user or v_existing.shakha_slug <> p_shakha_slug then raise exception 'Registration reference is already in use.'; end if;
  return v_existing.id;
 end if;
 insert into public.leader_bee_registrations (submission_key, shakha_slug, user_id, phone_verified_at, parent_name, parent_email, parent_phone, children, child_count, participant_count, amount_cents, payment_status, registration_details)
 values (p_submission_key, p_shakha_slug, v_user, now(), trim(p_parent_name), lower(trim(p_parent_email)), p_parent_phone, p_children, v_count, v_participants, v_participants * v_branch.fee_cents, case when v_participants * v_branch.fee_cents = 0 then 'not_required' else 'pending' end, p_details)
 returning id into v_id;
 return v_id;
end;
$$;
revoke all on function public.register_leader_bee_verified(uuid,text,text,text,text,jsonb,jsonb) from public, anon;
grant execute on function public.register_leader_bee_verified(uuid,text,text,text,text,jsonb,jsonb) to authenticated;

create or replace function public.protect_verified_leader_bee_registration() returns trigger
language plpgsql set search_path = public, pg_temp as $$
begin
 if old.phone_verified_at is not null and (
  new.user_id is distinct from old.user_id or new.phone_verified_at is distinct from old.phone_verified_at or
  new.shakha_slug is distinct from old.shakha_slug or new.parent_phone is distinct from old.parent_phone or
  new.parent_name is distinct from old.parent_name or new.parent_email is distinct from old.parent_email or
  new.children is distinct from old.children or new.amount_cents is distinct from old.amount_cents or
  new.child_count is distinct from old.child_count or new.participant_count is distinct from old.participant_count or
  new.registration_details is distinct from old.registration_details or
  new.submission_key is distinct from old.submission_key
 ) then raise exception 'Verified registration details cannot be replaced.'; end if;
 return new;
end;
$$;
