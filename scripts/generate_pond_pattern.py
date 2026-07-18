#!/usr/bin/env python3
"""
Generate an editable vector copy of the POND engraved brass band.

Faithful reconstruction of the engraving on the brass ruler:
  * top & bottom frame lines
  * a border of outlined hexagons (flat top/bottom, pointed left/right ends)
    tiled edge-to-edge, with small SOLID diamonds at every junction
  * a central reserve reading  P (diamond-dot) N D  flanked by large
    outline diamond-with-dot separators

Output is clean geometric SVG (plain polygons / polylines / lines / live text,
grouped and id-named) so it imports fully editable into CorelDRAW and Photoshop.

Outputs -> ../assets/brand/pond/ :
  pond-engraving-lineart.svg   black line-art on transparent
  pond-engraving-brass.svg     on a gold brass plate (brand colours)
  pond-border-tile.svg         one seamless repeat of the border (no text)
"""

import os

# ---- brand palette -------------------------------------------------------
GOLD_HI = "#c9a24b"
GOLD_MD = "#d8b866"
GOLD_LO = "#9a7a2f"
INK     = "#141210"          # engraving colour

# ---- geometry (units ~= px on the original photo) ------------------------
BH   = 56.0                  # band height, top frame to bottom frame
MID  = BH / 2.0
SW   = 2.4                   # engraving line weight

# hexagon cell
HW      = 50.0               # point-to-point width
HEX_E   = 12.0               # horizontal run of each angled end
HEX_INS = 10.0              # flat top/bottom inset from the frame lines
# junction diamond (solid)
DW      = 15.0               # width
DH      = 28.0               # height
GAP     = 3.0                # small gold gap between neighbouring elements

HEXES_PER_SIDE = 5

# central reserve
SEP_W   = 30.0               # large separator diamond width
SEP_H   = 42.0               # large separator diamond height
DOT_W   = 7.0                # centre dot of an outline diamond
PANEL   = 192.0              # POND text panel width (inside the box walls)
O_W     = 32.0              # diamond-"O" width
O_H     = 42.0              # diamond-"O" height
MARGIN_X = 34.0
MARGIN_Y = 22.0


# ---- primitives ----------------------------------------------------------
def poly(points, fill="none", stroke=INK, sw=SW):
    pts = " ".join(f"{x:.2f},{y:.2f}" for x, y in points)
    return (f'<polygon points="{pts}" fill="{fill}" stroke="{stroke}" '
            f'stroke-width="{sw}" stroke-linejoin="miter"/>')


def line(x1, y1, x2, y2, stroke=INK, sw=SW):
    return (f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" '
            f'stroke="{stroke}" stroke-width="{sw}" stroke-linecap="square"/>')


def diamond_pts(cx, cy, w, h):
    return [(cx - w / 2, cy), (cx, cy - h / 2), (cx + w / 2, cy), (cx, cy + h / 2)]


def solid_diamond(cx, cy=MID, w=DW, h=DH, ink=INK):
    return poly(diamond_pts(cx, cy, w, h), fill=ink, stroke="none")


def outline_diamond_dot(cx, cy, w, h, ink=INK):
    return (poly(diamond_pts(cx, cy, w, h), fill="none", stroke=ink) +
            solid_diamond(cx, cy, DOT_W, DOT_W, ink))


def hexagon(cx, ink=INK):
    top = HEX_INS
    bot = BH - HEX_INS
    hw = HW / 2.0
    pts = [
        (cx - hw, MID),
        (cx - hw + HEX_E, top),
        (cx + hw - HEX_E, top),
        (cx + hw, MID),
        (cx + hw - HEX_E, bot),
        (cx - hw + HEX_E, bot),
    ]
    return poly(pts, fill="none", stroke=ink)


# ---- border block --------------------------------------------------------
def border_block(x_start, ink=INK, lead_diamond=True):
    """Alternating diamonds and hexagons.

    lead_diamond=True  -> D H D H ... D H   (starts diamond, ends hexagon)
    lead_diamond=False -> H D H D ... H D   (starts hexagon, ends diamond)
    Either way: HEXES_PER_SIDE hexagons and HEXES_PER_SIDE diamonds.
    """
    parts = []
    x = x_start
    for i in range(HEXES_PER_SIDE):
        if lead_diamond:
            parts.append(solid_diamond(x + DW / 2, ink=ink)); x += DW + GAP
            parts.append(hexagon(x + HW / 2, ink=ink));       x += HW + GAP
        else:
            parts.append(hexagon(x + HW / 2, ink=ink));       x += HW + GAP
            parts.append(solid_diamond(x + DW / 2, ink=ink)); x += DW + GAP
    return "\n      ".join(parts), x - GAP


def block_width():
    return HEXES_PER_SIDE * (DW + GAP + HW + GAP) - GAP


# ---- POND letters (live, editable text) ----------------------------------
def pond_reserve(x0, ink=INK):
    """Outlined box holding  P (diamond-dot O) N D  evenly spaced."""
    parts = []
    # box walls (top/bottom come from the frame lines)
    parts.append(line(x0, 0, x0, BH, stroke=ink))
    parts.append(line(x0 + PANEL, 0, x0 + PANEL, BH, stroke=ink))
    fs = 44
    common = (f'font-family="Arial,\'Helvetica Neue\',sans-serif" '
              f'font-size="{fs}" font-weight="700" fill="{ink}" '
              f'text-anchor="middle" dominant-baseline="central"')
    # evenly spaced P  O  N  D
    xP = x0 + 26
    xO = x0 + 63
    xN = x0 + 100
    xD = x0 + 133
    xF = x0 + 168                 # trailing diamond flourish after D
    parts.append(f'<text x="{xP:.1f}" y="{MID:.1f}" {common}>P</text>')
    parts.append(outline_diamond_dot(xO, MID, O_W, O_H, ink))
    parts.append(f'<text x="{xN:.1f}" y="{MID:.1f}" {common}>N</text>')
    parts.append(f'<text x="{xD:.1f}" y="{MID:.1f}" {common}>D</text>')
    parts.append(outline_diamond_dot(xF, MID, O_W, O_H, ink))
    return "\n      ".join(parts)


# ---- assemble the full band ----------------------------------------------
def build_band(ink=INK):
    bw = block_width()
    total = bw * 2 + GAP * 2 + PANEL
    g = ['<g id="engraving">']

    # frame lines
    g.append('<g id="frame">')
    g.append(line(0, 0, total, 0, stroke=ink))
    g.append(line(0, BH, total, BH, stroke=ink))
    g.append('</g>')

    x = 0.0
    left_svg, x = border_block(x, ink=ink, lead_diamond=True)   # ends with hexagon
    g.append('<g id="border-left">\n      ' + left_svg + '\n      </g>')

    x += GAP
    g.append('<g id="reserve">\n      ' + pond_reserve(x, ink=ink) + '\n      </g>')
    x += PANEL + GAP

    right_svg, x = border_block(x, ink=ink, lead_diamond=False)  # starts with hexagon
    g.append('<g id="border-right">\n      ' + right_svg + '\n      </g>')

    g.append('</g>')
    return "\n    ".join(g), total


def svg_doc(width, height, body, defs="", scale=4):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" '
            f'width="{width*scale:.0f}" height="{height*scale:.0f}" '
            f'viewBox="0 0 {width:.2f} {height:.2f}">\n{defs}\n  {body}\n</svg>\n')


def main():
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__),
                                           "..", "assets", "brand", "pond"))
    os.makedirs(out_dir, exist_ok=True)

    band, total = build_band()
    doc_w = total + MARGIN_X * 2
    doc_h = BH + MARGIN_Y * 2

    def wrap(body):
        return (f'<g transform="translate({MARGIN_X:.2f},{MARGIN_Y:.2f})">\n'
                f'    {body}\n  </g>')

    # 1) line-art
    with open(os.path.join(out_dir, "pond-engraving-lineart.svg"), "w") as f:
        f.write(svg_doc(doc_w, doc_h, wrap(band)))

    # 2) brass plate
    defs = ('<defs>\n'
            '  <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1">\n'
            f'    <stop offset="0" stop-color="{GOLD_HI}"/>\n'
            f'    <stop offset="0.5" stop-color="{GOLD_MD}"/>\n'
            f'    <stop offset="1" stop-color="{GOLD_LO}"/>\n'
            '  </linearGradient>\n</defs>')
    bar = (f'<rect x="0" y="0" width="{doc_w:.2f}" height="{doc_h:.2f}" '
           f'rx="{doc_h/2:.2f}" ry="{doc_h/2:.2f}" fill="url(#brass)"/>')
    with open(os.path.join(out_dir, "pond-engraving-brass.svg"), "w") as f:
        f.write(svg_doc(doc_w, doc_h, bar + "\n  " + wrap(band), defs))

    # 3) seamless border tile: one hexagon + a diamond at each edge
    tw = GAP + HW + GAP + DW
    th = BH + MARGIN_Y * 2
    tile = [f'<g transform="translate(0,{MARGIN_Y:.2f})">']
    tile.append(line(0, 0, tw, 0))
    tile.append(line(0, BH, tw, BH))
    tile.append(solid_diamond(0))
    tile.append(hexagon(tw / 2))
    tile.append(solid_diamond(tw))
    tile.append('</g>')
    with open(os.path.join(out_dir, "pond-border-tile.svg"), "w") as f:
        f.write(svg_doc(tw, th, "\n  ".join(tile)))

    print("band units:", round(total, 1), "x", BH,
          "| doc:", round(doc_w, 1), "x", round(doc_h, 1))
    for fn in ("pond-engraving-lineart.svg", "pond-engraving-brass.svg",
               "pond-border-tile.svg"):
        p = os.path.join(out_dir, fn)
        print(" ", fn, os.path.getsize(p), "bytes")


if __name__ == "__main__":
    main()
