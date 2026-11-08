// Hebrew voice clips (tools/voice/build.mjs): every Hebrew line the app speaks has a recording,
// and the recordings are saved for offline play.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { hebrewLines, fileFor } from "../tools/voice/build.mjs";
import { HE_AUDIO } from "../public/js/data/he-audio.js";
import { TALK, SAY } from "../public/js/data/he-lines.js";
import { WORDS } from "../public/js/data/words.js";
import { LANDS } from "../public/js/data/lands.js";

const pub = f => new URL("../public/" + f, import.meta.url);
const src = f => readFileSync(pub(f), "utf8");

test("every Hebrew line has a recorded clip (run tools/voice/build.mjs after changing one)", () => {
  const missing = hebrewLines().filter(t => !HE_AUDIO[t]);
  assert.deepEqual(missing, [], "lines without a clip");
  for (const [t, f] of Object.entries(HE_AUDIO)) {
    assert.match(f, /^he-[0-9a-f]{12}\.m4a\?h=[0-9a-f]{8}$/, t);
    assert.equal(f.split("?")[0], fileFor(t), t);
    assert.ok(existsSync(pub("audio/he/" + f.split("?")[0])), "file for " + t);
  }
});

test("the lines cover words in both forms, lands, Pipo's feedback and fixed sentences", () => {
  const lines = new Set(hebrewLines());
  for (const g of WORDS) for (const s of g.subs) for (const w of s.w)
    for (const form of w[2].split("|")) assert.ok(lines.has(form), w[0] + ": " + form);
  for (const L of Object.values(LANDS)) assert.ok(lines.has(L.he), L.en);
  for (const [k, t] of Object.entries(TALK)) {
    assert.ok(t.m.length && t.f.length && t.en.length, k);
    for (const x of [...t.m, ...t.f]) assert.ok(lines.has(x), k + ": " + x);
  }
  for (const x of Object.values(SAY)) assert.ok(lines.has(x), x);
  assert.ok(lines.has("שמחה") && lines.has("לא שמעתי. נסי שוב!"), "girl forms");
});

test("no clip files are left over from lines that are gone (tools/voice/build.mjs --prune)", () => {
  const used = new Set(Object.values(HE_AUDIO).map(f => f.split("?")[0]));
  const extra = readdirSync(pub("audio/he")).filter(f => !used.has(f));
  assert.deepEqual(extra, []);
});

test("Hebrew is spoken through the clips, saved for offline play", () => {
  const sound = src("js/services/sound.js");
  assert.match(sound, /HE_AUDIO/, "sound.js plays the clips");
  assert.match(sound, /if \(heVoice\) return speak\(text, "he"\)/, "the device voice is the fallback");
  assert.match(sound, /hasHebrew\(he\)\) return hebrew\(he\)/, "feedback goes through the clips");
  assert.match(src("js/main.js"), /voice: Sound\.voiceUrls\(\)/);
  assert.match(src("js/pwa.js"), /cache-voice/);
  const sw = src("sw.js");
  assert.match(sw, /"cache-voice": VOICE/);
  assert.match(sw, /\/audio\/he\/[\s\S]{0,60}cacheFirst\(VOICE/);
  // nothing outside sound.js speaks Hebrew with the device voice directly
  const js = d => readdirSync(pub(d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? js(d + "/" + e.name) : e.name.endsWith(".js") ? [d + "/" + e.name] : []);
  for (const f of js("js")) if (f !== "js/services/sound.js") assert.doesNotMatch(src(f), /speak\([^)]*"he"/, f);
});
