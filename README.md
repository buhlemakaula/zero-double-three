<div align="center">

# Connect®

### Curbside, elevated.

A luxury on-demand **marketplace for groceries, the cellar & pharmacy** across greater Durban —
delivered to your door, or loaded straight into your boot. Trading **06:00 → 01:00**, every day.

</div>

---

## Why Connect

Durban's on-demand market is a two-horse race to your *front door* (Checkers Sixty60, Uber Eats,
Zulzi). Connect opens a **second lane no one owns — the kerb.** Order on your commute, pull in, tap
*"I'm here"*, and a runner loads your car in under three minutes. No parking, no queue, no lift home
with heavy bags.

It's also a genuine **three-vertical marketplace** — groceries, alcohol *(18+)* and pharmacy
*(script upload + real-time medical-aid claims)* — in **one bag, one elegant checkout.**

**21 Ridges** (Umhlanga Ridge) ships as the embedded launch partner so the full ordering experience
can be previewed and tested end-to-end.

## Signature features

- **Curbside handover** — vehicle + bay capture, boot-drop, live order tracking.
- **Three verticals, one bag** — restaurants, groceries, cellar, pharmacy in a single checkout.
- **Every SA payment structure** — card, tap-to-pay, Instant EFT, Connect Wallet (3% back),
  split-&-pay-later, and cash on handover.
- **Trading-hours engine** — live open/closed status for the 06:00–01:00 window (Durban / SAST),
  with automatic scheduling when closed.
- **Compliance built in** — 18+ ID verification at handover; prescription upload & medical-aid
  claims for pharmacy; cold-chain curbside pouches.
- **Trader proposition** — transparent low commission, owned customer data, editorial discovery.
- **Design** — airy ivory canvas, espresso ink, champagne accent; editorial serif display;
  Framer-Motion micro-interactions throughout; fully responsive.

## Tech stack

| | |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| State | Zustand |
| Type / icons | Fraunces + Manrope (self-hosted) · Lucide |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # preview the production build
```

## Project structure

```
src/
  data/catalog.ts        # vendors + products (incl. embedded 21 Ridges menu)
  lib/hours.ts           # 06:00–01:00 trading-hours engine (SAST)
  store.ts               # cart, fulfilment & payment state (Zustand)
  components/
    Header.tsx           # logo, live store status, bag
    Hero.tsx             # editorial hero
    Marketplace.tsx      # category-tabbed catalog (groceries/cellar/pharmacy)
    FeaturedRidges.tsx   # 21 Ridges launch-partner showcase + menu
    Difference.tsx       # curbside value prop + payment structures
    Traders.tsx          # merchant acquisition pitch
    CartDrawer.tsx       # slide-over bag
    Checkout.tsx         # 3-step animated seamless checkout + tracking
    Footer.tsx
```

See **[STRATEGY.md](./STRATEGY.md)** for the competitive analysis (Sixty60 / Uber Eats / Zulzi)
that shaped the product.

---

<div align="center">
<sub>Drink responsibly. Not for sale to persons under 18. © Connect Marketplace (Pty) Ltd · Durban, South Africa.</sub>
</div>
