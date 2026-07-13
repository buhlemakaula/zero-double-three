# Buhle Makaula — Portfolio

Dark, editorial one-page portfolio: big Anton display type, Urbanist body text, orange accent pills, grain texture, animated cover and scroll reveals.

## Structure

- `index.html` — all page content (edit text here)
- `css/style.css` — design tokens at the top of the file (colors, radius, spacing)
- `js/main.js` — wordmark auto-fit + scroll reveal animations
- `assets/buhle.png` — portrait photo
- `assets/fonts/` — self-hosted Anton + Urbanist (no external requests)

## Editing content

- **Bio, education, experience, skills** — plain text in `index.html`, look for the matching section comments.
- **Client work** — duplicate a `.work-card` block inside `#work` in `index.html`. Give each one a tag (Branding, Social Media, …), a project name, and link it to a case-study page or image.
- **Contact** — WhatsApp bookings link uses `https://wa.me/27711824885`; email is `buhlemakaula@gmail.com`.

## Running locally

Static site, no build step:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
