# Web Builds — live preview screenshots

The `03 Web Builds` ledger on the homepage streams a screenshot into the preview
frame for each site. Drop the real captures here and they appear automatically —
no code change needed. Until a file exists, a branded browser-chrome frame shows.

Expected filenames (referenced from `data/projects.js` → `builds[].shot`):

| Build | Desktop file (used by the ledger) |
|---|---|
| TMP Civils | `tmpcivils-desktop.webp` |
| Glammified by Kwannz | `glambykwannz-desktop.webp` |
| Buhle Portfolio | `buhle-portfolio-desktop.webp` |

Capture at **1440×900** and export WebP. Wider captures are fine: the frame
is 1440×900 and crops from the top centre, so anything past roughly the outer
11% on each side is trimmed. Keep the top of the page in shot.

All three are in place. They were supplied as browser screenshots and
normalised to 1440×900 WebP, because this session's network policy blocks
outbound access to the client domains for automated capture.
