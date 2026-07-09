/* Booking + checkout. Two modes:
   - Order mode (default): build a cart of laundry/sneaker services,
     choose drop-off or pickup, pay once-off or book via WhatsApp.
   - Pass mode (?pass=daily|block|concierge): join a Block Pass —
     the payment becomes a Paystack subscription. */

const cart = {}; // key -> { label, price, qty }
let fulfilment = "dropoff";
let pickupWindow = null;
let attachOn = false;
let passMode = false;
let passTier = null;

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  const params = new URLSearchParams(location.search);
  const passParam = params.get("pass");
  passMode = !!passParam;

  if (passMode) {
    setupPassMode(passParam);
  } else {
    buildServiceRows();
    buildPickupControls();
    buildAttach();
    applyPrefill();
  }
  wireActions();
  update();
});

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ---------------- Order mode: service rows ---------------- */
function makeRow(container, key, label, price) {
  const row = document.createElement("div");
  row.className = "svc-row";
  row.innerHTML =
    '<div><div class="svc-name">' + label + "</div>" +
    '<div class="svc-price">' + rands(price) + "</div></div>" +
    '<div class="qty" data-key="' + key + '">' +
    '<button type="button" aria-label="Remove one ' + label + '">−</button>' +
    '<span class="qty-n">0</span>' +
    '<button type="button" aria-label="Add one ' + label + '">+</button></div>';
  container.appendChild(row);

  const btns = row.querySelectorAll("button");
  btns[0].addEventListener("click", function () { bump(key, label, price, -1, row); });
  btns[1].addEventListener("click", function () { bump(key, label, price, +1, row); });
}

function bump(key, label, price, delta, row) {
  const item = cart[key] || { label: label, price: price, qty: 0 };
  item.qty = Math.max(0, Math.min(20, item.qty + delta));
  if (item.qty === 0) delete cart[key];
  else cart[key] = item;
  row.querySelector(".qty-n").textContent = item.qty;
  update();
}

function setQty(key, qty) {
  const el = document.querySelector('.qty[data-key="' + key + '"]');
  if (!el) return;
  const row = el.closest(".svc-row");
  const plus = el.querySelectorAll("button")[1];
  for (let i = 0; i < qty; i++) plus.click();
}

function buildServiceRows() {
  const laundryBox = document.getElementById("rows-laundry");
  BLOCK.laundry.loads.forEach(function (l) {
    makeRow(laundryBox, "laundry:" + l.id, l.label, l.price);
  });
  BLOCK.laundry.extras.forEach(function (x) {
    makeRow(laundryBox, "extra:" + x.id, x.label, x.price);
  });

  const snBox = document.getElementById("rows-sneakers");
  BLOCK.sneakers.materials.forEach(function (m) {
    makeRow(snBox, "sn:cleanse:" + m.id, "Deep cleanse · " + m.label, m.cleanse);
  });
  makeRow(snBox, "sn:refurb:std", "Refurbishment · sneakers", BLOCK.sneakers.materials[0].refurb);
  makeRow(snBox, "sn:refurb:suede", "Refurbishment · suede & nubuck",
    BLOCK.sneakers.materials.find(function (m) { return m.id === "suede"; }).refurb);

  const adBox = document.getElementById("rows-addons");
  BLOCK.sneakers.addons.forEach(function (a) {
    makeRow(adBox, "addon:" + a.id, a.label, a.price);
  });
}

/* Carry over the quote a visitor just built on the home page.
   quote.js sets prefill-intent when a "Book this" button is used. */
function applyPrefill() {
  try {
    const ln = JSON.parse(sessionStorage.getItem("prefill-laundry") || "null");
    const sn = JSON.parse(sessionStorage.getItem("prefill-sneaker") || "null");
    const intent = sessionStorage.getItem("prefill-intent");
    if (intent === "laundry" && ln) {
      setQty("laundry:" + ln.load, 1);
      ln.extras.forEach(function (x) { setQty("extra:" + x, 1); });
    }
    if (intent === "sneaker" && sn) {
      const key = sn.service === "refurb"
        ? "sn:refurb:" + (sn.material === "suede" ? "suede" : "std")
        : "sn:cleanse:" + sn.material;
      setQty(key, 1);
      sn.addons.forEach(function (a) { setQty("addon:" + a, 1); });
    }
    sessionStorage.removeItem("prefill-intent");
  } catch (e) { /* a broken prefill should never block booking */ }
}

/* ---------------- Order mode: pickup ---------------- */
function buildPickupControls() {
  document.getElementById("pickup-hint").textContent =
    "Pickup & delivery adds " + rands(BLOCK.delivery.fee) +
    " — free both ways on orders over " + rands(BLOCK.delivery.freeOver) + ".";

  const chips = document.getElementById("fulfil-chips");
  chips.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      fulfilment = chip.dataset.id;
      chips.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      document.getElementById("pickup-fields").hidden = fulfilment !== "pickup";
      update();
    });
  });

  const suburb = document.getElementById("suburb");
  BLOCK.delivery.suburbs.forEach(function (s) {
    const opt = document.createElement("option");
    opt.value = opt.textContent = s;
    suburb.appendChild(opt);
  });

  const daySel = document.getElementById("pickup-day");
  const fmt = new Intl.DateTimeFormat("en-ZA", { weekday: "short", day: "numeric", month: "short" });
  for (let i = 0; i < BLOCK.delivery.daysAhead; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const opt = document.createElement("option");
    const nice = fmt.format(d);
    opt.value = nice;
    opt.textContent = i === 0 ? "Today · " + nice : i === 1 ? "Tomorrow · " + nice : nice;
    daySel.appendChild(opt);
  }

  const winBox = document.getElementById("window-chips");
  BLOCK.delivery.windows.forEach(function (w) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = w;
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", function () {
      pickupWindow = w;
      winBox.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      update();
    });
    winBox.appendChild(chip);
  });
}

/* ---------------- Order mode: the attach ---------------- */
function buildAttach() {
  const a = BLOCK.coffee.attach;
  const txt = document.getElementById("attach-text");
  txt.querySelector("strong").textContent =
    "Add a " + a.label + " for " + rands(a.price) + "?";
  txt.querySelector("span").textContent =
    "Ready when you drop off — or riding along with your delivery.";
  const chip = document.getElementById("attach-chip");
  chip.addEventListener("click", function () {
    attachOn = !attachOn;
    chip.setAttribute("aria-pressed", String(attachOn));
    chip.textContent = attachOn ? "Added ✓" : "Add it";
    update();
  });
}

/* ---------------- Pass mode ---------------- */
function setupPassMode(passParam) {
  document.getElementById("services-step").hidden = true;
  document.getElementById("pickup-step").hidden = true;
  document.getElementById("attach-step").hidden = true;
  document.getElementById("pass-step").hidden = false;
  document.querySelector("#details-step .n").textContent = "2";
  document.getElementById("book-eyebrow").textContent = "Join the Block Pass";
  document.getElementById("book-title").textContent = "One membership, all three doors";
  document.getElementById("book-sub").textContent =
    "Pick your tier, tell us who you are, and your pass starts today.";
  document.getElementById("pay-btn").textContent = "Start my Block Pass";

  const box = document.getElementById("pass-tier-chips");
  BLOCK.pass.tiers.forEach(function (tier) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.innerHTML = tier.name + " <small>" + rands(tier.price) + "/mo</small>";
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", function () { selectTier(tier.id); });
    chip.dataset.id = tier.id;
    box.appendChild(chip);
  });
  selectTier(
    BLOCK.pass.tiers.some(function (t) { return t.id === passParam; })
      ? passParam
      : "block"
  );
}

function selectTier(id) {
  passTier = BLOCK.pass.tiers.find(function (t) { return t.id === id; });
  document.querySelectorAll("#pass-tier-chips .chip").forEach(function (c) {
    c.setAttribute("aria-pressed", String(c.dataset.id === id));
  });
  document.getElementById("pass-perks").innerHTML =
    "<ul style='margin:0;padding-left:20px;color:var(--ink-soft)'>" +
    passTier.perks.map(function (p) { return "<li>" + p + "</li>"; }).join("") +
    "</ul>";
  update();
}

/* ---------------- Totals + summary slip ---------------- */
function totals() {
  if (passMode) {
    return { lines: [{ label: "Block Pass · " + passTier.name, amt: passTier.price, suffix: "/mo" }], total: passTier.price };
  }
  const lines = [];
  let subtotal = 0;
  Object.keys(cart).forEach(function (key) {
    const it = cart[key];
    lines.push({ label: it.qty > 1 ? it.label + " × " + it.qty : it.label, amt: it.price * it.qty });
    subtotal += it.price * it.qty;
  });
  if (attachOn) {
    const a = BLOCK.coffee.attach;
    lines.push({ label: "Flat white (the good stuff)", amt: a.price });
    subtotal += a.price;
  }
  let total = subtotal;
  if (fulfilment === "pickup" && lines.length) {
    const free = subtotal >= BLOCK.delivery.freeOver;
    lines.push({ label: "Pickup & delivery" + (free ? " (free)" : ""), amt: free ? 0 : BLOCK.delivery.fee });
    if (!free) total += BLOCK.delivery.fee;
  }
  return { lines: lines, total: total, subtotal: subtotal };
}

function update() {
  const t = totals();
  const box = document.getElementById("summary-lines");
  if (!t.lines.length) {
    box.innerHTML =
      '<div class="slip-row" style="justify-content:center;padding:18px 0">' +
      "Your slip is empty — add something above.</div>";
  } else {
    box.innerHTML =
      t.lines.map(function (l) {
        return '<div class="slip-row"><span>' + l.label + '</span><span class="amt">' +
          rands(l.amt) + (l.suffix || "") + "</span></div>";
      }).join("") +
      '<div class="slip-row total"><span>Total</span><span class="amt">' +
      rands(t.total) + (passMode ? "/mo" : "") + "</span></div>";
  }

  // Membership nudge: show real savings on this exact order
  const nudge = document.getElementById("member-nudge");
  if (!passMode && t.subtotal > 0) {
    const saving = Math.round(t.subtotal * BLOCK.memberDiscount);
    nudge.hidden = saving < 5;
    nudge.innerHTML =
      "A Block Pass member would save <strong>" + rands(saving) +
      "</strong> on this slip. <a href='book.html?pass=daily'>See tiers</a>";
  } else {
    nudge.hidden = true;
  }

  document.getElementById("wa-btn").href = waLink(buildWaMessage(t));
}

/* ---------------- Checkout ---------------- */
function buildWaMessage(t) {
  const name = document.getElementById("cust-name").value.trim();
  let msg = passMode
    ? "Hi! I'd like to join the Block Pass — " + passTier.name + " tier (" + rands(passTier.price) + "/month)."
    : "Hi! I'd like to book:\n" +
      t.lines.map(function (l) { return "• " + l.label + " — " + rands(l.amt); }).join("\n") +
      "\nTotal: " + rands(t.total);
  if (!passMode && fulfilment === "pickup") {
    msg += "\nPickup: " + document.getElementById("suburb").value +
      ", " + document.getElementById("pickup-day").value +
      (pickupWindow ? ", " + pickupWindow : "");
  }
  if (name) msg += "\n– " + name;
  return msg;
}

function validate(forCard) {
  const t = totals();
  if (!passMode && !t.lines.length) return "Add at least one service to your slip first.";
  if (!passMode && fulfilment === "pickup" && !pickupWindow) return "Pick a two-hour window for your pickup.";
  if (!document.getElementById("cust-name").value.trim()) return "Add your name so we know whose order this is.";
  if (!document.getElementById("cust-phone").value.trim()) return "Add your WhatsApp number so we can confirm.";
  if (forCard && !/.+@.+\..+/.test(document.getElementById("cust-email").value)) {
    return "Add your email — Paystack sends your receipt there.";
  }
  return null;
}

function wireActions() {
  document.getElementById("pay-btn").addEventListener("click", function () {
    const problem = validate(true);
    if (problem) { showToast(problem); return; }
    const t = totals();
    checkout({
      amountRands: t.total,
      email: document.getElementById("cust-email").value.trim(),
      planCode: passMode ? BLOCK.payments.plans[passTier.id] : undefined,
      metadata: {
        custom_fields: [
          { display_name: "Name", variable_name: "name", value: document.getElementById("cust-name").value.trim() },
          { display_name: "WhatsApp", variable_name: "whatsapp", value: document.getElementById("cust-phone").value.trim() },
          { display_name: "Order", variable_name: "order", value: buildWaMessage(t).replace(/\n/g, " | ") },
        ],
      },
      waMessage: buildWaMessage(t),
    });
  });

  document.getElementById("wa-btn").addEventListener("click", function (e) {
    const problem = validate(false);
    if (problem) { e.preventDefault(); showToast(problem); return; }
    this.href = waLink(buildWaMessage(totals()));
  });
}
