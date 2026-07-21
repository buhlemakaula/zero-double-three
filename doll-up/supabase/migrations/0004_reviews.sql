-- ─────────────────────────────────────────────────────────────────────────
-- Phase 2: reviews / star ratings (zero-cost, WhatsApp-link driven).
--
-- After the studio marks a booking complete she sends the client a /review/<id>
-- link over WhatsApp. Clients rate 1–5 + a comment. 4–5 star reviews show on
-- the site and offer a one-tap Google review link; lower ratings stay private.
-- ─────────────────────────────────────────────────────────────────────────

alter table admin_config add column if not exists google_review_url text;

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid unique references bookings(id) on delete cascade,
  client_name text,
  service_name text,
  rating int not null check (rating between 1 and 5),
  comment text,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);
alter table reviews enable row level security; -- reachable only via the RPCs

-- Client submits a review — only for a completed booking, one per booking.
create or replace function submit_review(b_id uuid, p_rating int, p_comment text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare b bookings; existing uuid;
begin
  if p_rating < 1 or p_rating > 5 then raise exception 'invalid rating'; end if;
  select * into b from bookings where id = b_id;
  if not found then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
  if b.status <> 'completed' then return jsonb_build_object('ok', false, 'reason', 'not_completed'); end if;
  select id into existing from reviews where booking_id = b_id;
  if existing is not null then
    update reviews set rating = p_rating, comment = nullif(p_comment,''), created_at = now()
      where booking_id = b_id;
  else
    insert into reviews (booking_id, client_name, service_name, rating, comment)
    values (b_id, b.client_name, b.service_name, p_rating, nullif(p_comment,''));
  end if;
  return jsonb_build_object('ok', true,
    'google_review_url', (select google_review_url from admin_config where id = 1));
end $$;
grant execute on function submit_review(uuid,int,text) to anon, authenticated;

-- Public, approved 4–5 star reviews for the site's testimonials.
create or replace function public_reviews()
returns table (client_name text, service_name text, rating int, comment text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select client_name, service_name, rating, comment, created_at
  from reviews
  where approved and rating >= 4 and comment is not null and length(trim(comment)) > 0
  order by created_at desc limit 12;
$$;
grant execute on function public_reviews() to anon, authenticated;

-- Admin: read every review (incl. low ratings).
create or replace function admin_list_reviews(pass text)
returns setof reviews language plpgsql stable security definer set search_path = public as $$
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  return query select * from reviews order by created_at desc;
end $$;
grant execute on function admin_list_reviews(text) to anon, authenticated;

-- Admin: set the Google review link + read config (now incl. google url).
create or replace function admin_set_google_review(pass text, url text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  update admin_config set google_review_url = nullif(url,'') where id = 1;
  return true;
end $$;
grant execute on function admin_set_google_review(text,text) to anon, authenticated;

create or replace function admin_get_studio(pass text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare a text; n text; g text;
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  select studio_address, address_note, google_review_url into a, n, g from admin_config where id = 1;
  return jsonb_build_object('studio_address', a, 'address_note', n, 'google_review_url', g);
end $$;
