"""Trace the Dentaloupe logo (navy + grey) into SVG path data.

usage: python trace_logo.py <logo.jpg> <out.json>
Writes {part: {"box": [x, y, w, h], "navy": d, "grey": d}} in source-pixel units, relative to
each part's crop origin.
"""
import json
import sys

import numpy as np
import potrace
from PIL import Image, ImageFilter

SCALE = 4
# (left, top, right, bottom) in the 904x1280 source
PARTS = {
    "mark": (250, 585, 675, 890),
    "word": (100, 1000, 800, 1140),
}


def masks(crop):
    a = np.asarray(crop).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum = (r + g + b) / 3
    navy = (b - r > 45) & (lum < 120)
    # neutral-ish mid grey, not white
    grey = (lum > 95) & (lum < 205) & (abs(b - r) < 45) & ~navy
    return navy, grey


def to_d(bmp):
    plist = bmp.trace(turdsize=40, alphamax=1.0, opticurve=True, opttolerance=0.2)
    f = lambda p: f"{p.x / SCALE:.2f} {p.y / SCALE:.2f}"
    out = []
    for curve in plist:
        out.append(f"M{f(curve.start_point)}")
        for seg in curve.segments:
            if seg.is_corner:
                out.append(f"L{f(seg.c)}L{f(seg.end_point)}")
            else:
                out.append(f"C{f(seg.c1)} {f(seg.c2)} {f(seg.end_point)}")
        out.append("Z")
    return "".join(out)


def main(src, dst):
    img = Image.open(src).convert("RGB")
    result = {}
    for name, box in PARTS.items():
        crop = img.crop(box)
        w, h = crop.size
        big = crop.resize((w * SCALE, h * SCALE), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
        navy, grey = masks(big)
        # The anti-aliased rim of every navy shape reads as mid grey: open the grey mask so
        # only solid grey areas (the lens glints, "oupe") survive.
        g = Image.fromarray((grey * 255).astype("uint8"))
        g = g.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(9))
        grey = np.asarray(g) > 127
        result[name] = {
            "box": [box[0], box[1], w, h],
            "navy": to_d(potrace.Bitmap(~navy)),
            "grey": to_d(potrace.Bitmap(~grey)),
        }
        print(name, "navy", len(result[name]["navy"]), "grey", len(result[name]["grey"]))
    json.dump(result, open(dst, "w"))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
