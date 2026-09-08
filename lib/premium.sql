-- LIMRA AI — premium features schema
-- Run in Supabase SQL Editor (after profiles.sql, subscriptions.sql, mfa.sql).
-- Stores the AI-generated artifacts behind the premium modules so history
-- persists per user: name suggestions, Arabic variants, domain intelligence
-- results, grant recommendations, and roadmap generations.

-- ------------------------------------------------------------------ --
-- Name suggestions (Name Studio / Recommended Business Names)        --
-- ------------------------------------------------------------------ --
create table if not exists name_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idea text not null default '',                 -- the business idea / seed used
  category text not null check (category in ('english', 'arabic', 'brandable', 'seo')),
  name text not null,
  meaning text,
  industry_fit text,
  brand_score int,
  domain_score int,
  transliteration_ar text,
  brand_version_ar text,
  created_at timestamptz not null default now()
);

alter table name_suggestions enable row level security;
create policy "Users can view own name suggestions" on name_suggestions
  for select using (auth.uid() = user_id);
create policy "Users can insert own name suggestions" on name_suggestions
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own name suggestions" on name_suggestions
  for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------------ --
-- Arabic variants (transliteration + brand adaptation per name)      --
-- ------------------------------------------------------------------ --
create table if not exists arabic_variants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  suggestion_id uuid references name_suggestions(id) on delete set null,
  english text not null,
  transliteration_ar text,
  brand_version_ar text,
  created_at timestamptz not null default now()
);

alter table arabic_variants enable row level security;
create policy "Users can view own arabic variants" on arabic_variants
  for select using (auth.uid() = user_id);
create policy "Users can insert own arabic variants" on arabic_variants
  for insert with check (auth.uid() = user_id);

-- ------------------------------------------------------------------ --
-- Domain intelligence results                                        --
-- ------------------------------------------------------------------ --
create table if not exists domain_intelligence_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand text not null,
  domain text not null,
  ext text not null,
  available boolean,
  premium boolean not null default false,
  best_price numeric,
  best_registrar text,
  checked_at timestamptz not null default now()
);

alter table domain_intelligence_results enable row level security;
create policy "Users can view own domain results" on domain_intelligence_results
  for select using (auth.uid() = user_id);
create policy "Users can insert own domain results" on domain_intelligence_results
  for insert with check (auth.uid() = user_id);

-- ------------------------------------------------------------------ --
-- Grant recommendations                                              --
-- ------------------------------------------------------------------ --
create table if not exists grant_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grant_name text not null,
  provider text,
  type text,
  amount text,
  eligibility text[] default '{}',
  action_plan text,
  matched_at timestamptz not null default now()
);

alter table grant_recommendations enable row level security;
create policy "Users can view own grant recommendations" on grant_recommendations
  for select using (auth.uid() = user_id);
create policy "Users can insert own grant recommendations" on grant_recommendations
  for insert with check (auth.uid() = user_id);

-- ------------------------------------------------------------------ --
-- Roadmap history (per generation)                                   --
-- ------------------------------------------------------------------ --
create table if not exists roadmap_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile jsonb not null default '{}',          -- activity / ownership / legal structure
  idea text not null default '',
  stage_count int,
  step_count int,
  total_fee_low_sar int,
  total_fee_high_sar int,
  generated_at timestamptz not null default now()
);

alter table roadmap_history enable row level security;
create policy "Users can view own roadmap history" on roadmap_history
  for select using (auth.uid() = user_id);
create policy "Users can insert own roadmap history" on roadmap_history
  for insert with check (auth.uid() = user_id);

-- Indexes for the common per-user listing queries
create index if not exists idx_name_suggestions_user on name_suggestions (user_id, created_at desc);
create index if not exists idx_domain_results_user on domain_intelligence_results (user_id, checked_at desc);
create index if not exists idx_grant_recs_user on grant_recommendations (user_id, matched_at desc);
create index if not exists idx_roadmap_history_user on roadmap_history (user_id, generated_at desc);