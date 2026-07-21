-- ─────────────────────────────────────────────────────────────────────────
-- Phase 1: zero-cost "you're confirmed" page + private studio address.
--
-- the studio sends a per-booking link over her normal WhatsApp once she confirms.
-- The page shows the appointment + policies + studio address. The address is
-- kept in the PRIVATE admin_config table and only returned by booking_public()
-- once the booking is confirmed — so it never leaks via the public settings.
-- ─────────────────────────────────────────────────────────────────────────

alter table admin_config add column if not exists studio_address text;
alter table admin_config add column if not exists address_note   text;

-- Public per-booking data. The booking id (unguessable uuid) is the token.
create or replace function booking_public(b_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare b bookings; addr text; note text;
begin
  select * into b from bookings where id = b_id;
  if not found then
    return jsonb_build_object('found', false);
  end if;
  if b.status in ('confirmed','completed') then
    select studio_address, address_note into addr, note from admin_config where id = 1;
  end if;
  return jsonb_build_object(
    'found', true,
    'service_name', b.service_name,
    'date', b.date,
    'time', b.time,
    'status', b.status,
    'total', b.total,
    'deposit', b.deposit,
    'is_callout', b.is_callout,
    'client_name', b.client_name,
    'address', addr,
    'address_note', note
  );
end $$;
grant execute on function booking_public(uuid) to anon, authenticated;

-- Admin: read + set the studio address (passcode-gated).
create or replace function admin_get_studio(pass text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare a text; n text;
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  select studio_address, address_note into a, n from admin_config where id = 1;
  return jsonb_build_object('studio_address', a, 'address_note', n);
end $$;

create or replace function admin_set_studio(pass text, p_address text, p_note text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  update admin_config set studio_address = p_address, address_note = p_note where id = 1;
  return true;
end $$;

grant execute on function admin_get_studio(text) to anon, authenticated;
grant execute on function admin_set_studio(text,text,text) to anon, authenticated;
