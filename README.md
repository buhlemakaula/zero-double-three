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

## Connect Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL in order:
   - `supabase/migrations/0001_init.sql` — tables, RLS, the stamp-issuance trigger
   - `supabase/seed.sql` — services, portfolio, settings
3. Copy `.env.example` → `.env` and fill in:

   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

The site auto-detects the credentials and switches from seed data to the live
tables.

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
