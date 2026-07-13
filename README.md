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

## UI components — 21st.dev CLI

The [21st.dev](https://21st.dev) CLI is pinned as a dev dependency (`@21st-dev/cli`),
so it's reproducible from `npm install` — no global install needed. Run it with
`npx 21st …` (or `npm run 21st -- …`).

### Sign in

Login opens the browser and saves a token locally (one-time, per machine):

```bash
npx 21st login       # or: npm run ui:login
npx 21st whoami      # confirm the signed-in account
```

### Everyday use

```bash
npx 21st search "pricing table"                       # find components/themes/templates
npx 21st add shadcn/button                             # install a published component
npx 21st publish ./PinList.tsx --description "A pinned items list"
npx 21st edit pin-list --type component --visibility public
npx 21st delete pin-list --type component --yes
```

Run `npx 21st help` for the full command list.

### CI / scripts

In non-interactive environments, skip `login` and authenticate with an API key.
Set it as a secret (never commit it) and pass it explicitly or via the env var:

```bash
npx 21st search "hero" --api-key "$API_KEY_21ST"
# or export it once:
export API_KEY_21ST=…
```
