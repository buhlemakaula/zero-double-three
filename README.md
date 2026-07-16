# Glammified by Kwannz — booking website

Mobile-first booking site for **Glammified by Kwannz** — makeup artistry and wig
installations by NZ Myeni in Pietermaritzburg, KZN.

> _Let your face be my canvas._

Built with **React + Vite + Tailwind**, backed by **Supabase**. Monochrome,
editorial, no external UI kit.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the build
```

The site runs **with no backend** out of the box: without Supabase credentials
it falls back to seeded in-memory data, so every page and the full booking flow
work immediately. No `localStorage` is used.

## Supabase (already provisioned)

A live free-tier project (`glammified-by-kwannz`, region eu-west-1) backs this
site. To point the app at it, copy `.env.example` → `.env` and fill in the
project URL + anon key from the Supabase dashboard (Project settings → API):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

The site auto-detects the credentials and switches from seed data to the live
tables. Without them it runs on in-memory seed data (demo mode).

To recreate the schema from scratch, run in order:
- `supabase/migrations/0001_init.sql` — tables, RLS, stamp-issuance trigger
- `supabase/migrations/0002_rpcs_and_admin.sql` — booking RPCs + admin functions
- `supabase/seed.sql` — services, portfolio, settings

### Security model

The public site never reads client PII. All writes go through `SECURITY DEFINER`
RPCs: `booked_slots(date)` returns busy ranges only, and `book_appointment(…)`
de-dupes the client by phone and inserts a pending booking. Tables have RLS
enabled with no client policies (deny-all direct access).

## Admin dashboard — `/admin`

The artist manages the business from `/admin`, gated by a passcode (bcrypt-hashed
in the `admin_config` table — **change it on first login** via the dashboard,
Availability → Change passcode). No email account needed.

- **Bookings** — see upcoming bookings grouped by day; Confirm / Mark complete /
  No-show / Cancel. Marking a booking **complete** is what issues the Glam Card
  stamp (via the DB trigger). Client phone numbers are tap-to-WhatsApp.
- **Availability** — edit working hours per day, buffer, slot interval, max
  bookings/day, min lead time, deposit %, quiet-slot rules, and blackout dates.
  Changes flow straight into the public availability engine.

## How it fits together

| Concern | Where |
|---|---|
| Artist-controlled config (hours, buffer, caps, blackout dates, quiet slots, deposit rate) | `src/lib/settings.js` → `settings` table |
| Service catalog (exact prices/durations) | `src/data/services.js` → `services` table |
| Deposit math (always derived: `price × rate`) | `src/lib/deposit.js` |
| Availability / slot generation | `src/lib/availability.js` |
| **Glam Card** loyalty logic (stamps, quiet double, referral, group bonus, Trusted Client) | `src/lib/loyalty.js` |
| Booking flow (service → add-ons → date → time → details → deposit → confirm) | `src/components/booking/` |
| WhatsApp handoff | `src/lib/whatsapp.js` |

### The Glam Card

- 1 stamp per **completed, paid** booking · **6 stamps = R250 off or a free customisation**.
- **Double stamp** on artist-flagged quiet weekday slots — fills dead hours at no discount.
- **Referral** code at checkout → a stamp for both sides.
- **Group bonus** — call-outs earn a stamp per person.
- **Trusted Client** after 3 clean bookings → deposit drops to 25% + waitlist priority.
- Guardrails: stamps issue **only** when a booking is marked `completed` (enforced by a
  DB trigger, never the client); late strikes forfeit the stamp and reset Trusted status;
  stamps expire after 12 months; rewards aren't stackable.

## Deploy

Configured for Vercel (`vercel.json`): `framework: vite`, output `dist/`, with a
rewrite so the `/book` deep link resolves. Add the two `VITE_SUPABASE_*`
environment variables in the Vercel project to go live against Supabase.

---

The previous portfolio site for this repo is preserved under `legacy/`.
