-- LIMRA AI — KSA Setup Journey Engine migration (v1)
-- Adds business-profile columns to entities and journey metadata to roadmap_steps.
-- Safe to run multiple times (IF NOT EXISTS). No RLS changes needed — existing
-- policies in roadmap.sql already cover both tables.

-- Business profile captured at onboarding, used to branch the journey.
alter table entities add column if not exists ownership text;          -- 'foreign' | 'saudi_gcc'
alter table entities add column if not exists legal_structure text;    -- 'llc' | 'branch' | 'sole_establishment'

-- Stable engine key + stage for grouping/enrichment. Legacy rows keep null
-- values and fall back to flat rendering on the dashboard.
alter table roadmap_steps add column if not exists step_key text;
alter table roadmap_steps add column if not exists stage text;
