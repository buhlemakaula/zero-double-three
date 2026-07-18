#!/usr/bin/env python3
"""
Generate editable vector art of the POND engraved brass band.

Reconstructs the tribal/aztec-style chevron-and-diamond border seen on the
brass ruler, plus the central "POND" reserve. Output is clean geometric SVG
(plain polygons / polylines / live text, grouped and id-named) so it imports
fully editable into CorelDRAW and Photoshop — no messy auto-trace nodes.

Outputs (written to ../assets/brand/pond/):
  pond-engraving-lineart.svg  full band, black line-art on transparent
  pond-engraving-brass.svg    full band on a gold brass plate (brand colours)
  pond-border-tile.svg        one seamless repeat of the border (no text)
"""

import os

# ---- brand palette -------------------------------------------------------
GOLD_HI = "#c9a24b"
GOLD_LO = "#9a7a2f"
INK     = "#131210"      # engraving colour on brass
STROKE  = 3.0            # engraving line weight

# ---- geometry ------------------------------------------------------------
BAND_H   = 120.0         # engraving band height
CY       = BAND_H / 2.0  # vertical centre
MARGIN_X = 46.0
MARGIN_Y = 22.0

HEX_W    = 96.0          # hexagon cell width
HEX_CI   = 20.0          # hexagon corner inset
HEX_HH   = 34.0          # hexagon half-height
DIA_HW   = 13.0          # separator diamond half-width
DIA_HH   = 26.0          # separator diamond half-height
POND_W   = 208.0         # central reserve width
GAP      = 6.0

HEXES_PER_SIDE = 3


def poly(points, fill="none", stroke=INK, sw=STROKE, extra=""):
    pts = " ".join(f"{x:.2f},{y:.2f}" for x, y in points)
    return (f'<polygon points="{pts}" fill="{fill}" stroke="{stroke}" '
            f'stroke-width="{sw}" stroke-linejoin="round" {extra}/>')


def pline(points, stroke=INK, sw=STROKE):
    pts = " ".join(f"{x:.2f},{y:.2f}" for x, y in points)
    return (f'<polyline points="{pts}" fill="none" stroke="{stroke}" '
            f'stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"/>')


def diamond(cx, cy, hw, hh, fill=INK, stroke="none"):
    pts = [(cx - hw, cy), (cx, cy - hh), (cx + hw, cy), (cx, cy + hh)]
    return poly(pts, fill=fill, stroke=stroke, sw=STROKE)


def hexagon_cell(x0, ink=INK):
    """A hexagon frame with outward chevrons and a centre diamond."""
    cx = x0 + HEX_W / 2.0
    top, bot = CY - HEX_HH, CY + HEX_HH
    frame = [
        (x0, CY), (x0 + HEX_CI, top), (x0 + HEX_W - HEX_CI, top),
        (x0 + HEX_W, CY), (x0 + HEX_W - HEX_CI, bot), (x0 + HEX_CI, bot),
    ]
    parts = [poly(frame, stroke=ink)]
    # left chevron  <   and right chevron  >   pointing outward
    parts.append(pline([(cx - 18, CY - 20), (cx - 30, CY), (cx - 18, CY + 20)], stroke=ink))
    parts.append(pline([(cx + 18, CY - 20), (cx + 30, CY), (cx + 18, CY + 20)], stroke=ink))
    # centre diamond
    parts.append(diamond(cx, CY, 11, 18, fill=ink))
    return "\n      ".join(parts), cx


def side_sequence(x_start, ink=INK):
    """D H D H D H D  — returns (svg, end_x)."""
    parts = []
    x = x_start
    # leading diamond
    parts.append(diamond(x + DIA_HW, CY, DIA_HW, DIA_HH, fill=ink))
    x += DIA_HW * 2 + GAP
    for i in range(HEXES_PER_SIDE):
        hexsvg, _ = hexagon_cell(x, ink=ink)
        parts.append(hexsvg)
        x += HEX_W + GAP
        parts.append(diamond(x + DIA_HW, CY, DIA_HW, DIA_HH, fill=ink))
        x += DIA_HW * 2 + GAP
    return "\n      ".join(parts), x - GAP


def content_width():
    seq_w = DIA_HW * 2 + HEXES_PER_SIDE * (GAP + HEX_W + GAP + DIA_HW * 2)
    return seq_w * 2 + GAP + POND_W + GAP


def build_band(ink=INK, with_frame=True, text_fill=INK):
    """Full band group centred inside the drawing."""
    total_w = content_width()
    x = MARGIN_X
    g = ['<g id="engraving">']

    if with_frame:
        # top & bottom framing lines across the whole reserve
        fx0, fx1 = MARGIN_X - 10, MARGIN_X + total_w + 10
        ty, by = CY - HEX_HH - 10, CY + HEX_HH + 10
        g.append('<g id="frame">')
        g.append(pline([(fx0, ty), (fx1, ty)], stroke=ink, sw=STROKE))
        g.append(pline([(fx0, by), (fx1, by)], stroke=ink, sw=STROKE))
        g.append('</g>')

    left_svg, x = side_sequence(x, ink=ink)
    g.append('<g id="border-left">\n      ' + left_svg + '\n      </g>')

    # central POND reserve
    box_x = x + GAP
    box_y0, box_y1 = CY - HEX_HH, CY + HEX_HH
    g.append('<g id="pond">')
    g.append(f'<rect x="{box_x:.2f}" y="{box_y0:.2f}" width="{POND_W:.2f}" '
             f'height="{(box_y1-box_y0):.2f}" fill="none" stroke="{ink}" '
             f'stroke-width="{STROKE}"/>')
    g.append(f'<text x="{box_x + POND_W/2:.2f}" y="{CY:.2f}" '
             f'font-family="Arial, \'Helvetica Neue\', sans-serif" '
             f'font-size="46" font-weight="700" letter-spacing="6" '
             f'fill="{text_fill}" text-anchor="middle" '
             f'dominant-baseline="central">POND</text>')
    g.append('</g>')
    x = box_x + POND_W + GAP

    right_svg, x = side_sequence(x, ink=ink)
    g.append('<g id="border-right">\n      ' + right_svg + '\n      </g>')

    g.append('</g>')
    return "\n    ".join(g), total_w


def svg_doc(width, height, body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" '
            f'width="{width:.0f}" height="{height:.0f}" '
            f'viewBox="0 0 {width:.2f} {height:.2f}">\n'
            f'{defs}\n  {body}\n</svg>\n')


def main():
    out_dir = os.path.join(os.path.dirname(__file__), "..", "assets", "brand", "pond")
    out_dir = os.path.abspath(out_dir)
    os.makedirs(out_dir, exist_ok=True)

    total_w = content_width()
    doc_w = total_w + MARGIN_X * 2
    doc_h = BAND_H + MARGIN_Y * 2

    # translate band group down by MARGIN_Y
    def wrap(body):
        return f'<g transform="translate(0,{MARGIN_Y:.2f})">\n    {body}\n  </g>'

    # 1) line-art -----------------------------------------------------------
    band, _ = build_band(ink=INK, with_frame=True, text_fill=INK)
    open(os.path.join(out_dir, "pond-engraving-lineart.svg"), "w").write(
        svg_doc(doc_w, doc_h, wrap(band)))

    # 2) brass plate --------------------------------------------------------
    defs = ('<defs>\n'
            f'  <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1">\n'
            f'    <stop offset="0" stop-color="{GOLD_HI}"/>\n'
            f'    <stop offset="0.5" stop-color="#d8b866"/>\n'
            f'    <stop offset="1" stop-color="{GOLD_LO}"/>\n'
            f'  </linearGradient>\n'
            '</defs>')
    bar = (f'<rect x="0" y="0" width="{doc_w:.2f}" height="{doc_h:.2f}" '
           f'rx="{doc_h/2:.2f}" ry="{doc_h/2:.2f}" fill="url(#brass)"/>')
    band_b, _ = build_band(ink=INK, with_frame=True, text_fill=INK)
    body = bar + "\n  " + wrap(band_b)
    open(os.path.join(out_dir, "pond-engraving-brass.svg"), "w").write(
        svg_doc(doc_w, doc_h, body, defs))

    # 3) seamless border tile (one D+H repeat, no text) ---------------------
    tile_w = HEX_W + GAP + DIA_HW * 2 + GAP
    th = BAND_H + MARGIN_Y * 2
    parts = [f'<g transform="translate(0,{MARGIN_Y:.2f})">']
    # half diamond at each edge so tiles butt seamlessly
    parts.append(diamond(0, CY, DIA_HW, DIA_HH, fill=INK))
    hexsvg, _ = hexagon_cell(DIA_HW + GAP)
    parts.append(hexsvg)
    parts.append(diamond(tile_w, CY, DIA_HW, DIA_HH, fill=INK))
    parts.append('</g>')
    open(os.path.join(out_dir, "pond-border-tile.svg"), "w").write(
        svg_doc(tile_w, th, "\n  ".join(parts)))

    print("wrote:")
    for f in ("pond-engraving-lineart.svg", "pond-engraving-brass.svg", "pond-border-tile.svg"):
        p = os.path.join(out_dir, f)
        print(f"  {p}  ({os.path.getsize(p)} bytes)")


if __name__ == "__main__":
    main()
