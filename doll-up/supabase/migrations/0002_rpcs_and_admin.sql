-- ─────────────────────────────────────────────────────────────────────────
-- Doll Up Hair & Nail Art — booking RPCs + passcode-gated admin
--
-- The public site never touches client PII directly. All writes go through
-- SECURITY DEFINER functions:
--   • booked_slots(date)   → busy ranges only (no names/phones), for the
--                            availability engine.
--   • book_appointment(…)  → de-dupes the client by phone, records referrals,
--                            inserts a pending booking.
--
-- The artist manages everything through passcode-gated admin_* functions.
-- The passcode is bcrypt-hashed in admin_config (never client-readable).
-- Change the default immediately with admin_set_passcode / the dashboard.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists admin_config (
  id            int primary key default 1 check (id = 1),
  passcode_hash text not null
);
alter table admin_config enable row level security; -- deny-all: only definer fns

-- Seed a placeholder passcode, then CHANGE IT immediately from the dashboard
-- (Availability → Change passcode) or with:
--   select admin_set_passcode('CHANGE_ME_ON_FIRST_LOGIN', 'your-new-passcode');
-- Never commit a real passcode to the repo.
insert into admin_config (id, passcode_hash)
values (1, extensions.crypt('CHANGE_ME_ON_FIRST_LOGIN', extensions.gen_salt('bf')))
on conflict (id) do nothing;

create or replace function _admin_ok(pass text)
returns boolean language sql stable security definer set search_path = public, extensions as $$
  select exists (
    select 1 from admin_config where id = 1 and passcode_hash = extensions.crypt(pass, passcode_hash)
  );
$$;

-- Stamp trigger (adds referrer stamp on completion — both sides earn one).
create or replace function issue_stamps_on_completion()
returns trigger language plpgsql set search_path = public as $$
declare
  n int;
  why text;
  ref_id uuid;
begin
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

      update clients
         set clean_streak = clean_streak + 1,
             trusted = (clean_streak + 1 >= 3)
       where id = new.client_id;

      if new.referral_code is not null then
        select id into ref_id from clients
          where referral_code = new.referral_code and id <> new.client_id limit 1;
        if ref_id is not null then
          insert into stamps (client_id, booking_id, count, reason)
          values (ref_id, new.id, 1, 'referrer');
        end if;
      end if;
    end if;
    new.completed_at := now();
  end if;

  if new.status in ('late_cancel','late_arrival_cancel')
     and coalesce(old.status,'') not in ('late_cancel','late_arrival_cancel') then
    if new.client_id is not null then
      update clients set clean_streak = 0, trusted = false where id = new.client_id;
    end if;
  end if;

  return new;
end;
$$;

-- Public: busy ranges for a date, no PII.
create or replace function booked_slots(d date)
returns table ("date" date, "time" text, duration_min int)
language sql stable security definer set search_path = public as $$
  select b.date, b.time, b.duration_min
  from bookings b
  where b.date = d and b.status in ('pending','confirmed','completed');
$$;

-- Public: create a booking, de-duping the client by phone.
create or replace function book_appointment(
  p_service_id text, p_service_name text, p_addons jsonb, p_is_callout boolean,
  p_group_size int, p_date date, p_time text, p_duration_min int, p_total int,
  p_deposit int, p_is_quiet boolean, p_referral_code text, p_name text,
  p_phone text, p_email text, p_notes text
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_client uuid; v_code text; v_booking uuid; v_ref uuid;
begin
  select id, referral_code into v_client, v_code from clients where phone = p_phone limit 1;
  if v_client is null then
    insert into clients (name, phone, email) values (p_name, p_phone, nullif(p_email,''))
      returning id, referral_code into v_client, v_code;
  end if;

  if p_referral_code is not null and p_referral_code <> '' then
    select id into v_ref from clients where referral_code = p_referral_code and id <> v_client limit 1;
  end if;

  insert into bookings (
    client_id, service_id, service_name, addons, is_callout, group_size, date, time,
    duration_min, total, deposit, is_quiet, referral_code, client_name, client_phone,
    client_email, notes, status
  ) values (
    v_client, p_service_id, p_service_name, coalesce(p_addons,'[]'::jsonb), p_is_callout,
    p_group_size, p_date, p_time, p_duration_min, p_total, p_deposit, p_is_quiet,
    nullif(p_referral_code,''), p_name, p_phone, nullif(p_email,''), nullif(p_notes,''), 'pending'
  ) returning id into v_booking;

  if v_ref is not null then
    insert into referrals (code, referrer_id, referred_id, booking_id)
    values (p_referral_code, v_ref, v_client, v_booking);
  end if;

  return jsonb_build_object('booking_id', v_booking, 'client_id', v_client, 'referral_code', v_code);
end;
$$;

-- Admin (all passcode-gated).
create or replace function admin_check(pass text)
returns boolean language sql stable security definer set search_path = public as $$
  select _admin_ok(pass);
$$;

create or replace function admin_list_bookings(pass text, from_date date)
returns setof bookings language plpgsql stable security definer set search_path = public as $$
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  return query select * from bookings where date >= from_date order by date, time;
end;
$$;

create or replace function admin_set_status(pass text, b_id uuid, new_status text)
returns bookings language plpgsql security definer set search_path = public as $$
declare row_out bookings;
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  update bookings set status = new_status where id = b_id returning * into row_out;
  return row_out;
end;
$$;

create or replace function admin_update_settings(pass text, patch jsonb)
returns settings language plpgsql security definer set search_path = public as $$
declare row_out settings;
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  update settings set
    working_hours         = coalesce(patch->'working_hours', working_hours),
    quiet                 = coalesce(patch->'quiet', quiet),
    buffer_minutes        = coalesce((patch->>'buffer_minutes')::int, buffer_minutes),
    slot_interval_minutes = coalesce((patch->>'slot_interval_minutes')::int, slot_interval_minutes),
    max_bookings_per_day  = coalesce((patch->>'max_bookings_per_day')::int, max_bookings_per_day),
    min_lead_hours        = coalesce((patch->>'min_lead_hours')::int, min_lead_hours),
    deposit_rate          = coalesce((patch->>'deposit_rate')::numeric, deposit_rate),
    trusted_deposit_rate  = coalesce((patch->>'trusted_deposit_rate')::numeric, trusted_deposit_rate)
  where id = 1 returning * into row_out;
  return row_out;
end;
$$;

create or replace function admin_add_blackout(pass text, d date)
returns settings language plpgsql security definer set search_path = public as $$
declare row_out settings;
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  update settings set blackout_dates =
    case when d = any(blackout_dates) then blackout_dates else array_append(blackout_dates, d) end
  where id = 1 returning * into row_out;
  return row_out;
end;
$$;

create or replace function admin_remove_blackout(pass text, d date)
returns settings language plpgsql security definer set search_path = public as $$
declare row_out settings;
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  update settings set blackout_dates = array_remove(blackout_dates, d)
  where id = 1 returning * into row_out;
  return row_out;
end;
$$;

create or replace function admin_set_passcode(pass_old text, pass_new text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
begin
  if not _admin_ok(pass_old) then raise exception 'unauthorized'; end if;
  if length(pass_new) < 6 then raise exception 'passcode too short'; end if;
  update admin_config set passcode_hash = extensions.crypt(pass_new, extensions.gen_salt('bf')) where id = 1;
  return true;
end;
$$;

grant execute on function booked_slots(date) to anon, authenticated;
grant execute on function book_appointment(text,text,jsonb,boolean,int,date,text,int,int,int,boolean,text,text,text,text,text) to anon, authenticated;
grant execute on function admin_check(text) to anon, authenticated;
grant execute on function admin_list_bookings(text,date) to anon, authenticated;
grant execute on function admin_set_status(text,uuid,text) to anon, authenticated;
grant execute on function admin_update_settings(text,jsonb) to anon, authenticated;
grant execute on function admin_add_blackout(text,date) to anon, authenticated;
grant execute on function admin_remove_blackout(text,date) to anon, authenticated;
grant execute on function admin_set_passcode(text,text) to anon, authenticated;
revoke execute on function _admin_ok(text) from anon, authenticated, public;
