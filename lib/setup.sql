-- LIMRA AI — schema + sample data
-- Paste this whole file into your Neon or Supabase SQL editor and run it once.

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

create table if not exists bookings (
  id serial primary key,
  expert_name text not null,
  client_name text not null,
  client_email text not null,
  message text,
  preferred_date date,
  status text not null check (status in ('new', 'contacted', 'confirmed', 'cancelled')) default 'new',
  created_at timestamptz not null default now()
);

create index if not exists idx_licenses_entity on licenses(entity_id);
create index if not exists idx_filings_entity on filings(entity_id);
create index if not exists idx_activity_entity on compliance_activity(entity_id);

-- Clear any existing sample data before re-seeding
delete from compliance_activity;
delete from filings;
delete from licenses;
delete from entities;

insert into entities (name, owner, status, saudization_score) values
  ('Najd Tech Solutions LLC', 'Layla Al-Otaibi', 'active', 71),
  ('Falak Logistics', 'Omar Al-Harbi', 'active', 64),
  ('Dammam Steel Works', 'Sara Al-Qahtani', 'active', 58),
  ('Riyadh Cloud Systems', 'Yousef Al-Dossari', 'pending', 45),
  ('Jeddah Retail Group', 'Nora Al-Zahrani', 'active', 76),
  ('NEOM Advisory Partners', 'Khalid Al-Ghamdi', 'active', 69),
  ('Tabuk Agri Innovations', 'Huda Al-Shehri', 'pending', 38),
  ('Eastern Petrochem Services', 'Faisal Al-Mutairi', 'active', 61),
  ('Makkah Hospitality Co.', 'Amal Al-Amri', 'suspended', 29),
  ('Vision Data Labs', 'Bandar Al-Rashid', 'active', 82),
  ('Qassim Manufacturing', 'Reem Al-Subaie', 'active', 55),
  ('Riyadh Regional HQ Trading', 'Mishal Al-Anazi', 'active', 88);

-- Licenses: 3 per entity, cycling through common license types
insert into licenses (entity_id, type, status, issue_date, expiry_date)
select
  e.id,
  (array[
    'MISA Foreign Investment License', 'Commercial Registration', 'ZATCA Tax Registration',
    'GOSI Registration', 'Municipal License', 'SAGIA Industrial License',
    'Import/Export License', 'SEZ Operating Permit', 'Civil Defense Permit',
    'Environmental Compliance Certificate', 'Saudization (Nitaqat) Certificate', 'Trademark Registration'
  ])[((e.id + s.i) % 12) + 1],
  (array['approved','approved','approved','approved','in_review','approved','expiring','approved','in_review','approved','approved','expired'])[((e.id + s.i) % 12) + 1],
  now() - (interval '1 day' * (30 + e.id * 5)),
  now() + (interval '1 day' * (180 - e.id * 3))
from entities e
cross join (select generate_series(0,2) as i) s;

-- Filings: 1-3 per entity
insert into filings (entity_id, title, due_date, status)
select
  e.id,
  (array[
    'Quarterly ZATCA VAT Return', 'GOSI Monthly Contribution', 'Nitaqat Saudization Report',
    'Annual MISA License Renewal', 'Municipal License Renewal', 'Environmental Compliance Audit'
  ])[((e.id + s.i) % 6) + 1],
  now() + (interval '1 day' * (5 + s.i * 9 - (e.id % 5))),
  case when s.i = 0 then 'pending' when e.id % 4 = 0 then 'overdue' else 'submitted' end
from entities e
cross join lateral (select generate_series(0, (e.id % 3)) as i) s;

-- 8 weeks of compliance activity per entity, for the dashboard trend chart
insert into compliance_activity (entity_id, week_start, score)
select
  e.id,
  now() - (interval '1 week' * (7 - w.i)),
  least(99, (55 + (e.id % 5) * 6) + w.i * 2 + (e.id % 3))
from entities e
cross join (select generate_series(0,7) as i) w;
