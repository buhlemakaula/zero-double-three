/* ============================================================
   Buhle Studio — v3 behaviour
   Vanilla JS. Content is visible by default; motion only enhances.
   Deliberate choice over CDN Lenis/GSAP: zero external dependency,
   nothing gated behind a class transition, keeps the perf floor.
   ============================================================ */
(function () {
  "use strict";
  var D = window.BUHLE_DATA || { work: [], builds: [], proof: [] };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  if (!reduce) root.classList.add("has-motion");

  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };
  var $ = function (s, c) { return (c || document).querySelector(s); };

  /* ---------- reveals ---------- */
  function initReveals() {
    var els = document.querySelectorAll("[data-reveal]");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- hero line reveal ---------- */
  function initHero() {
    var lines = document.querySelectorAll(".hero-line [data-line]");
    if (reduce) { lines.forEach(function (l) { l.classList.add("in"); }); return; }
    lines.forEach(function (l, i) {
      setTimeout(function () { l.classList.add("in"); }, 180 + i * 130);
    });
  }

  /* ---------- nav: scrolled state + active section ---------- */
  function initNav() {
    var nav = $("#nav");
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 24); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (a) { a.classList.remove("active"); });
            var a = map[e.target.id]; if (a) a.classList.add("active");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) { io.observe(s); });
    }

    /* mobile menu */
    var toggle = $("#navToggle"), menu = $("#mobileMenu");
    function setMenu(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = !open;
      document.body.style.overflow = open ? "hidden" : "";
    }
    toggle.addEventListener("click", function () { setMenu(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) setMenu(false); });
  }

  /* ---------- 02 work ---------- */
  function initWork() {
    var list = $("#workList"), filters = $("#workFilters");
    if (!list) return;
    var tags = []; D.work.forEach(function (p) { p.tags.forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); }); });

    list.innerHTML = D.work.map(function (p) {
      var gal = p.images.map(function (im) {
        return '<figure><img src="' + esc(im.src) + '" alt="' + esc(im.alt) + '" loading="lazy" /></figure>';
      }).join("");
      return '<article class="wproj" data-tags="' + esc(p.tags.join("|")) + '">' +
        '<div class="wproj-head"><h3 class="wproj-name">' + esc(p.name) + '</h3>' +
        '<div class="wproj-tags">' + p.tags.map(function (t) { return '<span class="wtag">' + esc(t) + "</span>"; }).join("") + "</div></div>" +
        '<p class="wproj-blurb">' + esc(p.blurb) + "</p>" +
        '<div class="wproj-gallery">' + gal + "</div></article>";
    }).join("");

    filters.innerHTML = ["All"].concat(tags).map(function (t, i) {
      return '<button class="chip" type="button" aria-pressed="' + (i === 0 ? "true" : "false") + '" data-filter="' + esc(t) + '">' + esc(t) + "</button>";
    }).join("");
    filters.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      filters.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      var f = b.getAttribute("data-filter");
      list.querySelectorAll(".wproj").forEach(function (card) {
        var show = f === "All" || card.getAttribute("data-tags").split("|").indexOf(f) >= 0;
        card.style.display = show ? "" : "none";
      });
    });

    /* lightbox */
    var lb = $("#lightbox"), lbImg = lb.querySelector("img");
    list.addEventListener("click", function (e) {
      var img = e.target.closest(".wproj-gallery img"); if (!img) return;
      lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false; lb.querySelector(".lightbox-close").focus();
    });
    function closeLb() { lb.hidden = true; lbImg.src = ""; }
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest(".lightbox-close")) closeLb(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) closeLb(); });
  }

  /* ---------- 03 web builds ledger (signature) ---------- */
  function frameFallback(b) {
    return '<div class="viewport-fallback">' +
      '<span class="vf-mark">' + esc(b.client) + "</span>" +
      '<span class="vf-url">' + esc(b.url) + "</span>" +
      '<span class="vf-note">Live preview — open ' + esc(b.url) + "</span></div>";
  }
  function stageHtml(b) {
    return '<div class="chrome"><span class="dot"></span><span class="dot"></span><span class="dot"></span>' +
      '<span class="bar">' + esc(b.url) + "</span></div>" +
      '<div class="viewport-stage" data-stage>' + frameFallback(b) +
      '<img alt="Screenshot of ' + esc(b.client) + ' website" loading="lazy" /></div>';
  }

  function initBuilds() {
    var ledger = $("#ledger"), proof = $("#proof"), filters = $("#buildFilters");
    if (!ledger) return;

    proof.innerHTML = D.proof.map(function (p) {
      return '<div class="proof-cell"><div class="proof-fig">' + esc(p.fig) + '</div><div class="proof-label mono">' + esc(p.label) + "</div></div>";
    }).join("");

    var types = []; D.builds.forEach(function (b) { if (types.indexOf(b.type) < 0) types.push(b.type); });
    filters.innerHTML = ["All"].concat(types).map(function (t, i) {
      return '<button class="chip" type="button" aria-pressed="' + (i === 0 ? "true" : "false") + '" data-filter="' + esc(t) + '">' + esc(t) + "</button>";
    }).join("");

    var rows = D.builds.map(function (b, i) {
      var idx = ("0" + (i + 1)).slice(-2);
      var flag = b.stackConfirm ? '<span class="stack-flag">stack to confirm</span>' : "";
      return '<div class="lrow" data-type="' + esc(b.type) + '" data-idx="' + i + '">' +
        '<button class="lrow-head" type="button" aria-expanded="false" aria-controls="body-' + i + '">' +
          '<span class="lrow-idx">' + idx + '</span>' +
          '<span class="lrow-main"><span class="lrow-client">' + esc(b.client) + '</span>' +
            '<span class="lrow-meta"><span class="lrow-type">' + esc(b.type) + '</span>' +
            '<span class="lrow-url">' + esc(b.url) + '</span></span></span>' +
          '<span class="lrow-year">' + esc(b.year) + ' <span class="lrow-arrow" aria-hidden="true">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg></span></span>' +
        '</button>' +
        '<div class="lrow-body" id="body-' + i + '"><div class="lrow-body-inner">' +
          '<div class="viewport lrow-shot-mobile">' + stageHtml(b) + '</div>' +
          '<div class="case">' +
            '<div class="case-block"><h4>Problem</h4><p>' + esc(b.problem) + '</p></div>' +
            '<div class="case-block"><h4>Approach</h4><p>' + esc(b.approach) + '</p></div>' +
            '<div class="case-block"><h4>Stack</h4><p>' + esc(b.stack) + '</p>' + flag + '</div>' +
            '<div class="case-block"><h4>Outcome</h4><p>' + esc(b.outcome) + '</p></div>' +
            '<a class="pill pill-outline case-visit" href="' + esc(b.href) + '" target="_blank" rel="noopener">Open ' + esc(b.url) + ' ↗</a>' +
          '</div>' +
        '</div></div>' +
      '</div>';
    }).join("");

    ledger.innerHTML =
      '<div class="ledger-rows">' + rows + '</div>' +
      '<aside class="preview-panel"><div class="viewport">' + stageHtml(D.builds[0]) +
      '</div><p class="preview-cap mono">Hover or open a build to preview it</p></aside>';

    /* load a screenshot into a stage; fall back to branded frame */
    function loadStage(stage, b, sweep) {
      if (!stage) return;
      var img = stage.querySelector("img");
      if (sweep && !reduce) { stage.classList.remove("sweep"); void stage.offsetWidth; stage.classList.add("sweep"); }
      img.classList.remove("show");
      img.onload = function () { img.classList.add("show"); };
      img.onerror = function () { img.classList.remove("show"); };
      img.src = b.shot;
    }

    var panelStage = ledger.querySelector(".preview-panel [data-stage]");
    var panelBar = ledger.querySelector(".preview-panel .bar");
    loadStage(panelStage, D.builds[0], false);

    function preview(b) {
      if (panelBar) panelBar.textContent = b.url;
      if (panelStage) {
        panelStage.querySelector(".viewport-fallback").outerHTML = frameFallback(b);
        loadStage(panelStage, b, true);
      }
    }

    var rowsEl = ledger.querySelectorAll(".lrow");
    rowsEl.forEach(function (row) {
      var i = +row.getAttribute("data-idx");
      var b = D.builds[i];
      var head = row.querySelector(".lrow-head");
      var body = row.querySelector(".lrow-body");
      var mobileStage = row.querySelector(".lrow-shot-mobile [data-stage]");

      head.addEventListener("mouseenter", function () { preview(b); });
      head.addEventListener("focus", function () { preview(b); });

      head.addEventListener("click", function () {
        var open = row.classList.toggle("open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
          preview(b);
          loadStage(mobileStage, b, true);
          body.style.height = body.querySelector(".lrow-body-inner").scrollHeight + "px";
          if (reduce) body.style.height = "auto";
          else body.addEventListener("transitionend", function te() { body.style.height = "auto"; body.removeEventListener("transitionend", te); });
        } else {
          body.style.height = body.scrollHeight + "px"; void body.offsetWidth;
          body.style.height = "0px";
        }
      });
    });

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip"); if (!btn) return;
      filters.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      var f = btn.getAttribute("data-filter");
      rowsEl.forEach(function (row) {
        row.style.display = (f === "All" || row.getAttribute("data-type") === f) ? "" : "none";
      });
    });
  }

  /* ---------- boot ---------- */
  function boot() { initReveals(); initHero(); initNav(); initWork(); initBuilds(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
