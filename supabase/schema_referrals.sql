-- Referral tracking (run after main schema.sql)

create table if not exists public.referral_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  code text unique not null,
  label text,
  clicks int default 0,
  signups int default 0,
  created_at timestamptz default now()
);

create table if not exists public.referral_events (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  event_type text not null check (event_type in ('click', 'signup')),
  meta jsonb default '{}',
  created_at timestamptz default now()
);

alter table public.referral_links enable row level security;
alter table public.referral_events enable row level security;

create policy "Users manage own referral links"
  on public.referral_links for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can log referral events"
  on public.referral_events for insert
  with check (true);

create policy "Users can view events for their codes"
  on public.referral_events for select
  using (
    code in (select code from public.referral_links where user_id = auth.uid())
  );

create index if not exists referral_links_code_idx on public.referral_links(code);
create index if not exists referral_links_user_idx on public.referral_links(user_id);
create index if not exists referral_events_code_idx on public.referral_events(code);
