// What the star shop sells. Kids spend stars on animals whose English word they already know
// (the animal then lives in their garden) and on hats for the mascot. Nothing can be bought with
// real money, and nothing bought is ever lost.
import { WORDS, WORD } from "../data/index.js";
import { OUTFITS } from "../data/outfits.js";
import { store } from "../state.js";

export const PET_PRICE = 5;
export const ANIMALS = WORDS.find(g => g.id === "animals").subs.flatMap(s => s.keys);
export const petId = key => "pet:" + key;
export const hatId = id => "hat:" + id;

export const ownedPets = p => ANIMALS.filter(k => store.owns(p, petId(k)));

// Every animal the child doesn't own yet: ones they can buy first, then ones they've met,
// then the rest as shadows to collect, easiest words first.
export function pets(p) {
  const rank = k => store.knows(p, k) ? 0 : p.words[k] ? 1 : 2;
  return ANIMALS.filter(k => !store.owns(p, petId(k)))
    .map((k, i) => ({ kind: "pet", id: petId(k), key: k, w: WORD[k], price: PET_PRICE, known: store.knows(p, k), r: rank(k) * 1e4 + WORD[k].tier * 1e3 + i }))
    .sort((a, b) => a.r - b.r);
}
export const hats = () => OUTFITS.map(o => ({ kind: "hat", id: hatId(o.id), hat: o.id, price: o.price, known: true }));

// Is there anything the child could buy right now? (makes the shop button glow)
export function canBuy(p) {
  const n = store.purse(p);
  return pets(p).some(x => x.known && x.price <= n) || hats().some(x => !store.owns(p, x.id) && x.price <= n);
}
