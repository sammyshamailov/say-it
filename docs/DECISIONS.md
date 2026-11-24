# Decisions, reviews and councils

Why the game is the way it is: the reviews and councils that shaped it, what Sammy decided after each, and where the full conversations are. Newest first. Open work is in `docs/ROADMAP.md`; what shipped is in `docs/CHANGELOG.md`.

**Keeping it current:** whenever a review, a council, research or a question to Sammy leads to a decision (or to "not now"), add it here in the same session: the question, the options, what was chosen, by whom, and why. Put what wasn't built in the roadmap. Chats and the Claude Project's own files can't be read by every later session; this file can.

## 2026-11-24: the Hebrew voice has background noise

- **Sammy:** "come (בואי) sounds awful for girl; overall why does the Hebrew voice have white noise when speaking, English voice is clear."
- **Measured** (no ear here, so numbers): the quietest moment inside a spoken line is about 24 dB below the speech for Zina, 37–41 dB for the library voices Danit, Dalit and Ronit, 50 dB for Sarah. Zina's raw output is also 10–15 dB quieter, so levelling turns her up more than the others. Her saved voice settings have style 1.0 (Sarah 0); style 0 with lower similarity, ffmpeg's FFT and non-local-means noise removal, all moved it by 3 dB at most. ElevenLabs' voice isolator would be the next try, but the key lacks that permission. Conclusion: the noise is in the recording Zina's voice was made from, not in our processing.
- **Options:** (a) keep Zina, record again with style 0 (clean-up barely helps); (b) another Hebrew voice: Dalit and Ronit measured cleanest; Danit was heard before (Zina was preferred); (c) Sammy makes the key able to use the voice isolator and we clean Zina's clips.
- **Asked Sammy to choose by ear** with `hebrew-voices-listen.m4a` (Zina today, Dalit, Ronit, Danit). Whatever he picks, the Hebrew is recorded again with style 0. Waiting (roadmap, section 1).

## 2026-11-24: how the 57 everyday words went in (2.15.0)

Sammy sent the four picture sheets and said "Continue"; these choices were made in the session, following the plan in `docs/NEW-WORDS.md`:
- **Where they live:** opposites, where and who as three new groups in Learning Castle (the land of concepts); the new actions join Actions; yes/no/hello… as a new group, little words, in Me and Friends. Nothing new in the free land, so Animal Jungle is unchanged.
- **Tiers** as planned in NEW-WORDS (yes, no, hello, bye at tier 1; pronouns highest).
- **Pairs:** every opposite and the other look-alikes go in `PAIRS`, so from tier 3 the partner is the wrong answer on purpose.
- **Big/small:** cut at one scale (the small dog stands small) rather than asking Sammy for a new picture.
- **Pipo's "now listen" line was left out.** It was planned (14 Nov) to introduce listen-and-compare after a recording. Since 2.14.3 the child's own voice plays the moment they stop talking, and Sammy had complained about the wait before it; a spoken line first would bring the wait back. The glowing buttons (2.14.2) show what's playing. The sleep and treasure lines were added.
- **"brush"** already existed as a hairbrush (At Home); the new one is brushing teeth (Actions, Hebrew לצחצח שיניים). Words are compared by English, so the two never appear as answers together.

## 2026-11-23: documentation rule

Sammy: every change, plan and piece of work is written into the repo's md files (roadmap, changelog, CLAUDE.md, lessons learned, this file), so each new session has the full context. Until then, the two council verdicts and the 14 Nov review lived only in chat transcripts and in the Claude Project ("English learning app for kids"), and a new session couldn't find them.

## 2026-11-15: Say it always records (2.14.5)

- **Question:** the first "Say it" try (speech recognition) kept no recording, so it looked different from later tries. Keep the word check, or always record?
- **Options:** (a) always record and play back: every try looks the same, hearing themselves beside the word helps pronunciation, recognition is unreliable for 4–5-year-olds; cost: no "כמעט!" for a wrong word, one star per try. (b) keep the check on the first try and show a clear success screen without playback.
- **Sammy chose (a).** Speech recognition and the parent's speaking-mode setting were removed.
- Same day: two speaking turns per round instead of three (Sammy: too much recording compared to the listening games); marking on screen (glowing buttons) instead of a spoken hint after recording, because a hint needs a new recorded line.

## 2026-11-14: full review (Fable session) → 2.13.0, 2.14.0

Sammy asked for a review of everything (gameplay, education, levels, design). The full text, `REVIEW-2026-11-14.md`, and a per-point status table, `STATUS.md`, are in the Claude Project, not the repo. The summary:

- **Fix first:** the first round asked "מה זה?" about an untaught word; Listen & tap could be answered without listening (wrong pictures from all 484 words); a long first day hit a wall with no sign; clearing browser data burns an unlock slot; a miss then a right answer counted as a remembered day. One claim was wrong (the game does ask for persistent storage).
- **Teaching:** colours and numbers opened after about three months; about 430 of 484 words are names of things (no yes, no, hello, big, more, go); no phrases; one picture per word.
- **Gameplay and design:** the same steps for about 250 rounds; rewards run dry (about 2,400 stars earned against a shop costing 772 at the time); rounds and garden look flat next to the map; design checked only at phone size.
- **Parents and product:** the parent area only shows counts; the free land is 113 animals and none of the words parents value most.
- **Keep as is:** "done means remembered on two days" and "What's this?" (retrieval beats re-hearing, Leonard et al. 2019).
- **Recording feedback** (Sammy's question: the game praises anything): keep speaking but stop grading: listen-and-compare, fewer Say it turns, parents can listen later. No real pronunciation scoring (it would send children's voices to a server, and children's speech recognition is weak).
- **iPad:** install guide for parents (no banner over the game), sideways map layout, no scroll bars.

**Sammy:** "Run all fixes, modifications and provide the prompts for the new words." Built in 2.13.0 and 2.14.0 (see the changelog). Not built: the everyday words (need voices and, for 28, pictures; prompts in `docs/NEW-WORDS.md`), phrases, second pictures, a garden for all lands, parents listening to recordings, a feedback button, the unlock-slot decision, Pipo's new lines, a full design pass. All in the roadmap.

## 2026-11-08: Hebrew and English voices (2.10.0, 2.11.0)

- **Why:** the phone's Hebrew voice read without niqqud, guessed vowels and sounded robotic. Sammy wanted professional voices before sending the game to anyone.
- **Options looked at:** ElevenLabs (most natural), Google Chirp 3 HD, Microsoft Hila/Avri, a real person. Suno was ruled out for spoken words (sung, no control per word, hard to cut), but suggested for land songs later.
- **Licence research:** generate on a paid plan (the free plan has no commercial use); clips made while subscribed stay licensed after cancelling; don't use alpha/beta models; prefer ElevenLabs' own voices over Voice Library voices; ask support in writing about shipping clips inside a sold app. The last two are still open (roadmap).
- **Chosen by ear:** Hebrew "Zina – Young & Soulful" (library voice) over Danit, Nimrod and Jessica; English "Sarah" (premade) over Jessica, Emma, Clara and then over the Wikimedia recordings. Sammy: "you should just use Sarah's voice instead of wiki and phone."
- **Setup:** a restricted API key (text to speech, voices read, models read; 20,000 credits; 30 days), a personal `say-it` cloud environment that allows `api.elevenlabs.io`, with the key as a network secret.

## 2026-11-08: unlock codes and price (2.9.0, 2.9.1)

- **Price:** Sammy suggested 15₪ a month. Advice taken: one-time, not monthly (the content runs out after 5–8 months, subscriptions need accounts and online checks, "pay once, both kids, everything" is easier to sell). First land free, then about 79₪ one-time for the family; test 59/79/99; before building payments, ask about 10 families to pay by Bit for a code.
- **Free part:** Sammy first suggested the first land free for one child only. Advice: free for every child on the phone (siblings are the buyers; sharing one profile mixes progress). Sammy: "I want only the first land to be open." Built as first land free for the whole family (2.9.0).
- **Codes:** 10 characters, 5 random plus 5 signed with `UNLOCK_SECRET` (no database, no account). Sammy asked whether one code works on any number of phones: it did; limited to two devices in 2.9.1 (random device ids in Netlify Blobs). Transfers and backups no longer carry the unlock.
- **Future payment flow** sketched (provider checkout, signed notice to `/api/purchase`, code derived from the payment id): see the roadmap.
- **Game length and age:** simulated 230–300 rounds (15–20 hours, 5–8 months at 1–2 rounds a day). Age about 3½ to 7, best at 4–6.

## 2026-11-08: council "the game feels random" → 2.8.1

Sammy felt the game was too random and asked about per-child analysis, a parent view and mini games per pod. Five advisors, peer review, verdict:

- **Not just a feeling.** Rounds filled up with review words from any open stone on the map (tap fruits, get a cow and "red"), and the glowing stone jumped to whichever stone had the most words due. Answer order, wrong pictures and the sticker are harmless randomness (shuffling stops kids memorising positions).
- **Agreed:** the stone is a promise to a non-reader; the parent area shows the wrong number ("learned" = level 3, which lucky taps reach; "remembered on two days" isn't shown); per-child spaced repetition already is the adaptation (an analysis engine on ~200 answers per child would be a story); no mini game per pod (34 games is months of evenings).
- **Clashed:** hide the mixing or badge it ("Cow came back to visit!"); a single honest count per land or a full "Word Passport" behind the paywall. The majority won: no badges for a 4-year-old, start small.
- **Blind spots:** lucky taps; no history of rounds; speaking is never measured; changing what "known" means makes parents' numbers drop.
- **Recommendation, in order:** (1) a stone teaches its own words, review from the same land, cross-land review in chests; the glow stays until the stone is done; (2) a "knows for sure" count per land, "learned" renamed "getting there", a small log per round; (3) one adaptation rule (missed 3+ times: back sooner, sound twice); (4) mini games only after watching the kids.
- **Sammy chose "the same land"** (over "the same stone"). Step 1 built in 2.8.1. Steps 2 and 3 are not built (roadmap).

## 2026-11-04: council on pace, mini games and word order → 2.8.0

Sammy asked whether there should be more stages, more mini games, and a different word order. Five advisors, peer review, verdict:

- **Agreed:** pace isn't the problem: a stone was done once its words were seen once, so the trail could be cleared without remembering anything. Progress should follow remembering (right on two different days). The steps are all one skill (hear a noun, pick the picture); free recall and a movement game are missing. The word order is wrong: mom, eye, red, one, eat, happy came after about 28 rounds of hoopoes and pterodactyls; every feeling and action was tier 4. Keep Hebrew loanwords early.
- **Clashed:** small data change (Executor) or a map rebuild (Contrarian, Expansionist); all peer reviews ranked the small change strongest. Saying the word into Echo isn't proof (the child copies). Paid voice diaries: good parent hook, consent and privacy not covered.
- **Blind spots:** tier changes regroup stones and break old saves; guessing passes a two-picture gate; "come back tomorrow" makes small kids quit unless there's something else to do; Say it showed English text to non-readers; hi/bye/more missing; two kids on one phone; nobody planned a test with the real kids.
- **Recommendation:** new "done" rule (two days), 3+ pictures on review, rewards on review-only days; "What's this?" (free recall) then "Simon says"; first words to tier 1, rare animals up, land gate at about 40% of easy stones; hi/bye/more later; a mixed first stone only after that; test: a week later, 20 pictures per child.
- **The council's first step was to freeze stone ids before changing tiers. Sammy declined:** "the game is currently in building process, I didn't send it to anyone. Don't freeze any stones." Built in 2.8.0: two-day rule, 3+ pictures, tier moves, 40% gate, "What's this?". Not built: Simon says, the mixed first stone, the real-kid test (roadmap).

## Earlier decisions (in the changelog and lessons learned)

- 2.6.1: one land at a time, tiers open per land (Sammy).
- 2.0: Echo (record and play back) instead of speech recognition as the main "Say it" mode, because recognition is blocked in iPhone home-screen apps and weak with young voices.
- Hard limits from the start (CLAUDE.md): PWA only, no ads, no tracking, no accounts, nothing sold for real money inside the game, nothing a child has to read.

## Where the full conversations are

Claude Code sessions linked from the commits (`Claude-Session:` lines). Their transcripts can be listed with the session tools (`list_events`); the Cowork ones can't be reached from every environment.

| Dates | Session | Work |
| --- | --- | --- |
| 2026-11-14 – 15 | `session_01HwnCtcSxYwvNU3G2FXQV2j` "App review and UI feedback" (Cowork, started on Fable) | Full review, NEW-WORDS.md, 2.13.0 – 2.14.5 |
| 2026-11-08 | `session_01HwnCtgSUdmgeNT4eqYSjxV` "Hebrew clips with Zina voice" | 2.10.0 – 2.12.0 |
| 2026-11-08 | `session_01HwnCtdFwYdgzAGN4nbkk9b` | Voice choice notes in CLAUDE.md |
| 2026-11-08 | `session_01HwnCtfyYQHjZCWbk2xTZYz` (Cowork) | Council "too random", 2.8.1, price, 2.9.0 – 2.9.1, voice research, API key |
| 2026-11-04 | `session_01HwnCtgHzuezCnW9qirRjF4` "Kids' learning app review" (Cowork) | Council on pace and word order, 2.8.0 |
| 2026-11-03 – 04 | `session_01HwnCtge49T4CSmnJiQLBUN` | 2.6.1 – 2.7.1, first docs |
| 2026-11-03 | `session_01HwnCtdVeoTHdHNmmHKFiPy` | 2.6.0 soundtrack |
| 2026-11-02 | `session_01HwnCte7Aj7ME5CTo5bQPNZ`, `session_01HwnCtcSifgdU8G3mQqNAoE` | 2.4.0, 2.5.0, 2.5.1 |
| 2026-11-01 | `session_01HwnCtd9jjBjBsKw2CRm7hB` | 2.3.0 pictures |
| 2026-10-27 | `session_01HwnCtdykVJBn3GeAKJok8S` | 2.1.0 – 2.2.1 |
| 2026-10-26 | `session_01P3Fk1wQ9QnXcyyAum9yXRJ` | 2.0 rebuild |
| 2026-11-23 | `session_01HwnCtcNWuDgLqiCpNLzBHu` | Read all history; roadmap and this file |
