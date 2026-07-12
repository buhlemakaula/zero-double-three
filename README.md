# Misitu — Furniture Workshop

A luxury e-commerce storefront for **Misitu** ([misitu.co.za](https://misitu.co.za)),
a South African workshop crafting quality wooden furniture. *Misitu* is Swahili
for **forests** — where every piece begins.

Built as a fully static site: no build step, no dependencies.

## Pages

- `index.html` — editorial homepage: hero wordmark with the signature chair,
  about, fresh collection band, workshop story, payment & delivery.
- `shop.html` — full catalogue with category filters.

## Features

- 12 placeholder products with illustrative ZAR pricing (R3 950 – R32 900)
- Hand-drawn SVG product illustrations (no external images, nothing to break)
- Working cart: add/remove/quantity, persisted in `localStorage`, ZAR totals
  via `Intl.NumberFormat('en-ZA')`
- Responsive down to mobile, keyboard focus styles, `prefers-reduced-motion`
  respected

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

> Products, prices and contact details are placeholders pending real
> catalogue data from misitu.co.za.
