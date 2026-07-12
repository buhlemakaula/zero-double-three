# Maison Vela — :30 Cross-Device Cut

A 30-second, fully self-contained motion advert (`index.html`) that shows one
premium website reflowing across real 3D device mockups — laptop, tablet, and
phone — to prove mobile responsiveness. Calm, warm, luxurious: an umber stage,
champagne light, and a fictional boutique coastal retreat in Paternoster,
Western Cape as the subject site.

## The cut

| Time | Scene |
|------|-------|
| 0–4.5s | SC 01 — Title card, letterspaced serif reveal |
| 4–12.5s | SC 02 — Laptop rotates in, page scrolls hero → rooms |
| 12–19.5s | SC 03 — Tablet, same content folded to two columns |
| 19–26s | SC 04 — Phone sways in hand, thumb-scroll, tap ripple on Reserve |
| 26–30s | SC 05 — All three devices, end line, replay |

## Run it

Open `index.html` in any browser. No build, no network, no dependencies —
everything (devices, site screens, motion) is CSS; a few lines of JS handle
scaling and replay.

- **Replay** button appears at the end of the cut.
- **Scrub for stills**: append `?t=<seconds>` (e.g. `index.html?t=9`) to freeze
  the whole timeline at that moment.
- `prefers-reduced-motion` is respected: the finale composition is shown as a
  static frame.
