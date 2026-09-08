-- LIMRA AI — subscriptions (runtime table name: subscriptions)
-- Run in Supabase SQL Editor (after profiles.sql).
-- One row per user; the trigger keeps it in sync with auth.users.

create table if not exists subscriptions (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'growth', 'enterprise')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'past_due', 'trialing')),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

alter table subscriptions enable row level security;

-- Users can read their own subscription
create policy "Users can view own subscription" on subscriptions
  for select using (auth.uid() = id);

-- Auto-create a free subscription row whenever someone signs up
create or replace function public.handle_new_subscription()
returns trigger as $$
begin
  insert into public.subscriptions (id, plan, status)
  values (new.id, 'free', 'active')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_sub on auth.users;
create trigger on_auth_user_created_sub
  after insert on auth.users
  for each row execute procedure public.handle_new_subscription();

-- Edge: expandable premium demo flag for the free-sandbox flow.
create table if not exists user_premium_boosts (
  id uuid primary key references auth.users(id) on delete cascade,
  premium boolean not null default true,
  source text not null default 'sandbox-demo',
  created_at timestamptz not null default now()
);

alter table user_premium_boosts enable row level security;
create policy "Users can view own boost" on user_premium_boosts
  for select using (auth.uid() = id);