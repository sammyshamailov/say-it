# New everyday words: what's ready, and the picture prompts

From the review of 14 Nov 2026: about 430 of the 484 words are names of things. This adds the words a child needs to say something: 29 that already have pictures, and 28 that need two new picture sheets. None of them is in the game yet, because every word needs its recorded voice first (see "What each word still needs").

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

## B. 28 words that need new pictures

Two sheets, each generated twice (once with the boy, once with the girl), the same way as the Actions and Feelings sheets. That is four images.

**How to generate:** in ChatGPT image generation, attach `assets/pictures/sheets/actions-boy.webp` (for the boy runs) or `actions-girl.webp` (for the girl runs) as the reference, and paste the prompt. Save the results as `actions2-boy.webp`, `actions2-girl.webp`, `talk-boy.webp`, `talk-girl.webp` in `assets/pictures/sheets/`. Check before saving: 16 (or 12) separate pictures, the same child in every cell, no text anywhere, nothing touching its neighbour.

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

```
Create ONE image: a sprite sheet of exactly 16 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 4-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. jumping high, both feet off the ground, knees bent, arms up
2. sitting on a small wooden chair, hands on knees (chair in side profile)
3. standing still and straight, arms at the sides
4. playing: kneeling on the floor and stacking three colored wooden blocks
5. giving: holding out a red ball with both hands, arms stretched forward
6. hugging a brown teddy bear tightly with both arms
7. kissing: blowing a kiss from an open hand, one small red heart floating beside the hand
8. washing hands under a small tap, soap bubbles on the hands
9. looking through a magnifying glass held up to one eye
10. listening: one hand cupped behind the ear, head tilted
11. throwing a blue ball overhand, the ball just leaving the hand
12. catching a blue ball with both hands in front of the chest
13. pushing a large cardboard box with both hands, leaning forward
14. pulling a small red wagon by its handle, leaning back
15. brushing teeth with a toothbrush, mouth open, a little foam
16. hiding: crouching behind a large cardboard box, only the head and hands peeking over the top

POSE: the SAME child in every cell, the same child as in the attached reference image: a 5-year-old with natural child proportions, light tan skin, a plain mint-green T-shirt, blue shorts and white sneakers. Full body, in a 3/4 view turned toward the LEFT, doing the action described, with only the props listed. Camera at the child's chest height.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

The attached reference image sets the child, the style, the line weight and the coloring: copy them exactly. The items come only from the list above.
```

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

```
Create ONE image: a sprite sheet of exactly 12 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. YES: nodding with a big smile, one thumb up, and a large green check mark floating beside the head
2. NO: shaking the head, serious face, both forearms crossed in an X in front of the chest, and a large red X mark floating beside the head
3. HELLO: standing in an open wooden doorway, just arriving, one hand raised in greeting, smiling
4. BYE: walking away with a small blue backpack on the back, body turned away, looking back over the shoulder and waving
5. MORE: holding out an empty white bowl with both hands, looking up hopefully
6. STOP: one arm stretched straight forward with the open palm facing out, serious face, and a plain red octagon sign with no writing floating beside the hand
7. GO: taking one big step forward, one arm pointing ahead, and a round green traffic light circle floating above the pointing hand
8. COME: one arm stretched forward, the hand curled back in a beckoning "come here" gesture, friendly smile
9. PLEASE: both hands pressed together in front of the chest, head slightly tilted, hopeful smile
10. THANK YOU: holding a small wrapped gift box against the chest with one hand, the other hand flat on the heart, grateful smile
11. HELP: reaching one hand down to a small brown puppy sitting in a cardboard box, lifting it out
12. SORRY: head bowed, eyebrows raised in the middle, one hand on the chest, the other hand offering a single flower

POSE: the SAME child in every cell, the same child as in the attached reference image: a 5-year-old with natural child proportions, light tan skin, a plain mint-green T-shirt, blue shorts and white sneakers. Full body, FRONT VIEW or 3/4 view toward the LEFT (BYE is seen from behind), with only the props and marks listed. The gesture and the face must be strong and unmistakable. Camera at the child's chest height.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration, including the check mark, the X, the octagon and the green circle.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell, marks included.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. NO text, letters, words, numbers, labels or watermarks anywhere: the octagon sign and the marks are blank shapes.
- Do not add anything that is not described.

The attached reference image sets the child, the style, the line weight and the coloring: copy them exactly. The items come only from the list above.
```

Things to check on these two sheets, because they are harder than animals:
- **hello** must not look like the existing **wave** (a child waving), and **bye** must be seen leaving. If they can't be told apart, drop one.
- **give**, **more** and **please** are all "hands toward someone": compare the three side by side.
- **stop** and **no** both look stern: the octagon and the X must be large.

## What each word still needs

1. **The pictures** (B only): the four sheets above, then add them to `tools/pictures/sheets.json` and run `python3 tools/pictures/build.py`; add `talk` to `GENDERED` in `ui/picture.js`; bump `PIC_V`.
2. **The word lines** in `public/js/data/words.js`, from the tables above (`["jump","img:actions-jump","לקפוץ",["jumping"],2]`).
3. **The voices**, in the `say-it` cloud environment (the only one that reaches ElevenLabs): `node tools/voice/build.mjs --set en` and `--set he`. `npm test` fails until every word has both clips. Sammy listens to the new clips: short words read alone ("in", "on", "I", "we", "he") are the ones a voice gets wrong.
4. **New lines for Pipo**, recorded in the same run, for things 2.14 does without words for now: going to sleep ("פיפו עייף. נתראה מחר!"), listen-and-compare ("עכשיו תקשיב|תקשיבי"), and the chest ("מצאת אוצר!").
