/* ============================================================
   Buhle Studio — content data (v3)
   Edit here, never in markup. Rows render from these arrays.
   ============================================================ */
window.BUHLE_DATA = {

  /* ---------- 02 WORK — design portfolio ---------- */
  work: [
    {
      name: "Lorenzo Skin Care",
      tags: ["Brand Identity", "Packaging"],
      blurb: "A calm, editorial identity for a skincare line. The serif wordmark, flowing monogram and labels carry through onto the serum range.",
      images: [
        { src: "assets/work/lorenzo-serum.jpg", alt: "Lorenzo Skin Care serum bottle with dropper on a stone pedestal" },
        { src: "assets/work/lorenzo-logo.jpg", alt: "Lorenzo Skin Care serif wordmark and circular monogram" }
      ]
    },
    {
      name: "Flexers Fitness",
      tags: ["Brand Identity", "Packaging", "Social"],
      blurb: "A bold wing monogram for a health & wellness brand, carried through supplement packaging and a full Instagram presence.",
      images: [
        { src: "assets/work/flexers-packaging.jpg", alt: "Flexers Fitness whey protein, fat flush powder and herbal tea packaging in purple and black" },
        { src: "assets/work/flexers-logo.jpg", alt: "Flexers Fitness wing monogram logo" },
        { src: "assets/work/flexers-instagram.jpg", alt: "Flexers Fitness Instagram profile mockup on a phone" }
      ]
    },
    {
      name: "Kwen Essence",
      tags: ["Brand Identity", "Packaging"],
      blurb: "Pulse of life. A botanical monogram and a quiet label system for a home and body essence brand, from reed diffusers to magnesium oil.",
      images: [
        { src: "assets/work/kwen-diffusers.jpg", alt: "Two Kwen Essence amber reed diffusers with black labels" },
        { src: "assets/work/kwen-logo.jpg", alt: "Kwen Essence leaf monogram logo on sage green" },
        { src: "assets/work/kwen-spray.jpg", alt: "Kwen Essence magnesium oil spray in an amber bottle" }
      ]
    },
    {
      name: "The Flame Yard",
      tags: ["Logo", "Event Branding"],
      blurb: "A hand lettered badge for The Flame Yard, a fast foods brand where fire and flavour collide. The logo scales all the way up to a full branded gazebo.",
      images: [
        { src: "assets/work/flameyard-logo.jpg", alt: "The Flame Yard circular script logo with flame icon" },
        { src: "assets/work/flameyard-gazebo.jpg", alt: "The Flame Yard branded black gazebo stall" }
      ]
    },
    {
      name: "Zerodoublethree",
      tags: ["Own Label", "Apparel", "Illustration"],
      blurb: "My own streetwear label. A winged rose in barbed wire and flame, drawn for heavyweight tees and washed hoodies.",
      images: [
        { src: "assets/work/zdt-tee.jpg", alt: "Black Zerodoublethree tee with winged rose and barbed wire artwork" },
        { src: "assets/work/zdt-hoodie.jpg", alt: "Washed grey Zerodoublethree hoodie with winged rose artwork and flame sleeves" }
      ]
    }
  ],

  /* ---------- 03 WEB BUILDS — the ledger ----------
     shot: expected preview image. Drop a real capture at that path
     (e.g. assets/builds/tmpcivils-desktop.webp) and it appears automatically.
     Until then a branded frame shows. `stackConfirm: true` = verify before publishing.  */
  builds: [
    {
      client: "TMP Civils",
      url: "tmpcivils.co.za",
      href: "https://tmpcivils.co.za",
      type: "Corporate",
      year: "2025",
      shot: "assets/builds/tmpcivils-desktop.webp",
      problem: "TMP Civils takes on serious civil and construction work but had no credible online home to point clients, referrals and tender panels to.",
      approach: "A corporate build with no fluff: clear service lines, project credentials and a direct contact path, structured so someone vetting a contractor finds the proof fast.",
      stack: "Custom marketing site, front end build",
      stackConfirm: false,
      outcome: "TMP Civils now has a professional site that matches the scale of the work they bid for."
    },
    {
      // NOTE: confirm brand-name spelling & stack with Buhle.
      client: "Glammified by Kwannz",
      url: "glambykwannz.vercel.app",
      href: "https://glambykwannz.vercel.app",
      type: "Booking",
      year: "2025",
      shot: "assets/builds/glambykwannz-desktop.webp",
      problem: "Glammified by Kwannz, a beauty and glam brand, was taking bookings through Instagram DMs with no proper place for clients to see the services and book.",
      approach: "A clean glam site that puts the services and the booking flow front and centre, so clients can book without the back and forth.",
      stack: "Web build · deployed on Vercel",
      stackConfirm: false,
      outcome: "Kwannz now has one link where clients book directly, instead of chasing enquiries through the DMs."
    },
    {
      client: "Buhle Makaula Portfolio",
      url: "buhlemakaula.vercel.app",
      href: "https://buhlemakaula.vercel.app",
      type: "Portfolio",
      year: "2026",
      shot: "assets/builds/buhle-portfolio-desktop.webp",
      problem: "Buhle Studio needed a home that proves the work rather than describing it.",
      approach: "A single page editorial portfolio with a live web builds ledger. The site is itself a sample of the build quality on offer. You are reading it.",
      stack: "Static, hand coded HTML, CSS and vanilla JS. Deployed on Vercel.",
      stackConfirm: false,
      outcome: "One link that carries the brand, the design work and the web builds in a single scroll."
    }
  ],

  /* ---------- 03 proof triad — TRUE figures only ---------- */
  proof: [
    { fig: "03", label: "Sites shipped" },
    { fig: "03", label: "Industries served" },
    { fig: "2025", label: "Building the web since" }
  ]
};
