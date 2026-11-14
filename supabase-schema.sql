-- Run this in Supabase SQL Editor. Keep the service-role key only in Vercel Environment Variables.
create table if not exists public.project_requests (
  id bigint generated always as identity primary key,
  reference text unique not null,
  name text not null,
  email text not null,
  project_type text not null,
  description text not null,
  created_at timestamptz not null default now()
);

alter table public.project_requests enable row level security;

-- No public policies are created. Anonymous visitors cannot read or write this table directly.
-- The Vercel serverless endpoint inserts using the service-role key, which bypasses RLS.
