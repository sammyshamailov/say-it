#!/usr/bin/env python3
"""Make the map's pictures: the land backgrounds and the cut-out props and world stickers.

Reads   assets/map/bg-<land>.webp     one portrait photo per land (generated diorama)
        assets/map/props.webp        4x3 sheet: stepping stones, chests, star, sign, lock, flag
        assets/map/stickers.webp     4x3 sheet: small things that appear as a land is played
Writes  public/img/map/<land>.webp   backgrounds, 1080 px wide at most
        public/img/map/<name>.webp   cut-out props and stickers, transparent, 240 px

The props are photos of felt and clay on pure white. The paper and the soft shadows on it are
cut away; they are smooth, while white felt is textured. The page adds its own shadow.

Run from the repo root:  python3 tools/pictures/build_map.py
"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "assets/map")
OUT = os.path.join(ROOT, "public/img/map")
LANDS = ["animals", "food", "people", "things", "outside", "learning"]
PROPS = ["stone", "stone-1", "stone-2", "stone-3", "stone-4", "stone-5",
         "chest", "chest-open", "star", "sign", "lock", "flag"]
STICKERS = ["zebra", "lion", "palm", "stall", "basket", "puppy",
            "picnic", "train", "teddy", "balloon", "boat", "rainbow"]
SIZE = 240


def cut(cell):
    a = np.asarray(cell.convert("RGB")).astype(int)
    g = a.mean(2)
    flat = (a.max(2) - a.min(2)) < 16
    # the paper, plus the soft grey shadow under each object: smooth (felt is textured) and pale
    std = np.sqrt(np.maximum(ndi.uniform_filter(g * g, 9) - ndi.uniform_filter(g, 9) ** 2, 0))
    bg = flat & ((a.min(2) > 244) | ((a.min(2) > 165) & (std < 4.5)))
    lb, _ = ndi.label(bg)
    edge = set(np.unique(np.r_[lb[0], lb[-1], lb[:, 0], lb[:, -1]])) - {0}
    mask = ~np.isin(lb, list(edge))
    mask = ndi.binary_fill_holes(ndi.binary_opening(mask, iterations=2))
    ml, mn = ndi.label(mask)
    if mn > 1:  # keep the object, drop specks
        sizes = np.array(ndi.sum(mask, ml, range(1, mn + 1)))
        mask = np.isin(ml, [i + 1 for i, v in enumerate(sizes) if v >= 0.02 * sizes.max()])
    mask = ndi.binary_erosion(mask, iterations=3)  # trim the pale fringe the shadow leaves
    alpha = ndi.gaussian_filter(mask.astype(float), 0.9)
    rgba = np.dstack([a.astype(np.uint8), (alpha * 255).astype(np.uint8)])
    ys, xs = np.where(mask)
    img = Image.fromarray(rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1], "RGBA")
    side = max(img.size)
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.paste(img, ((side - img.size[0]) // 2, side - img.size[1]))  # stand on the bottom edge
    return sq.resize((SIZE, SIZE), Image.LANCZOS)


def sheet(name, ids, cols=4, rows=3):
    im = Image.open(os.path.join(SRC, name))
    W, H = im.size
    for i, pid in enumerate(ids):
        c, r = i % cols, i // cols
        box = (round(c * W / cols), round(r * H / rows), round((c + 1) * W / cols), round((r + 1) * H / rows))
        cut(im.crop(box)).save(os.path.join(OUT, pid + ".webp"), quality=86, method=6)


def main():
    os.makedirs(OUT, exist_ok=True)
    for land in LANDS:
        im = Image.open(os.path.join(SRC, f"bg-{land}.webp")).convert("RGB")
        if im.width > 1080:
            im = im.resize((1080, round(im.height * 1080 / im.width)), Image.LANCZOS)
        im.save(os.path.join(OUT, land + ".webp"), quality=74, method=6)
    sheet("props.webp", PROPS)
    sheet("stickers.webp", STICKERS)
    print("map pictures written to", OUT)


if __name__ == "__main__":
    main()
