// Tests for parent unlock codes (the function) and the free-first-land rule (the store).
import { test } from "node:test";
import assert from "node:assert/strict";
import { handle, makeCode, checkCode, formatCode } from "../netlify/functions/unlock.mjs";
import { createStore } from "../public/js/services/store.js";
import { STAGES, LAND_STAGES } from "../public/js/data/stages.js";

const SECRET = "test-secret";
const post = body => new Request("https://x/api/unlock", { method: "POST", body: JSON.stringify(body) });

test("a code made with the secret opens; changed or foreign codes don't", async () => {
  const code = await makeCode(SECRET);
  assert.match(code, /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{10}$/);
  assert.ok(await checkCode(SECRET, formatCode(code).toLowerCase()), "dash and lower case are fine");
  const wrong = code.slice(0, 9) + (code[9] === "A" ? "B" : "A");
  assert.ok(!(await checkCode(SECRET, wrong)));
  assert.ok(!(await checkCode("other-secret", code)));
  assert.ok(!(await checkCode(SECRET, "short")));
  assert.equal((await handle(post({ code }), SECRET)).status, 200);
  assert.equal((await handle(post({ code: wrong }), SECRET)).status, 404);
  assert.equal((await handle(post({ code }), undefined)).status, 503, "no secret set: not ready, never open");
  assert.equal((await handle(new Request("https://x/api/unlock"), SECRET)).status, 405);
});

function fresh() {
  const m = new Map();
  const store = createStore({ storage: { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) } });
  const p = store.newProfile("Noa"); store.addProfile(p);
  return { store, p };
}
const rememberAll = (p, stones) => stones.forEach(st => st.keys.forEach(k =>
  (p.words[k] = { lvl: 3, due: 0, right: 2, wrong: 0, said: 0, clear: 0, seen: 0, days: 2 })));

test("only the first land is free; an unlock opens the rest for every child", () => {
  const { store, p } = fresh();
  rememberAll(p, LAND_STAGES[0].filter(st => st.kind === "word"));
  rememberAll(p, LAND_STAGES[1].filter(st => st.kind === "word").slice(0, 1)); // played there before
  store.settings.unlockAll = true;
  assert.ok(LAND_STAGES[0].every(st => store.stageOpen(p, st)), "the whole first land");
  assert.ok(LAND_STAGES.slice(1).flat().every(st => !store.stageOpen(p, st)), "nothing else, not even with unlock all or old progress");
  assert.ok(STAGES.indexOf(store.nextStage(p)) < LAND_STAGES[0].length, "Play stays in the free land");
  store.settings.unlockAll = false;
  store.unlock("ABCDE-FGHJK");
  assert.ok(store.unlocked() && store.landOpen(p, 1));
  const q = store.newProfile("Ari"); store.addProfile(q);
  assert.ok(store.landPaid(5), "for every child on the phone");
});

test("the unlock travels with a transfer and survives restoring an older backup", () => {
  const a = fresh();
  const before = JSON.parse(JSON.stringify(a.store.exportData()));
  a.store.unlock("ABCDE-FGHJK");
  const b = fresh();
  assert.ok(b.store.replaceAll(JSON.parse(JSON.stringify(a.store.exportData()))));
  assert.ok(b.store.unlocked(), "moved to the new phone");
  assert.ok(a.store.replaceAll(before));
  assert.ok(a.store.unlocked(), "an older backup doesn't lock the map again");
});
