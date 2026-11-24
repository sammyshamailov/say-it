# Roadmap: everything not done yet

Everything still open: work that's half done, suggestions from the reviews and councils that weren't built, checks only a phone can do, and decisions waiting on Sammy. Where each idea came from and why is in `docs/DECISIONS.md`.

**Keeping it current:** when an item is built, delete it here and describe it in `docs/CHANGELOG.md`. When a review, council or chat suggests something that isn't built in the same session, add it here with its source. A session should never end with a plan that lives only in the chat.

Last full check against the code: 2026-11-23, live version 2.14.5 (voice rows updated for 2.15.1).

Sources are shortened: **C1** = council of 2026-11-04 (pace, mini games, word order), **C2** = council of 2026-11-08 ("the game feels random"), **R** = full review of 2026-11-14 (24 points), **S** = Sammy asked for it, **V** = voice and pricing research of 2026-11-08.

## 1. Waiting on Sammy (nothing can move without him)

| Item | What's needed | Source |
| --- | --- | --- |
| Listen to Dalit's Hebrew (2.15.1) | All Hebrew was recorded again in Dalit's voice. A sample, `dalit-listen.m4a`, sent 2026-11-24: Pipo's lines (does she say Pipo, not Fipo?), בואי/בוא, and the short words sent with vowel marks. A wrong one: tell Claude the word (`SPELL`/`SPELL_IN` and `--redo`). About 1,400 credits are left until 8 December. | S, 2026-11-24 |
| Listen to new voice clips | **The 2.15.0 clips** (57 new words, English then Hebrew, and Pipo's sleep and treasure lines): one file, `new-words-listen.m4a`, sent 2026-11-24. The Hebrew half was replaced by Dalit (row above); still to hear: the English. Most at risk: very short English words read alone (I, in, on, up, no, go, he, we) and the Hebrew sent with vowel marks (את, על, לנשק, לשבת, מלא, ריק). Also still never confirmed by ear: Sarah's two-way words (dove, read, wind). The key can't run speech-to-text, so every clip needs a human listen. A wrong one: tell Claude the word; it is fixed with `SPELL` in `tools/voice/build.mjs` and `--redo`. | V, 2.15.0 |
| ElevenLabs commercial use | Confirm in the ElevenLabs account (Subscription) that the plan allows commercial use, and send support the two-line question: "May I include audio generated on a paid plan as fixed files in a children's learning app I sell?" Keep the invoice that shows the clips were made while subscribed. | V |
| Dalit is a library voice | The 2026-11-08 research advised ElevenLabs' own (premade) voices, because Voice Library voices belong to whoever shared them and can be removed. Dalit (like Zina before her) is a library voice, Sarah is premade. Ask ElevenLabs support whether Dalit's clips stay usable commercially if she is removed, or pick a premade Hebrew voice before selling. | V |
| Rotate `UNLOCK_SECRET` before selling | The current secret was pasted in plain text in the 2026-11-08 chat. Anyone with it can make codes. Set a new one in Netlify, make new codes with `npm run codes N` and give the family a new code the same day (old codes stop working). Never put the secret in the repo or the docs. | 2026-11-23 read of past sessions |
| ElevenLabs key expires | The restricted key made on 2026-11-08 was set to expire after 30 days (about 2026-12-08). If it is the key saved in the `say-it` cloud environment, voice recording stops working then: make a new key and save it there as a network secret. | 2026-11-08 |
| Unlock slot lost when browser data is cleared | Each phone makes a random device id in localStorage. Clearing site data makes a new id, which uses up the code's second slot. Decide: allow a third device, or let slots free up (for example after 30 days). | R |
| Phone and iPad checks | See section 8. | |

## 2. Words and lines

The 57 everyday words and two of Pipo's three missing lines shipped in 2.15.0. Still open:
- **Sammy listens to the new clips** (section 1).
- **Look at the new pictures at stone size on the phone**, especially the pairs (big/small, in/on/under, he/she, hello/bye) and give/catch.
- **More everyday words** if the kids need them: want, my, here, there, again, all done (none has a picture or a prompt yet).

## 3. Learning

| Item | Notes | Source |
| --- | --- | --- |
| A first stone that mixes the first words | Family, colours and one to five at the very start of the trail, instead of only animals. Moving Learning Castle to second (2.14.0) helps, but it's behind the unlock code, so free players still get no colours, numbers or mom/dad. | C1, R ("the free land is 113 animals and none of the words parents value most") |
| One adaptation rule | A word missed 3 or more times comes back sooner and its sound plays twice. | C2 |
| Phrases from known words | "A red apple", "two cats": the next level after single words. Needs recordings (cheap with the voice tool). | R |
| Second pictures | One picture per word teaches one example. Children taught with varied examples carry a word over to new ones (Perry et al. 2010). A second picture for common words. | R |
| Measure speaking | Say it and "What's this?" record but nothing checks the word. A parent button ("said it to me on their own") or a dated voice diary would show real speaking. | C1, C2 |
| Test with the real kids | A week after a stretch of play, show each child 20 pictures and write down which words they say without help. Also watch both kids play a few rounds before building big features: "feels random" was the adult's view. | C1, C2 |
| Ages 4 and 5 differ | One template may not suit both (attention span, speech). The daily-rounds setting is for the whole phone, not per child. | C1, C2 |

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
