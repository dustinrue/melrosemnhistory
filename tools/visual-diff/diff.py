#!/usr/bin/env python3
"""Compare the *_a.png / *_b.png screenshot pairs written by shoot.sh.
usage: python3 tools/visual-diff/diff.py <outdir>      (needs Pillow: pip install pillow)
Prints the % of pixels that differ and the vertical bands where they differ.
Expect ~0.01% from the footer year line; anything much larger means the design moved."""
import glob, os, sys
from PIL import Image, ImageChops

out = sys.argv[1]
for a in sorted(glob.glob(os.path.join(out, "*_a.png"))):
    b = a.replace("_a.png", "_b.png")
    A, B = Image.open(a).convert("RGB"), Image.open(b).convert("RGB")
    h = min(A.height, B.height)
    d = ImageChops.difference(A.crop((0, 0, A.width, h)), B.crop((0, 0, B.width, h))).convert("L").point(lambda v: 255 if v > 40 else 0)
    n = sum(1 for v in d.getdata() if v)
    px, bands, cur = d.load(), [], None
    for y in range(h):
        has = any(px[x, y] for x in range(0, A.width, 2))
        if has and cur is None: cur = y
        if not has and cur is not None: bands.append((cur, y)); cur = None
    print(f"{os.path.basename(a)[:-6]:28s} differs={100*n/(A.width*h):6.3f}%  bands={bands[:6]}")
