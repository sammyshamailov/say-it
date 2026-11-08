// Tests for the on-device store (export, restore, migration, shop) and the speech matcher.
// The store is a factory that takes its storage, so it runs here against an in-memory fake.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createStore, isSave, KEY } from "../public/js/services/store.js";
import { isMatch } from "../public/js/services/match.js";
import { STAGES, STAGE, LAND_STAGES, confusable } from "../public/js/data/stages.js";
import { ALL_KEYS } from "../public/js/data/index.js";

function fakeStorage(init = {}) {
  const m = new Map(Object.entries(init));
  return { m, getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
}
const newStore = (init) => { const storage = fakeStorage(init); return { storage, store: createStore({ storage }) }; };

test("export then restore on a fresh phone gives the same progress", () => {
  const a = newStore().store;
  const p = a.newProfile("Noa", "🦄", "f");
  a.addProfile(p);
  a.mark(p, "farm/cow", true); a.addStars(p, 3);
  const data = JSON.parse(JSON.stringify(a.exportData()));

  const { store: b, storage } = newStore();
  assert.equal(b.state.profiles.length, 0);
  assert.ok(b.replaceAll(data));
  assert.equal(b.player().name, "Noa");
  assert.equal(b.player().stars, 3);
  assert.equal(b.player().words["farm/cow"].lvl, 1);
  assert.equal(JSON.parse(storage.m.get(KEY)).profiles[0].name, "Noa", "saved to storage at once");
});

test("restore refuses files that aren't a save and keeps current progress", () => {
  const { store } = newStore();
  store.addProfile(store.newProfile("Ari"));
  for (const bad of [null, {}, { v: 1, profiles: [] }, { v: 2, profiles: [{ id: 3 }] }]) assert.equal(store.replaceAll(bad), false);
  assert.equal(store.state.profiles[0].name, "Ari");
  assert.ok(!isSave("nope"));
});

test("restore fills in fields an older save is missing", () => {
  const { store } = newStore();
  assert.ok(store.replaceAll({ v: 2, profiles: [{ id: "x", name: "Tom", words: {}, stars: 60 }], lastId: "gone" }));
  const p = store.player();
  assert.equal(p.id, "x"); assert.deepEqual(p.stickers, []); assert.equal(p.stars, 60);
  assert.equal(store.settings.sayMode, "auto");
  assert.deepEqual(p.owned, ["hat:party", "hat:shades"], "hats earned before the shop are kept");
});

test("a save is written later, or at once when asked", async () => {
  const { store, storage } = newStore();
  store.addProfile(store.newProfile("Lia"));
  store.state.profiles[0].name = "Lia2";
  store.save();
  assert.equal(JSON.parse(storage.m.get(KEY)).profiles[0].name, "Lia", "not yet");
  store.save(true);
  assert.equal(JSON.parse(storage.m.get(KEY)).profiles[0].name, "Lia2");
});

test("first-version progress is imported and old keys left alone", () => {
  const { store, storage } = newStore({ "sayit-players": JSON.stringify([{ id: "p2", name: "Maya", avatar: "🦄" }]), "sayit-got-p2": JSON.stringify({ "farm/cow": 1, "nope/x": 1 }) });
  const p = store.player();
  assert.equal(p.name, "Maya"); assert.equal(p.gender, "f"); assert.equal(p.stars, 1);
  assert.equal(p.words["farm/cow"].lvl, 3);
  assert.ok(storage.m.has("sayit-players"));
});

test("speech matcher stays forgiving", () => {
  assert.ok(isMatch(["it's a cat"], "cat"));
  assert.ok(isMatch(["elefant"], "elephant"));
  assert.ok(isMatch(["tree"], "three", ["3", "tree", "free"]));
  assert.ok(!isMatch(["dog"], "cat"));
});

test("shop: spending lowers the purse, never the stars earned", () => {
  const { store } = newStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  const seen = [];
  store.on("stars", (_, n) => seen.push(n));
  store.addStars(p, 12);
  assert.equal(store.purse(p), 12);
  assert.ok(store.buy(p, "pet:farm/cow", 5));
  assert.equal(store.purse(p), 7);
  assert.equal(p.stars, 12, "lifetime stars unchanged");
  assert.ok(!store.buy(p, "pet:farm/cow", 5), "can't buy the same thing twice");
  assert.ok(!store.buy(p, "hat:crown", 10), "can't buy without enough stars");
  assert.equal(store.purse(p), 7);
  assert.ok(store.owns(p, "pet:farm/cow"));
  store.addStars(p, 3);
  assert.ok(store.buy(p, "hat:crown", 10));
  assert.equal(store.purse(p), 0);
  assert.deepEqual(seen, [12, -5, 3, -10], "the stars pill hears every change");
});

test("shop: an animal is for sale once its word was answered right", () => {
  const { store } = newStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  assert.ok(!store.knows(p, "farm/cow"));
  store.mark(p, "farm/cow", false);
  assert.ok(!store.knows(p, "farm/cow"), "met but missed");
  store.mark(p, "farm/cow", true);
  assert.ok(store.knows(p, "farm/cow"));
});

// a fake clock, so tests can move to the next day
function clockStore(init) {
  const clock = { t: new Date(2026, 10, 4, 9, 0).getTime() };
  const storage = fakeStorage(init);
  return { clock, store: createStore({ storage, now: () => clock.t }) };
}
const HOUR = 36e5;
// every word of these stones answered right on two days
const remember = (p, stones) => stones.forEach(st => st.keys.forEach(k =>
  (p.words[k] = { lvl: 2, due: 0, right: 2, wrong: 0, said: 0, clear: 0, seen: 0, days: 2 })));

test("rounds: new words first, never more than six; a stone is met once all its words were shown", () => {
  const { store } = clockStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  const st = store.nextStage(p);
  assert.equal(st.id, "farm-1-1", "starts at the bottom of the first land");
  const r = store.buildRound(p, st);
  assert.equal(r.fresh.length, 3);
  assert.ok(r.words.length >= 3 && r.words.length <= 6);
  r.fresh.forEach(k => store.meet(p, k));
  store.finishRound(p, st, { pic: "img:farm-cow", en: "cow" }, 60000);
  assert.equal(p.rounds, 1); assert.equal(p.stickers.length, 1); assert.equal(p.playMs, 60000);
  assert.ok(!store.stageMet(p, st), "words left to meet");
  assert.equal(store.nextStage(p), st, "so it stays the next stone");
  const r2 = store.buildRound(p, st);
  assert.ok(r2.fresh.length > 0 && r2.fresh.every(k => !r.fresh.includes(k)), "the rest come next time");
  r2.fresh.forEach(k => store.meet(p, k));
  store.finishRound(p, st, { pic: "img:farm-cow", en: "cow" }, 1000);
  assert.ok(store.stageMet(p, st));
  assert.ok(!store.stageDone(p, st), "met is not done");
  assert.notEqual(store.nextStage(p), st, "Play moves on to new words");
});

test("a word stone is done once every word was answered right on two different days", () => {
  const { store, clock } = clockStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  const st = STAGE["farm-1-1"];
  st.keys.forEach(k => store.meet(p, k));
  st.keys.forEach(k => store.mark(p, k, true));
  clock.t += HOUR;
  st.keys.forEach(k => store.mark(p, k, true));
  assert.ok(!store.stageDone(p, st), "right twice on the same day is not enough");
  assert.equal(store.stageProgress(p, st), 0.5, "met, not yet remembered");
  clock.t += 24 * HOUR;
  st.keys.slice(1).forEach(k => store.mark(p, k, true));
  assert.ok(!store.stageDone(p, st), "one word still waits for its second day");
  store.mark(p, st.keys[0], true);
  assert.ok(store.stageDone(p, st));
  assert.equal(store.stageProgress(p, st), 1);
  const q = store.newProfile("Ari"); store.addProfile(q);
  st.keys.forEach(k => { store.mark(q, k, false); });
  clock.t += 24 * HOUR;
  st.keys.forEach(k => { store.mark(q, k, false); });
  assert.ok(!store.stageDone(q, st), "wrong answers never count");
});

test("when every open stone was met, Play picks the stone with words due for review", () => {
  const { store, clock } = clockStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  const open = STAGES.filter(st => st.kind === "word" && store.stageOpen(p, st));
  open.forEach(st => st.keys.forEach(k => { store.meet(p, k); store.mark(p, k, true); }));
  clock.t += 2 * HOUR;
  const next = store.nextStage(p);
  assert.ok(open.includes(next) && store.dueKeys(p, next.keys).length > 0);
});

test("a word stone's round reviews words of its own land only; chests also bring back lands below", () => {
  const { store, clock } = clockStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  const landOf = k => STAGES.find(st => st.kind === "word" && st.keys.includes(k)).land;
  // words met in the first two lands, all due again
  store.unlock("TEST");
  const met = [0, 1].flatMap(gi => LAND_STAGES[gi].filter(st => st.kind === "word").slice(0, 4));
  met.forEach(st => st.keys.forEach(k => { store.meet(p, k); store.mark(p, k, true); }));
  clock.t += 2 * HOUR;
  const fruit = LAND_STAGES[1].find(st => st.kind === "word" && st.tier === 1);
  const { words } = store.buildRound(p, fruit);
  assert.ok(words.length >= 4);
  assert.ok(words.every(k => landOf(k) === 1), "no animals in a Yummy Town stone: " + words.join(", "));
  const chest = LAND_STAGES[1].find(st => st.kind === "chest");
  const animalsDue = store.dueKeys(p, met.filter(st => st.land === 0).flatMap(st => st.keys));
  p.words = Object.fromEntries(Object.entries(p.words).filter(([k]) => landOf(k) === 0));
  assert.ok(animalsDue.length && store.buildRound(p, chest).words.some(k => landOf(k) === 0), "a chest reviews the land below too");
});

test("Play follows the trail: a stone with words due stays the glowing stone", () => {
  const { store, clock } = clockStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  const open = STAGES.filter(st => st.kind === "word" && store.stageOpen(p, st));
  open.forEach(st => st.keys.forEach(k => { store.meet(p, k); store.mark(p, k, true); }));
  // the last stone gets more words due than the first, which the old rule would jump to
  clock.t += 2 * HOUR;
  open.slice(1).forEach(st => st.keys.forEach(k => store.mark(p, k, false)));
  assert.equal(store.nextStage(p), open[0], "the lowest stone not done, not the one with most due");
});

test("lands: one at a time up the trail; inside a land, harder stones open once most easier ones are done", () => {
  const { store } = clockStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  const words = gi => LAND_STAGES[gi].filter(st => st.kind === "word");
  const t1 = words(0).filter(st => st.tier === 1);
  const t2 = words(0).find(st => st.tier === 2);
  assert.ok(t1.every(st => store.stageOpen(p, st)), "the first land's easy stones are open from the start");
  assert.ok(!store.stageOpen(p, t2));
  assert.ok(LAND_STAGES.slice(1).flat().every(st => !store.stageOpen(p, st)), "later lands start locked");
  remember(p, t1.slice(0, Math.ceil(t1.length * 0.7)));
  assert.ok(store.stageOpen(p, t2));
  const easy = words(0).filter(st => st.tier <= 2);
  const need = Math.ceil(easy.length * 0.4);
  const { store: s2 } = clockStore();
  const q = s2.newProfile("Ari"); s2.addProfile(q);
  s2.unlock("TEST");
  remember(q, easy.slice(0, need - 1));
  assert.ok(!s2.landOpen(q, 1), "the next land waits for 40% of this land's easy stones");
  remember(q, easy.slice(need - 1, need));
  assert.ok(s2.landOpen(q, 1));
  assert.ok(words(1).filter(st => st.tier === 1).every(st => s2.stageOpen(q, st)));
  assert.ok(!s2.landOpen(q, 2));
  s2.settings.unlockAll = true;
  assert.ok(STAGES.every(st => s2.stageOpen(q, st)), "parents can open everything");
});

test("lands: a land already played in stays open", () => {
  const { store } = clockStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  store.unlock("TEST");
  const st = LAND_STAGES[3].find(x => x.kind === "word" && x.tier === 1);
  store.meet(p, st.keys[0]);
  assert.ok(store.landOpen(p, 3));
  assert.ok(LAND_STAGES[3].filter(x => x.kind === "word" && x.tier === 1).every(x => store.stageOpen(p, x)));
});

test("rounds below tier 3 never mix up look-alike words", () => {
  const { store } = newStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  for (const st of STAGES.filter(x => x.kind === "word" && x.tier < 3)) {
    const { words } = store.buildRound(p, st);
    for (const a of words) for (const b of words) assert.ok(!confusable(a, b), `${a} and ${b} in ${st.id}`);
  }
});

test("a save from before the big map keeps its finished groups and moved words", () => {
  const old = { v: 2, lastId: "a", settings: {}, profiles: [{ id: "a", name: "Ari", stars: 9, spent: 0, owned: ["pet:wild/dinosaur"],
    words: { "farm/cow": { lvl: 3, due: 0, right: 2, wrong: 0, said: 1, clear: 1, seen: 1 }, "wild/dinosaur": { lvl: 2, due: 0, right: 1, wrong: 0, said: 0, clear: 0, seen: 1 } },
    done: { farm: true }, stickers: [], playMs: 0, rounds: 3, lastPlayed: 0 }] };
  for (const how of ["storage", "restore"]) {
    const { store } = how === "storage" ? newStore({ [KEY]: JSON.stringify(old) }) : newStore();
    if (how === "restore") assert.ok(store.replaceAll(JSON.parse(JSON.stringify(old))));
    const p = store.player();
    assert.ok(store.stageStarted(p, STAGE["farm-1-1"]), how + ": the stone with cow is started");
    assert.ok(p.words["dinos/dinosaur"] && !p.words["wild/dinosaur"], how + ": the dinosaur moved to its own group");
    assert.deepEqual(p.owned, ["pet:dinos/dinosaur"], how + ": and stays in the garden");
    assert.equal(p.mapV, 3);
  }
});

test("every stone has words, and every word is on exactly one word stone", () => {
  const seen = new Map();
  for (const st of STAGES) {
    assert.ok(st.keys.length > 0, st.id);
    if (st.kind === "word") st.keys.forEach(k => seen.set(k, (seen.get(k) || 0) + 1));
  }
  for (const k of ALL_KEYS) assert.equal(seen.get(k), 1, k);
  assert.equal(new Set(STAGES.map(st => st.id)).size, STAGES.length, "stone ids are unique");
});

test("outfits: one thing per slot, a second tap takes it off, older one-hat saves still work", async () => {
  const { worn, toggleWear, OUTFITS } = await import("../public/js/data/outfits.js");
  assert.deepEqual(worn("crown"), ["crown"], "a save from before slots");
  assert.deepEqual(worn(null), []);
  let o = toggleWear("crown", "glasses");
  assert.deepEqual(o, ["crown", "glasses"], "a hat and glasses together");
  o = toggleWear(o, "pirate");
  assert.deepEqual(o, ["glasses", "pirate"], "a new hat replaces the old one");
  o = toggleWear(o, "glasses");
  assert.deepEqual(o, ["pirate"]);
  assert.ok(OUTFITS.every(x => ["head", "face", "neck", "back"].includes(x.slot)));
  assert.equal(new Set(OUTFITS.map(x => x.id)).size, OUTFITS.length);
});
