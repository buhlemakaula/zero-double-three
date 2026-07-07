/* =========================================================================
   21 Ridges Bistro & Bar — site behaviour
   -------------------------------------------------------------------------
   ▶▶  EDIT THIS ONE BLOCK to go live. These values populate every phone,
       WhatsApp, email link and the reservation form across the whole site.
   ========================================================================= */
const CONFIG = {
  // Displayed phone number (what visitors see)
  phoneDisplay: "078 377 5875",
  // Dial string for tel: links — international format, no spaces
  phoneDial: "+27783775875",

  // Dedicated bookings WhatsApp — international format WITHOUT the + or spaces.
  // Every online booking is routed here to confirm reservations.
  whatsappNumber: "27783775875",
  // Pre-filled WhatsApp message (used by the quick "WhatsApp us" buttons)
  whatsappText: "Hi 21 Ridges, I'd like to book a table.",

  // Optional: also email a copy of each booking. Leave the placeholder to skip.
  // Get a free key at https://web3forms.com (30 sec) — bookings still go to WhatsApp regardless.
  email: "hello@21ridges.co.za",
  web3formsKey: "YOUR-WEB3FORMS-ACCESS-KEY",

  // Google Analytics 4 Measurement ID (e.g. G-XXXXXXXXXX). Leave placeholder to disable.
  // Create free at https://analytics.google.com → Admin → Data Streams → Web.
  gaMeasurementId: "G-XXXXXXXXXX",
};

/* ========================================================================= */

(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---- Analytics (Google Analytics 4) ---- */
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  const gaOn = CONFIG.gaMeasurementId && !CONFIG.gaMeasurementId.includes("XXXX");
  if (gaOn) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.gaMeasurementId;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", CONFIG.gaMeasurementId);
  }
  // Track a conversion/interaction (no-op until a GA ID is set)
  const track = (name, params) => { try { gtag("event", name, params || {}); } catch (e) {} };

  /* ---- Populate contact links from CONFIG ---- */
  const waHref = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappText)}`;
  const telHref = `tel:${CONFIG.phoneDial}`;
  const mailHref = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Table reservation — 21 Ridges")}`;

  $$('[data-contact="whatsapp-link"]').forEach((el) => { el.href = waHref; });
  $$('[data-contact="phone-link"]').forEach((el) => {
    el.href = telHref;
    if (el.dataset.keepText === undefined && /^\s*(0\d|033)/.test(el.textContent)) el.textContent = CONFIG.phoneDisplay;
  });
  $$('[data-contact="email-link"]').forEach((el) => {
    el.href = mailHref;
    if (/@/.test(el.textContent)) el.textContent = CONFIG.email;
  });
  const keyField = $("#web3formsKey");
  if (keyField) keyField.value = CONFIG.web3formsKey;

  /* ---- Track lead-generating clicks (WhatsApp / call) ---- */
  $$('[data-contact="whatsapp-link"]').forEach((el) =>
    el.addEventListener("click", () => track("contact_whatsapp", { method: "whatsapp" })));
  $$('[data-contact="phone-link"]').forEach((el) =>
    el.addEventListener("click", () => track("contact_call", { method: "phone" })));

  /* ---- Year ---- */
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Hero load sequence ---- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ready = () => requestAnimationFrame(() => document.body.classList.add("is-ready"));
  if (document.readyState === "complete") ready();
  else window.addEventListener("load", ready);
  // Fallback so hero content never gets stuck hidden if load stalls
  setTimeout(() => document.body.classList.add("is-ready"), 1200);

  /* ---- Hero slideshow (crossfade + Ken Burns) ---- */
  const slides = $$(".hero__slide");
  const dotsWrap = $("#heroDots");
  if (slides.length > 1) {
    let current = 0;
    // build dots
    slides.forEach((_, i) => {
      const d = document.createElement("button");
      d.className = "hero__dot" + (i === 0 ? " is-active" : "");
      d.setAttribute("aria-label", `Show slide ${i + 1}`);
      d.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(d);
    });
    const dots = $$(".hero__dot", dotsWrap);
    let timer;
    const go = (n, manual) => {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = (n + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
      if (manual) restart();
    };
    const advance = () => go(current + 1);
    const restart = () => { clearInterval(timer); timer = setInterval(advance, 6000); };
    restart();
    // pause when tab hidden to save cycles
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearInterval(timer); else restart();
    });
  }

  /* ---- Hero parallax (subtle, cinematic) ---- */
  const heroInner = $(".hero__inner");
  if (heroInner && !reduceMotion) {
    let ticking = false;
    const parallax = () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroInner.style.transform = `translateY(${y * 0.22}px)`;
        heroInner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.75)));
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
  }

  /* ---- Sticky header shadow ---- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const backdrop = $("#navBackdrop");
  const setNav = (open) => {
    nav.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
  backdrop.addEventListener("click", () => setNav(false));
  $$(".nav__link, .nav__cta a", nav).forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });

  /* ---- Menu tabs ---- */
  const tabs = $$(".menu__tab");
  const panels = $$(".menu__panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.panel;
      tabs.forEach((t) => { const on = t === tab; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", String(on)); });
      panels.forEach((p) => {
        const on = p.id === `panel-${target}`;
        p.classList.toggle("is-active", on);
        p.hidden = !on;
      });
    });
  });

  /* ---- Scrollspy (active nav link) ---- */
  const sections = $$("main section[id]");
  const linkFor = (id) => $(`.nav__link[href="#${id}"]`);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          $$(".nav__link").forEach((l) => l.classList.remove("is-active"));
          const link = linkFor(en.target.id);
          if (link) link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---- Scroll reveal ---- */
  const reveals = $$("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Reservation: min date = today ---- */
  const dateField = $("#rf-date");
  if (dateField) dateField.min = new Date().toISOString().split("T")[0];

  /* ---- Reservation form → routed to the venue's WhatsApp ---- */
  const form = $("#reservationForm");
  const status = $("#rf-status");
  const submitBtn = $("#rf-submit");

  const showStatus = (msg, ok) => {
    status.textContent = msg;
    status.className = "form__status " + (ok ? "is-ok" : "is-err");
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const d = new FormData(form);
      const val = (k) => (d.get(k) || "").toString().trim();

      // Build the reservation message that lands in the venue's WhatsApp
      const lines = [
        "New table reservation — 21 Ridges",
        "",
        `Name: ${val("Name")}`,
        `Phone: ${val("Phone")}`,
        val("Email") ? `Email: ${val("Email")}` : "",
        `Date: ${val("Date")}`,
        `Time: ${val("Time")}`,
        `Guests: ${val("Guests")}`,
        val("Notes") ? `Notes: ${val("Notes")}` : "",
      ].filter(Boolean);
      const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;

      // Analytics: record the booking as a conversion (lead)
      track("generate_lead", {
        currency: "ZAR",
        value: 1,
        method: "whatsapp_reservation",
        guests: val("Guests"),
        date: val("Date"),
      });
      track("reservation_request", { channel: "whatsapp" });

      // Optional automatic email copy (only if a Web3Forms key is configured)
      if (CONFIG.web3formsKey && !CONFIG.web3formsKey.includes("YOUR-WEB3FORMS")) {
        try {
          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(Object.fromEntries(d)),
          });
        } catch (err) { /* email copy is best-effort; WhatsApp is the primary channel */ }
      }

      showStatus("Opening WhatsApp to send your booking to 21 Ridges — tap Send to confirm. We'll reply shortly.", true);
      // Open WhatsApp with the booking pre-filled; fall back to same-tab navigation
      // if a popup is blocked (e.g. in-app browsers), so the booking is never lost.
      const win = window.open(waUrl, "_blank");
      if (!win || win.closed || typeof win.closed === "undefined") { window.location.href = waUrl; }
      form.reset();
      if (dateField) dateField.min = new Date().toISOString().split("T")[0];
    });
  }
})();
