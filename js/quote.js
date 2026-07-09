/* Instant quote calculators: price on screen in three taps, no contact form.
   Selections are kept in sessionStorage so book.html starts prefilled. */

/* Build a row of toggle chips. mode: "single" | "multi" */
function chipGroup(containerId, items, mode, onChange) {
  const box = document.getElementById(containerId);
  if (!box) return null;
  const state = { selected: mode === "single" ? items[0].id : new Set() };

  items.forEach(function (item) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.dataset.id = item.id;
    chip.innerHTML =
      item.label +
      (item.price != null ? " <small>+" + rands(item.price) + "</small>" : "");
    chip.setAttribute(
      "aria-pressed",
      mode === "single" ? String(item.id === state.selected) : "false"
    );
    chip.addEventListener("click", function () {
      if (mode === "single") {
        state.selected = item.id;
        box.querySelectorAll(".chip").forEach(function (c) {
          c.setAttribute("aria-pressed", String(c.dataset.id === item.id));
        });
      } else {
        if (state.selected.has(item.id)) state.selected.delete(item.id);
        else state.selected.add(item.id);
        chip.setAttribute("aria-pressed", String(state.selected.has(item.id)));
      }
      onChange();
    });
    box.appendChild(chip);
  });
  return state;
}

function slipRow(label, amount) {
  return (
    '<div class="slip-row"><span>' +
    label +
    '</span><span class="amt">' +
    rands(amount) +
    "</span></div>"
  );
}

function renderSlip(el, rows, total, note) {
  el.innerHTML =
    rows.join("") +
    '<div class="slip-row total"><span>Your price</span><span class="amt">' +
    rands(total) +
    "</span></div>" +
    '<div class="slip-save">Block Pass members pay ' +
    rands(total * (1 - BLOCK.memberDiscount)) +
    " — 10% off, every time.</div>" +
    (note ? '<div class="slip-note">' + note + "</div>" : "");
}

/* ---------------- Laundry quote ---------------- */
function initLaundryQuote() {
  const slip = document.getElementById("laundry-slip");
  if (!slip) return;

  let loadState, extraState;
  function update() {
    const load = BLOCK.laundry.loads.find(function (l) {
      return l.id === loadState.selected;
    });
    const rows = [slipRow(load.label, load.price)];
    let total = load.price;
    BLOCK.laundry.extras.forEach(function (x) {
      if (extraState.selected.has(x.id)) {
        rows.push(slipRow(x.label, x.price));
        total += x.price;
      }
    });
    renderSlip(slip, rows, total, BLOCK.laundry.turnaround);
    sessionStorage.setItem(
      "prefill-laundry",
      JSON.stringify({ load: load.id, extras: Array.from(extraState.selected) })
    );
  }

  const bookBtn = document.getElementById("laundry-book-btn");
  if (bookBtn)
    bookBtn.addEventListener("click", function () {
      sessionStorage.setItem("prefill-intent", "laundry");
    });

  loadState = chipGroup("laundry-loads", BLOCK.laundry.loads, "single", update);
  extraState = chipGroup("laundry-extras", BLOCK.laundry.extras, "multi", update);
  update();
}

/* ---------------- Sneaker quote ---------------- */
function initSneakerQuote() {
  const slip = document.getElementById("sneaker-slip");
  if (!slip) return;

  let matState, svcState, addState;
  function update() {
    const mat = BLOCK.sneakers.materials.find(function (m) {
      return m.id === matState.selected;
    });
    const svc = BLOCK.sneakers.services.find(function (s) {
      return s.id === svcState.selected;
    });
    const base = svc.id === "refurb" ? mat.refurb : mat.cleanse;
    const rows = [slipRow(svc.label + " · " + mat.label, base)];
    let total = base;
    BLOCK.sneakers.addons.forEach(function (a) {
      if (addState.selected.has(a.id)) {
        rows.push(slipRow(a.label, a.price));
        total += a.price;
      }
    });
    renderSlip(slip, rows, total, "Per pair · " + BLOCK.sneakers.turnaround);
    sessionStorage.setItem(
      "prefill-sneaker",
      JSON.stringify({
        material: mat.id,
        service: svc.id,
        addons: Array.from(addState.selected),
      })
    );
  }

  const bookBtn = document.getElementById("sneaker-book-btn");
  if (bookBtn)
    bookBtn.addEventListener("click", function () {
      sessionStorage.setItem("prefill-intent", "sneaker");
    });

  matState = chipGroup("sn-materials", BLOCK.sneakers.materials, "single", update);
  svcState = chipGroup(
    "sn-services",
    BLOCK.sneakers.services.map(function (s) {
      return { id: s.id, label: s.label };
    }),
    "single",
    update
  );
  addState = chipGroup("sn-addons", BLOCK.sneakers.addons, "multi", update);
  update();
}
