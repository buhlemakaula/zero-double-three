// Renders one day's Instagram post from content/calendar.json into
// 1080x1350 slide PNGs under content/output/<date>/.
//
// Usage: node scripts/render-post.js 2026-07-13
// Needs: playwright-core + chromium, and a static server on :8321
// serving the repo root (for the brand fonts):
//   python3 -m http.server 8321
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

const ROOT = path.join(__dirname, "..");
const date = process.argv[2];
if (!date) { console.error("Usage: node scripts/render-post.js YYYY-MM-DD"); process.exit(1); }

const calendar = JSON.parse(fs.readFileSync(path.join(ROOT, "content/calendar.json"), "utf8"));
const post = calendar.posts.find((p) => p.date === date);
if (!post) { console.error("No post for " + date); process.exit(1); }
if (post.status !== "ready" || !post.slides) {
  console.error("Post for " + date + " is still an outline. Write its slides and set status to ready first.");
  process.exit(1);
}

const handle = calendar.brand.handle;
const series = calendar.brand.series;

const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Wraps the accent word of a cover title in orange.
function accentify(title, accent) {
  if (!accent) return esc(title);
  return esc(title).replace(esc(accent), '<span class="acc">' + esc(accent) + "</span>");
}

function slideHTML(s, i, total) {
  const num = String(i + 1).padStart(2, "0") + "/" + String(total).padStart(2, "0");
  const footer = `
    <footer class="foot">
      <span class="brand">BUHLE<em>.</em></span>
      <span class="page">${num}</span>
      <span class="handle">${esc(handle)}</span>
    </footer>`;

  if (s.type === "cover") {
    return `<div class="slide cover">
      <div class="eyebrow-row"><span class="pill">${esc(series)}</span></div>
      <div class="mid">
        ${s.kicker ? `<p class="kicker">${esc(s.kicker)}</p>` : ""}
        <h1>${accentify(s.title, s.accent)}</h1>
        <p class="swipe">Swipe <span class="arr">&rarr;</span></p>
      </div>${footer}</div>`;
  }
  if (s.type === "point") {
    return `<div class="slide point">
      <div class="eyebrow-row"><span class="numchip">${String(s.n).padStart(2, "0")}</span><span class="series">${esc(series)}</span></div>
      <div class="mid">
        <h2>${esc(s.heading)}</h2>
        <p class="body">${esc(s.body)}</p>
        ${s.example ? `<div class="example"><span class="exlabel">Copy this</span><p>${esc(s.example)}</p></div>` : ""}
      </div>${footer}</div>`;
  }
  if (s.type === "quote" || s.type === "quote-card") {
    return `<div class="slide quotecard">
      <div class="mid">
        <h2 class="q">${esc(s.text)}</h2>
        ${s.sub ? `<p class="qsub">${esc(s.sub)}</p>` : ""}
      </div>${footer}</div>`;
  }
  if (s.type === "cta") {
    return `<div class="slide cta">
      <div class="mid">
        <div class="mono">B<em>.</em></div>
        <h2>${esc(s.heading)}</h2>
        <p class="body">${esc(s.body)}</p>
        <span class="pill solid">Follow ${esc(handle)}</span>
      </div>${footer}</div>`;
  }
  throw new Error("Unknown slide type: " + s.type);
}

const page_html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: "Anton"; src: url("http://localhost:8321/assets/fonts/anton-latin.woff2") format("woff2"); }
  @font-face { font-family: "Urbanist"; font-weight: 100 900; src: url("http://localhost:8321/assets/fonts/urbanist-latin.woff2") format("woff2"); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #333; display: flex; flex-direction: column; gap: 30px; padding: 30px; }

  .slide {
    width: 1080px; height: 1350px; flex: none;
    background: radial-gradient(115% 85% at 50% 0%, #1c1c1b 0%, #0d0d0c 62%), #0d0d0c;
    position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    padding: 84px 88px;
    font-family: "Urbanist", sans-serif; color: #e9e7e2;
  }
  .slide::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .mid { position: relative; z-index: 2; margin: auto 0; }

  .eyebrow-row { position: relative; z-index: 2; display: flex; align-items: center; gap: 24px; }
  .pill {
    display: inline-block; background: #f4622e; color: #0d0d0c;
    font-weight: 800; font-size: 30px; letter-spacing: 0.08em;
    padding: 12px 34px; border-radius: 999px; text-transform: uppercase;
  }
  .pill.solid { margin-top: 48px; }
  .numchip {
    font-family: "Anton", sans-serif; font-size: 44px; color: #0d0d0c;
    background: #f4622e; border-radius: 20px; padding: 10px 24px;
  }
  .series { color: #98958d; font-weight: 700; font-size: 28px; letter-spacing: 0.22em; text-transform: uppercase; }

  .cover h1 {
    font-family: "Anton", sans-serif; font-weight: 400;
    font-size: 122px; line-height: 1.02; text-transform: uppercase;
    letter-spacing: 0.002em;
  }
  .cover .acc { color: #f4622e; }
  .kicker { color: #98958d; font-weight: 700; font-size: 34px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 34px; }
  .swipe { margin-top: 56px; color: #98958d; font-weight: 700; font-size: 34px; }
  .swipe .arr { color: #f4622e; }

  .point h2 {
    font-family: "Anton", sans-serif; font-weight: 400;
    font-size: 88px; line-height: 1.0; text-transform: uppercase; margin-bottom: 40px;
  }
  .body { font-size: 42px; line-height: 1.5; color: #cfccc5; max-width: 30ch; }

  .example {
    margin-top: 52px; background: #1b1b1a; border: 2px solid #2b2b29;
    border-left: 10px solid #f4622e; border-radius: 26px; padding: 40px 44px;
  }
  .example .exlabel {
    display: inline-block; color: #f4622e; font-weight: 800; font-size: 26px;
    letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 18px;
  }
  .example p { font-size: 36px; line-height: 1.5; color: #e9e7e2; }

  .quotecard .q {
    font-family: "Anton", sans-serif; font-weight: 400;
    font-size: 112px; line-height: 1.05; text-transform: uppercase;
  }
  .qsub { margin-top: 44px; color: #98958d; font-size: 38px; font-weight: 600; }

  .cta { text-align: left; }
  .cta .mono { font-family: "Anton", sans-serif; font-size: 170px; line-height: 1; margin-bottom: 40px; }
  .cta .mono em { font-style: normal; color: #f4622e; }
  .cta h2 { font-family: "Anton", sans-serif; font-weight: 400; font-size: 96px; text-transform: uppercase; margin-bottom: 36px; }

  .foot {
    position: relative; z-index: 2;
    display: flex; justify-content: space-between; align-items: baseline;
    color: #98958d; font-weight: 700; font-size: 30px;
  }
  .foot .brand { font-family: "Anton", sans-serif; font-size: 40px; color: #e9e7e2; }
  .foot .brand em { font-style: normal; color: #f4622e; }
  .foot .page { color: #f4622e; letter-spacing: 0.1em; }
</style></head><body>
${post.slides.map((s, i) => slideHTML(s, i, post.slides.length)).join("\n")}
</body></html>`;

(async () => {
  const outDir = path.join(ROOT, "content/output", date);
  fs.mkdirSync(outDir, { recursive: true });
  const tmp = path.join(ROOT, "post-render-tmp.html");
  fs.writeFileSync(tmp, page_html);

  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1500 } });
  await page.goto("http://localhost:8321/post-render-tmp.html", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const slides = await page.$$(".slide");
  for (let i = 0; i < slides.length; i++) {
    const file = path.join(outDir, "slide-" + String(i + 1).padStart(2, "0") + ".png");
    await slides[i].screenshot({ path: file });
    console.log(path.relative(ROOT, file));
  }
  await browser.close();
  fs.unlinkSync(tmp);

  fs.writeFileSync(path.join(outDir, "caption.txt"),
    post.caption + "\n\n[Post at " + post.time_sast + " SAST]\n");
  console.log("caption.txt written. " + slides.length + " slides for " + date + " (" + post.title + ")");
})();
