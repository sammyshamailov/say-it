// Tests for the on-device store (export, restore, migration, shop) and the speech matcher.
// The store is a factory that takes its storage, so it runs here against an in-memory fake.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createStore, isSave, KEY } from "../public/js/services/store.js";
import { isMatch } from "../public/js/services/match.js";

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

test("rounds: new words first, never more than six, finishing opens the next stone", () => {
  const { store } = newStore();
  const p = store.newProfile("Noa"); store.addProfile(p);
  const s = store.nextSub(p);
  assert.equal(s.id, "farm");
  const r = store.buildRound(p, s);
  assert.equal(r.fresh.length, 3);
  assert.ok(r.words.length >= 4 && r.words.length <= 6);
  store.finishRound(p, s, { pic: "img:farm-cow", en: "cow" }, 60000);
  assert.equal(p.rounds, 1); assert.equal(p.stickers.length, 1); assert.equal(p.playMs, 60000);
  assert.ok(store.subUnlocked(p, s.group.subs[1]), "next stone open");
});
