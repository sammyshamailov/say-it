// Recorded voices (tools/voice/build.mjs): every Hebrew line and every English word has a clip,
// and the clips are played first and saved for offline play.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { hebrewLines, englishWords, englishLines, fileFor } from "../tools/voice/build.mjs";
import { HE_AUDIO } from "../public/js/data/he-audio.js";
import { EN_AUDIO } from "../public/js/data/en-audio.js";
import { WORD } from "../public/js/data/index.js";
import { TALK, SAY, SAY_EN } from "../public/js/data/lines.js";
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

test("every English word and line has a recorded clip (run tools/voice/build.mjs --set en after adding one)", () => {
  const words = new Set(Object.values(WORD).map(w => w.en));
  assert.deepEqual(englishWords().sort(), [...words].sort());
  const lines = new Set(englishLines());
  for (const L of Object.values(LANDS)) assert.ok(lines.has(L.en), L.en);
  for (const t of Object.values(TALK)) t.en.forEach(x => assert.ok(lines.has(x), x));
  Object.values(SAY_EN).forEach(x => assert.ok(lines.has(x), x));
  assert.deepEqual([...lines].filter(t => !EN_AUDIO[t]), [], "English without a clip");
  for (const [t, f] of Object.entries(EN_AUDIO)) {
    assert.match(f, /^en-[0-9a-f]{12}\.m4a\?h=[0-9a-f]{8}$/, t);
    assert.equal(f.split("?")[0], fileFor(t, "en"), t);
    assert.ok(existsSync(pub("audio/en/" + f.split("?")[0])), "file for " + t);
  }
});

test("no clip files are left over from lines that are gone (tools/voice/build.mjs --prune)", () => {
  for (const [dir, map] of [["he", HE_AUDIO], ["en", EN_AUDIO]]) {
    const used = new Set(Object.values(map).map(f => f.split("?")[0]));
    assert.deepEqual(readdirSync(pub("audio/" + dir)).filter(f => !used.has(f)), [], dir);
  }
});

test("all speech goes through the recorded clips, saved for offline play", () => {
  const sound = src("js/services/sound.js");
  assert.match(sound, /HE_AUDIO/, "sound.js plays the clips");
  assert.match(sound, /if \(heVoice\) return speak\(text, "he"\)/, "the device voice is the fallback");
  assert.match(sound, /hasHebrew\(he\)\) return hebrew\(he\)/, "feedback goes through the clips");
  assert.match(sound, /if \(EN_AUDIO\[text\]\)[\s\S]{0,120}playUrl\("audio\/en\/"/, "English plays Sarah's clip first");
  assert.match(sound, /const word = english;/, "words are English lines like any other");
  assert.match(sound, /return english\(pick\(t\.en\)\)/, "English feedback is Sarah too");
  assert.match(src("js/main.js"), /voice: Sound\.voiceUrls\(\)/);
  assert.match(src("js/pwa.js"), /cache-voice/);
  const sw = src("sw.js");
  assert.match(sw, /"cache-voice": VOICE/);
  assert.match(sw, /includes\("\/audio\/"\)[\s\S]{0,80}cacheFirst\(VOICE/);
  // nothing outside sound.js uses the device voice directly
  const js = d => readdirSync(pub(d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? js(d + "/" + e.name) : e.name.endsWith(".js") ? [d + "/" + e.name] : []);
  for (const f of js("js")) if (f !== "js/services/sound.js") assert.doesNotMatch(src(f), /\bspeak\(|speechSynthesis/, f);
});

test("the Wikimedia recordings are gone (Sarah says every word since 2.11)", () => {
  assert.ok(!existsSync(pub("js/data/audio-map.js")));
  for (const f of ["js/services/sound.js", "sw.js", "js/pwa.js", "js/main.js", "js/parent/dashboard.js", "../netlify.toml"])
    assert.doesNotMatch(src(f), /wikimedia|AUDIO_MAP|cache-audio/i, f);
  assert.match(src("sw.js"), /k === "sayit-audio"/, "phones delete the old recordings");
});
