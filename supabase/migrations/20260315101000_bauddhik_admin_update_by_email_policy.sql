begin;
drop policy if exists bauddhik_admin_update_by_email on public.bauddhik_content;
create policy bauddhik_admin_update_by_email on public.bauddhik_content
for update
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) in ('freshpage.tech@gmail.com')
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) in ('freshpage.tech@gmail.com')
);
commit;
