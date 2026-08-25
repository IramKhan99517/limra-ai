-- Run in Supabase SQL Editor after lib/rls-entities.sql

alter table entities add column if not exists activity text;
alter table entities add column if not exists description text;

-- Owners can create and update their own entity (select policy already exists)
drop policy if exists "Owners can create entities" on entities;
create policy "Owners can create entities" on entities
  for insert with check (owner_id = auth.uid());

drop policy if exists "Owners can update own entities" on entities;
create policy "Owners can update own entities" on entities
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Personalized roadmap: ordered steps per entity, each optionally tied to a
-- required document type (see lib/documentTypes.ts for the id list)
create table if not exists roadmap_steps (
  id serial primary key,
  entity_id integer not null references entities(id) on delete cascade,
  order_index integer not null default 0,
  title text not null,
  description text not null,
  document_type_id text,
  status text not null check (status in ('pending', 'in_progress', 'done')) default 'pending',
  created_at timestamptz not null default now()
);

alter table roadmap_steps enable row level security;

drop policy if exists "Owners and admins view roadmap" on roadmap_steps;
create policy "Owners and admins view roadmap" on roadmap_steps
  for select using (
    exists (select 1 from entities e where e.id = entity_id and (e.owner_id = auth.uid()
      or exists (select 1 from profiles where id = auth.uid() and role = 'admin')))
  );

drop policy if exists "Owners insert own roadmap" on roadmap_steps;
create policy "Owners insert own roadmap" on roadmap_steps
  for insert with check (
    exists (select 1 from entities e where e.id = entity_id and e.owner_id = auth.uid())
  );

drop policy if exists "Owners update own roadmap" on roadmap_steps;
create policy "Owners update own roadmap" on roadmap_steps
  for update using (
    exists (select 1 from entities e where e.id = entity_id and e.owner_id = auth.uid())
  );
