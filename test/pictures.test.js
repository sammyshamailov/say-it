// Every word's picture exists (both versions for pictures drawn with the boy and the girl), and
// pairs whose size is the point (big/small, long/short) keep their size difference.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { ALL_KEYS, WORD, GENDERED } from "../public/js/data/index.js";

const ROOT = new URL("../", import.meta.url);
const file = id => new URL(`public/img/words/${id}.webp`, ROOT);

test("every word's picture exists, in both versions when it has a boy and a girl", () => {
  const missing = [];
  for (const k of ALL_KEYS) {
    const pic = WORD[k].pic;
    if (!pic.startsWith("img:")) continue;
    const id = pic.slice(4);
    const ids = GENDERED.test(id) ? [id + "-boy", id + "-girl"] : [id];
    for (const i of ids) if (!existsSync(file(i))) missing.push(`${k} -> ${i}`);
  }
  assert.deepEqual(missing, []);
});

test("big/small, up/down and long/short are cut at one scale, so their size difference shows", () => {
  const sheets = JSON.parse(readFileSync(new URL("tools/pictures/sheets.json", ROOT), "utf8"));
  const groups = sheets.flatMap(s => s.same_scale || []).map(g => g.join("+"));
  for (const g of ["opp-big+opp-small", "opp-up+opp-down", "opp-long+opp-short"]) assert.ok(groups.includes(g), g);
});
