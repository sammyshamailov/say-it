// Tests for the transfer-code function, using an in-memory stand-in for Netlify Blobs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { handle, cleanCode, looksLikeSave } from "../netlify/functions/transfer.mjs";

function memStore() {
  const m = new Map();
  return {
    m,
    async set(k, v, o = {}) { if (o.onlyIfNew && m.has(k)) return { modified: false }; m.set(k, { data: v, metadata: o.metadata }); return { modified: true }; },
    async getWithMetadata(k) { return m.get(k) || null; },
    async delete(k) { m.delete(k); }
  };
}
const save = { v: 2, profiles: [{ id: "k1", name: "Dana", words: { "farm/cow": { lvl: 2 } }, stars: 5 }], settings: {} };
const post = (body) => new Request("https://x/api/transfer", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) });
const get = (code) => new Request("https://x/api/transfer?code=" + encodeURIComponent(code));

test("creates a code and hands the save back exactly once", async () => {
  const s = memStore();
  const r1 = await handle(post({ data: save }), s);
  assert.equal(r1.status, 200);
  const { code, expires } = await r1.json();
  assert.match(code, /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/);
  assert.ok(expires > Date.now() + 14 * 60e3);
  const r2 = await handle(get(code.toLowerCase().slice(0, 3) + "-" + code.slice(3)), s);
  assert.equal(r2.status, 200);
  assert.deepEqual((await r2.json()).data, save);
  assert.equal((await handle(get(code), s)).status, 404, "second use fails");
  assert.equal(s.m.size, 0, "nothing left stored");
});

test("expired codes are refused and deleted", async () => {
  const s = memStore();
  const { code } = await (await handle(post({ data: save }), s)).json();
  s.m.get(code).metadata.expires = Date.now() - 1;
  assert.equal((await handle(get(code), s)).status, 410);
  assert.equal(s.m.size, 0);
});

test("rejects anything that isn't a Say It! save", async () => {
  const s = memStore();
  assert.equal((await handle(post("not json"), s)).status, 400);
  assert.equal((await handle(post({ data: { hello: 1 } }), s)).status, 400);
  assert.equal((await handle(post({ data: { ...save, v: 1 } }), s)).status, 400);
  assert.equal((await handle(post("x".repeat(300 * 1024)), s)).status, 413);
  assert.equal(s.m.size, 0);
});

test("bad or missing codes are a plain 404", async () => {
  const s = memStore();
  for (const c of ["", "ABC", "AAAAAAA", "OOOOOO", "../x"]) assert.equal((await handle(get(c), s)).status, 404);
});

test("helpers", () => {
  assert.equal(cleanCode(" k7p-42q "), "K7P42Q");
  assert.ok(looksLikeSave(save));
  assert.ok(!looksLikeSave(null));
  assert.ok(!looksLikeSave({ v: 2, profiles: [{}] }));
});
