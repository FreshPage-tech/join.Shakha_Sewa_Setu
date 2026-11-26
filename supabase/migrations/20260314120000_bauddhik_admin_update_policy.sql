begin;
drop policy if exists bauddhik_admin_update on public.bauddhik_content;
create policy bauddhik_admin_update on public.bauddhik_content
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);
commit;
