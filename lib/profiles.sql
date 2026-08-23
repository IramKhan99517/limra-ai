-- Run this in Supabase SQL Editor.
-- Creates a profiles table linked to Supabase's built-in auth.users,
-- with a role column so we can tell regular users apart from admins.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('user', 'admin')) default 'user',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Users can read their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- After running the above, promote yourself to admin by running:
--
--   update profiles set role = 'admin' where email = 'your-email@example.com';
--
-- (Do this only after you've signed up on the site with that email once,
-- so the profile row already exists.)
-- ─────────────────────────────────────────────────────────────
