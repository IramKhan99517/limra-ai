-- Run in Supabase SQL Editor.

alter table entities add column if not exists owner_id uuid references profiles(id);
alter table bookings add column if not exists user_id uuid references profiles(id);

alter table entities enable row level security;
alter table licenses enable row level security;
alter table filings enable row level security;
alter table compliance_activity enable row level security;
alter table bookings enable row level security;

create policy "Owners and admins can view entities" on entities
  for select using (
    owner_id = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Owners and admins manage licenses" on licenses
  for select using (
    exists (select 1 from entities e where e.id = entity_id and (e.owner_id = auth.uid()
      or exists (select 1 from profiles where id = auth.uid() and role = 'admin')))
  );

create policy "Owners and admins manage filings" on filings
  for select using (
    exists (select 1 from entities e where e.id = entity_id and (e.owner_id = auth.uid()
      or exists (select 1 from profiles where id = auth.uid() and role = 'admin')))
  );

create policy "Owners and admins view activity" on compliance_activity
  for select using (
    exists (select 1 from entities e where e.id = entity_id and (e.owner_id = auth.uid()
      or exists (select 1 from profiles where id = auth.uid() and role = 'admin')))
  );

create policy "Anyone can submit a booking" on bookings
  for insert with check (true);

create policy "Owners and admins view bookings" on bookings
  for select using (
    user_id = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Note: existing seed-data entities have owner_id = null, so they're only
-- visible to admins until reassigned or removed (see demo-data banner note).
