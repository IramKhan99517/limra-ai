-- Run this in Supabase SQL Editor.
-- Requires lib/profiles.sql to have been run already.

-- Metadata table: one row per document a user has uploaded
create table if not exists user_documents (
  id serial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type_id text not null,   -- matches an id in lib/documentTypes.ts
  file_name text not null,
  file_path text not null,          -- path inside the 'vault' storage bucket
  status text not null check (status in ('uploaded', 'approved', 'rejected')) default 'uploaded',
  uploaded_at timestamptz not null default now()
);

alter table user_documents enable row level security;

create policy "Users manage own documents" on user_documents
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Storage bucket for the actual files (private — not publicly accessible)
insert into storage.buckets (id, name, public)
values ('vault', 'vault', false)
on conflict (id) do nothing;

-- Each user can only read/write files inside a folder named after their own user id
create policy "Users can upload to own vault folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'vault' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view own vault files" on storage.objects
  for select to authenticated
  using (bucket_id = 'vault' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own vault files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'vault' and (storage.foldername(name))[1] = auth.uid()::text);
