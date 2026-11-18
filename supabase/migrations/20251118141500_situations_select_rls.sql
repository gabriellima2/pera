-- Lookup table: authenticated users may read active situations only (no writes via client).

alter table public.situations enable row level security;

grant select on table public.situations to authenticated;

create policy "situations_select_authenticated"
on public.situations
for select
to authenticated
using (active is true);