# MASTER PROMPT — T Monareng Projects (TMP) Website

> Paste this whole document to an AI builder (or use it yourself) to generate the
> TMP marketing website in one pass. It contains the brand, the exact content,
> the layout (modelled on the supplied inspiration), the colour system, and the
> image direction. Follow it literally. Where a value is marked **[VERIFY]**,
> treat it as a placeholder to confirm with the client before launch — do not
> present unverified numbers as fact.

---

## 1. ROLE & OBJECTIVE

You are a senior product designer + front-end engineer. Build a **modern, bold,
dark, industrial marketing website** for **T Monareng Projects (Pty) Ltd (“TMP”)**,
a South African construction and mining-supply company.

The site must:
- Look like a serious, established heavy-industry contractor that Eskom, Transnet
  and SARS already trust.
- Follow the **structure and section rhythm of the supplied inspiration**
  (a dark construction landing page: sticky nav → full-bleed hero → services
  grid → stats strip → featured projects → testimonials → contact → mega-footer).
- **Reskin that layout into the TMP brand: black, white, red** — NOT the orange
  of the inspiration. Match the *composition and energy*, not the colours.
- Be a fast, accessible, fully responsive **static site** (HTML + CSS + a little
  vanilla JS). No framework required, but Tailwind or a component framework is
  acceptable if the builder prefers — output must remain a single deployable site.

---

## 2. THE COMPANY (source of truth — from the 2025 Company Profile)

| Field | Value |
|---|---|
| Legal name | T Monareng Projects (Pty) Ltd |
| Brand / short name | TMP |
| Founded | 2021 |
| Sector | Construction & mining supply / services |
| CIDB gradings | **4CE, 3ME & 3G** |
| CRS No. | 10273886 |
| Managing Director | Tlhologo Mohlala |
| Phone | +27 79 604 8527 |
| Email | thlologelo637@gmail.com |
| Website | www.tmp-projects.co.za |
| Address | Stand No. 890, Kanana Moremela, Mpumalanga, 1271, South Africa |
| Tagline | **Your Trusted Partner in South Africa** |
| Positioning line | Built for today. Engineered for tomorrow. *(reworked from inspo)* |

**About (use / condense as needed):**
> T Monareng Projects was established in 2021 to service the mining and
> construction industry at an entrepreneurial level. Our story began with a
> simple vision — to deliver quality, reliable and innovative solutions that make
> a lasting impact. We have grown from a small team with big dreams into a trusted
> partner for some of South Africa’s most respected organisations. Every project
> is a promise to deliver excellence, on time, every time.

**Vision:** To become the leader and the service provider of choice — the
one-stop business for all quality construction and mining services.

**Mission:** Quality construction and mining services that aid the development of
infrastructure and change lives for the better.

**Core values (3):**
1. **Quality** — the highest standards in every product and service.
2. **Integrity** — strong ethics in everything we represent.
3. **Accountability** — owning our actions to build trust, internally and externally.

**Health & Safety pledge (short):** We develop and implement a health & safety
management system appropriate to our size and business, with visible leadership,
active risk reduction, and a director responsible for H&S.

**Market / who we serve:** Government, State-Owned Enterprises, Municipalities,
Private Companies, Private Developers, Mining Houses, NGOs and Industrial
Manufacturers across Southern Africa.

**Clients (real — use as logo wall / “Trusted by” + testimonials source):**
Eskom (Kendal, Lethabo, Matla, Kusile, Tutuka, Kriel, Majuba, New Germany power
stations), Transnet, SARS, Department of Labour, COGHSTA Mpumalanga, Mpumalanga
Department of Health, AB InBev, Jonrich Crane Hire, Dwarsloop Beer Wholesalers.

---

## 3. SERVICES (content for the “What We Do” grid + Services page)

Pick the **6 headline cards** for the homepage grid (icon + title + one line),
then list the full catalogue lower down / on the Services page.

**Homepage 6 (with Lucide-style icon suggestions):**
1. **Construction Works** *(icon: hard-hat / building)* — General building, civil
   works, infrastructure, road markings & signage.
2. **Plant & Equipment Hire** *(icon: truck / crane)* — Mobile cranes, TLBs,
   backhoes, front-end loaders, tractors, water bowsers, lighting plant.
3. **Mining & PPE Supply** *(icon: shield / pickaxe)* — Pumps, motors, gaskets,
   bearings, valves, sealants, fasteners, shafts and PPE.
4. **Engineering Works** *(icon: wrench / cog)* — Electrical engineering, water
   distribution, commissioning spares, on-site plastic welding.
5. **Steel & Materials Supply** *(icon: layers / beam)* — All grades of steel,
   HDPE pipes & spares, bolts & nuts, hydraulic pumps & spares, valves.
6. **Pump Services** *(icon: droplet / gauge)* — Pump sales, repairs, rentals and
   maintenance; field services.

**Full catalogue (Services page):** Domestic & industrial cleaning · Material
handling · Supply of all grades of steel · HDPE pipes and spares · Hydraulic pumps
and spares · Electrical equipment · Valves · Bolts & nuts · Field services ·
On-site plastic welding · Vegetation management & weed control · Pump maintenance /
sales / repair / rentals · Labour hire · Plant hire (mobile crane, backhoe,
tractor, TLB, front-end loader, water bowser, lighting plant) · General building ·
Civil works · Electrical engineering works · Infrastructure · Road markings &
signage · Commissioning spares · Water distribution.

---

## 4. BRAND COLOUR SYSTEM  (black · white · red — NON-NEGOTIABLE)

Reskin the inspiration’s dark orange theme to this palette. Red replaces every
orange accent; keep the deep near-black canvas.

```css
:root {
  /* Core */
  --ink:        #0B0B0C;  /* page background — near-black */
  --surface:    #141416;  /* cards / raised panels */
  --surface-2:  #1C1C1F;  /* nested panels, inputs */
  --line:       #2A2A2E;  /* hairline borders / dividers */

  /* Brand red (primary accent + CTAs) */
  --red:        #E11414;  /* primary red */
  --red-600:    #C10F0F;  /* hover / pressed */
  --red-300:    #FF4B4B;  /* small highlights only */
  --red-tint:   rgba(225,20,20,0.12); /* soft red wash behind icons */

  /* Text on dark */
  --white:      #FFFFFF;  /* headlines */
  --bone:       #EDEDEA;  /* body text on dark */
  --muted:      #9A9AA2;  /* secondary / captions */

  /* Optional light section (About / Safety) */
  --paper:      #F5F5F3;  /* off-white section bg */
  --ink-on-paper:#111113; /* text on light */
}
```

**Rules**
- Red is an **accent**, not a wash: use it for the logo mark, primary buttons,
  active nav underline, section eyebrows (“WHAT WE DO”), icon strokes/tints, stat
  numbers, link hovers, form submit. Roughly **≤10% of any screen**.
- Body text is `--bone` on `--ink`; headlines are pure `--white`.
- Every red-on-dark and white-on-dark pair must pass **WCAG AA (≥4.5:1)**.
  `--red #E11414` on `--ink` passes for large/bold text and UI; do **not** use red
  for small body copy — use bone/white and keep red for emphasis and controls.
- One optional **light** section (About or Safety) may use `--paper` for rhythm —
  invert tokens there and re-check contrast.
- No gradients-as-decoration. A subtle dark→darker vignette on hero imagery and a
  faint grain/noise texture (2–4% opacity) are welcome for the industrial feel.

---

## 5. TYPOGRAPHY

- **Display / headlines:** a heavy condensed grotesque — **Anton**, *Archivo
  Black*, or *Bebek/Oswald 700*. Uppercase, tight tracking, huge on the hero
  (`clamp(2.75rem, 8vw, 6.5rem)`), the way the inspo stacks
  “BUILDING / STRONGER / FOUNDATIONS”.
- **Body / UI:** a clean humanist sans — **Inter**, *Urbanist*, or *Archivo*.
  Base **16px**, line-height **1.5–1.6**, measure 60–75ch.
- Self-host fonts (`woff2`, `font-display: swap`) — no external font CDN calls.
- Type scale: 12 · 14 · 16 · 18 · 24 · 32 · 48 · 72. Weight = hierarchy
  (700 headings, 500 labels, 400 body).
- Section eyebrow style: small, uppercase, letter-spaced, **red**
  (e.g. `WHAT WE DO`, `OUR WORK`, `GET IN TOUCH`).

---

## 6. PAGE STRUCTURE (mirror the inspiration, top to bottom)

Single-page homepage with anchored nav (plus optional sub-pages for Services,
Projects, About, Safety, Contact). Each section below maps to a block in the
inspiration image.

### 6.1 Sticky top nav
- Left: **TMP logo** (red rounded-square “T” mark + “TMP” / “T Monareng
  Projects” wordmark).
- Centre: Home · About Us · Services · Projects · Safety · Clients · Contact.
- Right: **“Request a Quote →”** solid-red button.
- Transparent over hero, gains `--ink` background + hairline border on scroll.
- Mobile: hamburger → full-screen dark drawer. Active link uses red underline.

### 6.2 Hero (full-bleed)
- Full-width construction/mining photo, dark left-to-right gradient overlay for
  text legibility.
- Eyebrow (red): **BUILT FOR TODAY. ENGINEERED FOR TOMORROW.**
- Headline (stacked, huge, white with the last word red):
  **BUILDING STRONGER FOUNDATIONS** → last line **“FOUNDATIONS” in red**.
- Sub: “TMP delivers construction and mining-supply solutions with unmatched
  quality, integrity and reliability — on time, every time.”
- Two CTAs: **“Our Services →”** (solid red) + **“View Projects”** (outline/ghost
  with white border).
- Small trust badge row: **CIDB 4CE · 3ME · 3G** and **Est. 2021**.

### 6.3 “What We Do” — services grid
- Left eyebrow **WHAT WE DO** (red) + heading **“HEAVY-DUTY SERVICES BUILT ON
  EXPERIENCE”**; right: one supporting paragraph.
- **6-card grid** (3×2 desktop, 2×3 tablet, 1-col mobile) from §3. Each card:
  outline icon in a red-tinted square, title, one-line description, red “→” link.
- Cards: `--surface` bg, `--line` border, hover = border→red + slight lift
  (transform translateY(-4px), 200ms ease-out).

### 6.4 Stats strip (dark band with texture)
Four stats, red numbers, uppercase label, small caption. Use verifiable figures:
- **Since 2021** — trusted delivery partner **[VERIFY exact founding month]**
- **CIDB 4CE · 3ME · 3G** — graded & compliant
- **20+ blue-chip clients** — Eskom, Transnet, SARS & more **[VERIFY count]**
- **Nationwide** — projects across South Africa **[VERIFY provinces]**
> Do not invent “X projects completed / Y years” numbers. Use the grading, the
> founding year, and the real client roster, which are all true.

### 6.5 Featured projects
- Eyebrow **OUR WORK** (red) + heading **“FEATURED PROJECTS”**; right: **“View All
  Projects →”**.
- **3 project cards** (image, category tag in red, title, location pin). Use real
  engagements:
  1. **Eskom Power Station Supply** — tag *Mining & Industrial Supply* — 📍 Kusile
     / Kendal, Mpumalanga.
  2. **Transnet Concrete Supply** — tag *Civil / Materials* — 📍 Steelpoort &
     Ohrigstad.
  3. **Municipal Road Refurbishment (COGHSTA)** — tag *Roads & Infrastructure* — 📍
     Mpumalanga.
- Image hover: subtle zoom (scale 1.05, 300ms), red category tag stays pinned.

### 6.6 Testimonials
- Centered eyebrow **TESTIMONIALS** (red) + **“WHAT OUR CLIENTS SAY”**.
- Quote carousel (left/right arrows, dots). Large red quote mark.
- **[VERIFY / PLACEHOLDER]** — do not attribute fabricated quotes to real people.
  Use a neutral placeholder until the client supplies real testimonials, e.g.:
  > “TMP delivered exactly what they promised — quality work, on time, with zero
  > compromise on safety.” — *Client name & role, [VERIFY]*.
  Prefer showing the **real client logo wall** (“Trusted by”) which needs no quote.

### 6.7 Trusted-by logo wall (add — strong proof for TMP)
Muted, single-colour client logos in a row/marquee: Eskom, Transnet, SARS,
Department of Labour, COGHSTA, Mpumalanga Health, AB InBev. Grayscale → full
colour/white on hover. **[VERIFY logo usage rights]** — if unavailable, render
client names as clean uppercase text chips.

### 6.8 Contact — “LET’S BUILD SOMETHING GREAT”
- Two columns. Left (on dark): eyebrow **GET IN TOUCH** (red), heading, short line
  “Have a project in mind? We’d love to hear about it.”, then contact details:
  - 📞 +27 79 604 8527
  - ✉️ thlologelo637@gmail.com
  - 📍 Stand No. 890, Kanana Moremela, Mpumalanga, 1271
- Right: contact form — Full Name, Email, Phone, Company, Project Details
  (textarea), **“Send Message →”** solid-red submit.
  - Visible labels (not placeholder-only), inline validation on blur, error text
    below each field, loading→success state on submit, `aria-live` for errors.
  - Semantic input types (`email`, `tel`) for correct mobile keyboards.
  - Wire to Formspree/Netlify Forms/`mailto:` fallback — **[VERIFY handler]**.

### 6.9 Mega-footer
- Red TMP logo + one-line descriptor: “TMP is a South African construction and
  mining-supply company delivering quality infrastructure solutions with a focus
  on safety, integrity and performance.”
- Columns: **Company** (About, Leadership, Careers, Contact) · **Services**
  (Construction, Plant Hire, Mining & PPE, Engineering, Steel Supply) ·
  **Resources** (Safety, Equipment, CIDB Gradings, FAQ) · **Newsletter**
  (email input + red submit).
- Social row (LinkedIn, Facebook, Instagram, WhatsApp) — **[VERIFY handles]**.
- Bottom bar: `© 2025 T Monareng Projects (Pty) Ltd. All rights reserved.` ·
  **CIDB 4CE · 3ME · 3G** · **CRS No. 10273886** · Privacy · Terms.

---

## 7. IMAGERY DIRECTION

Fill every placeholder from the layout. Two acceptable sources:

**A. Generate images (preferred for hero + project cards).** Photoreal, gritty,
South-African heavy-construction & mining. Consistent look: golden-hour or
overcast industrial light, workers in PPE (hi-vis + hard hats), red machinery
accents where natural. Keep a cohesive colour temperature so all shots feel like
one brand. Suggested prompts:
- **Hero:** “Wide cinematic shot of a large South African construction / power-
  station site at golden hour, tower cranes and excavators, workers in hi-vis and
  hard hats walking toward camera, dust and warm haze, dramatic sky, photoreal,
  high detail, 16:9.”
- **Project 1 (Eskom):** power-station structural steel & concrete works, cranes.
- **Project 2 (Transnet):** concrete/ready-mix pour, civil site, trucks.
- **Project 3 (Roads):** highway/municipal road construction, rollers & graders,
  road markings.
- **Service icons:** use a **single outline icon set (Lucide/Heroicons)** — do NOT
  generate icons, and never use emoji as structural icons.

**B. Royalty-free stock fallback.** Pull from Unsplash / Pexels (construction,
mining, cranes, PPE, steel, power stations). Prefer landscape, high-res, and
recolour with a dark overlay so they sit in the palette. Keep licences on file.

**Image engineering requirements**
- Export **WebP/AVIF**, provide `srcset`/`sizes`, `loading="lazy"` below the fold,
  and eager-load the hero.
- Every meaningful image needs descriptive **alt text**
  (e.g. `alt="TMP crew installing structural steel at an Eskom power station"`).
- Declare `width`/`height` or `aspect-ratio` to prevent layout shift (CLS < 0.1).
- Store under `assets/img/`; name by section (`hero.webp`, `project-eskom.webp`…).

---

## 8. UX / ACCESSIBILITY / PERFORMANCE (must pass)

- **Mobile-first**, breakpoints 375 / 768 / 1024 / 1440. No horizontal scroll.
- **Contrast** ≥ 4.5:1 for text; visible focus rings (2–3px) on all interactive
  elements; never remove focus outline.
- **Touch targets** ≥ 44×44px with ≥ 8px spacing.
- **One primary CTA per section** (“Request a Quote” / “Our Services” / “Send
  Message”); secondary actions visually subordinate (ghost buttons).
- **Motion:** 150–300ms, `transform`/`opacity` only, ease-out on enter; scroll-
  reveal for sections and a small stagger (30–50ms) on the services grid. Respect
  `prefers-reduced-motion` (disable reveals/parallax).
- **Semantic HTML5**: header/nav/main/section/footer, sequential h1→h3, skip-link
  to main, labelled form controls, `aria-label` on icon-only buttons.
- **Performance:** inline critical CSS, defer JS, no render-blocking third-party
  scripts, self-hosted fonts. Target Lighthouse ≥ 90 across the board.
- **SEO/meta:** title “T Monareng Projects | Construction & Mining Supply in South
  Africa”, meta description from the About, Open Graph image (hero), favicon from
  the TMP mark, `lang="en-ZA"`, JSON-LD `Organization` (name, logo, phone, address,
  founding date, area served: South Africa).

---

## 9. TECH & DELIVERABLES

- **Stack:** static HTML + CSS + vanilla JS (Tailwind optional). No backend.
- **Files:**
  - `index.html` (all homepage sections)
  - `css/style.css` (design tokens at top — the §4 `:root` block verbatim)
  - `js/main.js` (nav scroll state, mobile drawer, testimonial carousel, scroll
    reveal, form validation)
  - `assets/img/…`, `assets/fonts/…`, `assets/icons/…`
  - optional sub-pages: `services.html`, `projects.html`, `about.html`,
    `safety.html`, `contact.html`
- **Runs with** `python3 -m http.server 8000` — no build step required.
- **Code quality:** design tokens (no raw hex in components), semantic class
  names, comments marking each section, mobile + dark verified before delivery.

---

## 10. DEFINITION OF DONE

- [ ] Layout matches the inspiration’s section order and energy, reskinned to
      black/white/red.
- [ ] All copy is real TMP content from §2–§3; every **[VERIFY]** item flagged,
      none presented as fabricated fact.
- [ ] Palette tokens from §4 used everywhere; red ≤ ~10% per screen; AA contrast.
- [ ] Hero, 6 services, stats, 3 projects, testimonials, trusted-by, contact,
      footer all present and populated.
- [ ] Images generated or sourced royalty-free, optimised, alt-texted, no CLS.
- [ ] Fully responsive (375→1440), keyboard-navigable, reduced-motion safe,
      Lighthouse ≥ 90.
- [ ] Contact form validates and submits (handler wired or clearly stubbed).
- [ ] `© 2025 T Monareng Projects (Pty) Ltd · CIDB 4CE 3ME 3G · CRS 10273886` in
      the footer.

---

### Quick-start instruction to the builder
> “Build the TMP website exactly as specified in this master prompt. Use the
> §4 colour tokens verbatim, mirror the §6 section order from the inspiration,
> populate with the real §2–§3 content, generate/optimise the §7 imagery, and
> meet every §8 and §10 requirement. Output `index.html`, `css/style.css`,
> `js/main.js` and the asset folders, runnable with a static server.”
