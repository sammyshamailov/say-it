// Tests for the on-device store (export, restore, migration, shop) and the speech matcher.
// The store is a factory that takes its storage, so it runs here against an in-memory fake.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createStore, isSave, KEY } from "../public/js/services/store.js";
import { isMatch } from "../public/js/services/match.js";
import { STAGES, STAGE, confusable } from "../public/js/data/stages.js";
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

test("rounds: new words first, never more than six, a stone is done once all its words were met", () => {
  const { store } = newStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  const st = store.nextStage(p);
  assert.equal(st.id, "farm-1-1", "starts at the bottom of the first land");
  const r = store.buildRound(p, st);
  assert.equal(r.fresh.length, 3);
  assert.ok(r.words.length >= 3 && r.words.length <= 6);
  r.fresh.forEach(k => store.meet(p, k));
  store.finishRound(p, st, { pic: "img:farm-cow", en: "cow" }, 60000);
  assert.equal(p.rounds, 1); assert.equal(p.stickers.length, 1); assert.equal(p.playMs, 60000);
  assert.ok(!store.stageDone(p, st), "words left to meet");
  assert.equal(store.nextStage(p), st, "so it stays the next stone");
  const r2 = store.buildRound(p, st);
  assert.ok(r2.fresh.length > 0 && r2.fresh.every(k => !r.fresh.includes(k)), "the rest come next time");
  r2.fresh.forEach(k => store.meet(p, k));
  store.finishRound(p, st, { pic: "img:farm-cow", en: "cow" }, 1000);
  assert.ok(store.stageDone(p, st));
  assert.notEqual(store.nextStage(p), st);
});

test("tiers: harder stones open once most easier ones are done", () => {
  const { store } = newStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  const t1 = STAGES.filter(st => st.kind === "word" && st.tier === 1);
  const t2 = STAGES.find(st => st.kind === "word" && st.tier === 2);
  assert.ok(t1.every(st => store.stageOpen(p, st)), "every easy stone is open from the start");
  assert.ok(!store.stageOpen(p, t2));
  t1.slice(0, Math.ceil(t1.length * 0.7)).forEach(st => (p.stages[st.id] = true));
  assert.ok(store.stageOpen(p, t2));
  store.settings.unlockAll = true;
  assert.ok(STAGES.every(st => store.stageOpen(p, st)), "parents can open everything");
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
    assert.ok(store.stageDone(p, STAGE["farm-1-1"]), how + ": the stone with cow is done");
    assert.ok(!store.stageDone(p, STAGE["farm-3-1"]), how + ": stones of new farm words are not");
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
