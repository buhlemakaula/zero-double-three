/* ============================================================
   Buhle Studio — v3 behaviour (strip the slop)
   Content is painted by default; motion enhances. Vanilla JS.
   ============================================================ */
(function () {
  "use strict";
  var D = window.BUHLE_DATA || { work: [], builds: [], proof: [] };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) document.documentElement.classList.add("has-motion");

  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var sel = "[data-draw],[data-rise],[data-clip],[data-wipe],[data-type]";

  /* ---------- generic reveals (everything outside the hero) ---------- */
  function initReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll(sel))
      .filter(function (el) { return !el.closest(".hero"); });
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); }); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.14 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero load sequence (1.2s) ---------- */
  function initHero() {
    var kick = $(".hero .hero-kick .rule");
    var lines = document.querySelectorAll(".hero h1 .l");
    var rises = document.querySelectorAll(".hero [data-rise]");
    if (reduce) {
      [kick].concat([].slice.call(lines)).concat([].slice.call(rises)).forEach(function (el) { el && el.classList.add("in"); });
      return;
    }
    if (kick) setTimeout(function () { kick.classList.add("in"); }, 80);
    lines.forEach(function (l, i) { setTimeout(function () { l.classList.add("in"); }, 260 + i * 150); });
    rises.forEach(function (r, i) { setTimeout(function () { r.classList.add("in"); }, 820 + i * 120); });
  }

  /* ---------- rail + mobile menu ---------- */
  function initNav() {
    var railLinks = {}, sections = [];
    document.querySelectorAll(".rail [data-rail]").forEach(function (a) {
      railLinks[a.getAttribute("data-rail")] = a;
      var s = document.getElementById(a.getAttribute("data-rail")); if (s) sections.push(s);
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            for (var k in railLinks) railLinks[k].classList.remove("active");
            var a = railLinks[e.target.id]; if (a) a.classList.add("active");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) { io.observe(s); });
    }
    var toggle = $("#navToggle"), menu = $("#mobileMenu");
    function setMenu(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = !open; document.body.style.overflow = open ? "hidden" : "";
    }
    toggle.addEventListener("click", function () { setMenu(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) setMenu(false); });
  }

  /* ---------- contact dark→light flip ---------- */
  function initFlip() {
    var c = $("#contact"); if (!c) return;
    if (reduce || !("IntersectionObserver" in window)) { c.classList.add("lit"); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { c.classList.add("lit"); io.disconnect(); } });
    }, { rootMargin: "0px 0px -25% 0px" });
    io.observe(c);
  }

  /* ---------- 02 work ---------- */
  function initWork() {
    var list = $("#workList"), filters = $("#workFilters"); if (!list) return;
    var tags = []; D.work.forEach(function (p) { p.tags.forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); }); });

    list.innerHTML = D.work.map(function (p, i) {
      var gal = p.images.map(function (im) { return '<figure><img src="' + esc(im.src) + '" alt="' + esc(im.alt) + '" loading="lazy" /></figure>'; }).join("");
      return '<article class="wrow" data-rise style="transition-delay:' + (i * 60) + 'ms" data-tags="' + esc(p.tags.join("|")) + '">' +
        '<div class="wrow-head"><h3>' + esc(p.name) + '</h3><div class="wrow-tags">' +
        p.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div></div>" +
        '<p class="wrow-blurb">' + esc(p.blurb) + "</p>" +
        '<div class="wrow-gallery">' + gal + "</div></article>";
    }).join("");

    filters.innerHTML = ["All"].concat(tags).map(function (t, i) {
      return '<button class="chip" type="button" aria-pressed="' + (i === 0) + '" data-filter="' + esc(t) + '">' + esc(t) + "</button>";
    }).join("");
    filters.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      filters.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      var f = b.getAttribute("data-filter");
      list.querySelectorAll(".wrow").forEach(function (card) {
        card.style.display = (f === "All" || card.getAttribute("data-tags").split("|").indexOf(f) >= 0) ? "" : "none";
      });
    });

    var lb = $("#lightbox"), lbImg = lb.querySelector("img");
    list.addEventListener("click", function (e) {
      var img = e.target.closest(".wrow-gallery img"); if (!img) return;
      lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false; lb.querySelector(".lightbox-close").focus();
    });
    function close() { lb.hidden = true; lbImg.src = ""; }
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest(".lightbox-close")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) close(); });
  }

  /* ---------- 03 web builds ---------- */
  function fallback(b) {
    return '<div class="stage-fallback"><span class="m">' + esc(b.client) + '</span>' +
      '<span class="u">' + esc(b.url) + '</span>' +
      '<span class="note">Live preview — open ' + esc(b.url) + '</span></div>';
  }
  function stage(b) {
    return '<div class="chrome"><span class="dot"></span><span class="dot"></span><span class="dot"></span>' +
      '<span class="bar">' + esc(b.url) + '</span></div>' +
      '<div class="stage" data-stage>' + fallback(b) + '<img alt="Screenshot of ' + esc(b.client) + ' website" loading="lazy" /></div>';
  }

  function initBuilds() {
    var ledger = $("#ledger"), proof = $("#proof"), filters = $("#buildFilters"); if (!ledger) return;

    proof.innerHTML = D.proof.map(function (p) {
      return '<div class="proof-cell" data-rise><div class="proof-fig">' + esc(p.fig) + '</div><div class="proof-label mono">' + esc(p.label) + "</div></div>";
    }).join("");

    var types = []; D.builds.forEach(function (b) { if (types.indexOf(b.type) < 0) types.push(b.type); });
    filters.innerHTML = ["All"].concat(types).map(function (t, i) {
      return '<button class="chip" type="button" aria-pressed="' + (i === 0) + '" data-filter="' + esc(t) + '">' + esc(t) + "</button>";
    }).join("");

    var rows = D.builds.map(function (b, i) {
      var n = ("0" + (i + 1)).slice(-2);
      return '<div class="lrow" data-type style="transition-delay:' + (i * 90) + 'ms" data-t="' + esc(b.type) + '" data-i="' + i + '">' +
        '<button class="lrow-head" type="button" aria-expanded="false" aria-controls="b-' + i + '">' +
          '<span class="lrow-n">' + n + '</span>' +
          '<span><span class="lrow-client">' + esc(b.client) + '</span>' +
            '<span class="lrow-meta"><span class="lrow-type">' + esc(b.type) + '</span><span class="lrow-url">' + esc(b.url) + '</span></span></span>' +
          '<span class="lrow-right">' + esc(b.year) + '<span class="lrow-arrow" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg></span></span>' +
        '</button>' +
        '<div class="lrow-body" id="b-' + i + '"><div class="lrow-body-inner">' +
          '<div class="viewport lrow-shot-mobile">' + stage(b) + '</div>' +
          '<div class="case">' +
            '<div><h4>Problem</h4><p>' + esc(b.problem) + '</p></div>' +
            '<div><h4>Approach</h4><p>' + esc(b.approach) + '</p></div>' +
            '<div><h4>Stack</h4><p>' + esc(b.stack) + '</p></div>' +
            '<div><h4>Outcome</h4><p>' + esc(b.outcome) + '</p></div>' +
            '<a class="btn btn-ghost case-visit" href="' + esc(b.href) + '" target="_blank" rel="noopener">Open ' + esc(b.url) + ' ↗</a>' +
          '</div>' +
        '</div></div></div>';
    }).join("");

    ledger.innerHTML = '<div class="ledger-rows">' + rows + '</div>' +
      '<aside class="preview"><div class="viewport">' + stage(D.builds[0]) + '</div><p class="preview-cap mono">Hover or open a build to preview it</p></aside>';

    function load(st, b, sweep) {
      if (!st) return;
      var img = st.querySelector("img");
      if (sweep && !reduce) { st.classList.remove("sweep"); void st.offsetWidth; st.classList.add("sweep"); }
      img.classList.remove("show");
      img.onload = function () { img.classList.add("show"); };
      img.onerror = function () { img.classList.remove("show"); };
      img.src = b.shot;
    }
    var pStage = ledger.querySelector(".preview [data-stage]"), pBar = ledger.querySelector(".preview .bar");
    load(pStage, D.builds[0], false);
    function preview(b) {
      if (pBar) pBar.textContent = b.url;
      if (pStage) { pStage.querySelector(".stage-fallback").outerHTML = fallback(b); load(pStage, b, true); }
    }

    var rowsEl = ledger.querySelectorAll(".lrow");
    rowsEl.forEach(function (row) {
      var b = D.builds[+row.getAttribute("data-i")];
      var head = row.querySelector(".lrow-head"), body = row.querySelector(".lrow-body");
      var mob = row.querySelector(".lrow-shot-mobile [data-stage]");
      head.addEventListener("mouseenter", function () { preview(b); });
      head.addEventListener("focus", function () { preview(b); });
      head.addEventListener("click", function () {
        var open = row.classList.toggle("open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
          preview(b); load(mob, b, true);
          body.style.height = body.querySelector(".lrow-body-inner").scrollHeight + "px";
          if (reduce) body.style.height = "auto";
          else body.addEventListener("transitionend", function te() { body.style.height = "auto"; body.removeEventListener("transitionend", te); });
        } else { body.style.height = body.scrollHeight + "px"; void body.offsetWidth; body.style.height = "0px"; }
      });
    });

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip"); if (!btn) return;
      filters.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      var f = btn.getAttribute("data-filter");
      rowsEl.forEach(function (row) { row.style.display = (f === "All" || row.getAttribute("data-t") === f) ? "" : "none"; });
    });
  }

  function boot() { initHero(); initNav(); initFlip(); initWork(); initBuilds(); initReveals(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
