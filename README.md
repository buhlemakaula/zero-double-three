# The Block Pass

One website for the whole block: **Linen & Mocha** (laundry + coffee bar) and
**Takkie Wash SA** (premium sneaker care) in Musgrave, Berea, Durban.

Instead of three sites each buying the same customer, this site sells the block
as one thing: instant prices (no contact forms), a pickup & delivery booking
flow, a coffee cross-sell at checkout, and the **Block Pass** — a monthly
membership spanning all three doors.

## What's here

| File | What it does |
|---|---|
| `index.html` | Main site: hero, Block Pass tiers, both businesses, instant quote calculators, before/after slider, FAQ |
| `book.html` | Booking + checkout: build an order, choose drop-off or pickup window, pay with Paystack or book via WhatsApp. `book.html?pass=block` is the membership signup flow |
| `js/config.js` | **The only file you need to edit.** Every price, suburb, phone number, tier and key lives here |
| `css/style.css` | All styling |
| `js/main.js`, `js/quote.js`, `js/booking.js`, `js/paystack.js` | Page behaviour — no build step, no frameworks |
| `assets/` | Logos (SVG) and the photo drop-in folder |

## Launch checklist

### 1. Swap or add photos (5 minutes)

Real photos already live in `assets/images/` — replace any of them by
saving a new photo over the same filename:

- `hero-craft.jpg` — homepage hero (the cobbler at work)
- `before-shoe.jpg` / `after-shoe.jpg` — powers the draggable slider (same
  pair, same angle, dirty vs clean)
- `studio-interior.jpg` — drop-off counter (process step 01 + booking page)
- `process-clean.jpg` — hand-cleaning close-up (process step 02)
- `espresso.jpg` — coffee shot (process step 03 + Linen & Mocha section)
- `process-drop.jpg` / `before-after-full.jpg` — spares for socials or extra sections

### 2. Check the prices

Open `js/config.js`. Sneaker prices come from the current Takkie Wash SA
price list; laundry, coffee and delivery prices are sensible defaults —
change any number and the whole site (calculators, booking, savings nudges)
updates itself.

### 3. Turn on card payments (Paystack)

Until you do this, every "Pay" button gracefully falls back to a prefilled
WhatsApp booking — you lose no leads while getting set up.

1. Create a free account at [paystack.com](https://paystack.com) (South
   African businesses are supported; payouts go to your bank).
2. Dashboard → Settings → API Keys & Webhooks → copy the **Live public key**
   (`pk_live_...`) into `paystackPublicKey` in `js/config.js`.
3. For the Block Pass subscriptions: Dashboard → Payments → **Plans** →
   create three monthly plans (R249 Daily, R699 Block, R1,499 Concierge) and
   paste each plan code (`PLN_...`) into `payments.plans` in `js/config.js`.

Card details never touch this website — Paystack's popup handles them
(PCI-DSS compliant). The public key is safe to publish; never put your
*secret* key in this repo.

### 4. Put it online (free)

Any static host works. Easiest: GitHub Pages — repo Settings → Pages →
deploy from branch. Or drag the folder into [netlify.com](https://netlify.com).
Point `linenandmocha.co.za` / your domain at it via your registrar's DNS.

## Where the money comes from

- **Block Pass subscriptions** — predictable revenue, collected before the
  service is delivered, with a savings flag computed live from your prices.
- **Instant quotes instead of contact forms** — a price in three taps, then
  straight into booking.
- **Pickup & delivery** — opens the whole Berea, not just walk-ins; free
  delivery over R350 nudges bigger baskets.
- **The attach** — "Add a flat white? +R38" at checkout, plus a
  "members would save R__ on this slip" nudge on every order.
- **WhatsApp everywhere** — every dead end becomes a conversation instead.

## Verified locally

`python3 -m http.server` + Playwright: calculators price correctly against
config, prefills carry from home page to booking, delivery fee waives over
R350, validation blocks incomplete orders, Paystack fallback opens WhatsApp
with the full order slip, no horizontal scroll at 375px, reduced-motion
respected.
