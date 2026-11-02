# Say It! Words

A game for young Hebrew-speaking children learning their first English words, through pictures, sound and voice. No reading needed, no ads, no accounts, no tracking. Progress is saved on the device.

Live: https://say-it-words.netlify.app/

## How it plays

- **Map**: six lands (Animal Jungle, Yummy Town, Me and Friends, Toy House, Adventure Road, Learning Castle). Each land has stepping stones, one per word group. Finishing stones opens the next land.
- **A round (3–5 minutes)**: meet new words → Listen & tap → Say it → a bonus game (Pop the bubbles or Memory match) → Well done, with stars and a sticker.
- **Say it**: on Android Chrome the browser's speech recognition checks the word and gives a bonus star. Everywhere else, and after one unheard try, "Echo" records the child, plays their voice back, then the model word. Every real attempt earns a star.
- **Spaced repetition**: each word has a level per child; a miss lowers it and brings the word back in the same round and later rounds.
- **Rewards**: stars, a sticker book (tap a sticker to hear its word), and the garden: kids spend stars to adopt any animal whose English word they've answered correctly (5 stars each; it lives in their garden and says its name when tapped) and to buy hats for the mascot (6–10 stars). Prices are shown as rows of stars, not numbers. Total stars earned never goes down; only the purse does. Nothing bought is ever lost, and nothing can be bought with real money.
- **Parent area**: type three numbers written as Hebrew words (a 4-year-old can't read them). Words learned, words to practice, time played, profiles, settings (sounds, music, Hebrew help, speaking mode, unlock all), microphone info, credits. Hebrew, right to left.

## Files

| Path | What |
| --- | --- |
| `public/` | Everything Netlify serves (the app) |
| `public/index.html` | App shell |
| `public/css/app.css` | "Toy Box Bright" design |
| `public/sw.js` | Offline support: opens instantly from the phone, saves pictures and recordings |
| `public/img/words/` | One picture per word (see `assets/pictures/README.md`) |
| `public/js/main.js` | Entry point: registers every screen and starts the app |
| `public/js/core/` | Building blocks with no app knowledge: safe `html` templates, router (screens + back button), sheets (pop-ups), events |
| `public/js/data/` | The 326 words (`words.js`), word → recording on Wikimedia Commons (`audio-map.js`), lands, hats |
| `public/js/services/` | Progress and spaced repetition (`store.js`), sound, speech, shop rules |
| `public/js/ui/` | Icons, word pictures, the chameleon mascot, shared components (word card, stars pill, buttons) |
| `public/js/screens/` | Map, land, who's playing, sticker book, garden and shop |
| `public/js/round/` | A round: `round.js` runs the steps; `steps/` has one file per step (meet, tap, say, pop, memory, finish) |
| `public/js/parent/` | Parent gate, parent area, first run, transfer codes and backups, microphone explanation |
| `assets/pictures/` | Source sheets, full-size pictures and the prompts used to make them (not deployed) |
| `tools/pictures/build.py` | Cuts the sheets into pictures |
| `tools/release.mjs` | Sets the version and refreshes the file lists (`npm run release`) |
| `netlify/functions/transfer.mjs` | Transfer codes: move progress to another phone |
| `netlify/functions/transfer-cleanup.mjs` | Daily sweep of unused codes |
| `test/` | Tests, run with `npm test` (Node 20+) |
| `netlify.toml` | Netlify settings |

### How the code fits together

- Every screen is a function registered by name in `main.js`; screens move with `nav.go("land", 2)`, `nav.back()`, `nav.reset("map")`. The Android back button closes an open sheet first, then goes back a screen.
- Markup is written with the `html` tag from `core/html.js`. It escapes every value, so names and anything restored from a backup or transfer code can't become HTML. Trusted markup (icons, other templates) passes through as is.
- A round step is a function `(ctx, step)`. `ctx` gives it the player, `frame()` to draw the step, `next()`, `award(stars)`, `requeue(word)` and `alive()`, which turns false the moment the child leaves; a step stops when it does. Timers and recordings registered with `ctx.round.onCleanup()` are stopped for it. To add a mini-game: write `round/steps/<name>.js`, add it to `STEPS` in `round/round.js`, and put it in the round's plan there.
- The store announces star changes (`store.on("stars", …)`), and every stars pill on screen updates itself.

## Releasing

No build step: edit and push. Before pushing a change, run

```
npm run release 2.5.0
```

with the next version number. It writes the version into `public/js/version.js`, `public/sw.js` and `public/index.html`, and refreshes the list of files the phone saves for offline use and preloads. `npm test` fails if you forgot (or added a file without running it).

Installed apps update themselves: the app opens straight from the phone without waiting for the network, the browser checks for a new version in the background (and each time the app comes back to the screen), and the app reloads into it on the map (never mid-round or in the parent area). `package.json` only exists so Netlify installs `@netlify/blobs` for the transfer function, and for the test and release scripts.

## Saved data

Stored in the browser's localStorage under `sayit2`. On first launch it imports profiles and stars from version 1 (`sayit-players`, `sayit-got-*`) and leaves those keys untouched.

## Moving to another phone

Parent area → "העברה לטלפון אחר". The old phone uploads its progress and gets a 6-character code; the new phone types it (in the parent area or on the first-run screen). The code works once and expires after 15 minutes. It's stored in Netlify Blobs (store `transfers`) and deleted when used or by the daily cleanup. Offline fallback: "גיבוי לקובץ" saves or restores a JSON backup file.

## Credits

- Word recordings: Wiktionary and Lingua Libre contributors on [Wikimedia Commons](https://commons.wikimedia.org), CC BY-SA (each file's page on Commons names its author and exact licence). Played as Commons' MP3 versions. Words without a recording use the device's voice.
- Font: [Fredoka](https://github.com/google/fonts/tree/main/ofl/fredoka), SIL Open Font License (`fonts/OFL.txt`), subset to Latin + Hebrew.
- Pictures: illustrations made for the app (see `assets/pictures/README.md`). Colours and numbers are drawn by the app.
