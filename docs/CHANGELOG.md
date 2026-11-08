# Changelog

Newest first. Dates are when the version went live. Versions before 2.0 were a single `index.html` uploaded to Netlify by hand and have no git history; they are reconstructed from the conversations.

## 2.8.1 (2026-11-08): rounds keep to the land the child chose
From a review of why the game "felt random".
- A word stone's round reviews words of its own land only. Before, review words came from any open stone on the map, so the fruit stone could bring a cow and a colour. Chests and party stones review their land and the lands below, which is where older lands come back.
- Play and the glowing stone follow the trail: once every open stone was met, Play goes to the lowest unfinished stone with words due, not the stone with the most due anywhere, so Pipo no longer jumps around the map between sessions.
- Answer order, wrong-answer pictures and the sticker stay random on purpose (a child can't learn where the right picture sits).
- Simulated with the real rules: the whole map takes about 230–300 rounds (15–20 hours): ~5 months at 2 rounds a day.

## 2.8.0 (2026-11-04): remembered, not just seen; first words first; "What's this?"
From a review of the code against research on how 4–5-year-olds learn words (spaced exposures across days, retrieval practice, early-vocabulary studies). Progress from earlier versions is not carried over exactly: word stones count again from the words' answers (the game hasn't gone to other families yet).
- **A word stone is done once every word was answered right on two different days** (first try, in Listen & tap). Before, a stone was done once each word had been shown once, so a child could clear the trail without remembering anything. "Met" (every word shown) is kept separately; the stone's progress bar fills half for meeting the words and half for remembering them.
- Play goes to the lowest open stone with new words; when everything open was met, to the stone with the most words due for review.
- Listen & tap shows at least 3 pictures when a word comes back for review, so a lucky tap is less likely (2 the very first time in tier 1, as before).
- **A land opens once 40% of the easy (tier 1–2) stones of the land below are done** (was 70% of all its stones): Yummy Town after about 6 stones instead of most of Animal Jungle, rare animals included.
- **Word order:** first words moved to tier 1: girl, grandma, grandpa, ear, mouth, foot, head, yellow, four, five, happy, sad, eat, drink, sleep. Most actions and feelings to tier 2 (run, walk, swim, dance, sing, clap, cry, laugh, angry, scared, sleepy, love, yummy), the rest to tier 3. Hyena, raccoon, triceratops and stegosaurus up to tier 4. Stones are rebuilt from the new tiers (135 stones, 18 chests).
- **New step "What's this?"**: for words met in earlier rounds, the picture shows with a "?" instead of the word, Pipo asks "מה זה?", and the child names it from memory. The word appears and is said after the try, or when the child taps the speaker. The Hebrew button says the Hebrew word as a hint and keeps the English hidden. A round with new words has one; a review round up to three, in place of Say it.

## 2.7.1 (2026-11-04): shop tiles all the same size
- Shop tiles have a fixed slot for the picture and one for the price, so every tile is the same height. Tiles with no price (shadows, owned items) centre their picture.

## 2.7.0 (2026-11-03): 12 new outfits, worn together by slot
- 20 outfits in all. New: safari hat, chef hat, heart glasses, propeller cap, pirate hat, graduation cap (one per land, for sale once that land opens), bow tie, glasses, antennae, and three to save up for: cape (20), fairy wings (25), royal crown (30).
- Pipo wears one item per slot (head, face, neck, back) at the same time. Tapping a worn item takes it off. Back items are drawn behind the mascot. Old saves with a single hat keep working.
- Prices over 10 stars show big stars worth five each.

## 2.6.2 (2026-11-03): even stones, full selection ring, all animals in the shop
- A land's stones are shared evenly over its photo copies (the last photo of Yummy Town had 4 of 25 before).
- The yellow "chosen" ring wraps the whole button including its 3D lip, and the shelf no longer clips it.
- The animal shelf shows every animal not owned yet (108 in all): buyable ones first, then met ones, then the rest as shadows to collect.

## 2.6.1 (2026-11-03): map fixes and one land at a time
- Tapping a locked stone shakes it in place; before, it jumped half a stone up and sideways.
- Stones are at least 0.22 picture widths apart in a straight line, so bends in the trail no longer stack stones on top of each other. Lands add a photo copy when they need more room (12 → 17 photos).
- Progression follows the trail: the first land is open, a land opens once 70% of the land below is done (or once the child has played in it). Tiers open per land. Play always starts the lowest open stone.

## 2.6.0 (2026-11-03): a real soundtrack
- Ten Suno tracks replace the generated beeps: main theme, one per land, bonus games, garden, and a party jingle.
- `tools/music/build.py` levels them to −16 LUFS, cuts the fade-out, and adds a beat-matched crossfade at the loop point. AAC/M4A, about 1 MB each.
- Map music follows the land in the middle of the screen; tracks crossfade and resume where they left off. Music ducks under words and stops while recording.
- Music is on by default (switched on once for every phone).

## 2.5.1 (2026-11-02): parent area taps
- The map's new `.panel` styles (no pointer events, sand bands) had also hit the parent area's `.panel` cards, so nothing there reacted to taps. The map now uses `.land-panel`.

## 2.5.0 (2026-11-02): big map, tiers and 158 new words
- One long trail through six felt/clay diorama photos (Animal Jungle, Yummy Town, Me and Friends, Toy House, Adventure Road, Learning Castle), about 130 stones, treasure chests (review rounds), a party stone per land, world stickers that appear as a land is played, the mascot beside the glowing next stone.
- Every word has a tier 1–5 (Seed, Sprout, Explorer, Doer, Talker). Listen & tap shows 2/3/4 pictures by tier; look-alike pairs never meet below tier 3.
- 158 new words from 20 new picture sheets (484 in all), new groups Dinosaurs and Accessories. Tiger's Hebrew is now טיגריס.
- Old saves keep their progress. The separate land screen is gone.

## 2.4.0 (2026-11-02): components and faster launch
- ES modules instead of global scripts (still no build step): `core/`, `data/`, `services/`, `ui/`, `screens/`, `round/` with one module per step, `parent/`.
- The service worker opens the app without waiting for the network; modules are preloaded; picture and recording downloads wait until idle.
- `tools/release.mjs` stamps the version and file lists; tests check them.
- Fixes: escaping names and restored data, back button during the mic prompt, pop-game taps after the last word, freed voice recordings, gate taps.

## 2.3.0 (2026-11-01): illustrations replace emoji
- Every word has its own illustration, cut from 29 generated sprite sheets in one strict style (animals in side profile facing left, people facing front, food from front-above). Feelings and actions come in a boy and a girl version that follow the player's profile.
- Source sheets, full-size cut-outs, prompts and `tools/pictures/build.py` are in the repo. Pictures are cached for offline play.

## 2.2.1 (2026-10-27): the installed app updates itself
- Opens the newest version from the network first (saved copy after 3 s or offline), checks for updates whenever the app comes back to the screen, and reloads at a calm moment (never mid-round or in the parent area).

## 2.2.0 (2026-10-27): garden and star shop
- Kids spend stars to adopt animals whose English word they've answered correctly; adopted animals live in the garden and say their name when tapped.
- Mascot hats move into the shop (6–10 stars) instead of unlocking on their own; earlier unlocks are kept.
- Prices are rows of star icons. Lifetime stars never go down; only the purse does.

## 2.1.1 (2026-10-27): mic and music
- The mic button is locked while the app is speaking, so the app no longer records itself.
- Background music fades under any spoken word and while the child records.
- A sound cut off by a new one finishes at once (before it could hold things up for 8 s).

## 2.1.0 (2026-10-27): transfer codes, safer parent gate
- Move progress to another phone with a one-time 6-character code (Netlify Function + Blobs, 15 minutes), plus a backup-file fallback.
- Parent gate: three numbers written as Hebrew words (replacing a 3-second hold a child could do).
- Content-Security-Policy header; app files moved to `public/`.
- Fixes: a distractor could be the same word as the target (orange fruit / orange colour); a child speaking right after tapping was treated as noise; save at once when the app is hidden.
- First tests (`npm test`).

## 2.0 (2026-10-26): game rebuild ("Toy Box Bright")
- Rebuilt as a game for non-readers: six-land map, Pipo the chameleon mascot with outfits, spaced repetition, rounds of Meet → Listen & tap → Say it → bonus game (Pop the bubbles, Memory match) → Well done, sticker book, parent area behind a gate, offline PWA, migration from version 1.
- "Say it" uses Echo (record the child, play it back, then the model word) because speech recognition is blocked in iPhone home-screen apps and unreliable for young voices; recognition is a bonus on Android Chrome.
- Word recordings from Wikimedia Commons (322 of 324 words), after dictionaryapi.dev's audio host started returning 502s.
- Repo linked to Netlify for auto-deploy; the "Powered by Netlify" badge removed (it covered buttons).

## 1.x (2026-10-22): first version, one HTML file
- Picture categories (emoji); tap a picture to hear the word, say it and get feedback (Web Speech API with forgiving matching).
- Slower speech, a turtle button for extra-slow playback; human recordings from Wiktionary instead of device text-to-speech.
- Two child profiles ("Who's playing?") with avatars, names and separate stars; 252 then 323 words in 6 groups and 28 subcategories.
- Hebrew: translation under each word, a Hebrew button, gendered Hebrew feedback per child.
- Deployed by dragging `index.html` onto Netlify's Deploys page.
