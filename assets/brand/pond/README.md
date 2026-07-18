# POND engraved band — vector pack

Clean, fully-editable vector reconstruction of the engraved brass band
(tribal chevron-and-diamond border + central `POND` reserve). Built as plain
geometric shapes — not an auto-trace — so nodes stay minimal and every element
is directly editable.

## Files

| File | What it is |
|------|------------|
| `pond-engraving-lineart.svg` | Full band as black line-art on a transparent background. Best master for recolouring / editing. |
| `pond-engraving-brass.svg` | Full band on a gold brass plate using the brand palette (`#c9a24b → #9a7a2f`). Presentation-ready. |
| `pond-border-tile.svg` | One seamless repeat of the border (no text). Duplicate/step-and-repeat it to make a border of any length. |

Regenerate any time: `python3 scripts/generate_pond_pattern.py`

## Editable structure (SVG groups / ids)

```
engraving
├─ frame          top & bottom framing lines
├─ border-left    diamonds + hexagon chevron cells
├─ pond           reserve rectangle + "POND" (live editable text)
└─ border-right   mirror of the left border
```

## Opening in CorelDRAW

1. **File ▸ Import** (or drag in) the `.svg`. CorelDRAW imports SVG natively.
2. Everything arrives as curves/groups — **Ungroup** (`Ctrl+U`) to reach
   individual shapes. The groups above become named objects in the Object Manager.
3. `POND` comes in as **live text** — retype it or restyle with any font.
4. Recolour by selecting shapes and clicking a palette swatch. On the line-art
   file all engraving is a single black fill/stroke, so a select-all recolour
   is one click.

## Opening in Photoshop

- **File ▸ Open** the `.svg` → Photoshop rasterises it at whatever size you set
  in the dialog (set a large size — it's vector, so it stays crisp).
- To keep it **vector and scalable**, use **File ▸ Place Embedded** instead — it
  lands as a Smart Object you can scale losslessly.
- To edit the actual paths in Photoshop, open the SVG in Illustrator/CorelDRAW,
  copy the shapes, and paste into Photoshop **as Shape Layers**.

> Tip: for the crispest hand-off to Photoshop as editable paths, export a
> **PDF or AI** from CorelDRAW (File ▸ Export) — Photoshop opens both as vector
> smart objects / shape paths.

## Colours

- Gold highlight `#c9a24b`, gold shadow `#9a7a2f`, engraving ink `#131210`.
