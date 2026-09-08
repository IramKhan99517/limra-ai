-- LIMRA AI — MFA enrollments
-- Run in Supabase SQL Editor.
-- Stores TOTP secrets + recovery codes per user (client-side enrollment).

create table if not exists mfa_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  method text not null check (method in ('totp', 'email_otp', 'sms_otp')),
  secret text,               -- TOTP base32 secret (email/sms: null)
  recovery_codes text[] default '{}',
  trusted_devices text[] default '{}',
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

alter table mfa_enrollments enable row level security;

create policy "Users can view own mfa" on mfa_enrollments
  for select using (auth.uid() = user_id);

create policy "Users can insert own mfa" on mfa_enrollments
  for insert with check (auth.uid() = user_id);

create policy "Users can update own mfa" on mfa_enrollments
  for update using (auth.uid() = user_id);