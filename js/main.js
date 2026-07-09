/* Main page behaviour: nav, scroll reveals, and everything rendered
   from js/config.js so prices only ever live in one place. */

document.addEventListener("DOMContentLoaded", function () {
  initPhotos();
  initNav();
  initReveals();
  renderTiers();
  renderMenuStrip();
  renderSuburbs();
  fillContactDetails();
  initLaundryQuote();
  initSneakerQuote();
  initBeforeAfter();
});

/* Photos: resolve data-photo to an absolute URL and feed the CSS layer.
   (A relative url() inside a custom property resolves against the
   stylesheet in some browsers, so we resolve it here instead.) */
function initPhotos() {
  document.querySelectorAll("[data-photo]").forEach(function (el) {
    const abs = new URL(el.dataset.photo, document.baseURI).href;
    el.style.setProperty("--photo", 'url("' + abs + '")');
  });
}

/* ---------------- Nav ---------------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") nav.classList.remove("open");
  });
}

/* ---------------- Scroll reveals ---------------- */
function initReveals() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach(function (el) { io.observe(el); });
}

/* ---------------- Block Pass tiers ---------------- */
function renderTiers() {
  const box = document.getElementById("tiers");
  if (!box) return;

  // What the Block tier's perks cost bought one by one (shown on its flag)
  const coffee = BLOCK.coffee.menu.find(function (m) { return m.id === "flatwhite"; }).price;
  const load = BLOCK.laundry.loads[0].price;
  const cleanse = BLOCK.sneakers.materials.find(function (m) { return m.id === "leather"; }).cleanse;
  const blockWorth = 12 * coffee + 4 * load + cleanse;

  BLOCK.pass.tiers.forEach(function (tier) {
    const card = document.createElement("div");
    card.className = "tier" + (tier.featured ? " featured" : "");
    card.innerHTML =
      (tier.featured
        ? '<span class="flag">Worth ' + rands(blockWorth) + " apart</span>"
        : "") +
      "<h3>" + tier.name + "</h3>" +
      '<p class="tier-blurb">' + tier.blurb + "</p>" +
      '<div class="price">' + rands(tier.price) + "<small> / month</small></div>" +
      "<ul>" +
      tier.perks.map(function (p) { return "<li>" + p + "</li>"; }).join("") +
      "</ul>" +
      '<a class="btn ' + (tier.featured ? "btn-primary" : "btn-dark") + ' btn-block" ' +
      'href="book.html?pass=' + tier.id + '">Join ' + tier.name + "</a>";
    box.appendChild(card);
  });
}

/* ---------------- Config-driven bits ---------------- */
function renderMenuStrip() {
  const box = document.getElementById("menu-strip");
  if (!box) return;
  BLOCK.coffee.menu.forEach(function (item) {
    const el = document.createElement("span");
    el.className = "menu-item";
    el.innerHTML = item.label + ' <span class="amt">' + rands(item.price) + "</span>";
    box.appendChild(el);
  });
  const note = document.getElementById("alterations-note");
  if (note) note.textContent = BLOCK.laundry.alterationsNote;
}

function renderSuburbs() {
  const box = document.getElementById("suburb-cloud");
  if (!box) return;
  BLOCK.delivery.suburbs.forEach(function (s) {
    const el = document.createElement("span");
    el.textContent = s;
    box.appendChild(el);
  });
  const freeNote = document.getElementById("free-over-note");
  if (freeNote)
    freeNote.textContent =
      "free both ways on orders over " + rands(BLOCK.delivery.freeOver);
}

function fillContactDetails() {
  const c = BLOCK.contact;
  const set = function (id, text, href) {
    const el = document.getElementById(id);
    if (!el) return;
    if (text) el.textContent = text;
    if (href) el.href = href;
  };
  set("footer-hours", c.hours);
  set("footer-phone", c.phoneDisplay, "tel:" + c.phoneDisplay.replace(/\s/g, ""));
  set("footer-email", c.email, "mailto:" + c.email);
  set("topbar-hours", c.hours);
  set("topbar-phone", c.phoneDisplay, "tel:" + c.phoneDisplay.replace(/\s/g, ""));
  set("topbar-email", c.email, "mailto:" + c.email);
  set("ig-linen", null, c.instagramLinen);
  set("ig-takkie", null, c.instagramTakkie);
  set(
    "wa-pickup",
    null,
    "https://wa.me/" + c.whatsapp + "?text=" +
      encodeURIComponent("Hi! I'd like to book a laundry/sneaker pickup. My suburb is: ")
  );
  const waFloat = document.getElementById("wa-float");
  if (waFloat)
    waFloat.href =
      "https://wa.me/" + c.whatsapp + "?text=" +
      encodeURIComponent("Hi! I found you through the Block Pass site.");
  const turnaround = document.getElementById("turnaround-note");
  if (turnaround) turnaround.textContent = BLOCK.sneakers.turnaround + " · " + c.hours;
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------------- Before / after slider ---------------- */
function initBeforeAfter() {
  const slider = document.getElementById("ba-slider");
  if (!slider) return;
  const range = slider.querySelector(".ba-range");
  function setPos(pct) {
    slider.style.setProperty("--ba", pct + "%");
  }
  range.addEventListener("input", function () {
    setPos(range.value);
  });
  // Direct pointer dragging (the invisible range covers the slider,
  // so pointer events already map to it; this smooths touch drags)
  slider.addEventListener("pointermove", function (e) {
    if (e.buttons !== 1) return;
    const rect = slider.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    range.value = pct;
    setPos(pct);
  });
  setPos(50);
}
