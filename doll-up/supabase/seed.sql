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
  '{"name":"Doll Up Hair & Nail Art","tagline":"Own Your Crown","trader":"Doll Up Hair & Nail Art","location":"Railway St, Pietermaritzburg","address":"Railway Station, Railway St, Pietermaritzburg, 3201","phone_display":"082 699 8945","phone_e164":"+27826998945","instagram":"dollup_hair_and_nail_art","instagram_url":"https://www.instagram.com/dollup_hair_and_nail_art","facebook_url":"https://www.facebook.com/people/Doll-Up-Hair-And-Nail-Art/61574434674574/","bank":{"bank":"Bank name to confirm","account_name":"Doll Up Hair & Nail Art","account_number":"Account number to confirm"}}'
)
on conflict (id) do nothing;

insert into services (id, category, name, price, duration_min, photo, description, highlight, caption, sort) values
  -- Hair
  ('knotless-small','hair','Knotless Braids (Small)',650,300,'/photos/braids.jpg','Small, neat knotless braids for a full, natural look. Shoulder length or longer.','Hair not included.',null,1),
  ('knotless-medium','hair','Knotless Braids (Medium)',500,240,'/photos/braids.jpg','Medium knotless braids, soft and lightweight on your edges.',null,null,2),
  ('knotless-large','hair','Knotless Braids (Large)',400,180,'/photos/braids.jpg','Large, quick and comfortable knotless braids.',null,null,3),
  ('boho-braids','hair','Boho Braids',750,300,'/photos/braids.jpg','Knotless braids finished with soft, curly boho pieces.','Curls included.',null,4),
  ('feed-in-cornrows','hair','Feed-in Cornrows',280,120,'/photos/cornrows.jpg','Sleek straight-back feed-in cornrows.',null,null,5),
  ('stitch-cornrows','hair','Stitch Cornrows',400,150,'/photos/cornrows.jpg','Detailed stitch-line cornrows in the pattern of your choice.',null,'Own your crown 👑',6),
  ('fulani-braids','hair','Fulani Braids',550,240,'/photos/cornrows.jpg','A cornrow-and-braid mix with a classic Fulani finish.',null,null,7),
  ('passion-twists','hair','Passion Twists',500,240,'/photos/twists.jpg','Soft, bouncy passion twists.',null,null,8),
  ('cornrow-ponytail','hair','Cornrow Ponytail',350,120,'/photos/cornrows.jpg','A braided-up ponytail with added length and volume.',null,null,9),
  ('wash-blow','hair','Wash, Treatment & Blow-dry',180,60,'/photos/twists.jpg','Cleanse, deep treatment and a smooth blow-out.',null,null,10),
  ('takedown','hair','Braid Take-down',150,60,'/photos/twists.jpg','Careful removal of old braids or twists.',null,null,11),
  -- Nails
  ('gel-overlay','nails','Gel Overlay',200,60,'/photos/nails.jpg','A strengthening gel overlay on your natural nails.',null,null,12),
  ('gel-manicure','nails','Gel Manicure',250,60,'/photos/nails.jpg','Shape, cuticle care and a glossy gel colour.',null,null,13),
  ('acrylic-short','nails','Acrylic Full Set (Short)',320,90,'/photos/nails.jpg','A full acrylic set, short and neat.',null,null,14),
  ('acrylic-long','nails','Acrylic Full Set (Long)',400,120,'/photos/nails.jpg','A full acrylic set, medium to long.',null,null,15),
  ('nail-art','nails','Nail Art Set',480,120,'/photos/nails.jpg','A gel or acrylic set finished with custom nail art.','Art included.',null,16),
  ('gel-pedi','nails','Gel Pedicure',230,60,'/photos/nails.jpg','A pampering pedicure with a gel colour finish.',null,null,17),
  ('soak-off','nails','Soak-off & Removal',90,30,'/photos/nails.jpg','Gentle removal of gel or acrylics.',null,null,18),
  -- Kids
  ('kids-cornrows','kids','Kids Cornrows',150,60,'/photos/kids.jpg','Neat, gentle cornrows for little ones.','Ages 12 & under.',null,19),
  ('kids-knotless','kids','Kids Knotless Braids',350,150,'/photos/kids.jpg','Soft, gentle knotless braids for kids.',null,null,20),
  ('kids-styling','kids','Kids Twists & Styling',220,90,'/photos/kids.jpg','Twists or a cute styled look for kids.',null,null,21)
on conflict (id) do nothing;

insert into portfolio_images (src, alt, span, sort) values
  ('/photos/braids.jpg','Knotless braids styled by Doll Up Hair & Nail Art.','tall',1),
  ('/photos/cornrows.jpg','Neat feed-in cornrows by Doll Up Hair & Nail Art.','wide',2),
  ('/photos/nails.jpg','Custom nail art set by Doll Up Hair & Nail Art.','tall',3),
  ('/photos/kids.jpg','Kids cornrows and styling by Doll Up Hair & Nail Art.','wide',4);
