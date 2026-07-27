TOKEN PLAN — buhlemakaula.vercel.app v3 (ink + orange, per user)

COLOR (5 tokens, OKLCH-tuned, dark-first):
  ink     #0D0D0C  oklch(.15 .004 60)   canvas
  surface #17110D  oklch(.18 .012 55)   raised viewport / footer-dark
  bone    #ECEAE4  oklch(.93 .006 80)   type (biased light for contrast)
  orange  #F4622E  oklch(.68 .19 40)    primary accent
  stone   #A8A49B  oklch(.71 .01 70)    muted labels (lifted vs old #98958D for >=4.5:1)
  signature gradient (ONE element only): orange #F4622E -> ember #FF8A3D, on the ledger viewport sweep

TYPE (3 roles, contrast axis):
  Display : Anton (self-hosted)  — restraint: clamp ceiling 5.5rem, tracking -0.04em
  Body    : Urbanist (self-hosted) — grotesk, 65–75ch measure
  Utility : system mono (ui-monospace, SFMono, Menlo…) — numbering, taxonomy, stat captions (zero extra request)

SIGNATURE: 03 Web Builds live-preview ledger — hover/tap a row -> site preview streams into an
  inline viewport frame with an orange->ember gradient sweep. All boldness spent here; rest stays quiet.

SELF-CRITIQUE vs anti-patterns (what I changed):
  - Dropped the old card-heavy layout: v3 is editorial hairline-ruled rows, NOT nested cards.
    Only ONE raised container exists — the ledger viewport — so the signature reads as special.
  - No gradient TEXT on hero (anti-pattern); hero is solid Anton with one orange-emphasised phrase.
  - Numbering 00–05 kept ONLY because it is a real reading sequence; ledger indices are a real index.
  - Studio is a typed service ledger, not a generic 3-col "My Services" grid.
  - Mono utility layer is the Dragonfly-adjacent tell; system mono keeps the SA-mobile perf floor.
