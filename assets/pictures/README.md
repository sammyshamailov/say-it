# Word pictures

Every picture word in the app has its own illustration, cut from AI-generated sprite sheets.

| Path | What |
| --- | --- |
| `assets/pictures/sheets/` | The 29 generated sheets, as they came from the image generator (the source) |
| `assets/pictures/master/` | Each picture cut out at full size, transparent, with a white sticker border |
| `assets/pictures/PROMPTS.md` | The prompts used for the sheets |
| `tools/pictures/sheets.json` | Which sheet holds which pictures, in reading order |
| `tools/pictures/build.py` | Cuts the sheets and writes everything below |
| `public/img/words/<id>.webp` | 320 px copies the app shows |
| `public/img/words-sprite.webp` | All pictures on one combined sheet (256 px tiles) |
| `public/img/words-sprite.json` | Where each picture sits on the combined sheet |

A picture's id is `<subcategory>-<word>`, for example `farm-cow` or `fruits-orange`. Feelings and actions come in a boy and a girl version (`feelings-happy-boy`, `feelings-happy-girl`); the app shows the one that matches the player's profile. Colors and numbers have no pictures: the app draws those itself.

In `public/js/words.js` a word's picture is written `img:<id>` (without the `-boy`/`-girl` ending).

## Rebuilding

```
pip install pillow numpy scipy
python3 tools/pictures/build.py
```

The cutter finds each picture by its outline, not by the grid, so stray grid lines, uneven spacing and missing borders in a sheet don't matter. To mirror a picture that faces the wrong way, add `"flip": ["<id>"]` to its sheet in `sheets.json`.

After rebuilding, bump `PIC_V` in `public/js/app.js` so installed apps download the new pictures, and bump the app version as described in the main README.
