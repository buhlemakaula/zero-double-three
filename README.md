# Buhle Makaula — Studio Site

A dark, motion-led portfolio for **Buhle Makaula**, freelance digital artist & brand builder.
Big type, warm gold accent, editorial serif touches — built to feel premium and to make the
name trusted.

Built with **Vite**, **GSAP + ScrollTrigger** (scroll animation) and **Lenis** (smooth scroll).

## Run it

```bash
npm install
npm run dev        # local dev at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Add your own hero photo

The hero currently shows a placeholder silhouette. To use your real portrait:

1. Drop a portrait image at `public/img/buhle.jpg` (portrait orientation, ~900×1200 works well).
2. That's it — the site auto-detects the file and swaps it into the hero on load.

For best results use a high-contrast photo on a dark/neutral background so it sits well against
the dark theme.

## What's on the site

- **Hero** — giant "Building brands people trust" with your portrait + a running services marquee
- **Manifesto** — scroll-scrubbed statement
- **Stats** — animated counters
- **Selected Work** — Lorenzo Skin Care · Smoke Boys · Flexers Fitness · Kwen Essence
- **Studio** — services (Brand Identity, Packaging, Social, Art Direction)
- **About** — bio + skills marquee
- **Contact** — big call-to-action to `buhlemakaula@gmail.com`

## Edit content

Everything is in three files:

- `index.html` — all copy, sections and project images
- `src/style.css` — the design system (colours, type, layout)
- `src/main.js` — the motion

Project images live in `public/work/`. Swap in higher-res versions using the same filenames
to update the case studies. Social links in the footer are placeholders (`href="#"`) — point
them at your Instagram / Behance / WhatsApp.

## Deploy

The `dist/` folder is a static site — drop it on Netlify, Vercel, GitHub Pages or any host.
