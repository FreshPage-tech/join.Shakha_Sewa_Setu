create table if not exists public.leader_bee_registrations (
  id uuid primary key default gen_random_uuid(),
  submission_key uuid not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  parent_name text not null,
  parent_email text not null,
  parent_phone text not null,
  children jsonb not null default '[]'::jsonb,
  child_count integer not null,
  participant_count integer not null,
  amount_cents integer not null default 0,
  payment_status text not null default 'not_required'
    check (payment_status in ('not_required', 'pending', 'paid', 'failed', 'refunded')),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  paid_at timestamptz
);

drop trigger if exists trg_leader_bee_registrations_set_updated_at on public.leader_bee_registrations;
create trigger trg_leader_bee_registrations_set_updated_at
before update on public.leader_bee_registrations
for each row execute function public.set_updated_at();

alter table public.leader_bee_registrations enable row level security;

drop policy if exists leader_bee_registrations_select_admin on public.leader_bee_registrations;
create policy leader_bee_registrations_select_admin
on public.leader_bee_registrations
for select
to authenticated
using (
  exists (select 1 from public.admin_users au where au.user_id = auth.uid())
);

-- Public writes are handled by Edge Functions with the service-role key.
-- There is deliberately no anonymous insert/update policy for this table.

create index if not exists leader_bee_registrations_created_at_idx
  on public.leader_bee_registrations (created_at desc);
create index if not exists leader_bee_registrations_payment_status_idx
  on public.leader_bee_registrations (payment_status);
