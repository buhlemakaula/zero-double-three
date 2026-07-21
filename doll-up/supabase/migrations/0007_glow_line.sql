-- ─────────────────────────────────────────────────────────────────────────
-- Phase 4: "The Glow Line" — warm callback / enquiry requests.
-- A client asks the studio to call; it lands in the admin Enquiries tab and pushes
-- her instantly (reusing the Phase 3 notify function). Turns hesitant browsers
-- into a phone call — the studio's strongest channel.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  message    text,
  preferred  text,
  source     text not null default 'glow_line',
  status     text not null default 'new'
             check (status in ('new','called','booked','closed')),
  created_at timestamptz not null default now()
);
alter table enquiries enable row level security; -- via RPCs only

create or replace function submit_enquiry(p_name text, p_phone text, p_message text, p_preferred text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  if length(trim(coalesce(p_name,''))) = 0 or length(trim(coalesce(p_phone,''))) = 0 then
    raise exception 'name and phone required';
  end if;
  insert into enquiries (name, phone, message, preferred)
  values (trim(p_name), trim(p_phone), nullif(trim(p_message),''), nullif(trim(p_preferred),''))
  returning id into v;
  return v;
end $$;
grant execute on function submit_enquiry(text,text,text,text) to anon, authenticated;

create or replace function admin_list_enquiries(pass text)
returns setof enquiries language plpgsql stable security definer set search_path = public as $$
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  return query select * from enquiries order by
    case status when 'new' then 0 when 'called' then 1 when 'booked' then 2 else 3 end,
    created_at desc;
end $$;
grant execute on function admin_list_enquiries(text) to anon, authenticated;

create or replace function admin_set_enquiry_status(pass text, e_id uuid, new_status text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not _admin_ok(pass) then raise exception 'unauthorized'; end if;
  update enquiries set status = new_status where id = e_id;
  return true;
end $$;
grant execute on function admin_set_enquiry_status(text,uuid,text) to anon, authenticated;

-- New enquiry -> push the studio immediately.
create or replace function notify_new_enquiry()
returns trigger language plpgsql security definer set search_path = public, extensions, net as $$
declare sec text;
begin
  select push_secret into sec from admin_config where id = 1;
  if sec is not null then
    perform net.http_post(
      url := 'https://tvtherrzunjcbiakmnqj.supabase.co/functions/v1/notify',
      headers := jsonb_build_object('Content-Type','application/json'),
      body := jsonb_build_object(
        'secret', sec,
        'title', '📞 New enquiry',
        'body', new.name || ' wants a call' ||
                case when new.preferred is not null then ' (' || new.preferred || ')' else '' end,
        'url', '/admin'
      )
    );
  end if;
  return new;
end $$;

drop trigger if exists trg_notify_new_enquiry on enquiries;
create trigger trg_notify_new_enquiry after insert on enquiries
  for each row execute function notify_new_enquiry();
