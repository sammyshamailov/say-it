# Picture prompts

The prompts used to generate the sheets in `sheets/` (ChatGPT image generation, with the finished Farm sheet attached as a style reference).
Feelings and Actions were generated twice, once with the boy and once with the girl described as the child.

To add or replace pictures: generate a sheet with a prompt in this style, save it in `sheets/`, add it to `tools/pictures/sheets.json`, and run `python3 tools/pictures/build.py`.

## 1. Animals / Farm

```
Create ONE image: a sprite sheet of exactly 10 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells. The last 2 cells (bottom right) stay completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. cow (black and white Holstein)
2. pig (pink)
3. sheep (white wool, black face and legs)
4. horse (brown with black mane)
5. hen (brown)
6. rooster (red comb, dark green tail)
7. duck (white farm duck, orange beak and feet)
8. goat (white, small horns, beard)
9. donkey (grey, long ears)
10. turkey (brown, tail fan closed)
11. (empty, leave blank)
12. (empty, leave blank)

POSE (identical for every animal): full body, standing on all its legs (four-legged animals on all four legs; the hen, rooster, duck and turkey on both legs with wings folded) on a flat invisible ground line, in STRICT SIDE PROFILE FACING LEFT. Head in profile looking left (not turned toward the viewer), only one eye visible, mouth closed, legs straight and evenly spaced, tail visible. Camera at the animal's mid-body height, no perspective tilt.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 2. Animals / Pets

```
Create ONE image: a sprite sheet of exactly 8 separate illustrations for a preschool vocabulary app, arranged in an invisible 3-column × 3-row grid of equal square cells. The last cell (bottom right) stays completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. adult dog (golden retriever)
2. puppy (golden retriever puppy, clearly much smaller, rounder and younger than the dog, but still standing in the same side profile)
3. adult cat (grey tabby)
4. kitten (grey tabby kitten, clearly much smaller and rounder than the cat, same side profile)
5. rabbit (grey and white, ears up)
6. hamster (golden)
7. mouse (grey)
8. goldfish in side profile facing left, inside a small round glass fishbowl seen from the front
9. (empty, leave blank)

POSE (identical unless the item says otherwise): full body, standing on all four legs on a flat invisible ground line, in STRICT SIDE PROFILE FACING LEFT. Head in profile looking left (not turned toward the viewer), only one eye visible, mouth closed, legs straight and evenly spaced, tail visible. Camera at the animal's mid-body height, no perspective tilt.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 3. Animals / Wild (1 of 2)

```
Create ONE image: a sprite sheet of exactly 9 separate illustrations for a preschool vocabulary app, arranged in an invisible 3-column × 3-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. lion (male, golden mane)
2. tiger
3. elephant (grey, trunk hanging down)
4. monkey (brown, walking on all fours)
5. giraffe
6. zebra
7. brown bear
8. giant panda
9. koala (on all fours)

POSE (identical unless the item says otherwise): full body, standing on all four legs on a flat invisible ground line, in STRICT SIDE PROFILE FACING LEFT. Head in profile looking left (not turned toward the viewer), only one eye visible, mouth closed, legs straight and evenly spaced, tail visible. Camera at the animal's mid-body height, no perspective tilt.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 4. Animals / Wild (2 of 2)

```
Create ONE image: a sprite sheet of exactly 9 separate illustrations for a preschool vocabulary app, arranged in an invisible 3-column × 3-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. red fox
2. grey wolf
3. deer (male, with antlers)
4. snake (green), body lying flat in a gentle S-curve along the ground line, head slightly raised and facing left
5. crocodile (green, on all four short legs, mouth closed)
6. hippo (grey)
7. kangaroo, standing upright on its two hind legs and tail, side profile facing left
8. camel (one-humped dromedary, the big hump clearly visible on its back)
9. long-necked dinosaur (green brontosaurus)

POSE (identical unless the item says otherwise): full body, standing on all four legs on a flat invisible ground line, in STRICT SIDE PROFILE FACING LEFT. Head in profile looking left (not turned toward the viewer), only one eye visible, mouth closed, legs straight and evenly spaced, tail visible. Camera at the animal's mid-body height, no perspective tilt.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 5. Animals / Birds

```
Create ONE image: a sprite sheet of exactly 10 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells. The last 2 cells (bottom right) stay completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. small songbird (blue)
2. owl (brown), body in side profile but this one bird may turn its face toward the viewer
3. parrot (red, blue and yellow)
4. bald eagle
5. swan (white), floating on an invisible water line instead of standing
6. flamingo (pink), standing on one leg
7. peacock (tail closed, trailing behind)
8. penguin, standing upright
9. chick (small, fluffy, yellow)
10. dove (white)
11. (empty, leave blank)
12. (empty, leave blank)

POSE (identical unless the item says otherwise): full body, standing on both legs on a flat invisible ground line, in STRICT SIDE PROFILE FACING LEFT, wings folded against the body, beak closed, one eye visible. Camera at the bird's mid-body height.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 6. Animals / Sea

```
Create ONE image: a sprite sheet of exactly 12 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. fish (a simple tropical fish, yellow and blue)
2. whale (blue, with a small water spout)
3. dolphin (grey)
4. shark (grey, mouth closed)
5. octopus (orange), FRONT VIEW, head on top, eight tentacles spread evenly below
6. crab (red), FRONT VIEW, claws raised
7. sea turtle (green), swimming, flippers out
8. seal (grey), lying on its belly
9. jellyfish (light purple), FRONT VIEW, tentacles hanging straight down
10. shrimp (pink)
11. lobster (red), TOP-DOWN VIEW, claws forward pointing up
12. scallop seashell (cream and peach), FRONT VIEW, no animal

POSE (identical unless the item says otherwise): full body, swimming horizontally in STRICT SIDE PROFILE FACING LEFT, one eye visible, mouth closed. Camera level with the animal.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 7. Animals / Bugs

```
Create ONE image: a sprite sheet of exactly 10 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells. The last 2 cells (bottom right) stay completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. honeybee
2. ant (black)
3. butterfly (orange monarch), wings fully open
4. ladybug (red with black spots), wings closed
5. spider (black)
6. snail, SIDE PROFILE FACING LEFT, shell on its back, crawling on the ground line
7. earthworm (pink), SIDE PROFILE, lying in a gentle S-curve along the ground line, head on the left
8. caterpillar (green), SIDE PROFILE FACING LEFT, crawling on the ground line
9. housefly
10. beetle (dark green, shiny)
11. (empty, leave blank)
12. (empty, leave blank)

POSE (identical unless the item says otherwise): seen from DIRECTLY ABOVE (top-down view), head pointing to the top of the cell, body perfectly straight, legs and wings spread symmetrically.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 8. Food / Fruits

```
Create ONE image: a sprite sheet of exactly 16 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 4-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. red apple with one leaf
2. single yellow banana
3. a bunch of purple grapes
4. orange (the fruit)
5. red strawberry with green top
6. a triangular watermelon slice (red flesh, black seeds, green rind)
7. green pear
8. two red cherries joined by their stems
9. yellow lemon
10. pineapple
11. peach
12. kiwi fruit, one whole kiwi with one half cut open beside it
13. mango (red and yellow)
14. coconut, one whole brown coconut with one half cut open beside it
15. a small pile of three blueberries
16. avocado, cut in half with the pit

VIEW (identical for every item): one whole item, upright, seen from the front at a slight angle from above (about 20 degrees), resting on an invisible flat surface. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 9. Food / Vegetables

```
Create ONE image: a sprite sheet of exactly 12 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. orange carrot with green leafy top
2. red tomato
3. brown potato
4. green cucumber
5. corn cob, husk partly peeled
6. head of broccoli
7. brown onion
8. garlic bulb
9. green bell pepper
10. white button mushroom
11. head of lettuce
12. purple eggplant

VIEW (identical for every item): one whole item, upright, seen from the front at a slight angle from above (about 20 degrees), resting on an invisible flat surface. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 10. Food / Meals

```
Create ONE image: a sprite sheet of exactly 15 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 4-row grid of equal square cells. The last cell (bottom right) stays completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. loaf of bread
2. wedge of yellow cheese with holes
3. one white egg
4. whole pizza
5. sandwich cut diagonally
6. bowl of soup
7. bowl of white rice
8. plate of spaghetti with tomato sauce
9. bowl of green salad
10. hamburger
11. french fries in a red carton
12. hot dog in a bun
13. stack of pancakes with syrup
14. pita bread filled with falafel balls
15. bowl of cereal with milk
16. (empty, leave blank)

VIEW (identical for every item): one serving, seen from the front at a slight angle from above (about 30 degrees), resting on an invisible flat surface. Plain white dishes where a dish is needed. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 11. Food / Sweets

```
Create ONE image: a sprite sheet of exactly 10 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells. The last 2 cells (bottom right) stay completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. slice of layered cake
2. ice cream cone with one scoop
3. chocolate chip cookie
4. chocolate bar, partly unwrapped
5. wrapped candy (twist wrapper)
6. round swirl lollipop
7. donut with pink icing and sprinkles
8. cupcake
9. popcorn in a red and white striped box
10. honey jar
11. (empty, leave blank)
12. (empty, leave blank)

VIEW (identical for every item): one item, seen from the front at a slight angle from above (about 20 degrees), resting on an invisible flat surface. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 12. Food / Drinks

```
Create ONE image: a sprite sheet of exactly 6 separate illustrations for a preschool vocabulary app, arranged in an invisible 3-column × 2-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. glass of milk
2. orange juice box with a straw
3. clear glass of water
4. cup of tea on a saucer
5. cup of coffee on a saucer
6. paper soda cup with a lid and straw

VIEW (identical for every item): one drink, upright, seen from the front at a slight angle from above (about 15 degrees), resting on an invisible flat surface. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 13. Me & People / Family

```
Create ONE image: a sprite sheet of exactly 8 separate illustrations for a preschool vocabulary app, arranged in an invisible 3-column × 3-row grid of equal square cells. The last cell (bottom right) stays completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. mom (adult woman)
2. dad (adult man)
3. baby in a diaper, sitting
4. boy (about 6)
5. girl (about 6)
6. grandma (grey hair, glasses)
7. grandpa (grey hair)
8. a family standing side by side: dad, mom, a boy and a girl, all in the same front view pose
9. (empty, leave blank)

POSE (identical for every person): full body, standing upright, FRONT VIEW facing the viewer, arms relaxed at the sides, feet slightly apart, calm gentle smile, plain simple clothes. Real human proportions for each age (adults about 7 heads tall, children about 5). Camera at chest height.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 14. Me & People / My Body

```
Create ONE image: a sprite sheet of exactly 12 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. open hand, palm facing the viewer, fingers together
2. bare foot, side view facing left
3. one eye with its eyebrow, front view
4. one ear, side view
5. nose, side view facing left
6. smiling closed mouth (lips only)
7. one clean white tooth
8. one whole leg, side view, bare
9. one arm, flexed to show the muscle
10. hand with only the index finger pointing up
11. face showing only the mouth with the tongue sticking out
12. pink brain, side view

VIEW (identical for every item): one single body part on its own, front view, light tan skin, neatly cut off with a smooth rounded edge (no blood, no anatomy inside). No faces unless the item is a face part.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 15. Me & People / Feelings

```
Create ONE image: a sprite sheet of exactly 10 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells. The last 2 cells (bottom right) stay completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. happy (big smile)
2. sad (frown, one tear)
3. angry (furrowed brows, red cheeks)
4. scared (wide eyes, mouth open, hands up at cheeks)
5. sleepy (eyes half closed, yawning)
6. sick (pale, thermometer in mouth)
7. surprised (raised eyebrows, round open mouth)
8. silly (tongue out, eyes crossed)
9. in love (hands making a heart shape at chest, warm smile)
10. yummy (licking lips with the tongue, happy eyes)
11. (empty, leave blank)
12. (empty, leave blank)

POSE (identical for every cell): the SAME child in every cell: a 5-year-old with natural child proportions, light tan skin, short brown hair, a plain mint-green T-shirt, blue shorts and white sneakers. Head and shoulders only, FRONT VIEW facing the viewer, centered. Only the facial expression changes between cells; it must be strong and unmistakable.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 16. Me & People / Clothes

```
Create ONE image: a sprite sheet of exactly 12 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. T-shirt (red)
2. baseball cap (blue), side profile facing left
3. sneaker (white and blue)
4. one sock (striped)
5. dress (yellow)
6. winter coat (blue)
7. pair of eyeglasses (black frame), front view
8. jeans
9. one rain boot (yellow)
10. pair of gloves (red), side by side
11. scarf (red and white stripes), laid flat
12. gold crown, front view

VIEW (identical for every item): one single clothing item, laid flat and seen straight from the front, symmetric, no person, no hanger. Shoes and boots: side profile facing left.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 17. Me & People / Actions

```
Create ONE image: a sprite sheet of exactly 16 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 4-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. running
2. walking
3. swimming in a small patch of blue water
4. climbing a short ladder
5. riding a bicycle (bicycle also in side profile facing left)
6. dancing, arms up
7. sleeping in a bed, lying down, eyes closed (bed in side profile)
8. eating an apple
9. drinking a glass of water
10. singing, mouth open, two music notes beside the head
11. sitting and reading an open book
12. sitting and writing with a pencil on paper
13. clapping hands in front of the chest
14. waving one hand, smiling
15. crying, tears running down
16. laughing with eyes closed and mouth open

POSE: the SAME child in every cell: a 5-year-old with natural child proportions, light tan skin, short brown hair, a plain mint-green T-shirt, blue shorts and white sneakers. Full body, in a 3/4 view turned toward the LEFT, doing the action described, with only the props listed. Camera at the child's chest height.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 18. Me & People / Jobs

```
Create ONE image: a sprite sheet of exactly 10 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells. The last 2 cells (bottom right) stay completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. doctor (white coat, stethoscope)
2. firefighter (yellow helmet and uniform, holding a hose)
3. police officer (blue uniform and cap)
4. farmer (straw hat, overalls, holding a pitchfork)
5. chef (white hat and jacket, holding a wooden spoon)
6. teacher (holding a book)
7. pilot (dark uniform and cap)
8. astronaut (white spacesuit, helmet held under one arm)
9. artist (beret, holding a paintbrush and palette)
10. builder (yellow hard hat, orange vest, holding a hammer)
11. (empty, leave blank)
12. (empty, leave blank)

POSE (identical for every person): one adult, full body, standing upright, FRONT VIEW facing the viewer, real human proportions (about 7 heads tall), wearing the job's standard uniform and holding the one tool listed in one hand, calm gentle smile. Camera at chest height.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 19. Home & Things / At Home

```
Create ONE image: a sprite sheet of exactly 16 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 4-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. bed, side view
2. wooden chair
3. sofa
4. front door, front view, closed
5. window, front view, closed
6. light bulb, glowing
7. alarm clock
8. smartphone, screen facing the viewer, blank screen
9. TV, blank screen
10. bathtub
11. toilet
12. toothbrush, lying flat
13. bar of soap
14. key, lying flat
15. hand mirror
16. lit candle

VIEW (identical for every item): one single object, upright, seen from the front at a slight angle from above (about 20 degrees), resting on an invisible flat surface. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 20. Home & Things / Kitchen

```
Create ONE image: a sprite sheet of exactly 9 separate illustrations for a preschool vocabulary app, arranged in an invisible 3-column × 3-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. spoon, lying flat
2. fork, lying flat
3. empty white plate
4. frying pan
5. kettle
6. empty glass jar with a lid
7. salt shaker
8. baby bottle
9. three ice cubes

VIEW (identical for every item): one single object, upright, seen from the front at a slight angle from above (about 20 degrees), resting on an invisible flat surface. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 21. Home & Things / Toys

```
Create ONE image: a sprite sheet of exactly 12 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. soccer ball
2. teddy bear, sitting
3. kite (diamond shape) with a tail
4. red balloon on a string
5. toy drum with two sticks
6. acoustic guitar, upright
7. toy robot, front view
8. one jigsaw puzzle piece
9. skateboard, side profile
10. yo-yo with its string
11. toy doll, front view, standing
12. gift box with a ribbon and bow

VIEW (identical for every item): one single object, upright, seen from the front at a slight angle from above (about 20 degrees), resting on an invisible flat surface. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 22. Home & Things / School

```
Create ONE image: a sprite sheet of exactly 10 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells. The last 2 cells (bottom right) stay completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. closed book (red cover)
2. yellow pencil, lying flat
3. crayon (blue), lying flat
4. pen, lying flat
5. scissors, closed
6. ruler, lying flat
7. paint palette with a brush
8. spiral notebook
9. school backpack
10. open laptop, blank screen
11. (empty, leave blank)
12. (empty, leave blank)

VIEW (identical for every item): one single object, seen from the front at a slight angle from above (about 20 degrees), resting on an invisible flat surface. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 23. Out & About / Vehicles

```
Create ONE image: a sprite sheet of exactly 16 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 4-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. car (red)
2. bus (yellow)
3. steam train engine
4. airplane flying, side profile facing left
5. sailboat on an invisible water line
6. bicycle
7. delivery truck
8. rocket, upright, FRONT VIEW, small flame below
9. helicopter flying
10. tractor (green)
11. taxi (yellow)
12. ambulance (white with red stripe)
13. fire truck (red)
14. police car (blue and white)
15. motorcycle
16. kick scooter

VIEW (identical for every vehicle): STRICT SIDE PROFILE FACING LEFT, all wheels on a flat invisible ground line, no driver visible, no motion lines. Camera level with the vehicle. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 24. Out & About / Places

```
Create ONE image: a sprite sheet of exactly 11 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells. The last cell (bottom right) stays completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. house
2. school building with a bell
3. hospital building with a red cross
4. small shop with a striped awning
5. castle
6. camping tent
7. beach: sand, a little sea and a beach umbrella
8. park: two trees and a bench
9. playground slide
10. small group of city buildings
11. bridge over a little river
12. (empty, leave blank)

VIEW (identical for every item): a small self-contained scene seen straight from the front, sitting on a flat oval patch of ground, no sky, no background beyond the oval. No people. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 25. Out & About / Nature

```
Create ONE image: a sprite sheet of exactly 14 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 4-row grid of equal square cells. The last 2 cells (bottom right) stay completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. sun
2. crescent moon
3. five-pointed star (yellow)
4. tree
5. flower (red, with stem and leaves)
6. green leaf
7. small sprout in a pot
8. cactus in a pot
9. rock
10. mountain with a snowy top
11. sea waves
12. campfire
13. planet Earth
14. volcano
15. (empty, leave blank)
16. (empty, leave blank)

VIEW (identical for every item): one single element seen from the front, centered. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 26. Out & About / Weather

```
Create ONE image: a sprite sheet of exactly 11 separate illustrations for a preschool vocabulary app, arranged in an invisible 4-column × 3-row grid of equal square cells. The last cell (bottom right) stays completely blank.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. bright sun
2. grey cloud with raindrops
3. snowflake
4. white cloud
5. rainbow arc
6. swirling wind lines blowing a leaf
7. dark cloud with a lightning bolt and rain
8. lightning bolt
9. thermometer with the red line at the top, next to a blazing sun
10. thermometer with a low blue line, next to a snowflake
11. open umbrella
12. (empty, leave blank)

VIEW (identical for every item): one single weather symbol seen from the front, centered. No faces.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```

## 27. Learning / Shapes

```
Create ONE image: a sprite sheet of exactly 6 separate illustrations for a preschool vocabulary app, arranged in an invisible 3-column × 2-row grid of equal square cells.

ITEMS, left to right, top to bottom (exactly this order, exactly these items):
1. circle (blue)
2. square (red)
3. triangle (green)
4. heart (pink)
5. five-pointed star (yellow)
6. diamond / rhombus (orange)

VIEW (identical for every item): one flat 2D shape, perfectly geometric, seen straight on, filled with one solid color, no face, no 3D effect.

STYLE (identical in every cell, do not vary or interpret):
- Semi-realistic children's picture-book illustration. TRUE-TO-LIFE proportions and anatomy, simplified into clean shapes. NOT chibi, NOT kawaii, NOT big-headed, NOT a toy or plush look.
- REALISTIC natural colors exactly as in real life, clean and slightly bright. No candy, neon, pastel or fantasy colors.
- Eyes at natural size with one small white catchlight. Calm, friendly, neutral expression.
- Cel shading: one base color, one shadow tone and one highlight per area. Light from the top-left on every item. No gradients, no textures, no fur, feather or hair strands.
- One even dark navy outline (#1A1640) of the same medium thickness around every illustration.
- NO sticker border, NO white outline around the illustration.

SIZE AND PLACEMENT:
- Scale every item so its widest dimension fills 80% of its cell. Ignore real-world size differences: a mouse is drawn as large as an elephant.
- Center each item in its cell. Items that stand share the same invisible ground line near the bottom of the cell.

BACKGROUND AND FORBIDDEN:
- Flat solid pure white (#FFFFFF) background over the whole image.
- Do NOT draw the grid: no boxes, frames, cell borders, cards, lines or dividers.
- No ground, grass, water, cast shadows, scenery, extra props, accessories or clothing unless listed for that item. No text, letters, numbers, labels or watermarks.
- Do not add anything that is not described. Do not change the pose, view or direction for any item.

If a reference image is attached, copy its style, line weight, coloring and pose exactly; the reference only sets the style, the items come from the list above.
```
