-- Seed data — mirrors src/data & src/lib/settings.js. Run after 0001_init.sql.

insert into settings (id, deposit_rate, trusted_deposit_rate, working_hours,
  slot_interval_minutes, buffer_minutes, max_bookings_per_day, min_lead_hours,
  blackout_dates, quiet, business)
values (
  1, 0.5, 0.25,
  '{"0":null,"1":{"open":"08:00","close":"17:00"},"2":{"open":"08:00","close":"17:00"},"3":{"open":"08:00","close":"17:00"},"4":{"open":"08:00","close":"18:00"},"5":{"open":"07:00","close":"19:00"},"6":{"open":"07:00","close":"16:00"}}',
  30, 30, 4, 24,
  '{2026-12-25,2026-12-26,2026-01-01}',
  '{"weekdays":[1,2,3,4],"before":"12:00"}',
  '{"name":"Glammified by Kwannz","trader":"NZ Myeni","location":"Pietermaritzburg, KZN","phone_display":"073 808 6990","phone_e164":"+27738086990","instagram":"Glamified_byKwannz","instagram_url":"https://instagram.com/Glamified_byKwannz","bank":{"bank":"FNB","account_name":"NZ Myeni T/A Glamified by Kwannz","account_number":"6300 4783 212"}}'
)
on conflict (id) do nothing;

insert into services (id, category, name, price, duration_min, photo, description, highlight, caption, sort) values
  ('makeup-looks','makeup','Makeup looks',650,60,'/photos/glam-curly.jpg','All looks include foundation, contour and highlight, eyebrow fill-in, any eyeshadow look of your choice, eyeliner (black or white) and a lip of your choice.','Lashes are included.',null,1),
  ('hair-and-makeup','makeup','Hair and makeup',1000,150,'/photos/hero-leather.jpg','This package includes both basic wig install and a face beat of your choice.',null,null,2),
  ('basic-wig-installation','hair','Basic wig installation',400,60,'/photos/glam-blue.jpg','Your wig needs to be customised and clean. Middle or side parting. Does not include snoopy.','Customised & clean units only.',null,3),
  ('install-styling','hair','Install + styling',550,null,'/photos/glam-white.jpg','Wig installation with a styled finish.',null,null,4),
  ('customisation','hair','Customisation',250,null,'/photos/glam-blue.jpg','Drop off and collection dates need to be specified. Includes bleaching knots and plucking.',null,'My units come customised 💋',5),
  ('house-call','callout','House call / Call out',500,null,'/photos/hero-leather.jpg','Minimum of 3 people. Client is responsible for transportation to and from — I do organise my own (Bolt rates). Arrival time depends on the start time of the event.','Minimum 3 people.',null,6)
on conflict (id) do nothing;

insert into portfolio_images (src, alt, span, sort) values
  ('/photos/hero-leather.jpg','Client in a black leather jacket with a full glam beat — soft smokey eye, fluttery lashes and a glossy nude lip, hair in a sleek straight middle part.','tall',1),
  ('/photos/glam-curly.jpg','Client with a curly middle-part install and a warm glam look — bronzed lids, defined lashes and a soft glossy lip.','wide',2),
  ('/photos/glam-blue.jpg','Client in a blue striped shirt with a long straight sleek install, glowing skin, winged liner and a nude glossy lip.','tall',3),
  ('/photos/glam-white.jpg','Client in a white top with a sleek straight middle-part install, sculpted brows, soft glam eyes and a glossy lip.','wide',4);
