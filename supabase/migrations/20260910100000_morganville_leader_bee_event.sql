-- Preserve the real Morganville event that was already published on the static program page.
-- Do not replace admin-edited configuration or the separate Keshav demo branch.
insert into public.leader_bee_branches
 (slug, shakha_id, name, address, timing, start_date, coordinator_name, whatsapp_number, email, is_demo, registration_enabled, fee_cents)
values
 ('usa-07751-sri-krishna-shakha', 'New Jersey|Morganville|Sri Krishna Shakha', 'Sri Krishna Shakha',
  'The Dance Spot, 479 Hwy 79 A4, Morganville, NJ 07751', 'Every Sunday · 4:00 PM–5:30 PM', '2026-09-13',
  'Utkarsh Patel', '+12018896610', '', false, true, 1000)
on conflict do nothing;
