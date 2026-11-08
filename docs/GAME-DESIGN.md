# Game design

How Say It! Words is put together as a game. The code that implements each part is named in brackets.

## Who it's for

Two Hebrew-speaking children aged 4 and 5 who can't read. Every interaction works through pictures, sound and voice. Hebrew help is spoken; the only text a child sees is the English word under its picture.

## The map (`screens/map.js`, `data/lands.js`, `data/stages.js`)

- One long vertical trail, easy at the bottom, hard at the top, through six lands, one per word group:

| Land | Group | Subcategories |
| --- | --- | --- |
| Animal Jungle | animals | farm, pets, wild, birds, sea, bugs, dinos |
| Yummy Town | food | fruits, veg, meals, sweets, drinks |
| Me and Friends | people | family, body, feelings, clothes, accessories, actions, jobs |
| Toy House | things | home, kitchen, toys, school |
| Adventure Road | outside | vehicles, places, nature, weather |
| Learning Castle | learning | colours, numbers, shapes |

- Each land is a felt/clay diorama photo with the trail drawn into it (`path` in `lands.js`). A land with more stones than one photo holds repeats its photo, mirrored, above itself (17 photos in all).
- **Stones** (135 in all) are placed along the trail so no two are closer than 0.22 picture widths in a straight line, and a land's stones are shared evenly over its photos.
- Kinds of stone:
  - **Word stone**: 4–7 words of one subcategory and tier (small leftovers of several subcategories share one mixed stone). Shows the picture of its first word.
  - **Treasure chest** (18): after each tier of a land that has at least three stones; a review round of the words met so far in that land.
  - **Party stone**: the end of each land; a review of all its words, with the party jingle.
- **World stickers** (a zebra, a fruit stall, a sailboat…) appear in a land at 30% and 65% done.
- The glowing stone, with Pipo beside it, is what Play starts. Any open stone can be tapped. A locked stone wiggles and makes a soft sound. A floating Pipo button scrolls back to the glowing stone when it's off screen.

## Difficulty and unlocking (`services/store.js`)

- Every word has a tier 1–5: Seed, Sprout, Explorer, Doer, Talker. Tiers come from how hard a word is for a Hebrew-speaking 4-year-old: can it be pictured, how early English children learn it, sounds Hebrew lacks, look-alikes, and a bonus for words Hebrew already uses (banana, pizza, giraffe). Tier 1 also holds the first words children learn in any language (early-vocabulary research): family, basic body parts, the first colours, one to five, happy/sad, eat/drink/sleep. Most actions and feelings are tier 2; rare animals and dinosaurs tier 4.
- **Only the first land is free:** later lands need a parent unlock code (parent area), which opens all lands for every child on the phone. Until then they stay locked whatever the progress; a child tapping there hears in Hebrew to ask a parent. Codes are checked by `/api/unlock` (HMAC with `UNLOCK_SECRET`); each code opens at most **two devices**, recorded as random device ids in Netlify Blobs (`unlocks`). The unlock stays on the phone: transfers and backups don't carry it, a new phone enters the code. `npm run codes N` makes codes.
- **One land at a time:** the first land is open from the start. A land opens once 40% of the easy (tier 1–2) word stones of the land below are done, or once the child has already played in it (so older progress never relocks).
- **Inside a land:** tier 1 is open; a tier opens once 70% of the tier below is done. Every stone in an open tier can be played.
- A chest opens when every word stone of its tier is done; the party stone when 70% of the land is done.
- **Done means remembered:** a word stone is *met* once all its words were shown, and *done* once every word was answered right (first try, Listen & tap) on two different days. The stone's progress bar fills half for meeting, half for remembering. Chests and parties are done after one round.
- Next stone (Play) follows the trail, so the glow and Pipo don't hop around the map between sessions: the lowest open stone with something new (words not met yet, or a chest/party not played); then the lowest open stone not done that has words due for review; once everything open is done, the open stone with the most words due (this can be in an earlier land); then the lowest open stone not done.
- Parents can switch on "unlock all" (only on an unlocked phone; it never opens a land that isn't paid for).

## A round (`round/round.js`, `round/steps/`)

3–5 minutes: **Meet** new words → **What's this?** → **Listen & tap** → **Say it** → a bonus game (**Pop the bubbles** or **Memory match**) → **Well done** with stars and a sticker.

- Up to 3 new words per round, then words due for review, at most 6 words. A word stone reviews its own words first, then words of the **same land** only, so a round keeps to the place the child chose (no cow in a fruit stone). Chests and party stones review their land and then the lands below; that is where older lands come back.
- Finishing the whole map takes about 230–300 rounds, 15–20 hours of play: about 5 months at 2 rounds a day, 7–8 months at one (simulated with the real store rules).
- Listen & tap shows 2 pictures in tier 1, 3 in tier 2, 4 from tier 3 (one fewer the first time a word is asked); a word back for review gets at least 3, so a lucky tap is less likely. Look-alike pairs (puppy/dog, lemon/lime; list in `stages.js`) never meet below tier 3; from tier 3 one may be the wrong answer on purpose.
- **Say it**: on Android Chrome speech recognition checks the word and gives a bonus star. Otherwise, and after one unheard try, **Echo** records the child, plays their voice back, then the model word. Every real attempt earns a star. Used for the new words of the round.
- **What's this?** (same screen as Say it, `whats` step): for words met in earlier rounds, before the round says them again. The word is hidden behind a "?", Pipo asks "מה זה?", and the child names the picture from memory (free recall). The word shows and is said after the try, or when the child taps the speaker; the Hebrew button says the Hebrew word as a hint and keeps the English hidden. One per round with new words, up to three in a review round. Say it and What's this? together are at most three per round.

## Learning model (`services/store.js`)

- Spaced repetition per child and word: a level that goes up with right answers and down with misses. A miss brings the word back in the same round and in later rounds. A word counts as learned at level 3 (crown on the stone). Separately, each word counts the days it was answered right; two days make it *remembered*, which is what finishes a stone. Only Listen & tap answers count.

## Rewards (`services/shop.js`, `screens/garden.js`, `data/outfits.js`)

- **Stars** for every attempt. Lifetime stars never go down; spending only lowers the purse shown in the star counter.
- **Sticker book**: one sticker per finished round; tapping it says the word.
- **Garden**: kids adopt animals with stars (5 each). An animal is for sale once its English word was answered right. The shelf shows all 108 animals: buyable first, then met, then the rest as shadows. Adopted animals live in the garden, bob, and say their name when tapped. (A bigger, swipeable, animated garden with habitat zones is planned.)
- **Outfits for Pipo** (20): one item per slot (head, face, neck, back), worn together. Six are tied to a land and appear for sale once that land opens. Prices 6–10, with three big ones (20/25/30) to save up for.
- Prices are rows of stars, never numbers; prices over 10 use big stars worth five. Buying always goes through a confirm sheet with a big tick. Nothing bought is ever lost, and nothing can be bought with real money.

## Sound (`services/sound.js`)

- Word recordings: Wiktionary/Lingua Libre speakers from Wikimedia Commons; the device voice for the few without one. Hebrew uses the device's Hebrew voice. Planned: recorded Hebrew clips (word translations and Pipo's lines) in one ElevenLabs voice, "Zina", so Hebrew sounds the same on every phone and works without a device Hebrew voice.
- Soundtrack: a main theme, one loop per land (on the map, the land in the middle of the screen), bonus games, garden, and a party jingle.
- Music ducks to a whisper under any spoken word and goes silent while the child records. The mic is locked while the app is talking.

## Mascot

Pipo, an original chameleon (`ui/mascot.js`), drawn as SVG with four moods (idle, happy, listen, oops). Kept as the single main character and the game's signature; variety comes from outfits and the garden animals.

## Parent area (`parent/`)

- Gate: type three numbers written as Hebrew words.
- Words learned and to practise, time played, profiles, settings (sounds, music, Hebrew help, speaking mode, unlock all), microphone help, transfer to another phone (one-time 6-character code, 15 minutes) and backup file, credits. Hebrew, right to left.

## Offline and updates (`sw.js`, `pwa.js`)

- Installed as a PWA; opens straight from the phone. Pictures, recordings and music download in the background for offline play.
- Checks for a new version when the app opens or comes back to the screen, and reloads into it on the map, never mid-round or in the parent area.
