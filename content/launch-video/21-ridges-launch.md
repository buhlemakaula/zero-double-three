# 21 Ridges — Launch Video

Two things live here:

1. **A rendered launch film** — `21-ridges-launch-8k.mp4`, a real 8K clip built
   from code (no AI-video service needed). See [Rendered film](#rendered-film).
2. **Ready-to-paste prompts** for an AI video generator (Veo 3, Sora, Runway
   Gen-3, Kling, Luma), if you want a photoreal cinematic version — the reel
   shows a website **building itself** and resolving into the real 21 Ridges
   site as the payoff.

## Rendered film

`21-ridges-launch-8k.mp4` — **7680×4320 (8K UHD), H.264 MP4, 12s @ 24fps.**
A cool emerald→blue "agent" interface types "21 RIDGES", a loading pulse fires,
a glassy wireframe assembles top-to-bottom (nav → hero → menu tabs → gallery),
then **one hard cut** blooms the finished, candlelit 21 Ridges site — gold
wordmark, "Good food. Great vibes.", a gold *Reserve a Table* button — and ends
on "Built by an AI agent". Deep near-black grade, film grain, one reserved cut.

It's a self-contained HTML/CSS animation rendered frame-by-frame, so it's fully
editable — change the copy, colours, or timing and re-render.

**Files**
- `launch.html` — the animation (deterministic `window.seek(t)` timeline; uses
  the repo's self-hosted Anton + Urbanist fonts).
- `render-frames.js` — Playwright script that seeks each frame and writes JPEGs.

**Re-render (needs Node + Playwright's Chromium + ffmpeg):**
```bash
# 1) render 288 frames (script renders at 4K for speed)
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node render-frames.js
# 2) encode + upscale to true 8K
ffmpeg -y -framerate 24 -i frames/f_%04d.jpg \
  -vf "scale=7680:4320:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v high -preset medium -crf 17 \
  -x264-params "level=6.2:keyint=48" -pix_fmt yuv420p -movflags +faststart \
  -r 24 21-ridges-launch-8k.mp4
```
The film master is finished at 8K from a 4K render (lanczos) — standard for
vector/gradient/type motion graphics and visually indistinguishable from native
8K, while keeping render time to minutes. To render natively at 8K, set
`W=7680, H=4320` in `render-frames.js` (much slower — the large blur radii are
expensive at 33MP).

---

## AI-video prompt package

Ready-to-paste prompts for an AI video generator (Veo 3, Sora, Runway Gen-3,
Kling, Luma). The reel shows a website **building itself** and resolving into a
real site we already shipped — **21 Ridges Bistro & Bar** — as the payoff.

**Reference site:** https://raw.githack.com/buhlemakaula/zero-double-three/eaaa8ee24ce564f6d27098e00685cf5328d59534/index.html
**Image reference (attach to the model if it accepts one):** `ridges-shots/desktop-hero.png`, `ridges-shots/desktop-full.png`

## The idea in one line

A cold, glassy "agent" interface types a business name, assembles a wireframe
block by block, then **one hard cut** blooms the finished, candlelit 21 Ridges
site into place — cold tech process → warm finished brand.

## The one deliberate colour move (read before rendering)

The locked **STYLE BLOCK** is the emerald→royal-blue premium-tech grade. The
finished 21 Ridges site is **candlelit gold on near-black** — its own identity.
Both share a deep near-black ground (`#0A0A0A` ≈ the site's `#070706`), so the
handoff is clean. The arc is intentional:

- **Build phase (Clips 1–2):** everything is the emerald→blue "system" — the
  cursor, the loading pulse, the wireframe, the glow. Strictly on-palette.
- **The reveal (Clip 3):** the single reserved hard cut. The cool wireframe
  snaps into the site's native **warm gold** (`#c9a24b` / `#e6cd93`), Cormorant
  serif wordmark, film grain, thin gold inset frame. This is the money frame.
- **Payoff (Clip 4):** the live site sits in a cool ambient glow — warm site,
  cool room. The two palettes coexist, they don't fight.

Gold + emerald + blue across a reel is **not** "rainbow" — it stays inside the
NEGATIVE block. If a client wants it strictly cool end-to-end, see
[Cool-only variant](#cool-only-variant) at the bottom.

---

## Reusable master template

Copy this for any future build-reveal clip. The three blocks in **CAPS (do not
change)** are locked house style — paste them verbatim every time. Fill only the
bracketed parts.

```
[SHOT DESCRIPTION — one clear sentence of what happens.]

STYLE BLOCK (do not change):
Cinematic, atmospheric, premium tech aesthetic. Deep near-black background
(#0A0A0A). Accent gradient flowing from emerald green (#10B981) into royal
blue (#2563EB). High contrast, moody lighting, subtle volumetric glow around
UI elements. Oversized bold typography. Glassy, modern interface panels with
soft depth and faint reflections. Feels like a high-end product launch film.
Colour grade: rich blacks, controlled highlights, cinematic teal-and-blue tone.

MOTION BLOCK (do not change):
Smooth, deliberate, weighted motion — nothing jittery. Elements ease in and
out. Slow controlled camera push-in. UI builds with satisfying sequential
timing, like dominoes resolving. One clean hard-cut moment reserved for the
reveal. Frame rate feels fluid and premium.

SUBJECT / ACTION:
[Describe the specific action for THIS clip. Be concrete about what moves and
in what order.]

ON-SCREEN TEXT (render sharp, bold, centred or lower-third):
"[Hook text — under 8 words]"

CAMERA:
[slow push-in / static locked-off with internal motion / gentle orbital drift /
vertical pan following the build downward]

PACING:
[slow and hypnotic (eye-candy) / brisk and punchy (scale/montage)]

NEGATIVE BLOCK (do not change):
No people, no faces, no hands unless specified. No stock-footage look, no
generic corporate blandness, no rainbow colours, no cluttered UI, no
watermark, no warped text, no flickering, no low-contrast washed-out grading,
no cheesy zoom bounces.
```

---

## The reel — 4 clips

Render each separately, then stitch in order. Suggested lengths in each header.
Shoot **9:16** for the Instagram reel; a **16:9** cut works for the site/showreel.

### Clip 1 — The prompt (≈5s, slow and hypnotic)

```
A business name is typed into a sleek dark agent interface, a loading pulse
ripples outward, and the first structural lines of a website begin to draw
themselves in mid-air.

STYLE BLOCK (do not change):
Cinematic, atmospheric, premium tech aesthetic. Deep near-black background
(#0A0A0A). Accent gradient flowing from emerald green (#10B981) into royal
blue (#2563EB). High contrast, moody lighting, subtle volumetric glow around
UI elements. Oversized bold typography. Glassy, modern interface panels with
soft depth and faint reflections. Feels like a high-end product launch film.
Colour grade: rich blacks, controlled highlights, cinematic teal-and-blue tone.

MOTION BLOCK (do not change):
Smooth, deliberate, weighted motion — nothing jittery. Elements ease in and
out. Slow controlled camera push-in. UI builds with satisfying sequential
timing, like dominoes resolving. One clean hard-cut moment reserved for the
reveal. Frame rate feels fluid and premium.

SUBJECT / ACTION:
Centred in the dark, a thin emerald text cursor blinks. Letters type in one by
one spelling "21 RIDGES", the caret glowing at the tip. A single emerald-to-blue
loading pulse ripples outward from the text like a ring on water. As it fades, a
faint blue wireframe grid resolves out of the black and the first rectangular
panels of a web layout sketch themselves in glowing outline — a nav bar at the
top, a large hero block beneath — glassy, semi-transparent, edges catching a
soft volumetric glow. Nothing is filled yet; it is pure structure, drawn in
light. Slow, deliberate, weighted.

ON-SCREEN TEXT (render sharp, bold, centred or lower-third):
"Watch an AI build a restaurant"

CAMERA:
slow push-in

PACING:
slow and hypnotic

NEGATIVE BLOCK (do not change):
No people, no faces, no hands unless specified. No stock-footage look, no
generic corporate blandness, no rainbow colours, no cluttered UI, no
watermark, no warped text, no flickering, no low-contrast washed-out grading,
no cheesy zoom bounces.
```

### Clip 2 — The build (≈6s, brisk and punchy)

```
Website sections snap into place from top to bottom like dominoes resolving —
nav, hero, menu tabs, gallery grid — each locking in with a soft emerald-blue
glow.

STYLE BLOCK (do not change):
Cinematic, atmospheric, premium tech aesthetic. Deep near-black background
(#0A0A0A). Accent gradient flowing from emerald green (#10B981) into royal
blue (#2563EB). High contrast, moody lighting, subtle volumetric glow around
UI elements. Oversized bold typography. Glassy, modern interface panels with
soft depth and faint reflections. Feels like a high-end product launch film.
Colour grade: rich blacks, controlled highlights, cinematic teal-and-blue tone.

MOTION BLOCK (do not change):
Smooth, deliberate, weighted motion — nothing jittery. Elements ease in and
out. Slow controlled camera push-in. UI builds with satisfying sequential
timing, like dominoes resolving. One clean hard-cut moment reserved for the
reveal. Frame rate feels fluid and premium.

SUBJECT / ACTION:
The blue wireframe from the previous shot now fills in, block by block, from the
top down. First the slim nav bar slides in and locks with a soft click of glow.
Then a tall hero panel drops into place. Then a horizontal row of menu tabs
snaps in one after another — evenly spaced pills of light. Then a three-by-three
gallery grid tiles in, cell by cell, bottom-left to top-right, like dominoes
resolving. Each element eases in, settles with weight, and pulses a faint
emerald-to-blue rim-light as it locks. Glassy panels with soft depth and faint
reflections; thin gradient hairlines separating sections. The camera drifts
downward following the build. Still monochrome tech-blue — no photos, no colour
inside the blocks yet, just structure snapping together with satisfying timing.

ON-SCREEN TEXT (render sharp, bold, centred or lower-third):
"Zero code. One afternoon."

CAMERA:
vertical pan following the build downward

PACING:
brisk and punchy

NEGATIVE BLOCK (do not change):
No people, no faces, no hands unless specified. No stock-footage look, no
generic corporate blandness, no rainbow colours, no cluttered UI, no
watermark, no warped text, no flickering, no low-contrast washed-out grading,
no cheesy zoom bounces.
```

### Clip 3 — The reveal (≈5s, the one hard cut)

> This is the reserved hard-cut. The cool wireframe becomes the finished,
> candlelit 21 Ridges site. Attach `ridges-shots/desktop-hero.png` as an image
> reference here if the model supports it.

```
One clean hard cut: the cold blue wireframe snaps into the finished, warm
candlelit 21 Ridges website — gold serif wordmark, dark hero, film grain — fully
alive.

STYLE BLOCK (do not change):
Cinematic, atmospheric, premium tech aesthetic. Deep near-black background
(#0A0A0A). Accent gradient flowing from emerald green (#10B981) into royal
blue (#2563EB). High contrast, moody lighting, subtle volumetric glow around
UI elements. Oversized bold typography. Glassy, modern interface panels with
soft depth and faint reflections. Feels like a high-end product launch film.
Colour grade: rich blacks, controlled highlights, cinematic teal-and-blue tone.

MOTION BLOCK (do not change):
Smooth, deliberate, weighted motion — nothing jittery. Elements ease in and
out. Slow controlled camera push-in. UI builds with satisfying sequential
timing, like dominoes resolving. One clean hard-cut moment reserved for the
reveal. Frame rate feels fluid and premium.

SUBJECT / ACTION:
Hold one beat on the finished blue wireframe — then a single clean HARD CUT.
The same layout is now the real, finished site, rendered in warm candlelight:
a deep near-black ground, a high-contrast serif wordmark reading "21 RIDGES"
with "BISTRO & BAR" small and gold-lettered beneath it, glowing metallic gold
(#c9a24b to #e6cd93). Behind it a moody dark hero photograph of a plated dish
under low light, slowly Ken-Burns zooming. A thin gold inset frame with small
right-angle corner ticks borders the screen. Fine film grain drifts over
everything. An italic serif line fades in: "Good food. Great vibes." A solid
gold "Reserve a Table" button glows into focus below it. The whole frame breathes
warmth after the cold build — same structure, now a real restaurant. Slow push-in
on the wordmark. Cinematic, opulent, controlled highlights.

ON-SCREEN TEXT (render sharp, bold, centred or lower-third):
"This site built itself"

CAMERA:
slow push-in

PACING:
slow and hypnotic

NEGATIVE BLOCK (do not change):
No people, no faces, no hands unless specified. No stock-footage look, no
generic corporate blandness, no rainbow colours, no cluttered UI, no
watermark, no warped text, no flickering, no low-contrast washed-out grading,
no cheesy zoom bounces.
```

### Clip 4 — The payoff (≈5s, static with internal motion)

```
The finished 21 Ridges site sits glowing on a floating dark glass device, a gold
"Reserve a Table" button pulses, and a closing line resolves in.

STYLE BLOCK (do not change):
Cinematic, atmospheric, premium tech aesthetic. Deep near-black background
(#0A0A0A). Accent gradient flowing from emerald green (#10B981) into royal
blue (#2563EB). High contrast, moody lighting, subtle volumetric glow around
UI elements. Oversized bold typography. Glassy, modern interface panels with
soft depth and faint reflections. Feels like a high-end product launch film.
Colour grade: rich blacks, controlled highlights, cinematic teal-and-blue tone.

MOTION BLOCK (do not change):
Smooth, deliberate, weighted motion — nothing jittery. Elements ease in and
out. Slow controlled camera push-in. UI builds with satisfying sequential
timing, like dominoes resolving. One clean hard-cut moment reserved for the
reveal. Frame rate feels fluid and premium.

SUBJECT / ACTION:
The finished warm 21 Ridges homepage sits on a floating pane of dark glass,
angled slightly in three-quarter view, hovering in a near-black room lit by a
soft emerald-to-blue ambient glow from behind — warm site, cool room. The page
gently scrolls a touch, revealing the gold menu tabs and a "Sushi & RnB Night"
banner easing past. A solid gold "Reserve a Table" button gives one slow,
confident pulse of glow. Faint reflections travel across the glass. Everything
is calm and settled — the build is done. A closing line fades up, centred.

ON-SCREEN TEXT (render sharp, bold, centred or lower-third):
"Built by an AI agent"

CAMERA:
static locked-off with internal motion

PACING:
slow and hypnotic

NEGATIVE BLOCK (do not change):
No people, no faces, no hands unless specified. No stock-footage look, no
generic corporate blandness, no rainbow colours, no cluttered UI, no
watermark, no warped text, no flickering, no low-contrast washed-out grading,
no cheesy zoom bounces.
```

---

## On-screen hook options (all under 8 words)

Swap into any clip. Keep to **one hook per clip** for punch.

- Watch an AI build a restaurant
- This site built itself
- Zero code. One afternoon.
- From prompt to premium
- I didn't write a single line
- Your business, live by tonight
- Built by an AI agent
- Real client. Real site. No developer.

## Stitching & delivery notes

- **Order:** Clip 1 → 2 → 3 → 4. The only hard cut lands entering Clip 3.
- **Aspect:** 9:16 for the IG reel; render a 16:9 pass for the showreel/site.
- **Total runtime:** ~21s — a clean sub-30s reel.
- **Audio (add in edit):** low sub-bass swell through the build, a single soft
  impact on the Clip-3 hard cut, warm pad underneath the payoff.
- **Consistency:** keep the wordmark spelled "21 RIDGES" in every clip so the
  brand reads the same frame to frame (models drift on text — regenerate any
  clip with warped letters rather than shipping it).
- **Caption tie-in:** matches the built-in-public voice — e.g. "An AI agent
  built this restaurant's whole website in one afternoon. Real client. Comment
  SITE and I'll send the breakdown."

## Cool-only variant

If a version must stay strictly emerald→blue with **no** warm reveal (e.g. a
generic agency showreel, not the 21 Ridges cut): in Clip 3, keep the finished
site but recolour it to the tech palette — replace the gold wordmark and button
with an emerald-to-blue gradient on the same near-black ground, and drop the
film-grain/candlelight language. Everything else holds. This trades the
warm-brand payoff for strict palette lock.
