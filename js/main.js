/* =========================================================================
   21 Ridges Bistro & Bar — site behaviour
   -------------------------------------------------------------------------
   ▶▶  EDIT THIS ONE BLOCK to go live. These values populate every phone,
       WhatsApp, email link and the reservation form across the whole site.
   ========================================================================= */
const CONFIG = {
  // Displayed phone number (what visitors see)
  phoneDisplay: "033 000 0000",
  // Dial string for tel: links — international format, no spaces (e.g. +27331234567)
  phoneDial: "+2733XXXXXXX",

  // WhatsApp number in international format WITHOUT the + or spaces (e.g. 27821234567)
  whatsappNumber: "27XXXXXXXXX",
  // Pre-filled WhatsApp message
  whatsappText: "Hi 21 Ridges, I'd like to book a table.",

  // Reservation email
  email: "hello@21ridges.co.za",

  // Web3Forms access key — get a free one at https://web3forms.com (30 seconds).
  // Submissions are emailed to the address you registered with Web3Forms.
  web3formsKey: "YOUR-WEB3FORMS-ACCESS-KEY",
};

/* ========================================================================= */

(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

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

  /* ---- Year ---- */
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Hero load sequence ---- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ready = () => requestAnimationFrame(() => document.body.classList.add("is-ready"));
  if (document.readyState === "complete") ready();
  else window.addEventListener("load", ready);
  // Fallback so hero content never gets stuck hidden if load stalls
  setTimeout(() => document.body.classList.add("is-ready"), 1200);

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

  /* ---- Reservation form submit (Web3Forms) ---- */
  const form = $("#reservationForm");
  const status = $("#rf-status");
  const submitBtn = $("#rf-submit");

  const showStatus = (msg, ok) => {
    status.textContent = msg;
    status.className = "form__status " + (ok ? "is-ok" : "is-err");
  };

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) { form.reportValidity(); return; }

      // If no real key configured yet, fall back to WhatsApp so no lead is lost.
      if (!CONFIG.web3formsKey || CONFIG.web3formsKey.includes("YOUR-WEB3FORMS")) {
        const d = new FormData(form);
        const msg =
          `Hi 21 Ridges, I'd like to book a table.%0A` +
          `Name: ${d.get("Name")}%0APhone: ${d.get("Phone")}%0A` +
          `Date: ${d.get("Date")} at ${d.get("Time")}%0AGuests: ${d.get("Guests")}` +
          (d.get("Notes") ? `%0ANotes: ${d.get("Notes")}` : "");
        showStatus("Opening WhatsApp to complete your booking…", true);
        window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`, "_blank");
        return;
      }

      submitBtn.disabled = true;
      const original = submitBtn.textContent;
      submitBtn.textContent = "Sending…";
      status.className = "form__status";

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        const data = await res.json();
        if (data.success) {
          showStatus("Thank you! Your reservation request has been sent — we'll confirm shortly.", true);
          form.reset();
          if (dateField) dateField.min = new Date().toISOString().split("T")[0];
        } else {
          throw new Error(data.message || "Submission failed");
        }
      } catch (err) {
        showStatus("Sorry, something went wrong. Please call or WhatsApp us and we'll sort it out.", false);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      }
    });
  }
})();
