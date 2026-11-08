// Tests for parent unlock codes (the function) and the free-first-land rule (the store).
import { test } from "node:test";
import assert from "node:assert/strict";
import { handle, makeCode, checkCode, formatCode } from "../netlify/functions/unlock.mjs";
import { createStore } from "../public/js/services/store.js";
import { STAGES, LAND_STAGES } from "../public/js/data/stages.js";

const SECRET = "test-secret";
function memStore() {
  const m = new Map();
  return { get: async k => m.get(k) ?? null, set: async (k, v) => { m.set(k, v); }, m };
}
const PHONE = ["phoneone1234", "phonetwo1234", "phonethree12"];
const post = body => new Request("https://x/api/unlock", { method: "POST", body: JSON.stringify({ device: PHONE[0], ...body }) });

test("a code made with the secret opens; changed or foreign codes don't", async () => {
  const code = await makeCode(SECRET);
  assert.match(code, /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{10}$/);
  assert.ok(await checkCode(SECRET, formatCode(code).toLowerCase()), "dash and lower case are fine");
  const wrong = code.slice(0, 9) + (code[9] === "A" ? "B" : "A");
  assert.ok(!(await checkCode(SECRET, wrong)));
  assert.ok(!(await checkCode("other-secret", code)));
  assert.ok(!(await checkCode(SECRET, "short")));
  const s = memStore();
  assert.equal((await handle(post({ code }), SECRET, s)).status, 200);
  assert.equal((await handle(post({ code: wrong }), SECRET, s)).status, 404);
  assert.equal((await handle(post({ code }), undefined, s)).status, 503, "no secret set: not ready, never open");
  assert.equal((await handle(new Request("https://x/api/unlock"), SECRET, s)).status, 405);
});

test("a code opens two devices, the same device again, and not a third", async () => {
  const code = await makeCode(SECRET), s = memStore();
  const on = device => handle(post({ code: formatCode(code), device }), SECRET, s).then(r => r.status);
  assert.equal(await on(PHONE[0]), 200);
  assert.equal(await on(PHONE[0]), 200, "entering it again on the same phone is free");
  assert.equal(await on(PHONE[1]), 200);
  assert.equal(await on(PHONE[2]), 409, "a third device is refused");
  assert.equal(await on(PHONE[1]), 200, "the two devices still work");
  assert.equal(await on("../bad"), 400);
  assert.deepEqual(JSON.parse(s.m.get(code)), PHONE.slice(0, 2), "only the random device ids are kept");
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

test("the unlock stays on its phone: transfers and backups never carry or remove it", () => {
  const a = fresh();
  const before = JSON.parse(JSON.stringify(a.store.exportData()));
  a.store.unlock("ABCDE-FGHJK");
  const b = fresh();
  assert.ok(b.store.replaceAll(JSON.parse(JSON.stringify(a.store.exportData()))));
  assert.ok(!b.store.unlocked(), "a transfer doesn't unlock another phone");
  assert.ok(!("unlocked" in a.store.exportData()));
  assert.ok(a.store.replaceAll(before));
  assert.ok(a.store.unlocked(), "restoring a backup keeps this phone's unlock");
  const forged = { ...a.store.exportData(), unlocked: { at: 1, code: "X" } };
  assert.ok(b.store.replaceAll(forged) && !b.store.unlocked(), "a backup file edited to say unlocked doesn't unlock");
});
