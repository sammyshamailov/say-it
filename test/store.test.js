// Tests for the on-device store: export, restore, and the speech matcher.
// The app files are plain browser scripts, so they run here against small fakes of window and localStorage.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function loadApp(stored = {}) {
  const ls = new Map(Object.entries(stored));
  const listeners = {};
  const ctx = {
    localStorage: { getItem: k => ls.has(k) ? ls.get(k) : null, setItem: (k, v) => ls.set(k, String(v)) },
    navigator: {}, addEventListener: (n, f) => { listeners[n] = f; },
    document: { addEventListener() {}, hidden: false },
    matchMedia: () => ({ matches: false }), setTimeout, clearTimeout, console
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of ["words.js", "store.js", "speech.js"]) vm.runInContext(readFileSync(new URL("../public/js/" + f, import.meta.url), "utf8"), ctx);
  return { ctx, ls, listeners, Store: ctx.Store, Speech: ctx.Speech };
}

test("export then restore on a fresh phone gives the same progress", () => {
  const a = loadApp();
  const p = a.Store.newProfile("Noa", "🦄", "f");
  a.Store.state.profiles.push(p); a.Store.state.lastId = p.id;
  a.Store.mark(p, "farm/cow", true); a.Store.addStars(p, 3);
  const data = JSON.parse(JSON.stringify(a.Store.exportData()));

  const b = loadApp();
  assert.equal(b.Store.state.profiles.length, 0);
  assert.ok(b.Store.replaceAll(data));
  assert.equal(b.Store.player().name, "Noa");
  assert.equal(b.Store.player().stars, 3);
  assert.equal(b.Store.player().words["farm/cow"].lvl, 1);
  assert.equal(JSON.parse(b.ls.get("sayit2")).profiles[0].name, "Noa", "saved to localStorage at once");
});

test("restore refuses files that aren't a save and keeps current progress", () => {
  const a = loadApp();
  a.Store.state.profiles.push(a.Store.newProfile("Ari"));
  for (const bad of [null, {}, { v: 1, profiles: [] }, { v: 2, profiles: [{ id: 3 }] }]) assert.equal(a.Store.replaceAll(bad), false);
  assert.equal(a.Store.state.profiles[0].name, "Ari");
});

test("restore fills in fields an older save is missing", () => {
  const a = loadApp();
  assert.ok(a.Store.replaceAll({ v: 2, profiles: [{ id: "x", name: "Tom", words: {} }], lastId: "gone" }));
  const p = a.Store.player();
  assert.equal(p.id, "x"); assert.deepEqual([...p.stickers], []); assert.equal(p.stars, 0);
  assert.equal(a.Store.state.settings.sayMode, "auto");
});

test("leaving the app saves immediately", () => {
  const a = loadApp();
  a.Store.state.profiles.push(a.Store.newProfile("Lia"));
  a.Store.save();               // normally delayed 250 ms
  a.listeners.pagehide();
  assert.equal(JSON.parse(a.ls.get("sayit2")).profiles[0].name, "Lia");
});

test("speech matcher stays forgiving", () => {
  const { Speech } = loadApp();
  assert.ok(Speech.isMatch(["it's a cat"], "cat"));
  assert.ok(Speech.isMatch(["elefant"], "elephant"));
  assert.ok(Speech.isMatch(["tree"], "three", ["3", "tree", "free"]));
  assert.ok(!Speech.isMatch(["dog"], "cat"));
});
