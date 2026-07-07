# 21 Ridges Bistro &amp; Bar — Website

A fast, mobile-responsive marketing site for **21 Ridges Bistro & Bar**, Pietermaritzburg.
Its core job is to turn visitors into bookings, via an online reservation form (emailed to
you through Web3Forms) plus instant WhatsApp / click-to-call fast paths.

Built as plain **HTML / CSS / JavaScript** — no build step, no framework. It runs by opening
`index.html` and hosts on anything (Netlify, Vercel, Cloudflare Pages, cPanel, GitHub Pages).

---

## ✅ Go-live checklist (what's still a placeholder)

Everything below is a placeholder and marked so it's easy to find. Most of it lives in **one
block** at the top of `js/main.js` — change it there once and it updates every phone number,
WhatsApp button, email link and the booking form across the whole site.

### 1. Contact details & booking — `js/main.js` → `CONFIG`
```js
const CONFIG = {
  phoneDisplay:    "078 377 5875",     // shown to visitors
  phoneDial:       "+27783775875",     // tap-to-call
  whatsappNumber:  "27783775875",      // ← BOOKINGS WhatsApp (already set)
  email:           "hello@21ridges.co.za",
  web3formsKey:    "YOUR-WEB3FORMS-ACCESS-KEY", // optional email copy (step 2)
  gaMeasurementId: "G-XXXXXXXXXX",     // Google Analytics 4 (step 3)
};
```

**How online bookings work now:** the reservation form composes the booking (name, phone,
date, time, guests, notes) and **routes it straight to the venue WhatsApp `+27 78 377 5875`** —
the customer taps *Send* and it lands in your chat to confirm. The floating button, "Call to
book", and all WhatsApp/phone links point at the same number.

> ⓘ *Fully-automatic server-side WhatsApp sending (no customer tap) needs the paid WhatsApp
> Business API + a backend. The one-tap wa.me handoff above is the standard, no-cost method for
> a static site and is what most SA venues use.*

### 2. (Optional) Email copy of every booking — Web3Forms
Bookings already go to WhatsApp. If you *also* want each one emailed:
1. Get a free key at <https://web3forms.com> (enter your inbox email).
2. Paste it into `CONFIG.web3formsKey`. Each submission is then emailed **and** sent to WhatsApp.

### 3. Analytics — Google Analytics 4 (free) + built-in conversion tracking
1. Create a property at <https://analytics.google.com> → **Admin → Data Streams → Web**, copy the
   **Measurement ID** (`G-XXXXXXXXXX`).
2. Paste it into `CONFIG.gaMeasurementId`. The site then loads GA4 and automatically fires these
   events (mark them as **conversions** in GA4 → Admin → Events):
   - `generate_lead` &amp; `reservation_request` — a booking was submitted
   - `contact_whatsapp` — a WhatsApp button was clicked
   - `contact_call` — a call button was clicked
3. Also verify the site in <https://search.google.com/search-console> to track search traffic,
   keywords and impressions, and submit `sitemap.xml`.

**SEO already built in:** keyword-rich title/description, geo meta, Open Graph/Twitter cards,
`robots.txt`, `sitemap.xml`, Restaurant + FAQ structured data (rich results), a keyword FAQ
section, fast self-hosted fonts and a preloaded hero. After go-live: create/claim your **Google
Business Profile** (biggest local-SEO lever), and keep your name/address/phone identical
everywhere.

### 3. Opening hours — `index.html`
Search for `id="hoursList"` and set the real trading hours (currently sensible placeholders;
Thursday is flagged as *Sushi & RnB Night*).

### 4. Photos — `assets/img/`
The site now uses your supplied photography (graded for the black-and-gold look). Swap any file
for a newer/higher-res shot using the **same filename** and it drops straight in. Recommended shots:

| File | Used for | Ideal crop |
|------|----------|-----------|
| `hero-1.jpg` `hero-2.jpg` `hero-3.jpg` | Hero slideshow (3 rotating frames) | landscape or centered subject, dark/moody |
| `about.jpg` | About — moody spread | portrait 4:5 |
| `chef.jpg` | Chef's signature (round crop) | square, plate centered |
| `event.jpg` | Sushi & RnB banner | landscape |
| `g1`–`g6.jpg` | Gallery grid | square |

Hero focal points are set per slide in `index.html` via `background-position` (e.g. `center 74%`) —
adjust if a new photo's subject sits higher or lower. Optimise images before uploading for speed.

### 4b. Logo — `assets/logo/`
Your logo is built in from `2c3e0b4e` (white-on-black):
`logo-white.png` / `logo-gold.png` (full lockup) and `mark-white.png` / `mark-gold.png` (the "21"
monogram). The header uses the gold mark, the hero uses the white lockup, the footer uses the gold
lockup, and the favicon (`assets/img/favicon.png`) is the gold mark. Drop in official vector/PNG
versions under `assets/logo/` (same names) when you have them.

### 5. Domain & SEO — `index.html` `<head>`
Find-and-replace `21ridges.co.za` with your real domain once registered. This updates the
canonical URL, Open Graph (social share) tags and structured data.

### 6. Address / map
Address (22 Doig Street, Pietermaritzburg) is set in the map embed, contact section, footer and
Google structured data. If it changes, search `Doig` and update those spots.

---

## 🎨 Design

- **Palette:** deep forest green → charcoal with gold accents (blends the Remida & Wilma refs).
- **Type:** *Playfair Display* (serif headlines) + *Manrope* (body), loaded from Google Fonts.
- **Sections:** hero · about · features · full tabbed menu (incl. bar) · chef picks ·
  Sushi & RnB night · gallery · reservation (form + WhatsApp + call) · location/map · footer.
- Fully responsive down to small phones; respects `prefers-reduced-motion`.

## 📂 Structure
```
index.html            – the whole page
css/styles.css        – design system + all styles
js/main.js            – CONFIG block + interactions (nav, tabs, form, reveals)
assets/img/           – placeholder images + favicon (swap for real photos)
assets/menu/          – downloadable full menu PDF
```

## ▶ Preview locally
```bash
# any static server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

---
*Menu items and prices are transcribed from the venue's official menu PDF. Please confirm
pricing before launch — restaurant prices change.*
