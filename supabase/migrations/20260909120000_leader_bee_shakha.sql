alter table public.leader_bee_registrations
  add column if not exists shakha_slug text not null default 'usa-07751-sri-krishna-shakha';
create index if not exists leader_bee_registrations_shakha_slug_idx
  on public.leader_bee_registrations (shakha_slug);
