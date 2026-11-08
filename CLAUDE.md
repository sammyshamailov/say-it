# CLAUDE.md: working on Say It! Words

Read this before changing anything. Also see:

- `docs/GAME-DESIGN.md`: how the game is structured (lands, tiers, stones, rounds, rewards)
- `docs/CHANGELOG.md`: every version and what it contains
- `docs/LESSONS-LEARNED.md`: mistakes made so far, how they were fixed, and the rule each one taught. Add to it whenever something goes wrong.

## What this is

An English vocabulary game for Sammy's two children (4 and 5), whose home language is Hebrew and who can't read yet. Pictures, sound and voice only. Live at https://say-it-words.netlify.app/, deployed by Netlify from `main` of `sammyshamailov/say-it`. The kids play on **Android Chrome** (installed as a home-screen app).

Hard constraints, set by Sammy:

- Stays a PWA for iPhone and Android. No app stores.
- No ads, no tracking, no accounts. Progress lives on the device (`localStorage`, key `sayit2`).
- Nothing is ever sold for real money inside the game. Stars are earned, never bought.
- Every screen must work for a non-reader: no numbers or text a child has to read. Prices are rows of stars; the parent gate uses Hebrew words.
- Hebrew help everywhere for the child (spoken), Hebrew UI for the parent area (right to left).

Long-term: Sammy wants it to earn money someday. Since 2.9.0 only the first land is free; a parent unlock code opens all lands for all children on the phone (one-time, family-wide; ~79₪ suggested, to validate with real families). How codes are sold isn't built yet. Ads and tracking are ruled out.

## Stack

- Vanilla JS ES modules, **no build step**. `public/` is exactly what Netlify serves.
- Netlify Functions (`netlify/functions/`): transfer codes (Netlify Blobs) and parent unlock codes (`unlock.mjs`, signed with the `UNLOCK_SECRET` environment variable; Blobs store `unlocks` keeps up to two random device ids per code). `package.json` exists only for `@netlify/blobs` and the test/release scripts.
- Pictures and map art are generated outside (ChatGPT image generation, felt/clay diorama style) and cut by `tools/pictures/*.py`. Music is made with Suno (paid plan) and processed by `tools/music/build.py`. Word recordings come from Wikimedia Commons.

## Code map (short; README has the full table)

| Where | What |
| --- | --- |
| `public/js/main.js` | Registers screens, starts the app |
| `public/js/core/` | `html` template tag (escapes values), router, sheets, events |
| `public/js/data/` | `words.js` (484 words, tier 1-5 each), `stages.js` (stones built from words), `lands.js` (land photos, trail paths, stone placement), `outfits.js` |
| `public/js/services/` | `store.js` (progress, spaced repetition, unlock rules, rounds), `sound.js`, `speech.js`, `shop.js`, `match.js` |
| `public/js/screens/` | map, who, stickers, garden (garden + shop) |
| `public/js/round/` | `round.js` runs a round; `steps/` meet, tap, say (also "What's this?"), pop, memory, finish |
| `public/js/parent/` | gate, dashboard, setup, transfer, profile form |
| `public/css/app.css` | All styles ("Toy Box Bright") |
| `test/` | `node --test` suites |
| `tools/release.mjs` | Version stamping and offline file list |

## How to work

1. **Clone**: `git clone --depth 1 https://github.com/sammyshamailov/say-it`. Add the repo with push access first.
2. **Change**, keeping to the conventions below.
3. **Test**: `npm test`. Add a test for any rule change in `store.js`, `shop.js`, `stages.js`, `lands.js` or `outfits.js`.
4. **Look at it**: serve `public/` (`python3 -m http.server 8765` from inside `public/`) and screenshot with Playwright at **390×844, deviceScaleFactor 2**. Disable the service worker in the page (`Object.defineProperty(navigator,'serviceWorker',{value:undefined})`). Seed a player through the store: `store.newProfile(...)`, `store.addProfile(p)`, then `nav.reset('map')`. Write screenshots to the scratchpad with **absolute paths**, never into the repo.
5. **Release**: `npm run release X.Y.Z` (bumps `version.js`, `sw.js`, `index.html`, file lists). `npm test` fails if you forget. Patch for fixes, minor for features.
6. **Commit and push to `main`**: `git fetch origin main && git rebase origin/main && git push origin HEAD:main`. Netlify deploys in about a minute; phones pick it up next time the app comes to the front.
7. **Update `docs/CHANGELOG.md`** in the same commit, and `docs/LESSONS-LEARNED.md` if a mistake was fixed.

## Conventions that matter

- **Stone ids** (`<sub>-<tier>-<n>`, `<land>-<tier>-chest`, `<land>-party`) are built from each word's tier, so moving a word to another tier regroups the stones under those ids. Saved chest/party progress points at them.
- **Free first land:** `landPaid()` in `store.js` is checked before every other unlock rule, including "unlock all" and the already-played rule. Don't add a way into a later land that skips it. The unlock is per phone: `exportData()` leaves it out and `replaceAll()` keeps the phone's own, so transfers and backups can't spread it.
- **Rounds keep to the land:** a word stone reviews only words of its own land; mixing across lands happens in chests and parties. Play follows the trail.
- **Progress rules:** a word stone is done when every word was answered right on two different days (`remembered` in `store.js`); "met" is separate. Only Listen & tap answers move a word's level and day count.
- **Old saves must keep working** once the game goes to other families. Until then (Sammy, 2026-11-04: still building, not sent to anyone), changes that regroup stones or reset progress are fine; say so in the changelog. Changes to the save shape still need a tolerant reader (e.g. `worn()` accepts the old single-hat string, `days` may be missing on a word record).
- **Use the `html` tag** for all markup; it escapes values. Names and restored data are untrusted.
- **Positioned elements and animations:** stones and similar use `transform: translate(...)` to centre themselves. Any animation on them must keep that translate in every keyframe, or the element jumps. Use element-specific keyframes, not the shared `wiggle`/`pop`.
- **Map pictures** are cache-busted by `MAP_V` in `screens/map.js`; music by `MUSIC_V` in `services/sound.js`. Bump them when the files change.
- **Sound:** music ducks under any spoken word and goes silent while the child records. The mic is locked while the app is talking. Keep it that way for anything new that speaks.
- **Kid-facing design:** big tap targets, no reading, gentle feedback (a locked thing wiggles and makes a soft sound, it never scolds).
- Write plain commit messages: a title with the version, then what changed and why.

## Working with Sammy

- Sammy works in IT/software (development, UI/UX, product). Messages are short and screenshot-driven; screenshots from his Android phone with orange arrows mark the problem.
- He usually wants the fix shipped, not a proposal, for bugs. For design choices with gameplay consequences (unlock order, economy), ask one short question first, then build.
- Answer "why is X like this?" questions directly: say whether it was by design or a bug before changing it.
- Give opinions when asked "should we…?", with a clear recommendation.
- Things Claude can't do here: listen to audio, test the real microphone, generate images in the house style. Say so and ask Sammy to check on the phone, or hand him a prompt.
