# Portfolio 2026 — Cross-Device Mockup Loop

A seamless 24-second looping mockup animation of the live portfolio at
[buhlemakaula.github.io/zero-double-three](https://buhlemakaula.github.io/zero-double-three/).

A tilted laptop and phone play the real site on offset scroll rhythms —
cover, hello, selected work, and the "Let's work!" outro — while the site's
own pills, the 2026 badge, and client work cards float around the devices
in parallax. Once per loop a cursor lands on the WhatsApp CTA and books it.

Everything is one self-contained `index.html` (pure CSS animation, no
libraries), styled with the portfolio's own identity: ink `#0D0D0C`,
bone `#E9E7E2`, orange `#F4622E`, Anton display and Urbanist body type,
plus the grain overlay from the live site.

## Viewing

Open `index.html` in a browser. Useful extras:

- **Pause / Play** button (bottom left) freezes the loop.
- **`?t=12`** in the URL scrubs the whole loop to the 12-second mark and
  pauses — handy for exporting stills.
- `prefers-reduced-motion` is respected: the piece settles on a static
  composed frame with no animation.

Assets (fonts, portrait, work photography) are copied from the live site's
`gh-pages` branch so the page works offline.
