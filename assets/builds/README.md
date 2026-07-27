# Web Builds — live preview screenshots

The `03 Web Builds` ledger on the homepage streams a screenshot into the preview
frame for each site. Drop the real captures here and they appear automatically —
no code change needed. Until a file exists, a branded browser-chrome frame shows.

Expected filenames (referenced from `data/projects.js` → `builds[].shot`):

| Build | Desktop file (used by the ledger) |
|---|---|
| TMP Civils | `tmpcivils-desktop.png` |
| Glammified by Kwannz | `glambykwannz-desktop.png` |
| Buhle Portfolio | `buhle-portfolio-desktop.png` |

Capture at **1440×900**, export as PNG (or WebP and update the `.shot` path),
keep it reasonably compressed. The frame is `4:3`-ish and crops from the top,
so capture the top of each page.

> These could not be auto-captured during the build: the session's network
> policy blocks outbound access to the client domains. Capture them from any
> normal browser and drop them in here.
