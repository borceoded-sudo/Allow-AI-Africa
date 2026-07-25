-- Allow AI Africa — initial schema
--
-- Two write-only public tables. The site collects leads and newsletter
-- signups; nothing on the marketing page ever reads them back, so the
-- anon role gets INSERT and nothing else. Reads are left to the service
-- role (server-side) and to authenticated staff via Supabase Studio.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Contact submissions
-- ---------------------------------------------------------------------------

create table if not exists public.contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  first_name    text not null check (char_length(trim(first_name)) between 1 and 80),
  last_name     text     check (last_name is null or char_length(last_name) <= 80),
  email         text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  organisation  text     check (organisation is null or char_length(organisation) <= 120),
  phone         text     check (phone is null or char_length(phone) <= 40),
  message       text not null check (char_length(trim(message)) between 1 and 4000),
  source        text not null default 'website',
  -- Best-effort request metadata, useful for triage and abuse review
  user_agent    text,
  status        text not null default 'new'
                check (status in ('new', 'triaged', 'replied', 'archived', 'spam'))
);

comment on table public.contact_submissions is
  'Leads captured by the marketing site contact form. Insert-only for anon.';

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

create index if not exists contact_submissions_status_idx
  on public.contact_submissions (status)
  where status = 'new';

-- ---------------------------------------------------------------------------
-- Newsletter subscribers
-- ---------------------------------------------------------------------------

create table if not exists public.newsletter_subscribers (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  email          text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source         text not null default 'footer',
  unsubscribed_at timestamptz
);

comment on table public.newsletter_subscribers is
  'Footer newsletter signups. Insert-only for anon; re-subscribing is a no-op.';

-- Case-insensitive uniqueness so Ada@x.com and ada@x.com are one subscriber
create unique index if not exists newsletter_subscribers_email_key
  on public.newsletter_subscribers (lower(email));

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.contact_submissions   enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Anonymous visitors may only ever add a row. No select, update or delete
-- policy exists, so RLS denies those by default even with the anon key.
drop policy if exists "anon can submit contact form" on public.contact_submissions;
create policy "anon can submit contact form"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "anon can subscribe" on public.newsletter_subscribers;
create policy "anon can subscribe"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (unsubscribed_at is null);
