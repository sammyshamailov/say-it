#!/usr/bin/env python3
"""Cut the generated picture sheets into single word pictures.

Reads   tools/pictures/sheets.json      which sheet holds which pictures, in reading order
        assets/pictures/sheets/*.webp   the sheets as they came out of the image generator
Writes  assets/pictures/master/<id>.webp    full-size cut-outs (keep these, they are the source)
        public/img/words/<id>.webp          320 px copies the app shows
        assets/pictures/words-sprite.webp   every picture on one combined sheet (not deployed)
        assets/pictures/words-sprite.json   where each picture sits on the combined sheet

Each picture is found by its outline (not by the grid), its white background is removed,
and a uniform white sticker border is added, so stray grid lines, uneven spacing or
missing borders in a generated sheet do not matter.

Needs Python 3 with Pillow, NumPy and SciPy:  pip install pillow numpy scipy
Run from the repo root:                     python3 tools/pictures/build.py
"""
import json, math, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SHEETS = os.path.join(ROOT, "assets/pictures/sheets")
MASTER = os.path.join(ROOT, "assets/pictures/master")
WEB = os.path.join(ROOT, "public/img/words")
SPRITE = os.path.join(ROOT, "assets/pictures/words-sprite")  # not used by the app, so not deployed
WEB_SIZE = 320      # px, square
TILE = 256          # px per picture on the combined sheet
BORDER = 7          # px of white sticker border at master size


def is_background(c):
    """Near-white, unsaturated pixels: the sheet background and faint grid lines."""
    return (c.min(2) > 200) & ((c.max(2) - c.min(2)) < 25)


def cutout(c):
    """Mask of everything not connected to the crop's edge through background."""
    lb, _ = ndi.label(is_background(c))
    edge = set(np.unique(np.r_[lb[0], lb[-1], lb[:, 0], lb[:, -1]])) - {0}
    mask = ~np.isin(lb, list(edge))
    mask = ndi.binary_fill_holes(ndi.binary_opening(mask, iterations=2))
    ml, mn = ndi.label(mask)
    if mn > 1:  # drop specks, keep real separate pieces (raindrops, a second glove)
        sizes = np.array(ndi.sum(mask, ml, range(1, mn + 1)))
        mask = np.isin(ml, [i + 1 for i, v in enumerate(sizes) if v >= 0.012 * sizes.max()])
    return mask


def cut_sheet(path, cols, rows, count, separate_people=False):
    a = np.asarray(Image.open(path).convert("RGB")).astype(int)
    H, W, _ = a.shape
    fg = ndi.binary_opening(~is_background(a), iterations=1)
    # join an item's nearby parts; on sheets of people standing close together, don't
    lab, _ = ndi.label(fg if separate_people else ndi.binary_dilation(fg, iterations=3))
    cw, ch = W / cols, H / rows
    cells = {}
    for i, sl in enumerate(ndi.find_objects(lab)):
        m = lab[sl] == i + 1
        if m.sum() < 300:
            continue
        ys, xs = np.nonzero(m)
        k = int((sl[0].start + ys.mean()) // ch) * cols + int((sl[1].start + xs.mean()) // cw)
        cells.setdefault(k, []).append((sl, i + 1))
    out = []
    for k in range(count):
        if k not in cells:
            raise SystemExit(f"{os.path.basename(path)}: nothing found in cell {k + 1}")
        sls = [x[0] for x in cells[k]]; ids = [x[1] for x in cells[k]]
        pad = 12
        y0 = max(0, min(s[0].start for s in sls) - pad); y1 = min(H, max(s[0].stop for s in sls) + pad)
        x0 = max(0, min(s[1].start for s in sls) - pad); x1 = min(W, max(s[1].stop for s in sls) + pad)
        c = a[y0:y1, x0:x1]
        mask = cutout(c)
        # keep only pieces that belong to this cell, not a neighbour's feet poking in
        own = np.isin(lab[y0:y1, x0:x1], ids); anyl = lab[y0:y1, x0:x1] > 0
        ml, mn = ndi.label(mask)
        mask = np.isin(ml, [j for j in range(1, mn + 1)
                            if (own & (ml == j)).sum() > 0.5 * max(1, (anyl & (ml == j)).sum())])
        p = BORDER + 3
        c = np.pad(c, ((p, p), (p, p), (0, 0)), constant_values=255); mask = np.pad(mask, p)
        border = ndi.binary_dilation(mask, iterations=BORDER)
        a_obj = ndi.gaussian_filter(mask.astype(float), 0.8)
        a_brd = ndi.gaussian_filter(border.astype(float), 1.0)
        rgb = c * a_obj[..., None] + 255 * (1 - a_obj[..., None])  # picture over its white sticker
        rgba = np.dstack([rgb.astype(np.uint8), (a_brd * 255).astype(np.uint8)])
        ys, xs = np.where(border)
        img = Image.fromarray(rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1], "RGBA")
        side = int(max(img.size) * 1.06)
        sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        sq.paste(img, ((side - img.size[0]) // 2, (side - img.size[1]) // 2))
        out.append(sq)
    return out


def main():
    manifest = json.load(open(os.path.join(ROOT, "tools/pictures/sheets.json")))
    for d in (MASTER, WEB):
        os.makedirs(d, exist_ok=True)
    pics = {}
    for s in manifest:
        imgs = cut_sheet(os.path.join(SHEETS, s["sheet"]), s["cols"], s["rows"], len(s["pictures"]),
                         s.get("separate_people", False))
        for pid, im in zip(s["pictures"], imgs):
            if pid in s.get("flip", []):
                im = im.transpose(Image.FLIP_LEFT_RIGHT)
            pics[pid] = im
        print(f"{s['sheet']}: {len(imgs)}")
    ids = sorted(pics)
    for pid in ids:
        im = pics[pid]
        im.save(os.path.join(MASTER, pid + ".webp"), quality=95, method=6)
        im.resize((WEB_SIZE, WEB_SIZE), Image.LANCZOS).save(os.path.join(WEB, pid + ".webp"), quality=82, method=6)
    cols = math.ceil(math.sqrt(len(ids)))
    rows = math.ceil(len(ids) / cols)
    sheet = Image.new("RGBA", (cols * TILE, rows * TILE), (0, 0, 0, 0))
    frames = {}
    for i, pid in enumerate(ids):
        x, y = (i % cols) * TILE, (i // cols) * TILE
        sheet.paste(pics[pid].resize((TILE, TILE), Image.LANCZOS), (x, y))
        frames[pid] = {"x": x, "y": y, "w": TILE, "h": TILE}
    sheet.save(SPRITE + ".webp", quality=85, method=6)
    json.dump({"image": "words-sprite.webp", "size": {"w": sheet.width, "h": sheet.height},
               "tile": TILE, "frames": frames}, open(SPRITE + ".json", "w"), indent=1)
    print(f"{len(ids)} pictures, combined sheet {sheet.width}x{sheet.height}")


if __name__ == "__main__":
    sys.exit(main())
