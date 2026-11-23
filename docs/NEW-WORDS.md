# New everyday words: what's ready, and the picture prompts

From the review of 14 Nov 2026: about 430 of the 484 words are names of things. This adds the words a child needs to say something: 29 that already have pictures, and 28 that need two new picture sheets. None of them is in the game yet, because every word needs its recorded voice first (see "What each word still needs").

**Who does what:**
- **Sammy:** generates the pictures for part B in ChatGPT image generation (4 images). Claude can't make pictures in the house style.
- **Claude**, in a session in the `say-it` environment: everything else, cutting the sheets, the word lines and the recordings. Part A needs nothing from Sammy except listening to the new clips.

## A. 29 words whose pictures already exist

These were generated and cut for 2.5 and never used (`public/img/words/opp-*`, `pos-*`, `who-*`). They only need voices. Suggested home: Learning Castle, three new subcategories.

| Subcategory | Word | Picture | Hebrew | Tier |
| --- | --- | --- | --- | --- |
| `opposites` (ההפכים) | big | `opp-big` | גדול | 2 |
| | small | `opp-small` | קטן | 2 |
| | up | `opp-up` | למעלה | 2 |
| | down | `opp-down` | למטה | 2 |
| | open | `opp-open` | פתוח | 2 |
| | closed | `opp-closed` | סגור | 2 |
| | day | `opp-day` | יום | 2 |
| | night | `opp-night` | לילה | 2 |
| | fast | `opp-fast` | מהר | 3 |
| | slow | `opp-slow` | לאט | 3 |
| | full | `opp-full` | מלא | 3 |
| | empty | `opp-empty` | ריק | 3 |
| | wet | `opp-wet` | רטוב | 3 |
| | dry | `opp-dry` | יבש | 3 |
| | clean | `opp-clean` | נקי | 3 |
| | dirty | `opp-dirty` | מלוכלך | 3 |
| | long | `opp-long` | ארוך | 3 |
| | short | `opp-short` | קצר | 3 |
| `where` (איפה) | in | `pos-in` | בתוך | 3 |
| | on | `pos-on` | על | 3 |
| | under | `pos-under` | מתחת | 3 |
| | next to | `pos-next-to` | ליד | 4 |
| | behind | `pos-behind` | מאחורי | 4 |
| `who` (מי) | I | `who-i` (boy/girl) | אני | 4 |
| | you | `who-you` (boy/girl) | אתה\|את | 4 |
| | we | `who-we` | אנחנו | 5 |
| | they | `who-they` | הם | 5 |
| | he | `who-he` | הוא | 5 |
| | she | `who-she` | היא | 5 |

Notes for whoever adds them:
- Each pair of opposites, and in/on/under, goes into `PAIRS` in `data/stages.js`: the two never meet below tier 3, and from tier 3 one is the wrong answer on purpose, which is the point of the pair.
- `who-i` and `who-you` come as boy and girl pictures: add `who` to `GENDERED` in `ui/picture.js`.
- Before adding, look at each picture on the phone at stone size: an opposite only works if its picture can't be read as its partner.
- **Big and small come out the same size in the game.** The sheet draws the small dog much smaller, but `tools/pictures/build.py` scales every picture to fill its square, so `opp-big` and `opp-small` are the same dog at the same size (seen 2026-11-23). Before adding them: keep the pair's real size difference when cutting (cut both at the big one's scale), or redraw "small" next to something that shows its size. Check long/short and up/down the same way.

## B. 28 words that need new pictures

Two sheets, each generated twice (once with the boy, once with the girl), the same way as the Actions and Feelings sheets. That is four images.

**How to generate:** four runs in ChatGPT image generation (each sheet once with the boy, once with the girl). The ready-to-paste prompts, which reference sheet to attach to each, the file names and what to check are in `assets/pictures/PROMPTS-NEW-WORDS.md`.

### Sheet 1: Actions 2 (16 pictures)

| Word | Picture id | Hebrew | Tier |
| --- | --- | --- | --- |
| jump | `actions-jump` | לקפוץ | 2 |
| sit | `actions-sit` | לשבת | 2 |
| stand | `actions-stand` | לעמוד | 2 |
| play | `actions-play` | לשחק | 2 |
| give | `actions-give` | לתת | 2 |
| hug | `actions-hug` | לחבק | 2 |
| kiss | `actions-kiss` | לנשק | 2 |
| wash | `actions-wash` | לרחוץ | 2 |
| look | `actions-look` | להסתכל | 3 |
| listen | `actions-listen` | להקשיב | 3 |
| throw | `actions-throw` | לזרוק | 3 |
| catch | `actions-catch` | לתפוס | 3 |
| push | `actions-push` | לדחוף | 3 |
| pull | `actions-pull` | למשוך | 3 |
| brush | `actions-brush` | לצחצח | 3 |
| hide | `actions-hide` | להתחבא | 3 |

### Sheet 2: Little words (12 pictures)

A new subcategory, `talk` (מילים קטנות), in Me and Friends.

| Word | Picture id | Hebrew | Tier |
| --- | --- | --- | --- |
| yes | `talk-yes` | כן | 1 |
| no | `talk-no` | לא | 1 |
| hello | `talk-hello` | שלום | 1 |
| bye | `talk-bye` | להתראות | 1 |
| more | `talk-more` | עוד | 2 |
| stop | `talk-stop` | עצור\|עצרי | 2 |
| go | `talk-go` | קדימה | 2 |
| come | `talk-come` | בוא\|בואי | 2 |
| please | `talk-please` | בבקשה | 2 |
| thank you | `talk-thank-you` | תודה | 2 |
| help | `talk-help` | עזרה | 3 |
| sorry | `talk-sorry` | סליחה | 3 |

Things to check on these two sheets, because they are harder than animals (also in the prompts file):
- **hello** must not look like the existing **wave** (a child waving), and **bye** must be seen leaving. If they can't be told apart, drop one.
- **give**, **more** and **please** are all "hands toward someone": compare the three side by side.
- **stop** and **no** both look stern: the octagon and the X must be large.

## What each word still needs

1. **The pictures** (B only): the four sheets above, then add them to `tools/pictures/sheets.json` and run `python3 tools/pictures/build.py`; add `talk` to `GENDERED` in `ui/picture.js`; bump `PIC_V`.
2. **The word lines** in `public/js/data/words.js`, from the tables above (`["jump","img:actions-jump","לקפוץ",["jumping"],2]`).
3. **The voices**, in the `say-it` cloud environment (the only one that reaches ElevenLabs): `node tools/voice/build.mjs --set en` and `--set he`. `npm test` fails until every word has both clips. Sammy listens to the new clips: short words read alone ("in", "on", "I", "we", "he") are the ones a voice gets wrong.
4. **New lines for Pipo**, recorded in the same run, for things 2.14 does without words for now: going to sleep ("פיפו עייף. נתראה מחר!"), listen-and-compare ("עכשיו תקשיב|תקשיבי"), and the chest ("מצאת אוצר!").
