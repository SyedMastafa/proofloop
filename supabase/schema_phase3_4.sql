-- Phase 3 & 4: sequences, enrollments, campaigns
-- Run after schema_phase2.sql

create table if not exists public.sequences (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  is_active boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.sequence_steps (
  id uuid primary key default gen_random_uuid(),
  sequence_id uuid references public.sequences(id) on delete cascade not null,
  step_order int not null default 0,
  delay_days int not null default 0,
  subject text not null,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists public.sequence_enrollments (
  id uuid primary key default gen_random_uuid(),
  sequence_id uuid references public.sequences(id) on delete cascade not null,
  lead_id uuid references public.leads(id) on delete cascade not null,
  current_step int not null default 0,
  status text not null default 'active'
    check (status in ('active', 'paused', 'completed', 'unsubscribed')),
  next_run_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (sequence_id, lead_id)
);

create index if not exists seq_enroll_next_idx
  on public.sequence_enrollments(next_run_at)
  where status = 'active';

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  channel text not null default 'x'
    check (channel in ('x', 'linkedin', 'email', 'other')),
  body text not null,
  status text not null default 'idea'
    check (status in ('idea', 'scheduled', 'published', 'archived')),
  scheduled_for timestamptz,
  published_at timestamptz,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists campaigns_status_idx on public.campaigns(status);

alter table public.sequences enable row level security;
alter table public.sequence_steps enable row level security;
alter table public.sequence_enrollments enable row level security;
alter table public.campaigns enable row level security;

-- Seed default onboarding sequence (inactive until you activate)
insert into public.sequences (id, name, description, is_active)
values (
  'a0000000-0000-4000-8000-000000000001',
  'Free user onboarding',
  'Day 0 / 3 / 7 nurture toward first story + upgrade',
  false
)
on conflict (id) do nothing;

insert into public.sequence_steps (sequence_id, step_order, delay_days, subject, body)
values
(
  'a0000000-0000-4000-8000-000000000001',
  0, 0,
  'Welcome — your first proof in under a minute',
  E'Hi,\n\nThanks for trying ProofLoop.\n\nPaste one piece of customer feedback into the generator and hit Generate — you''ll get a polished testimonial you can share the same day.\n\n→ Open generator: {{app_url}}/dashboard\n\n— ProofLoop'
),
(
  'a0000000-0000-4000-8000-000000000001',
  1, 3,
  'Still sitting on raw feedback?',
  E'Hi,\n\nMost teams already have wins buried in Slack or support tickets.\n\nProofLoop turns that into testimonials and case studies without a content sprint.\n\nIf you have 2 minutes: {{app_url}}/dashboard\n\n— ProofLoop'
),
(
  'a0000000-0000-4000-8000-000000000001',
  2, 7,
  'Case studies without the writing backlog',
  E'Hi,\n\nWhen sales asks for proof, marketing shouldn''t start from a blank page.\n\nChallenge → Solution → Results is built into ProofLoop. Free plan includes 3 stories.\n\nPricing: {{app_url}}/pricing\n\n— ProofLoop'
)
on conflict do nothing;
