// Checks that keep the app's structure honest: safe templates, and release files in sync.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { html, raw } from "../public/js/core/html.js";
import { Router } from "../public/js/core/router.js";
import { render, currentVersion } from "../tools/release.mjs";

test("templates escape values unless marked trusted", () => {
  const name = `<img src=x onerror="alert(1)">`;
  assert.equal(String(html`<b title="${name}">${name}</b>`), `<b title="&lt;img src=x onerror=&quot;alert(1)&quot;&gt;">&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</b>`);
  assert.equal(String(html`${raw("<i></i>")}${[html`<b>${"&"}</b>`, "<"]}${null}${undefined}${false}`), "<i></i><b>&amp;</b>&lt;false");
});

test("router: back steps through the stack, reset and replace start over", () => {
  const r = new Router(), shown = [];
  for (const n of ["map", "land", "round", "gate", "dashboard"]) r.register(n, (...a) => shown.push([n, ...a].join(":")));
  let left = 0; r.beforeShow(n => { if (n !== "round") left++; });
  r.reset("map"); r.go("land", 2); r.go("round");
  r.back();
  assert.equal(shown.at(-1), "land:2", "back shows the previous screen with its arguments");
  r.go("gate"); r.replace("dashboard"); r.back();
  assert.equal(shown.at(-1), "land:2", "the gate is not on the way back");
  r.back(); r.back();
  assert.equal(shown.at(-1), "map", "never goes back past the first screen");
  let open = 1; r.interceptBack(() => open-- > 0);
  const before = shown.length; r.back();
  assert.equal(shown.length, before, "an open sheet takes the back press");
  assert.ok(left > 0);
});

test("release files are in sync (run `npm run release` after adding or removing a file)", () => {
  const v = currentVersion();
  const want = render(v);
  for (const f of Object.keys(want))
    assert.equal(readFileSync(new URL("../public/" + f, import.meta.url), "utf8"), want[f], `public/${f} is out of date`);
});

test("Say it: another word gets \"almost, try again\" and no star; only the right word is rewarded", () => {
  const say = readFileSync(new URL("../public/js/round/steps/say.js", import.meta.url), "utf8");
  assert.match(say, /if \(res\.heard\) await \(Speech\.isMatch\(res\.heard, w\.en, w\.alts\) \? reward\(true\) : missed\("almost"\)\);/);
  assert.match(say, /let echo = Speech\.mode\(\) !== "recognize" \|\| attempts >= 1;/, "the try after a miss is Echo");
});
