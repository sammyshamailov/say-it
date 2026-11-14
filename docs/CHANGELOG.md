# Changelog

Newest first. Dates are when the version went live. Versions before 2.0 were a single `index.html` uploaded to Netlify by hand and have no git history; they are reconstructed from the conversations.

## 2.14.0 (2026-11-14): what the review found
From a full review of the game (`REVIEW-2026-11-14.md` in the Claude project). Sammy asked for all of it; what needs new pictures or recordings is prepared in `docs/NEW-WORDS.md` and not in the game yet. Stone progress isn't reset, but the map changes order (below).

Fixes
- **The first round asked "מה זה?" about a word that was never taught.** A short round was filled up with words of the stone the child hadn't met, and those skipped their Meet card (the first round of the game: cow, pig, horse, then "what's this?" over a duck). A round now holds only new words (with Meet) and words met before; the first round is its three new words.
- **Listen & tap could be answered without listening.** The wrong pictures for a new word came from all 484 words, so the picture Pipo had just shown stood next to one never seen (a horse beside a globe). Wrong pictures are now the other words of the round, then words met in the same land, then the rest of the land. Pop the bubbles uses words the child has met too.
- **A word missed and asked again in the same round** no longer counts that second answer as a day it was remembered (its level still comes back).

Learning
- **Learning Castle is the second land** (was the last): colours, numbers and shapes come right after the first animals instead of after about three months. The order is now Animal Jungle, Learning Castle, Yummy Town, Me and Friends, Toy House, Adventure Road. It is still behind the unlock code: only Animal Jungle is free.
- **Hebrew at the first meeting** for words a picture can't explain (feelings, actions, family, jobs, weather, places, colours, numbers, shapes): English, Hebrew, English again. Other words still say Hebrew only from the עב button.
- **More "What's this?", less "Say it":** a round with new words asks two words from memory (was one) and has the child repeat one new word (was two).
- **Echo no longer says "well done" for any sound.** It can't tell whether the word was right, so it lets the child compare: the word, the child's voice, the word again. The star is for trying. Speech recognition on Android still praises the right word.

Play
- **Pipo goes to sleep.** After the day's rounds (4; parents choose 2, 4, 6 or no limit), or when nothing is new and nothing is due, Pipo sleeps beside the stone, Play shows a moon and the garden glows; the end of the last round leads to the garden instead of "play more". Stones can still be tapped. Before, a long first day reached rounds that couldn't move anything, with no sign. (No spoken line yet; it needs a recording.)
- **New bonus game, Feed Pipo:** Pipo asks for something by its word, the child taps its plate and the picture flies to him. Bonus games now go in turn: bubbles, Feed Pipo, memory.
- **A treasure chest is its own ending:** after its review, the child knocks on the chest three times, it opens and gives 5 stars.
- **The sticker book is an album:** every word of the open lands, land by land: a shadow until the word was answered right, in colour after that, a gold frame once it is remembered. (Before: one random sticker per round, repeats and all. Stickers already collected aren't shown as such any more.)
- **Animals cost more the harder the word:** 5, 6, 8 or 10 stars by tier (were all 5), so there is something to save for.

Looks
- **Rounds are played in their land:** its photo, blurred and dark, lies behind the round instead of flat navy.
- The turtle (slow) button is bigger.

Parents
- **"This week's words"** in the parent area: the words met in the last seven days and three things to do with them at home.
- The daily-rounds setting, with a line on why short daily play beats one long day.

Not in this version: the everyday words (yes, no, big, in, jump…), phrases, second pictures, a garden for all lands, parents listening to recordings, a feedback button (needs an address to send to). A review claim was wrong: the game already asked the browser to keep its storage (`state.js`).

## 2.13.0 (2026-11-14): tablets, an install guide, no scroll bars
From Sammy trying the game on an iPad.
- **The map on a wide screen held sideways** (a tablet, or a phone on its side): the buttons stand in a column beside the map, with Pipo in the middle, so the map gets the whole height. Before, the phone layout was only centred: the map was a strip between two rows of buttons. Upright screens are unchanged. The other screens are still a centred column on a tablet.
- **How to install, for parents.** iPhone and iPad have no install prompt, so nothing ever offered it there. The first-run screen and the parent area now show three steps (the share button, "Add to Home Screen", open it from the home screen) whenever the game runs in a browser tab on iPhone or iPad. They also say that progress made in the browser doesn't follow to the installed game by itself (iPhone and iPad keep the two apart): install before starting, or move it with a transfer code. On Android the install button also shows at first run, as soon as Chrome offers it. Nothing shows once the game is installed.
- **No scroll bars.** The parent area's bar was drawn on the left, over the edge of the cards (the area is right to left). The parent area, shop shelf, sticker book, garden and sheets now scroll without a bar, like the map.
- **The screen stays in place after typing on iPhone and iPad.** After the child's name was typed, the page could stay pushed up, with the top buttons under the browser's bar and an empty band at the bottom. The page is put back when typing ends. Not reproduced off the device: check on the iPad.

## 2.12.0 (2026-11-08): Say it no longer praises the wrong word
- When speech recognition (Android Chrome) hears a different word, Pipo says "כמעט! נסה שוב!" / "כמעט! נסי שוב!" ("Almost! Try again!" with Hebrew help off), plays the word again, and gives no star. Before, any word earned a star and "שמעתי אותך! כל הכבוד!". The next try is Echo, as after a try that wasn't heard, so a child the recognizer keeps mishearing is never stuck. Echo (iPhone, and the try after a miss) still can't tell words apart and praises any real try. Sammy chose this over stricter retries.

## 2.11.1 (2026-11-08): the right Hebrew for boys, the first try records
- A boy heard the girl's form at the end of a round ("כל הכבוד! סיימתְּ!"): the boy and girl lines were spelled the same, so there was one recording, read as the girl form. "סיימת", "אותך" and "אמרת" now have niqqud, and each form has its own recording.
- On Android, a child's first try at saying a word after an earlier Echo recording heard nothing; only the second try worked. The microphone stayed open from the first recording to the end of the round, so speech recognition couldn't use it. Now the microphone is closed right after each recording (with a short pause while Android switches the sound back from "call" mode, which could also swallow the next sound, such as the end-of-round "כל הכבוד").

## 2.11.0 (2026-11-08): all English in one recorded voice
- Everything the app says in English is now one voice, "Sarah" (a premade ElevenLabs voice, American, Eleven v4, a little slower than normal), chosen by Sammy over Jessica, Emma and Clara and then against the old recordings: all 482 words, the six land names, Pipo's English lines (used when Hebrew help is off) and "Ask a grown-up!". Before, words came from many different Wikimedia speakers, and 160 of the 482 words (a third) had no recording and used the phone's voice, as did all the other English. Clips are in `public/audio/en/`, about 6 KB each.
- The Wikimedia recordings are gone (Sammy: Sarah instead of Wikimedia and the phone). Phones delete the saved copies (cache `sayit-audio`), the site no longer allows `upload.wikimedia.org`, and the credit is removed. The device's voice speaks only if a clip can't play (the very first start without internet).
- The turtle button plays Sarah's clip slower (0.65, pitch kept).
- Who's playing: an English name hears Sarah's "Hi!" (a name can't be recorded; before, the device voice said "Hi <name>!").
- `tools/voice/build.mjs` now makes both sets (`--set he`, `--set en`); `npm test` fails while any English or Hebrew line has no clip. Pipo's lines in both languages are in `data/lines.js` (was `he-lines.js`). The parent area's offline line counts the new clips; credits name both voices.

## 2.10.0 (2026-11-08): recorded Hebrew voice
- All Hebrew is now spoken by one recorded voice, "Zina – Young & Soulful" (ElevenLabs, Eleven v4, a little slower than normal), instead of the phone's own Hebrew voice: every word's translation (boy and girl forms), the six land names, and all of Pipo's lines (cheers, "didn't hear you", "what's this?", "ask a parent", the parents'-gate line). 512 clips, about 7 KB each, in `public/audio/he/`.
- Phones without a Hebrew voice now hear Hebrew help too; before they heard nothing (or English feedback). The device voice stays as the fallback for a line without a clip.
- The clips are saved for offline play in the background like the pictures and music (new service-worker cache `sayit-voice`). Music ducks under them and the microphone stays locked while one plays, as with every other voice.
- Who's playing: a child with a Hebrew name is greeted with the recorded "היי!" (a name can't be recorded ahead of time). English names still hear "Hi <name>!".
- New tool `tools/voice/build.mjs` collects every Hebrew line, records only the missing ones, trims silence, levels loudness (−16 LUFS) and writes the manifest `data/he-audio.js`. Pipo's lines moved to `data/lines.js` so the app and the tool share them. `npm test` fails while a Hebrew line has no clip.
- Credits in the parent area name the voice.

## 2.9.1 (2026-11-08): one code, two devices
- An unlock code opens at most two devices. The function keeps, per code, only the random ids the two phones made for themselves (Netlify Blobs, store `unlocks`); entering the code again on the same phone is free, a third phone hears the code was already used on two devices. To give a family a fresh start, delete the code's entry in that store.
- The unlock stays on the phone it was entered on: transfer codes and backups no longer carry it (otherwise a transfer code could open any number of phones), and restoring one keeps the phone's own unlock. A new phone enters the code itself.

## 2.9.0 (2026-11-08): first land free, a parent code opens the rest
- Only Animal Jungle is open without an unlock code. Later lands stay locked whatever the progress, "unlock all" or old saves. A child who taps a stone there sees it wiggle and hears, in Hebrew, to ask a parent to open it.
- New parent-area panel "פתיחת כל המפה": a 10-character code (ABCDE-FGHJK) opens all six lands for every child on the phone. The "unlock all" switch shows only after that.
- Codes are checked by a new Netlify Function (`/api/unlock`): 5 random letters plus 5 signed from them with `UNLOCK_SECRET`, so there's no database and no account. Make codes with `UNLOCK_SECRET=... npm run codes 10`.
- The unlock is saved with the progress, travels with transfer codes and backups, and restoring an older backup doesn't lock the map again.
- How parents buy a code isn't built yet.

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
