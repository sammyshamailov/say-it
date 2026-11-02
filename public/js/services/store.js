// Progress lives on this device only (localStorage). Nothing is sent anywhere.
// createStore() takes its storage and clock as arguments, so tests run it in Node with fakes.
import { WORDS, WORD } from "../data/index.js";
import { OUTFITS } from "../data/outfits.js";
import { Emitter } from "../core/emitter.js";

export const KEY = "sayit2";
const DAY = 864e5;
const DUE = [0, 10 * 60e3, DAY, 3 * DAY, 7 * DAY, 21 * DAY]; // wait after reaching each level

export function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const blankSettings = () => ({ music: false, sfx: true, sayMode: "auto", hebrew: true, unlockAll: false, mascot: "Pipo" });
const blank = now => ({ v: 2, profiles: [], lastId: null, created: now, settings: blankSettings() });
const newRecord = now => ({ lvl: 0, due: 0, right: 0, wrong: 0, said: 0, clear: 0, seen: now });

export function isSave(d) {
  return !!d && typeof d === "object" && d.v === 2 && Array.isArray(d.profiles) &&
    d.profiles.every(p => p && typeof p.id === "string" && p.words && typeof p.words === "object");
}

export function createStore({ storage, now = Date.now } = {}) {
  const events = new Emitter();
  const read = k => { try { return storage.getItem(k); } catch (e) { return null; } };

  function newProfile(name, avatar, gender) {
    return { id: "k" + now().toString(36) + Math.random().toString(36).slice(2, 6), name: name || "", avatar: avatar || "🦁",
      gender: gender === "f" ? "f" : "m", stars: 0, spent: 0, owned: [], outfit: null, stickers: [], words: {}, done: {},
      playMs: 0, rounds: 0, lastPlayed: 0 };
  }

  // Players from before the shop keep every hat they had already unlocked.
  function upgradeProfile(p) {
    if (!Array.isArray(p.owned)) p.owned = OUTFITS.filter(o => (p.stars || 0) >= o.stars).map(o => "hat:" + o.id);
    if (typeof p.spent !== "number") p.spent = 0;
    return p;
  }

  // ---- migrate from the first version (keys sayit-players, sayit-got-<id>) ----
  function migrate() {
    let old = null;
    try { old = JSON.parse(read("sayit-players") || "null"); } catch (e) {}
    if (!Array.isArray(old) || !old.length) {
      // the first version also had default profiles saved only implicitly; check star keys
      const ids = ["p1", "p2"].filter(id => read("sayit-got-" + id));
      if (!ids.length) return null;
      old = ids.map(id => ({ id, name: id === "p2" ? "My daughter" : "My son", avatar: id === "p2" ? "🦄" : "🦁", gender: id === "p2" ? "f" : "m" }));
    }
    const s = blank(now());
    old.forEach((p, i) => {
      const np = newProfile(p.name, p.avatar, p.gender || (p.id === "p2" ? "f" : "m"));
      np.id = p.id || "p" + (i + 1);
      delete np.owned; // decided by upgradeProfile from the stars below
      let got = {};
      try { got = JSON.parse(read("sayit-got-" + p.id) || "{}"); } catch (e) {}
      Object.keys(got).forEach(k => {
        if (!WORD[k]) return;
        // a star in the first version meant the child said the word correctly
        np.words[k] = { lvl: 3, due: now() + 3 * DAY, right: 1, wrong: 0, said: 1, clear: 1, seen: now() };
        np.stars++;
      });
      s.profiles.push(np);
    });
    const last = read("sayit-last");
    s.lastId = s.profiles.some(p => p.id === last) ? last : s.profiles[0].id;
    s.migratedFrom = 1;
    return s; // old keys are left untouched on purpose
  }

  let state = null;
  try { state = JSON.parse(read(KEY) || "null"); } catch (e) {}
  if (!state || state.v !== 2) state = migrate() || blank(now());
  state.settings = Object.assign(blankSettings(), state.settings || {});
  state.profiles.forEach(upgradeProfile);

  let saveTimer = null;
  function save(immediately) {
    clearTimeout(saveTimer);
    const write = () => { try { storage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
    if (immediately) write(); else saveTimer = setTimeout(write, 250);
  }
  save(true);

  // ---- moving progress between phones (transfer code or backup file) ----
  const exportData = () => JSON.parse(JSON.stringify(state));
  function replaceAll(d) {
    if (!isSave(d)) return false;
    d.settings = Object.assign(blankSettings(), d.settings || {});
    d.profiles = d.profiles.map(p => {
      const base = newProfile(p.name, p.avatar, p.gender);
      delete base.owned; // an older save without a shop gets its hats from upgradeProfile
      return upgradeProfile(Object.assign(base, p));
    });
    if (!d.profiles.some(p => p.id === d.lastId)) d.lastId = d.profiles[0] ? d.profiles[0].id : null;
    state = d;
    save(true);
    return true;
  }

  // ---- word progress / spaced repetition ----
  const rec = (p, key) => p.words[key];
  const recFor = (p, key) => p.words[key] || (p.words[key] = newRecord(now()));
  function meet(p, key) { if (!p.words[key]) { recFor(p, key); save(); } }
  function mark(p, key, ok) {
    const r = recFor(p, key);
    if (ok) { r.right++; r.lvl = Math.min(5, r.lvl + 1); }
    else { r.wrong++; r.lastWrong = now(); r.lvl = Math.max(0, r.lvl - 1); }
    r.due = now() + DUE[r.lvl];
    save();
  }
  function markSaid(p, key, clear) {
    const r = recFor(p, key);
    r.said++; if (clear) r.clear++;
    save();
  }
  const learned = (p, key) => (p.words[key]?.lvl || 0) >= 3;
  const knows = (p, key) => !!(p.words[key] && p.words[key].right > 0);
  const toPractice = p => Object.keys(p.words).filter(k => WORD[k] && p.words[k].wrong > 0 && p.words[k].lvl <= 1);
  function dueKeys(p, keys) {
    const t = now();
    return keys.filter(k => p.words[k] && p.words[k].due <= t)
      .sort((a, b) => p.words[a].lvl - p.words[b].lvl || p.words[a].due - p.words[b].due);
  }

  // ---- stars and the shop ----
  // p.stars counts every star ever earned and never goes down (parents see it, lands use it).
  // The purse is what's left to spend. Bought things are kept forever in p.owned.
  const purse = p => Math.max(0, (p.stars || 0) - (p.spent || 0));
  const owns = (p, id) => Array.isArray(p.owned) && p.owned.includes(id);
  function addStars(p, n) { p.stars += n; save(); events.emit("stars", p, n); }
  function buy(p, id, price) {
    if (owns(p, id) || purse(p) < price) return false;
    p.owned = [...(p.owned || []), id];
    p.spent = (p.spent || 0) + price;
    save(true);
    events.emit("stars", p, -price);
    return true;
  }

  // ---- map progression ----
  const subStarted = (p, s) => s.keys.some(k => p.words[k]);
  const subDone = (p, s) => !!p.done[s.id];
  const subCrown = (p, s) => s.keys.every(k => learned(p, k));
  const subProgress = (p, s) => s.keys.filter(k => p.words[k]).length / s.keys.length;
  function landUnlocked(p, gi) {
    if (state.settings.unlockAll || gi === 0) return true;
    const g = WORDS[gi], prev = WORDS[gi - 1];
    if (g.subs.some(s => subStarted(p, s) || subDone(p, s))) return true;
    return prev.subs.filter(s => subDone(p, s)).length >= 2 && landUnlocked(p, gi - 1);
  }
  function subUnlocked(p, s) {
    if (!landUnlocked(p, WORDS.indexOf(s.group))) return false;
    if (state.settings.unlockAll) return true;
    const i = s.group.subs.indexOf(s);
    return i === 0 || subDone(p, s) || subStarted(p, s) || subDone(p, s.group.subs[i - 1]);
  }
  function nextSub(p) {
    for (const g of WORDS) for (const s of g.subs) if (subUnlocked(p, s) && !subDone(p, s)) return s;
    // everything open is done: the stone with the most words due
    let best = null, bestN = -1;
    for (const g of WORDS) for (const s of g.subs) {
      if (!subUnlocked(p, s)) continue;
      const n = dueKeys(p, s.keys).length;
      if (n > bestN) { best = s; bestN = n; }
    }
    return best || WORDS[0].subs[0];
  }
  const currentLand = p => WORDS.indexOf(nextSub(p).group);

  // ---- build one round for a stone ----
  function buildRound(p, s) {
    const fresh = s.keys.filter(k => !p.words[k]).slice(0, 3);
    const pool = [];
    WORDS.forEach(g => g.subs.forEach(x => { if (subUnlocked(p, x)) pool.push(...x.keys); }));
    const review = [];
    for (const k of [...dueKeys(p, s.keys), ...dueKeys(p, pool)])
      if (!fresh.includes(k) && !review.includes(k) && review.length < 6 - fresh.length) review.push(k);
    const words = [...fresh, ...review];
    if (words.length < 4) for (const k of shuffle(s.keys)) if (!words.includes(k) && words.length < 5) words.push(k);
    return { sub: s, fresh, words };
  }

  // A finished round: the stone is done, a sticker is earned.
  function finishRound(p, sub, sticker, playedMs) {
    p.done[sub.id] = true; p.rounds++; p.lastPlayed = now();
    p.stickers.push({ pic: sticker.pic, en: sticker.en, at: now() });
    p.playMs += playedMs;
    save(true);
  }
  function addPlayTime(p, ms, immediately) { if (p && ms > 0) { p.playMs += ms; save(immediately); } }

  // ---- profiles ----
  const player = () => state.profiles.find(p => p.id === state.lastId) || null;
  function setPlayer(id) { state.lastId = id; save(); }
  function addProfile(p) { state.profiles.push(p); state.lastId = p.id; save(true); }
  function removeProfile(p) {
    state.profiles = state.profiles.filter(x => x !== p);
    if (state.lastId === p.id) state.lastId = state.profiles[0]?.id || null;
    save(true);
  }

  return {
    get state() { return state; },
    get settings() { return state.settings; },
    on: (t, f) => events.on(t, f),
    save, reset() { state = blank(now()); save(true); },
    newProfile, addProfile, removeProfile, player, setPlayer,
    rec, meet, mark, markSaid, learned, knows, toPractice, dueKeys,
    purse, owns, addStars, buy,
    subStarted, subDone, subCrown, subProgress, landUnlocked, subUnlocked, nextSub, currentLand,
    buildRound, finishRound, addPlayTime,
    isSave, exportData, replaceAll
  };
}
