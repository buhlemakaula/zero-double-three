-- ─────────────────────────────────────────────────────────────────────────
-- Phase 3: Web Push notifications for the studio (free — no per-message cost).
--
-- VAPID keys + a push_secret are stored in the private admin_config table and
-- set out-of-band (never committed). The browser subscribes with the public
-- key; the `notify` edge function signs pushes with the private key.
-- ─────────────────────────────────────────────────────────────────────────

alter table admin_config add column if not exists vapid_public  text;
alter table admin_config add column if not exists vapid_private text;
alter table admin_config add column if not exists push_secret   text;

create table if not exists push_subscriptions (
  endpoint   text primary key,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);
alter table push_subscriptions enable row level security; -- via RPCs / service role only

-- Public: the VAPID public key the browser needs to subscribe.
create or replace function push_public_key()
returns text language sql stable security definer set search_path = public as $$
  select vapid_public from admin_config where id = 1;
$$;
grant execute on function push_public_key() to anon, authenticated;

-- Admin: register this device for push (passcode-gated — only the studio).
create or replace function add_push_subscription(pass text, sub jsonb)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  insert into push_subscriptions (endpoint, p256dh, auth)
  values (sub->>'endpoint', sub#>>'{keys,p256dh}', sub#>>'{keys,auth}')
  on conflict (endpoint) do nothing;
  return true;
end $$;
grant execute on function add_push_subscription(text,jsonb) to anon, authenticated;

-- After running this migration, set the keys out-of-band (values not in git):
--   update admin_config set
--     vapid_public  = '<public>',
--     vapid_private = '<private>',
--     push_secret   = encode(extensions.gen_random_bytes(16),'hex')
--   where id = 1;
