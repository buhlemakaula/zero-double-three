-- ─────────────────────────────────────────────────────────────────────────
-- Phase 3 (cont.): fire the `notify` edge function on new bookings + daily.
-- Uses pg_net to POST, pg_cron to schedule. The push_secret is read at runtime.
-- Replace <PROJECT-REF> if you redeploy to a new Supabase project.
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists pg_net;
create extension if not exists pg_cron;

-- New booking -> notify the studio's devices immediately.
create or replace function notify_new_booking()
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
        'title', 'New booking 💅',
        'body', coalesce(new.client_name,'Someone') || ' — ' || new.service_name ||
                ' on ' || to_char(new.date,'DD Mon') || ' at ' || new.time,
        'url', '/admin'
      )
    );
  end if;
  return new;
end $$;

drop trigger if exists trg_notify_new_booking on bookings;
create trigger trg_notify_new_booking after insert on bookings
  for each row execute function notify_new_booking();

-- Daily morning summary (05:00 UTC = 07:00 SAST).
select cron.unschedule('daily-booking-reminder')
where exists (select 1 from cron.job where jobname = 'daily-booking-reminder');

select cron.schedule('daily-booking-reminder', '0 5 * * *', $cron$
  do $do$
  declare c int; sec text;
  begin
    select count(*) into c from bookings
      where date = current_date and status in ('pending','confirmed');
    if c > 0 then
      select push_secret into sec from admin_config where id = 1;
      perform net.http_post(
        url := 'https://tvtherrzunjcbiakmnqj.supabase.co/functions/v1/notify',
        headers := jsonb_build_object('Content-Type','application/json'),
        body := jsonb_build_object('secret', sec,
          'title', 'Today''s appointments ✨',
          'body', c || ' booking' || case when c > 1 then 's' else '' end ||
                  ' today. Open the app to see your day.',
          'url', '/admin')
      );
    end if;
  end $do$;
$cron$);
