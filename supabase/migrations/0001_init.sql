-- ─────────────────────────────────────────────────────────────────────────
-- Glammified by Kwannz — initial schema
-- Tables: services, clients, bookings, stamps, settings, referrals,
--         portfolio_images
--
-- Key invariant: rows in `stamps` are only ever written when a booking
-- reaches status = 'completed'. This is enforced by a trigger, not the client.
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── settings ──────────────────────────────────────────────────────────────
-- Single-row table the artist controls. Deposit rates, working hours, buffers,
-- caps, blackout dates and quiet-slot rules all live here.
create table if not exists settings (
  id                   int primary key default 1,
  deposit_rate         numeric not null default 0.5,
  trusted_deposit_rate numeric not null default 0.25,
  working_hours        jsonb  not null default '{}'::jsonb,
  slot_interval_minutes int   not null default 30,
  buffer_minutes       int    not null default 30,
  max_bookings_per_day int    not null default 4,
  min_lead_hours       int    not null default 24,
  blackout_dates       date[] not null default '{}',
  quiet                jsonb  not null default '{}'::jsonb,
  business             jsonb  not null default '{}'::jsonb,
  constraint settings_singleton check (id = 1)
);

-- ── services ─────────────────────────────────────────────────────────────
create table if not exists services (
  id           text primary key,
  category     text not null check (category in ('makeup','hair','callout')),
  name         text not null,
  price        int  not null,          -- ZAR, whole rand
  duration_min int,                    -- null where no fixed duration
  photo        text,
  description  text,
  highlight    text,
  caption      text,
  sort         int default 0
);

-- ── clients ──────────────────────────────────────────────────────────────
create table if not exists clients (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  phone         text not null,
  email         text,
  referral_code text unique default substr(md5(random()::text), 1, 6),
  trusted       boolean not null default false,
  clean_streak  int not null default 0,   -- completed bookings w/o late strikes
  created_at    timestamptz not null default now()
);
create index if not exists clients_phone_idx on clients (phone);

-- ── bookings ─────────────────────────────────────────────────────────────
create table if not exists bookings (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid references clients(id) on delete set null,
  service_id      text references services(id),
  service_name    text not null,
  addons          jsonb not null default '[]'::jsonb,
  is_callout      boolean not null default false,
  group_size      int,
  date            date not null,
  time            text not null,          -- "HH:MM" 24h
  duration_min    int,
  total           int not null,
  deposit         int not null,
  is_quiet        boolean not null default false,
  referral_code   text,
  client_name     text,
  client_phone    text,
  client_email    text,
  notes           text,
  pop_url         text,                   -- proof-of-payment upload
  status          text not null default 'pending'
                  check (status in ('pending','confirmed','completed',
                                    'client_cancel','late_cancel',
                                    'late_arrival_cancel')),
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);
create index if not exists bookings_date_idx on bookings (date);
create index if not exists bookings_client_idx on bookings (client_id);

-- ── stamps ───────────────────────────────────────────────────────────────
-- One row per stamp-earning event. `count` carries multi-stamp awards
-- (double / group). Only written by the completion trigger below.
create table if not exists stamps (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references clients(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  count      int not null default 1,
  reason     text,                        -- base | quiet | referral | callout-group
  earned_at  timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '12 months')
);
create index if not exists stamps_client_idx on stamps (client_id);

-- ── referrals ────────────────────────────────────────────────────────────
create table if not exists referrals (
  id           uuid primary key default gen_random_uuid(),
  code         text not null,            -- the referrer's code, used at checkout
  referrer_id  uuid references clients(id) on delete set null,
  referred_id  uuid references clients(id) on delete set null,
  booking_id   uuid references bookings(id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ── portfolio_images ─────────────────────────────────────────────────────
create table if not exists portfolio_images (
  id    uuid primary key default gen_random_uuid(),
  src   text not null,
  alt   text not null,           -- required: accessibility
  span  text default 'wide',     -- 'tall' | 'wide' drives the grid
  sort  int default 0
);

-- ─────────────────────────────────────────────────────────────────────────
-- Stamp issuance trigger — the load-bearing guardrail.
-- Fires only when a booking becomes 'completed', computes stamps by the same
-- rules as the client (loyalty.js), and updates Trusted-Client tracking.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function issue_stamps_on_completion()
returns trigger as $$
declare
  n int;
  why text;
begin
  -- Only on the transition into 'completed', and never twice.
  if new.status = 'completed' and coalesce(old.status,'') <> 'completed' then
    if new.client_id is not null then
      if new.is_callout then
        n := greatest(coalesce(new.group_size,3), 3);
        why := 'callout-group';
      else
        n := 1; why := 'base';
        if new.is_quiet then n := n + 1; why := 'quiet'; end if;
        if new.referral_code is not null then n := n + 1; why := why || '+referral'; end if;
      end if;

      insert into stamps (client_id, booking_id, count, reason)
      values (new.client_id, new.id, n, why);

      -- Reliability streak: a completion advances it; Trusted after 3 clean.
      update clients
         set clean_streak = clean_streak + 1,
             trusted = (clean_streak + 1 >= 3)
       where id = new.client_id;
    end if;
    new.completed_at := now();
  end if;

  -- A late strike forfeits nothing to issue (no stamp) AND resets Trusted.
  if new.status in ('late_cancel','late_arrival_cancel')
     and coalesce(old.status,'') not in ('late_cancel','late_arrival_cancel') then
    if new.client_id is not null then
      update clients set clean_streak = 0, trusted = false where id = new.client_id;
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_issue_stamps on bookings;
create trigger trg_issue_stamps
  before update on bookings
  for each row execute function issue_stamps_on_completion();

-- ─────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- Public site can: read services / portfolio / settings, create a booking,
-- upsert their own client record. It can NEVER write stamps or flip a booking
-- to 'completed' — those are artist/service-role only.
-- ─────────────────────────────────────────────────────────────────────────
alter table services         enable row level security;
alter table portfolio_images enable row level security;
alter table settings         enable row level security;
alter table clients          enable row level security;
alter table bookings         enable row level security;
alter table stamps           enable row level security;
alter table referrals        enable row level security;

-- Public read of catalog-style tables.
create policy "public read services"  on services         for select using (true);
create policy "public read portfolio" on portfolio_images for select using (true);
create policy "public read settings"  on settings         for select using (true);

-- Anonymous visitors may create a client + a pending booking.
create policy "anon create client"  on clients  for insert with check (true);
create policy "anon create booking" on bookings for insert
  with check (status = 'pending');

-- Stamps + referrals are never client-writable; only the service role
-- (bypasses RLS) and the completion trigger touch them. No policies added =
-- no anon access.
