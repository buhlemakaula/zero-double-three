/* ============================================================
   THE BLOCK PASS — single place to edit prices, contacts & keys
   Everything the site displays or charges comes from this file.
   Prices marked [verified] come from takkiewashsa.co.za research;
   everything else is an editable default — change freely.
   ============================================================ */

const BLOCK = {
  brand: {
    name: "The Block Pass",
    street: "Musgrave, Berea, Durban",
    tagline: "One block. Three doors. Every chore handled.",
  },

  contact: {
    // WhatsApp number in international format, digits only (used for wa.me links)
    whatsapp: "27681785025",
    phoneDisplay: "+27 68 178 5025",
    phoneAlt: "+27 31 023 0421",
    email: "washme@takkiewashsa.co.za",
    emailLinen: "hello@linenandmocha.co.za",
    instagramLinen: "https://www.instagram.com/_linenandmocha/",
    instagramTakkie: "https://www.instagram.com/takkiewashsa_dbn/",
    hours: "Open 7 days · 08:00 – 18:00",
  },

  payments: {
    // Replace with your LIVE public key from dashboard.paystack.com → Settings → API Keys.
    // While this placeholder is unchanged, checkout falls back to WhatsApp booking.
    paystackPublicKey: "pk_test_REPLACE_ME",
    currency: "ZAR",
    // Create three subscription Plans in Paystack (Payments → Plans),
    // then paste each plan code (looks like PLN_xxxxxxxx) here.
    plans: {
      daily: "PLN_REPLACE_DAILY",
      block: "PLN_REPLACE_BLOCK",
      concierge: "PLN_REPLACE_CONCIERGE",
    },
  },

  pass: {
    tiers: [
      {
        id: "daily",
        name: "Daily",
        price: 249,
        blurb: "For the regulars at the counter.",
        perks: [
          "5 coffees every month",
          "10% off all laundry",
          "10% off all sneaker care",
          "Member-only drops & tastings",
        ],
        featured: false,
      },
      {
        id: "block",
        name: "Block",
        price: 699,
        blurb: "The whole block, on one card.",
        perks: [
          "12 coffees every month",
          "1 wash, dry & fold load every week",
          "1 sneaker deep cleanse every month",
          "10% off everything else",
        ],
        featured: true,
      },
      {
        id: "concierge",
        name: "Concierge",
        price: 1499,
        blurb: "You never carry a bag again.",
        perks: [
          "Unlimited coffee, every visit",
          "Weekly pickup & delivery, scheduled",
          "3 sneaker cleans every month",
          "Priority turnaround on everything",
        ],
        featured: false,
      },
    ],
  },

  /* -------- Takkie Wash SA -------- */
  sneakers: {
    turnaround: "48–72 hours · SMS when ready",
    materials: [
      { id: "canvas", label: "Canvas", cleanse: 110, refurb: 295 }, // [verified range]
      { id: "knit", label: "Knit / mesh", cleanse: 120, refurb: 295 },
      { id: "leather", label: "Leather", cleanse: 140, refurb: 295 },
      { id: "suede", label: "Suede / nubuck", cleanse: 160, refurb: 385 }, // [verified]
    ],
    services: [
      {
        id: "cleanse",
        label: "Deep cleanse",
        detail: "Uppers, midsoles, laces & insoles, deodorised",
      },
      {
        id: "refurb",
        label: "Refurbishment",
        detail: "Deep cleanse plus repaint, sole icing & repairs",
      },
    ],
    addons: [
      { id: "whitening", label: "Sole whitening", price: 60 },
      { id: "protect", label: "Rain & stain protector", price: 50 },
      { id: "newlaces", label: "Fresh laces", price: 40 },
    ],
  },

  /* -------- Linen & Mocha: laundry -------- */
  laundry: {
    turnaround: "Same-day if in by 10:00",
    loads: [
      { id: "std", label: "Standard load · up to 8 kg", price: 95 },
      { id: "lrg", label: "Family load · up to 12 kg", price: 135 },
      { id: "duvet", label: "Duvet / comforter", price: 150 },
    ],
    extras: [
      { id: "iron", label: "Ironed & hung", price: 60 },
      { id: "soft", label: "Hypoallergenic wash", price: 25 },
      { id: "fold24", label: "Express · ready in 3 hours", price: 45 },
    ],
    alterationsNote: "Alterations & repairs from R50 — ask at the counter.",
  },

  /* -------- Linen & Mocha: coffee bar -------- */
  coffee: {
    menu: [
      { id: "americano", label: "Americano", price: 28 },
      { id: "cappuccino", label: "Cappuccino", price: 35 },
      { id: "flatwhite", label: "Flat white", price: 38 },
      { id: "mocha", label: "House mocha", price: 42 },
      { id: "coldbrew", label: "Cold brew", price: 45 },
    ],
    // The one-tap cross-sell offered at checkout
    attach: { id: "flatwhite", label: "flat white", price: 38 },
  },

  /* -------- Pickup & delivery -------- */
  delivery: {
    fee: 45,
    freeOver: 350, // order total that unlocks free pickup & delivery
    suburbs: [
      "Musgrave",
      "Berea",
      "Essenwood",
      "Glenwood",
      "Morningside",
      "Windermere",
      "Overport",
      "Umbilo",
      "Bulwer",
      "Sydenham",
    ],
    windows: [
      "08:00 – 10:00",
      "10:00 – 12:00",
      "12:00 – 14:00",
      "14:00 – 16:00",
      "16:00 – 18:00",
    ],
    daysAhead: 7, // how many days out someone can book
  },

  memberDiscount: 0.1, // the 10% shown in savings nudges
};

/* Format a rand amount for display: 1499 -> "R1,499" */
function rands(n) {
  return "R" + Math.round(n).toLocaleString("en-ZA");
}
