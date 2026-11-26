# Roadmap: everything not done yet

Everything still open: work that's half done, suggestions from the reviews and councils that weren't built, checks only a phone can do, and decisions waiting on Sammy. Where each idea came from and why is in `docs/DECISIONS.md`.

**Keeping it current:** when an item is built, delete it here and describe it in `docs/CHANGELOG.md`. When a review, council or chat suggests something that isn't built in the same session, add it here with its source. A session should never end with a plan that lives only in the chat.

Last full check against the code: 2026-11-23, live version 2.14.5 (voice rows updated for 2.15.1; section 3 replanned 2026-11-26).

Sources are shortened: **C1** = council of 2026-11-04 (pace, mini games, word order), **C2** = council of 2026-11-08 ("the game feels random"), **R** = full review of 2026-11-14 (24 points), **S** = Sammy asked for it, **V** = voice and pricing research of 2026-11-08.

## 1. Waiting on Sammy (nothing can move without him)

| Item | What's needed | Source |
| --- | --- | --- |
| Listen to the English clips | Sent 2026-11-25 as the artifact "Sarah's English Lines": the 56 words and two Pipo lines new in 2.15.0 first, then dove, read and wind (never confirmed by ear), then all 560 English clips by land, with flags to copy back. Most at risk: the very short words said alone (I, in, on, up, no, go, he, we). A wrong one: a respelling in `SPELL.en`, or `{ say, before }` with sentence context (see LESSONS-LEARNED), then `--redo`; offer a few takes side by side. | V, 2.15.0 |
| ElevenLabs commercial use | Confirm in the ElevenLabs account (Subscription) that the plan allows commercial use, and send support the two-line question: "May I include audio generated on a paid plan as fixed files in a children's learning app I sell?" Keep the invoice that shows the clips were made while subscribed. | V |
| Dalit is a library voice | The 2026-11-08 research advised ElevenLabs' own (premade) voices, because Voice Library voices belong to whoever shared them and can be removed. Dalit (like Zina before her) is a library voice, Sarah is premade. Ask ElevenLabs support whether Dalit's clips stay usable commercially if she is removed, or pick a premade Hebrew voice before selling. | V |
| Rotate `UNLOCK_SECRET` before selling | The current secret was pasted in plain text in the 2026-11-08 chat. Anyone with it can make codes. Set a new one in Netlify, make new codes with `npm run codes N` and give the family a new code the same day (old codes stop working). Never put the secret in the repo or the docs. | 2026-11-23 read of past sessions |
| ElevenLabs key expires | The restricted key made on 2026-11-08 was set to expire after 30 days (about 2026-12-08). If it is the key saved in the `say-it` cloud environment, voice recording stops working then: make a new key and save it there as a network secret. | 2026-11-08 |
| Unlock slot lost when browser data is cleared | Each phone makes a random device id in localStorage. Clearing site data makes a new id, which uses up the code's second slot. Decide: allow a third device, or let slots free up (for example after 30 days). | R |
| Go-ahead for the Learning plan | Section 3 is planned (choices and council of 2026-11-26) but not started: Sammy asked only to put it in the roadmap. | 2026-11-26 |
| Three pictures for the Learning plan | The home picture under the jungle, numbers drawn as fingers, and later colour phrases and second pictures (section 3). Claude writes the ChatGPT prompts; Sammy makes the images. | 2026-11-26 |
| Phone and iPad checks | See section 8. | |

## 2. Words and lines

The 57 everyday words and two of Pipo's three missing lines shipped in 2.15.0. Still open:
- **Sammy listens to the new clips** (section 1).
- **Look at the new pictures at stone size on the phone**, especially the pairs (big/small, in/on/under, he/she, hello/bye) and give/catch.
- **More everyday words** if the kids need them: want, my, here, there, again, all done (none has a picture or a prompt yet).

## 3. Learning

Planned on 2026-11-26 with Sammy's choices and a council (full reasoning in `docs/DECISIONS.md`). **Waiting for Sammy's go-ahead to build.** Source **L** = that plan, **LC** = its council. Build in this order; 1–5 need no new art.

| # | Item | What to build | Source |
| --- | --- | --- | --- |
| 1 | **Wrong-picture rule, and a stricter "remembered"** (build first) | Give every word a kind (family, greeting, body, feeling, colour, number, animal, …; mostly its subcategory). In Listen & tap (`choices()` in `steps/tap.js`): until a word has been answered right once, its wrong pictures are other kinds of words (red next to mom and a cow); after that at least one wrong picture is the same kind (red among blue and a cow). A first-try right answer counts as a day towards "remembered" (`mark()` in `store.js`) only when a same-kind picture was among the wrong ones, or when no other word of that kind has been met yet. Wrong pictures may come from every word met, not only the word's home land. Applies to all stones; some animal stones will take a little longer to finish. Tests in `store.test.js`/`app.test.js`. | LC |
| 2 | **Starter stones by topic** at the bottom of Animal Jungle (free) | In this order: **Family & hello** (mom, dad, baby, hello, bye; first round mom, dad, hello), then the **first animal stone unchanged** (cow, pig, horse, duck, pony), then **My face** (eye, nose, mouth, happy, sad), then **Colours** (red, blue, yellow; three words on purpose), then the rest of the animals. No numbers until item 7. Add happy/sad to the look-alike list (hello/bye already is). The words stay in their own lands too (one progress record each, so they count as met there and some paid stones open partly done). Built in `stages.js` (new stone ids, tier 1 of land 0; chest and party keys include them); check the map layout, the 40% land gate and `nextStage()`. Removes the review's "the free land is 113 animals" (R, C1). Old saves: Sammy's kids get starter stones under stones they've already played; Play goes back down to them. | LC, S, R, C1 |
| 3 | **One adaptation rule** | A word missed 3 or more times (and not yet remembered) comes back sooner (shorter wait in `DUE`, first in `dueKeys()`) and its sound plays twice in Listen & tap. | C2 |
| 4 | **Parent word check** (measures speaking; is also the real-kid test) | In the parent area: the parent hands the phone to the child; about 20 pictures of words met (remembered ones first, none from today); the child names each, the parent taps ✓ said / ✗ not (Hebrew UI). Saved per word with the date; the dashboard shows "says on their own: N words" and the last check. Sammy chose this over a per-word "said it" button. | S, C1, C2 |
| 5 | **Rounds a day and round size per child** | Move "rounds a day before Pipo rests" from the phone's settings to each child's profile (fallback: the phone setting, so old saves keep working), and add "short rounds" per child: at most 4 words, 2 new instead of 3. In the child's profile form. | S, C1, C2 |
| 6 | **"Already knows" line** | In the parent area: "Already knows: mom, dad, red…" (remembered words). The council's way to show a parent the value of the free land. | LC |
| 7 | **Numbers a child can see** | Numbers are drawn as digits ("1", "2", "3"): naming a digit is reading. Redraw one to five (later ten) as a hand holding up fingers, felt style. Claude writes the prompt, Sammy makes the sheet, `tools/pictures/build.py` cuts it. Then one, two, three can join the starter stones. | LC |
| 8 | **Number phrases** ("two cats") | Sammy chose these first: a new step that shows a known picture 1–5 times; the child hears "two cats" and taps the right count among two or three. Recordings of each phrase with Sarah (plurals, including sheep, mice, geese; a curated list of well-known nouns), Hebrew help lines with Dalit. Needs item 7 (or counts that need no digit) and a rule for when a word is ready for phrases (remembered). | S, R |
| 9 | **Home picture at the bottom of the trail** | A felt/clay diorama of Pipo's home with a little farmyard (family room, a mirror for "my face", a paint corner for colours, a fence with a cow and a pony), under the jungle, holding the starter stones. Still part of the free first land: map code needs a land whose first photo is different (`lands.js`, `screens/map.js`), with its own trail path. Claude writes the prompt. Until it exists the starter stones sit on the jungle photo. | LC, 2026-11-26 |
| 10 | **Colour phrases** ("a red apple") | Need new pictures of things in several colours (a tinted picture looks wrong). Prompts from Claude, art by Sammy. | S, R |
| 11 | **Second pictures** | One picture per word teaches one example; children taught with varied examples carry a word over to new ones (Perry et al. 2010). A second picture for common words, used on review. Prompts from Claude, art by Sammy, then a word may list several pictures. | R |
| 12 | **Watch "What's this?" on the starter words** | On the phone: do the kids name hello, bye, happy and sad, or say "face"/"hand"? If they stall, leave greetings and feelings out of "What's this?" and keep Listen & tap and Say it for them. Do they answer in Hebrew ("Ima")? | LC |
| 13 | **Test with the real kids** | A week after a stretch of play, the word check (item 4) on each child. Also watch both kids play a few rounds before building big features: "feels random" was the adult's view. | C1, C2 |

Not planned: more lands or themes (advice of 2026-11-26: content isn't what's missing; see DECISIONS), parent-recorded voices and WhatsApp sharing (council: scope creep).

## 4. Play and rewards

| Item | Notes | Source |
| --- | --- | --- |
| More round types | Every round is the same steps for about 250 rounds, the biggest risk of the kids dropping off. Feed Pipo and the chest were added (2.14.0); one or two more are still suggested. | R |
| "Simon says" | An action game for verbs (jump, touch your nose); the parent taps a thumbs-up when the child acts it out. Fits once the action words of NEW-WORDS are in. | C1 |
| Animal sounds game in Animal Jungle | The one land-specific game C2 thought worth trying, only after watching whether the kids ask for more. | C2 |
| Rewards run dry | A child earns about 2,400 stars over the map (the review's simulation); the whole shop costs 861 (animals 654, outfits 207, counted 2026-11-23 after the tiered animal prices of 2.14.0). More to spend on (outfits, garden items) or fewer stars. | R |
| A garden for every land | Today the garden holds animals only. A bigger, swipeable, animated garden with habitat zones, and things to adopt from the other lands. Needs art. | R, GAME-DESIGN |
| Land songs | One short Suno song per land that sings its words, unlocked at the land's party stone. Suno's paid plan covers commercial use. | V |

## 5. Parents

| Item | Notes | Source |
| --- | --- | --- |
| "Knows for sure" count | The parent area counts "learned" (level 3), which lucky taps can reach. Show "remembered on two days" per land instead ("Animals: 12 of 108") and rename "learned" to "getting there". Say in the changelog why the numbers drop. | C2 |
| A small log of every round | One small entry per round (date, stone, words, right/wrong), capped in size, so a weekly line or trend can be shown later. Nothing is recorded over time now. | C2 |
| Parents listen to recordings later | Keep the last ten or so recordings on the phone. The parent listens in the parent area and taps a thumbs-up; next time Pipo says something like "Dad heard your words!" with a bonus. No one has to sit next to the child. Recordings never leave the phone. | R, C1 (consent and privacy to think through) |
| Feedback button | Needs an address to send to (Sammy). | R |
| Record the child's name | A name can't be recorded ahead of time, so Pipo says only "היי!". A button in the child's profile where the parent says the name once. | V |
| One code instead of two | On an unlocked phone, a transfer code could also unlock the new phone (counting as one of the two devices), so a family handles the unlock code only once. Offered on 2026-11-08, not answered. | 2026-11-08 |
| Wrong child playing | Two non-readers can pick each other's profile and mix their progress. | C2 |

## 6. Selling (the product side)

| Item | Notes | Source |
| --- | --- | --- |
| Price | First land free for every child on the phone, then one payment (about 79₪) opens everything for the family. Monthly was ruled out: the content runs out, subscriptions need accounts and online checks. Test 59/79/99 with real families. | 2026-11-08 pricing answer |
| Validate before building payments | Ask about 10 families to pay by Bit for a code. Whether they actually pay is the price signal. | 2026-11-08 |
| Payment flow (when ready) | "Buy" in the parent area opens the provider's own checkout; the provider calls a new function (`/api/purchase`) with a signed "paid" notice; the function derives the code from the payment id (same format, same secret, same two-device limit); the app unlocks itself on return and the code also goes out in the receipt. Needs a provider that takes Israeli cards and Bit and issues the receipt (Grow/Meshulam, Cardcom, PayPlus; or Paddle / Lemon Squeezy as seller of record), and at least an עוסק פטור. About one evening of work after that. | 2026-11-08 |
| Sending it to other families | From then on old saves must keep working (see CLAUDE.md). Until then (Sammy, 2026-11-04) stone regrouping and resets are allowed. | CLAUDE.md |

## 7. Design and code

| Item | Notes | Source |
| --- | --- | --- |
| Full design pass, screen by screen | The review's design section was the thinnest and done at one phone size. 2.13.0 and 2.14.1 fixed tablets and phones on their side, but no complete pass of every screen at every size has been done. | R |
| Blurred land photo performance | The blurred photo behind a round ran fine on Sammy's phone; check the kids' phones if they are older. | R |

## 8. Can only be checked on a phone or iPad

Sammy, when you can:
- **Install steps on iPhone/iPad** (2.13.0): never tested.
- **iPad: the page after typing a name** (2.13.0): should go back into place.
- **After a recording** (2.14.2, 2.14.3): the child's voice plays right away, then the word, with no long wait.
- **Feed Pipo and the chest with touch** (2.14.0).
- **The order of sounds** in Feed Pipo (whoosh, pop and chime, the word, the next word).

## 9. Docs to fix

None open (the README was brought up to date on 2026-11-23).
