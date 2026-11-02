# Word pictures

Every picture word in the app has its own illustration, cut from AI-generated sprite sheets.

| Path | What |
| --- | --- |
| `assets/pictures/sheets/` | The 49 generated sheets, as they came from the image generator (the source) |
| `assets/pictures/master/` | Each picture cut out at full size, transparent, with a white sticker border |
| `assets/pictures/PROMPTS.md` | The prompts used for the sheets |
| `tools/pictures/sheets.json` | Which sheet holds which pictures, in reading order |
| `tools/pictures/build.py` | Cuts the sheets and writes everything below |
| `public/img/words/<id>.webp` | 320 px copies the app shows |
| `assets/pictures/words-sprite.webp` | All pictures on one combined sheet (256 px tiles). Not used by the app, so it isn't deployed |
| `assets/pictures/words-sprite.json` | Where each picture sits on the combined sheet |

A picture's id is `<subcategory>-<word>`, for example `farm-cow` or `fruits-orange`. Feelings and actions come in a boy and a girl version (`feelings-happy-boy`, `feelings-happy-girl`); the app shows the one that matches the player's profile. Colors and numbers have no pictures: the app draws those itself.

In `public/js/data/words.js` a word's picture is written `img:<id>` (without the `-boy`/`-girl` ending).

The sheets added in 2.5 use the same prompt templates as `PROMPTS.md` with new item lists (the lists are in `sheets.json`). A few pictures are cut but not used by any word yet: `dinos-brontosaurus` (the app keeps its older long-neck dinosaur), and the sheets for the Who? game (`who-*`: I, you, we, they, he, she), opposites (`opp-*`) and position words (`pos-*`), which need their own round steps. The Who? sheet is cells 1–7 of one generation and cell 8 of another.

## Map pictures

`assets/map/` holds the six land photos (`bg-<land>.webp`, generated as photos of a felt-and-clay diorama with a winding trail) and two 4x3 sheets: `props.webp` (stepping stones in the five tier colours, chests, star, sign, lock, flag) and `stickers.webp` (things that appear in a land as it's played). `python3 tools/pictures/build_map.py` writes them to `public/img/map/`. The trail in each photo is traced by hand as `path` in `public/js/data/lands.js`; after changing a photo, trace it again and bump `MAP_V` in `public/js/screens/map.js`.

## Rebuilding

```
pip install pillow numpy scipy
python3 tools/pictures/build.py
```

The cutter finds each picture by its outline, not by the grid, so stray grid lines, uneven spacing and missing borders in a sheet don't matter. To mirror a picture that faces the wrong way, add `"flip": ["<id>"]` to its sheet in `sheets.json`.

After rebuilding, bump `PIC_V` in `public/js/ui/picture.js` so installed apps download the new pictures, and run `npm run release <new version>` as described in the main README.
