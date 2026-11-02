// What the star shop sells. Kids spend stars on animals whose English word they already know
// (the animal then lives in their garden) and on hats for the mascot. Nothing can be bought with
// real money, and nothing bought is ever lost.
import { WORDS, WORD, SUBS } from "../data/index.js";
import { OUTFITS } from "../data/outfits.js";
import { store } from "../state.js";

export const PET_PRICE = 5;
export const ANIMALS = WORDS.find(g => g.id === "animals").subs.flatMap(s => s.keys);
export const petId = key => "pet:" + key;
export const hatId = id => "hat:" + id;

export const ownedPets = p => ANIMALS.filter(k => store.owns(p, petId(k)));

// Animals the child has met and doesn't own yet (known ones for sale first, the rest as shadows).
// Before meeting any, a few farm animals are shown as shadows so the shelf isn't empty.
export function pets(p) {
  const met = ANIMALS.filter(k => p.words[k] && !store.owns(p, petId(k)));
  const list = met.length || ownedPets(p).length ? met : SUBS.farm.keys.slice(0, 4);
  return list.map(k => ({ kind: "pet", id: petId(k), key: k, w: WORD[k], price: PET_PRICE, known: store.knows(p, k) }))
    .sort((a, b) => b.known - a.known);
}
export const hats = () => OUTFITS.map(o => ({ kind: "hat", id: hatId(o.id), hat: o.id, price: o.price, known: true }));

// Is there anything the child could buy right now? (makes the shop button glow)
export function canBuy(p) {
  const n = store.purse(p);
  return pets(p).some(x => x.known && x.price <= n) || hats().some(x => !store.owns(p, x.id) && x.price <= n);
}
