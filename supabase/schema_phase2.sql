-- Phase 2: leads, events, agent tasks
-- Run in Supabase SQL Editor after schema.sql

create table if not exists public.product_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  event text not null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists product_events_event_idx on public.product_events(event);
create index if not exists product_events_created_idx on public.product_events(created_at desc);
create index if not exists product_events_user_idx on public.product_events(user_id);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  user_id uuid references auth.users(id) on delete set null,
  source text default 'app',
  score int default 0,
  temperature text default 'cold' check (temperature in ('hot', 'warm', 'cold')),
  stage text default 'new' check (stage in ('new', 'nurture', 'qualified', 'won', 'lost')),
  notes text,
  last_event text,
  last_seen_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (email)
);

create index if not exists leads_score_idx on public.leads(score desc);
create index if not exists leads_stage_idx on public.leads(stage);

create table if not exists public.agent_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  type text not null default 'email',
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'sent', 'failed', 'rejected')),
  subject text,
  body text not null,
  to_email text,
  meta jsonb default '{}'::jsonb,
  error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  sent_at timestamptz
);

create index if not exists agent_tasks_status_idx on public.agent_tasks(status);

-- RLS: service role bypasses; no public access via anon by default
alter table public.product_events enable row level security;
alter table public.leads enable row level security;
alter table public.agent_tasks enable row level security;

-- Authenticated users can insert their own events
create policy "Users insert own events"
  on public.product_events for insert
  with check (auth.uid() = user_id or user_id is null);

-- No select for anon on leads/tasks (admin uses service role)
