-- Contract Analyzer: persisted analyses so users can revisit past results.
-- Run this in Supabase SQL Editor (requires lib/profiles.sql first).

create table if not exists contract_analyses (
  id serial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  contract_type text,
  summary text not null,
  key_terms jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table contract_analyses enable row level security;

create policy "Users manage own contract analyses" on contract_analyses
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_contract_analyses_user
  on contract_analyses(user_id, created_at desc);
