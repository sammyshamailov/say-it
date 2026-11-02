// The stones on the map, built once from the word list.
//
// Each land (word group) holds its words in tiers 1-5 (see words.js), easy at the bottom of the
// land, hard at the top. A tier of a land becomes a row of stones:
//   word stones   5-6 words of one subcategory (small leftovers of several are mixed into one)
//   a chest       a review round of the words met so far in that land
// and every land ends with a party stone, a review round of all its words.
// Stone ids are stable across versions, so saved progress keeps pointing at the same stones.
import { WORDS, WORD } from "./index.js";

export const TIERS = [null,
  { name: "Seed", c: "green" }, { name: "Sprout", c: "yellow" }, { name: "Explorer", c: "orange" },
  { name: "Doer", c: "purple" }, { name: "Talker", c: "pink" }];
export const MAX_TIER = 5;
const SIZE = 6;      // most words in one stone
const SMALL = 3;     // fewer words of a subcategory than this are mixed with other leftovers

// split a list into near-equal pieces of at most SIZE
function pieces(list) {
  const n = Math.ceil(list.length / SIZE), out = [];
  for (let i = 0; i < n; i++) out.push(list.slice(Math.round(i * list.length / n), Math.round((i + 1) * list.length / n)));
  return out;
}

// Pairs a child this age mixes up (look or sound alike, or one is a kind of the other).
// They never meet in the same round below tier 3; from tier 3 on, one may be the wrong answer
// to tap on purpose.
const PAIRS = [
  ["farm/cow", "farm/calf"], ["farm/sheep", "farm/lamb"], ["farm/horse", "farm/pony"], ["farm/duck", "farm/goose"],
  ["pets/dog", "pets/puppy"], ["pets/cat", "pets/kitten"], ["pets/hamster", "pets/guinea pig"], ["pets/mouse", "pets/hamster"],
  ["wild/leopard", "wild/cheetah"], ["wild/bear", "wild/polar bear"], ["wild/lion", "wild/tiger"],
  ["fruits/orange", "fruits/tangerine"], ["fruits/lemon", "fruits/lime"], ["fruits/peach", "fruits/apricot"], ["fruits/orange", "fruits/grapefruit"],
  ["fruits/strawberry", "fruits/raspberries"], ["fruits/grapes", "fruits/blueberry"], ["fruits/watermelon", "fruits/melon"],
  ["veg/cucumber", "veg/zucchini"], ["veg/lettuce", "veg/cabbage"], ["veg/broccoli", "veg/cauliflower"], ["veg/potato", "veg/sweet potato"],
  ["veg/pepper", "veg/chili"], ["veg/onion", "veg/garlic"],
  ["sea/fish", "sea/clownfish"], ["sea/octopus", "sea/squid"], ["sea/seal", "sea/walrus"], ["sea/shark", "sea/dolphin"],
  ["bugs/fly", "bugs/mosquito"], ["bugs/butterfly", "bugs/dragonfly"], ["bugs/ant", "bugs/cockroach"],
  ["birds/bird", "birds/crow"], ["birds/stork", "birds/flamingo"], ["birds/dove", "birds/seagull"],
  ["family/grandma", "family/aunt"], ["family/grandpa", "family/uncle"], ["family/boy", "family/brother"], ["family/girl", "family/sister"],
  ["body/head", "body/face"], ["body/foot", "body/toes"], ["body/leg", "body/knee"], ["body/arm", "body/elbow"], ["body/arm", "body/shoulder"],
  ["clothes/hat", "accessories/cap"], ["clothes/shoe", "clothes/sandals"], ["clothes/shoe", "clothes/slippers"], ["clothes/sandals", "clothes/slippers"],
  ["clothes/pants", "clothes/shorts"], ["clothes/dress", "clothes/skirt"], ["clothes/coat", "clothes/sweater"], ["clothes/shirt", "clothes/pajamas"],
  ["accessories/glasses", "accessories/sunglasses"], ["accessories/necklace", "accessories/bracelet"], ["accessories/wallet", "accessories/purse"],
  ["school/bag", "accessories/purse"], ["home/bath", "home/shower"], ["home/bed", "home/pillow"], ["home/bed", "home/blanket"],
  ["kitchen/pan", "kitchen/pot"], ["kitchen/plate", "kitchen/bowl"], ["kitchen/bottle", "kitchen/cup"], ["kitchen/spoon", "kitchen/knife"],
  ["toys/balloon", "vehicles/hot-air balloon"], ["toys/balloon", "toys/bubbles"], ["vehicles/car", "vehicles/taxi"], ["vehicles/truck", "vehicles/fire truck"],
  ["vehicles/car", "vehicles/police car"], ["vehicles/boat", "vehicles/submarine"], ["vehicles/bike", "vehicles/motorcycle"],
  ["places/shop", "places/supermarket"], ["places/shop", "places/restaurant"], ["places/house", "places/farm"], ["places/park", "places/garden"],
  ["nature/sea", "nature/lake"], ["nature/sea", "places/beach"], ["places/pool", "nature/lake"], ["nature/river", "nature/waterfall"],
  ["nature/cactus", "nature/desert"], ["nature/tree", "nature/forest"], ["nature/sand", "nature/desert"], ["nature/rock", "nature/cave"],
  ["nature/moon", "shapes/crescent"], ["nature/star", "shapes/star"], ["shapes/circle", "shapes/oval"], ["shapes/square", "shapes/rectangle"],
  ["dinos/dinosaur", "dinos/stegosaurus"], ["dinos/dinosaur", "dinos/triceratops"]
];
export const CONFUSABLE = {};
for (const [a, b] of PAIRS) {
  if (!WORD[a] || !WORD[b]) throw new Error("unknown word in PAIRS: " + (WORD[a] ? b : a));
  (CONFUSABLE[a] = CONFUSABLE[a] || new Set()).add(b);
  (CONFUSABLE[b] = CONFUSABLE[b] || new Set()).add(a);
}
export const confusable = (a, b) => !!CONFUSABLE[a]?.has(b);

export const STAGES = [];      // every stone, land by land, bottom to top
export const STAGE = {};       // id -> stone
export const LAND_STAGES = []; // land index -> its stones, bottom to top

WORDS.forEach((g, gi) => {
  const land = [];
  const add = st => { Object.assign(st, { group: g, land: gi, n: land.length }); land.push(st); STAGES.push(st); STAGE[st.id] = st; };
  for (let t = 1; t <= MAX_TIER; t++) {
    const before = land.length, leftovers = [];
    for (const s of g.subs) {
      const keys = s.keys.filter(k => WORD[k].tier === t);
      if (!keys.length) continue;
      if (keys.length < SMALL) { leftovers.push(...keys); continue; }
      pieces(keys).forEach((ks, i) => add({ id: `${s.id}-${t}-${i + 1}`, kind: "word", tier: t, sub: s, keys: ks }));
    }
    // leftovers of several groups make one or two mixed stones (one or two words join the last stone)
    const last = land.length > before ? land[land.length - 1] : null;
    if (leftovers.length && leftovers.length < SMALL && last && last.keys.length + leftovers.length <= SIZE + 1)
      last.keys = last.keys.concat(leftovers);
    else if (leftovers.length)
      pieces(leftovers).forEach((ks, i) => add({ id: `${g.id}-${t}-mix-${i + 1}`, kind: "word", tier: t, sub: WORD[ks[0]].sub, keys: ks }));
    // a chest after each tier with at least three stones
    if (land.length - before >= 3) {
      const keys = land.filter(x => x.kind === "word").flatMap(x => x.keys);
      add({ id: `${g.id}-${t}-chest`, kind: "chest", tier: t, sub: land[land.length - 1].sub, keys });
    }
  }
  add({ id: `${g.id}-party`, kind: "party", tier: 1, sub: g.subs[0], keys: g.subs.flatMap(s => s.keys) });
  // the picture on a word stone: its first word
  land.forEach(st => { st.pic = st.kind === "word" ? WORD[st.keys[0]].pic : null; });
  LAND_STAGES.push(land);
});
