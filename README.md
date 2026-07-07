# Space Bar — Website

High-traffic, minimal marketing site for **Space Bar**, a private members' cannabis club. Its two jobs:

1. **Look like a credible, established business.**
2. **Drive sign-ups to the members' WhatsApp community** (where the specials live).

## Highlights

- **Minimal, professional UX/UI** — space/night palette, generous whitespace, `Space Grotesk` + `Inter`.
- **3D scroll animation** — a `three.js` starfield and ringed planet that drift, scale and tilt as you scroll, with subtle mouse parallax. Gracefully disabled when the browser reports `prefers-reduced-motion`.
- **WhatsApp-first conversion** — hero CTA, dedicated members section, and a floating chat button all deep-link to WhatsApp.
- **Age gate** (18+) and "right of admission reserved" messaging for credibility/compliance.
- **Fast & responsive** — single page, one small JS file, CDN-loaded three.js, mobile-first layout.
- **SEO/social ready** — meta description, Open Graph tags, semantic markup.

## Structure

```
index.html            Markup + inline SVG icons
assets/css/styles.css Design system + layout
assets/js/main.js     Age gate, scroll reveals, count-ups, 3D scene
assets/img/favicon.svg
```

## Run locally

Any static server works:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Configure

- **WhatsApp number / group** — search `wa.me/27661627732` in `index.html` and swap in your number (or a group invite link like `https://chat.whatsapp.com/XXXX`). The `?text=` param pre-fills the first message.
- **Phone** — `tel:+27661627732`.
- **Copy & stats** — edit directly in `index.html` (the `data-count` attributes drive the animated numbers).

## Deploy

Static hosting — drop the folder on Netlify, Vercel, Cloudflare Pages, or GitHub Pages.
