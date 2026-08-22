-- LIMRA AI schema
-- Run this once against your Neon / Supabase Postgres database.
-- (psql "$DATABASE_URL" -f lib/schema.sql)

create table if not exists entities (
  id serial primary key,
  name text not null,
  owner text not null,
  status text not null check (status in ('active', 'pending', 'suspended')) default 'pending',
  saudization_score numeric(5,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists licenses (
  id serial primary key,
  entity_id integer not null references entities(id) on delete cascade,
  type text not null,
  status text not null check (status in ('approved', 'in_review', 'expiring', 'expired')) default 'in_review',
  issue_date date,
  expiry_date date
);

create table if not exists filings (
  id serial primary key,
  entity_id integer not null references entities(id) on delete cascade,
  title text not null,
  due_date date not null,
  status text not null check (status in ('pending', 'submitted', 'overdue')) default 'pending'
);

create table if not exists compliance_activity (
  id serial primary key,
  entity_id integer not null references entities(id) on delete cascade,
  week_start date not null,
  score numeric(5,2) not null
);

create index if not exists idx_licenses_entity on licenses(entity_id);
create index if not exists idx_filings_entity on filings(entity_id);
create index if not exists idx_activity_entity on compliance_activity(entity_id);
