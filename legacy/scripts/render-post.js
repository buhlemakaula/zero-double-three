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
  const engage = s.engage ? `<div class="engage">${esc(s.engage)}</div>` : "";
  const footer = `${engage}
    <footer class="foot">
      <span class="brand">BUHLE<em>.</em></span>
      <span class="page">${num}</span>
      <span class="handle">${esc(handle)}</span>
    </footer>`;

  if (s.type === "quiz") {
    return `<div class="slide quiz">
      <div class="eyebrow-row"><span class="pill">Guess before you swipe</span></div>
      <div class="mid">
        <h2 class="q">${esc(s.q)}</h2>
        ${s.hint ? `<p class="qsub">${esc(s.hint)}</p>` : ""}
        <p class="swipe">Answer next <span class="arr">&rarr;</span></p>
      </div>${footer}</div>`;
  }
  if (s.type === "answer") {
    return `<div class="slide answer">
      <div class="eyebrow-row"><span class="numchip">A</span><span class="series">The answer</span></div>
      <div class="mid">
        <h2>${esc(s.heading)}</h2>
        <p class="body">${esc(s.body)}</p>
        ${s.why ? `<div class="example"><span class="exlabel">Why you care</span><p>${esc(s.why)}</p></div>` : ""}
      </div>${footer}</div>`;
  }
  if (s.type === "receipt") {
    return `<div class="slide receipt">
      <div class="eyebrow-row"><span class="pill">${esc(s.label || "Receipt")}</span></div>
      <div class="mid">
        <div class="example prompt-box"><span class="exlabel">The prompt</span><p>${esc(s.prompt)}</p></div>
        <div class="example output-box"><span class="exlabel out">What came back</span><p>${esc(s.output)}</p></div>
        ${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
      </div>${footer}</div>`;
  }
  if (s.type === "ab") {
    return `<div class="slide ab">
      <div class="eyebrow-row"><span class="pill">Vote in the comments</span></div>
      <div class="mid">
        <h2>${esc(s.heading)}</h2>
        <div class="ab-row">
          <div class="ab-box"><span class="ab-tag">A</span><p>${esc(s.a)}</p></div>
          <div class="ab-box"><span class="ab-tag">B</span><p>${esc(s.b)}</p></div>
        </div>
        <p class="body ask">${esc(s.ask)}</p>
      </div>${footer}</div>`;
  }
  if (s.type === "checklist") {
    return `<div class="slide check">
      <div class="eyebrow-row"><span class="series">${esc(series)}</span></div>
      <div class="mid">
        <h2>${esc(s.heading)}</h2>
        <ul class="checklist">${(s.items || []).map((it) => `<li>${esc(it)}</li>`).join("")}</ul>
      </div>${footer}</div>`;
  }
  if (s.type === "challenge") {
    return `<div class="slide challenge">
      <div class="eyebrow-row"><span class="pill">Try it tonight</span></div>
      <div class="mid">
        <h2>${esc(s.heading)}</h2>
        <p class="body">${esc(s.body)}</p>
        <div class="example"><span class="exlabel">Your move</span><p>${esc(s.action)}</p></div>
      </div>${footer}</div>`;
  }
  if (s.type === "flow") {
    const steps = (s.items || []).map((it, k) => `
      ${k > 0 ? '<div class="flow-arrow">&darr;</div>' : ""}
      <div class="flow-box${it.hot ? " hot" : ""}"><span class="flow-t">${esc(it.t)}</span><span class="flow-d">${esc(it.d)}</span></div>`).join("");
    return `<div class="slide flow">
      <div class="eyebrow-row"><span class="series">${esc(series)}</span></div>
      <div class="mid">
        <h2>${esc(s.heading)}</h2>
        <div class="flow-col">${steps}</div>
      </div>${footer}</div>`;
  }
  if (s.type === "bars") {
    const max = Math.max(...(s.items || []).map((it) => it.value));
    const rows = (s.items || []).map((it) => `
      <div class="bar-row">
        <div class="bar-label">${esc(it.label)}</div>
        <div class="bar-track"><div class="bar-fill${it.hot ? " hot" : ""}" style="width:${Math.max(6, (it.value / max) * 100)}%"></div>
        <span class="bar-value">${esc(it.display != null ? it.display : it.value)}</span></div>
      </div>`).join("");
    return `<div class="slide barslide">
      <div class="eyebrow-row"><span class="series">${esc(series)}</span></div>
      <div class="mid">
        <h2>${esc(s.heading)}</h2>
        <div class="bars">${rows}</div>
        ${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
      </div>${footer}</div>`;
  }
  if (s.type === "stat") {
    return `<div class="slide statslide">
      <div class="eyebrow-row"><span class="series">${esc(series)}</span></div>
      <div class="mid">
        ${s.kicker ? `<p class="kicker">${esc(s.kicker)}</p>` : ""}
        <div class="stat-value">${esc(s.value)}</div>
        <p class="body">${esc(s.body)}</p>
      </div>${footer}</div>`;
  }
  if (s.type === "chips") {
    // A chunk that doesn't start with a space continues the previous word (a
    // word piece) — grey. Space-prefixed chunks start whole words — orange.
    const chips = (s.items || []).map((c, k) => {
      const piece = k > 0 && !c.startsWith(" ");
      return `<span class="chip${piece ? " piece" : ""}">${esc(c.trim())}</span>`;
    }).join("");
    return `<div class="slide chipslide">
      <div class="eyebrow-row"><span class="series">${esc(series)}</span></div>
      <div class="mid">
        <h2>${esc(s.heading)}</h2>
        <div class="chip-row">${chips}</div>
        ${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
      </div>${footer}</div>`;
  }
  if (s.type === "timeline") {
    const rows = (s.items || []).map((it) => `
      <div class="tl-row"><span class="tl-time">${esc(it.t)}</span><span class="tl-dot"></span><span class="tl-text">${esc(it.d)}</span></div>`).join("");
    return `<div class="slide tlslide">
      <div class="eyebrow-row"><span class="series">${esc(series)}</span></div>
      <div class="mid">
        <h2>${esc(s.heading)}</h2>
        <div class="tl">${rows}</div>
      </div>${footer}</div>`;
  }
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

  .quotecard .q, .quiz .q {
    font-family: "Anton", sans-serif; font-weight: 400;
    font-size: 112px; line-height: 1.05; text-transform: uppercase;
  }
  .quiz .q { font-size: 96px; }
  .qsub { margin-top: 44px; color: #98958d; font-size: 38px; font-weight: 600; }

  .answer h2, .ab h2, .check h2, .challenge h2 {
    font-family: "Anton", sans-serif; font-weight: 400;
    font-size: 88px; line-height: 1.0; text-transform: uppercase; margin-bottom: 40px;
  }
  .answer h2 { color: #f4622e; }

  .receipt .prompt-box { margin-top: 0; }
  .receipt .output-box { margin-top: 34px; border-left-color: #98958d; }
  .receipt .output-box .exlabel.out { color: #98958d; }
  .receipt .note { margin-top: 40px; font-size: 38px; line-height: 1.45; color: #e9e7e2; font-weight: 600; }

  .ab-row { display: flex; gap: 30px; }
  .ab-box {
    flex: 1; background: #1b1b1a; border: 2px solid #2b2b29;
    border-radius: 26px; padding: 40px;
  }
  .ab-box p { font-size: 36px; line-height: 1.45; color: #cfccc5; }
  .ab-tag {
    display: inline-block; font-family: "Anton", sans-serif; font-size: 44px;
    color: #0d0d0c; background: #f4622e; border-radius: 16px;
    padding: 6px 26px; margin-bottom: 24px;
  }
  .ab .ask { margin-top: 44px; font-weight: 700; color: #e9e7e2; }

  .checklist { list-style: none; }
  .checklist li {
    font-size: 42px; line-height: 1.4; color: #cfccc5;
    padding-left: 64px; position: relative; margin-bottom: 34px;
  }
  .checklist li::before {
    content: ""; position: absolute; left: 0; top: 14px;
    width: 34px; height: 34px; border-radius: 9px;
    border: 4px solid #f4622e;
  }

  .flow h2, .barslide h2, .chipslide h2, .tlslide h2 {
    font-family: "Anton", sans-serif; font-weight: 400;
    font-size: 80px; line-height: 1.0; text-transform: uppercase; margin-bottom: 48px;
  }

  .flow-col { display: flex; flex-direction: column; align-items: stretch; }
  .flow-box {
    background: #1b1b1a; border: 2px solid #2b2b29; border-radius: 22px;
    padding: 26px 40px; display: flex; align-items: baseline; gap: 28px;
  }
  .flow-box.hot { border-color: #f4622e; }
  .flow-t { font-family: "Anton", sans-serif; font-size: 40px; color: #f4622e; white-space: nowrap; }
  .flow-d { font-size: 34px; color: #cfccc5; line-height: 1.3; }
  .flow-arrow { text-align: center; color: #f4622e; font-size: 44px; line-height: 1.1; padding: 6px 0; }

  .bars { display: flex; flex-direction: column; gap: 44px; }
  .bar-label { font-size: 32px; font-weight: 700; color: #98958d; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.08em; }
  .bar-track { display: flex; align-items: center; gap: 26px; }
  .bar-fill { height: 34px; border-radius: 8px; background: #45453f; }
  .bar-fill.hot { background: #f4622e; }
  .bar-value { font-family: "Anton", sans-serif; font-size: 40px; color: #e9e7e2; white-space: nowrap; }
  .barslide .note, .chipslide .note { margin-top: 52px; font-size: 36px; line-height: 1.45; color: #cfccc5; }

  .stat-value {
    font-family: "Anton", sans-serif; font-size: 320px; line-height: 1;
    color: #f4622e; margin: 20px 0 40px;
  }
  .statslide .kicker { margin-bottom: 0; }

  .chip-row { display: flex; flex-wrap: wrap; gap: 18px; }
  .chip {
    font-family: "Urbanist", sans-serif; font-weight: 700; font-size: 40px;
    color: #e9e7e2; background: #1b1b1a; border: 3px solid #f4622e;
    border-radius: 16px; padding: 14px 26px;
  }
  .chip.piece { border-color: #45453f; }

  .tl { display: flex; flex-direction: column; position: relative; }
  .tl-row { display: flex; align-items: center; gap: 34px; padding: 26px 0; position: relative; }
  .tl-time { font-family: "Anton", sans-serif; font-size: 44px; color: #f4622e; width: 190px; flex: none; }
  .tl-dot { width: 22px; height: 22px; border-radius: 50%; background: #f4622e; flex: none; }
  .tl-row:not(:last-child) .tl-dot::after {
    content: ""; position: absolute; left: calc(190px + 34px + 9px); top: 62%;
    width: 4px; height: 76%; background: #2b2b29;
  }
  .tl-text { font-size: 38px; color: #cfccc5; line-height: 1.35; }

  .engage {
    position: relative; z-index: 2; align-self: flex-start;
    border: 3px solid #f4622e; color: #f4622e;
    font-weight: 800; font-size: 28px; letter-spacing: 0.14em; text-transform: uppercase;
    padding: 14px 34px; border-radius: 999px; margin-bottom: 44px;
  }

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
