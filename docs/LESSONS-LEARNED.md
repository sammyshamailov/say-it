# Lessons learned

Mistakes made while building Say It! Words, how each was found and fixed, and the rule to keep. Newest first. Add an entry whenever something reaches the phone broken or a decision has to be undone.

## Map and layout

**A tapped locked stone jumped off the trail (fixed in 2.6.1)**
- What happened: the shared `wiggle` animation sets `transform` in every keyframe, which replaced the stone's `translate(-50%,-62%)` centring. The stone snapped half its size up and sideways while shaking.
- Fix: a stone-only `stonewiggle` that keeps the translate in every frame, with a smaller shake.
- Rule: an element positioned with `transform` needs its own keyframes that include that transform.

**Stones stacked on top of each other (fixed in 2.6.1)**
- What happened: stones were spaced evenly *along* the trail. Where the trail bends back on itself, stones far apart on the path landed close together on screen.
- Fix: stones are dropped along the trail only where they are at least 0.22 picture widths from every other stone in a straight line; lands add photos when they need room. Checked for every stone on the map, including across photo seams.
- Rule: measure overlap on screen, not along a path. Check the closest pair programmatically, not just by eye.

**The last photo of a land was nearly empty (fixed in 2.6.2)**
- What happened: stones were split into chunks of `ceil(n / photos)`, so the last photo got the leftovers (4 of 25 in Yummy Town).
- Fix: share stones evenly: `slice(round(j·n/k), round((j+1)·n/k))`.
- Rule: when splitting a list into pages, distribute evenly.

**Later lands were open from the start (changed in 2.6.1)**
- What happened: not a bug but a design that didn't match the map. Tiers opened across the whole map, so every land's easy stones were open on day one while the map looks like one trail.
- Fix (Sammy chose this): one land at a time; tiers open per land; Play follows the trail. A land the child already played in stays open.
- Rule: the unlock order must match what the map shows. When a question is "why is X like this?", say whether it's by design before changing it, and ask when the change affects gameplay.

**Parent area stopped reacting to taps (fixed in 2.5.1)**
- What happened: the 2.5.0 map added `.panel { pointer-events: none }` and sand-band pseudo-elements. The parent area also used `.panel` for its cards, so it went dead.
- Fix: the map uses `.land-panel`.
- Rule: give new styles specific class names; search `app.css` and the JS for an existing class before reusing a generic name. Click through the parent area after any CSS change.

## Shop and garden

**The yellow "chosen" ring didn't cover the whole button (fixed in 2.6.2)**
- What happened: the ring was a `box-shadow` spread around the button face, not its 3D lip, and the scrolling shelf clipped it on the left.
- Fix: the ring is an `:after` border around the face and lip; the shelf has more padding.
- Rule: rings and glows on 3D buttons must include the lip; leave room for them inside scrolling containers.

**Shop tiles had different heights (fixed in 2.7.1)**
- What happened: tiles were `aspect-ratio: 1` but a second row of price stars made some grow.
- Fix: fixed grid slots for the picture and the price.
- Rule: grids of cards need fixed content slots, not content-driven height.

**Big prices overflowed their tiles (fixed in 2.7.0, before release)**
- What happened: 20–30 star prices drew 20–30 small stars.
- Fix: over 10, big stars worth five each.

**Only a few animals on the shelf (changed in 2.6.2)**
- What happened: by design only met animals showed, so the shelf looked empty and gave nothing to aim for.
- Fix: every animal shows, unmet ones as shadows.

## Updates and offline

**The installed app didn't pick up new versions (fixed in 2.2.1)**
- What happened: the service worker served the saved copy and updated only on the launch after next. Android keeps the app in memory, so coming back to it never relaunched it.
- Fix: network first on open (3 s timeout), check for updates when the app returns to the screen, reload at a calm moment, and cache new versions past the HTTP cache. Phones needed one manual double reopen to receive the fix itself.
- Rule: test updates on an installed app, not a browser tab.

**The version was typed in many places (fixed in 2.4.0)**
- What happened: the version lived in `index.html` (9 times), `sw.js`, the file list and the parent area, so releases were easy to get half right.
- Fix: `npm run release X.Y.Z` stamps everything; `npm test` fails if it's out of date.

## Sound and speech

**The app recorded its own voice (fixed in 2.1.1)**
- What happened: the mic could be pressed while the app was still saying the word or feedback.
- Fix: the mic is locked (dimmed) while anything is speaking.

**Music drowned out the words (fixed in 2.1.1)**
- Fix: music ducks under every spoken sound and stops while recording. Applies to the real soundtrack too (2.6.0).

**A child speaking right after tapping counted as noise (fixed in 2.1.0)**
- What happened: the recorder measured background noise in the first moments, exactly when an eager child starts talking.

**Distractor was the same word as the target (fixed in 2.1.0)**
- What happened: "orange" the fruit and "orange" the colour (and "star" twice) could appear together in Pop the bubbles.
- Fix: distractors are compared by English word, not by id.
- Rule: words can repeat across groups; compare by the spoken word.

**Word audio sources (1.x → 2.0)**
- Device text-to-speech was too fast and clipped short words like "cow". Human recordings were better, but mixed accents bothered Sammy at first; a neural TTS needed a local script and was dropped. Wikimedia Commons recordings are what stuck.
- dictionaryapi.dev's audio host started returning 502s mid-project; recordings now come straight from Wikimedia Commons' MP3 versions.
- Rule: don't depend on a third-party host you don't control at runtime; cache everything offline.

**Speech recognition can't be relied on (2.0 design)**
- It's blocked in iPhone home-screen apps and poor with young voices. Echo (record and play back) is the main mode; recognition is a bonus.

## Pictures

**Inconsistent illustrations (2.3.0)**
- Loose prompts gave mixed styles and poses. The camel came out like a llama (needed an explicit hump), puppy and kitten looked like adults (needed baby proportions), and farm birds couldn't share the mammals' four-legged pose.
- Fix: strict prompts with exact pose, angle and view for every item ("no room for creativity"); facing direction fixed in code instead of regenerating; outline-based cutting instead of a fixed grid, so multi-piece items (a pair of gloves) stay whole.
- Rule: write the pose into every prompt; check odd items (lookalikes, babies, birds) first.

**Unclear emoji (1.x)**
- A microphone for "sing" and similar. Fixed with two-emoji pictures, later replaced by illustrations.

## Security and data

**Names and restored data could become HTML (fixed in 2.4.0)**
- Fix: all markup goes through the `html` tag, which escapes values.

**The parent gate was a 3-second hold (fixed in 2.1.0)**
- A 4-year-old can hold a button. Replaced with three numbers written as Hebrew words.

**A child's English-letter name could crash the greeting (fixed in 1.x)**

## How the work is done

**Screenshots written into the repo (2026-11-03)**
- What happened: Playwright scripts used relative file names, so screenshots landed in the repo folder (and one stale screenshot was mistaken for the new result).
- Fix: absolute scratchpad paths in every script; `git status` before committing.
- Rule: write tool output to absolute paths outside the repo, and check the file's timestamp when a change "didn't work".

**Replacing a block of code dropped helpers it contained (2026-11-03)**
- What happened: rewriting the map-progression block in `store.js` removed `stageDone` and friends, failing 12 tests.
- Fix: restored them; tests caught it before release.
- Rule: when replacing a block, list what it defined and check each one still exists. Always run `npm test` before releasing.

**Things that can't be checked here**
- Audio levels, the real microphone and touch feel need the phone. Say so and ask Sammy to try it, rather than claiming it works.
