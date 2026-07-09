/* Checkout wrapper around Paystack Inline v2.
   Card details go straight to Paystack — this site never sees them.
   Until a live public key is set in js/config.js, every checkout
   falls back to a prefilled WhatsApp booking so no lead is lost. */

function paystackReady() {
  return (
    typeof PaystackPop !== "undefined" &&
    BLOCK.payments.paystackPublicKey &&
    !BLOCK.payments.paystackPublicKey.includes("REPLACE_ME")
  );
}

function waLink(message) {
  return (
    "https://wa.me/" +
    BLOCK.contact.whatsapp +
    "?text=" +
    encodeURIComponent(message)
  );
}

/* Open checkout for a once-off amount or a subscription plan.
   opts: { amountRands, email, label, planCode?, metadata?, onSuccess?, waMessage } */
function checkout(opts) {
  if (!paystackReady()) {
    window.open(waLink(opts.waMessage), "_blank", "noopener");
    showToast("Payments open soon — we've moved your booking to WhatsApp.");
    return;
  }
  const popup = new PaystackPop();
  const config = {
    key: BLOCK.payments.paystackPublicKey,
    email: opts.email,
    amount: Math.round(opts.amountRands * 100), // Paystack charges in cents
    currency: BLOCK.payments.currency,
    metadata: opts.metadata || {},
    onSuccess: function (txn) {
      if (opts.onSuccess) opts.onSuccess(txn);
      showToast("Paid. Reference " + txn.reference + " — see you on the block!");
    },
    onCancel: function () {
      showToast("Checkout closed — nothing was charged.");
    },
  };
  if (opts.planCode && !opts.planCode.includes("REPLACE")) {
    config.plan = opts.planCode; // recurring Block Pass subscription
  }
  popup.newTransaction(config);
}

function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(function () {
    el.classList.remove("show");
  }, 4200);
}
