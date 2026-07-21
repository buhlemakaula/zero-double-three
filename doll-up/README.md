# Doll Up Hair & Nail Art — booking website

Mobile-first booking site for **Doll Up Hair & Nail Art** — braids, cornrows,
styling and nail art in Pietermaritzburg, KZN.

> _Own Your Crown._

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

## Supabase

To point the app at a live project, copy `.env.example` → `.env` and fill in the
project URL + anon key from the Supabase dashboard (Project settings → API):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

The site auto-detects the credentials and switches from seed data to the live
tables. Without them it runs on in-memory seed data (demo mode).

To create the schema from scratch, run in order:
- `supabase/migrations/0001_init.sql` — tables, RLS, stamp-issuance trigger
- `supabase/migrations/0002_rpcs_and_admin.sql` — booking RPCs + admin functions
- `supabase/seed.sql` — services, portfolio, settings

### Security model

The public site never reads client PII. All writes go through `SECURITY DEFINER`
RPCs: `booked_slots(date)` returns busy ranges only, and `book_appointment(…)`
de-dupes the client by phone and inserts a pending booking. Tables have RLS
enabled with no client policies (deny-all direct access).

## Admin dashboard — `/admin`

The studio manages the business from `/admin`, gated by a passcode (bcrypt-hashed
in the `admin_config` table — **change it on first login** via the dashboard,
Availability → Change passcode). No email account needed.

- **Bookings** — see upcoming bookings grouped by day; Confirm / Mark complete /
  No-show / Cancel. Marking a booking **complete** is what issues the Crown Card
  stamp (via the DB trigger). Client phone numbers are tap-to-WhatsApp.
- **Availability** — edit working hours per day, buffer, slot interval, max
  bookings/day, min lead time, deposit %, quiet-slot rules, and blackout dates.
  Changes flow straight into the public availability engine.

## How it fits together

| Concern | Where |
|---|---|
| Studio-controlled config (hours, buffer, caps, blackout dates, quiet slots, deposit rate) | `src/lib/settings.js` → `settings` table |
| Service catalog (exact prices/durations) | `src/data/services.js` → `services` table |
| Deposit math (always derived: `price × rate`) | `src/lib/deposit.js` |
| Availability / slot generation | `src/lib/availability.js` |
| **Crown Card** loyalty logic (stamps, quiet double, referral, family bonus, Trusted Client) | `src/lib/loyalty.js` |
| Booking flow (service → add-ons → date → time → details → deposit → confirm) | `src/components/booking/` |
| WhatsApp handoff | `src/lib/whatsapp.js` |

### The Crown Card

- 1 stamp per **completed, paid** booking · **6 stamps = R100 off or a free wash & treatment**.
- **Double stamp** on flagged quiet weekday slots — fills dead hours at no discount.
- **Referral** code at checkout → a stamp for both sides.
- **Family bookings** — every child styled in the same visit earns a stamp.
- **Trusted Client** after 3 clean bookings → deposit drops to 25% + waitlist priority.
- Guardrails: stamps issue **only** when a booking is marked `completed` (enforced by a
  DB trigger, never the client); late strikes forfeit the stamp and reset Trusted status;
  stamps expire after 12 months; rewards aren't stackable.

## Guides

- **[`docs/BACKEND.md`](docs/BACKEND.md)** — step-by-step guide to the Supabase
  backend: logging in, the tables, everyday tasks, editing services, looking up
  loyalty, security model, backups, troubleshooting.
- **[`docs/DEPLOY.md`](docs/DEPLOY.md)** — deploying to Vercel (GitHub connect or
  CLI) and setting the environment variables.

## Deploy (short version)

Configured for Vercel (`vercel.json`): `framework: vite`, output `dist/`, with
rewrites so the `/book` and `/admin` routes resolve. Connect the GitHub repo in
Vercel and add the two `VITE_SUPABASE_*` environment variables to go live against
Supabase. Full steps in `docs/DEPLOY.md`.
