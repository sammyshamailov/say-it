// Lookup tables built once from the word list.
//   WORD["farm/cow"] -> {key, en, pic, he, alts, sub, group}
//   SUBS["farm"]     -> the subcategory, with .group and .keys added
import { WORDS } from "./words.js";

export { WORDS };
export const WORD = {};
export const SUBS = {};
export const ALL_KEYS = [];

WORDS.forEach(g => g.subs.forEach(s => {
  s.group = g;
  SUBS[s.id] = s;
  s.keys = s.w.map(w => {
    const key = s.id + "/" + w[0];
    WORD[key] = { key, en: w[0], pic: w[1], he: w[2], alts: w[3] || [], tier: w[4] || 1, sub: s, group: g };
    ALL_KEYS.push(key);
    return key;
  });
}));

export const groupIndex = g => WORDS.indexOf(g);
export const subIndex = s => s.group.subs.indexOf(s);
