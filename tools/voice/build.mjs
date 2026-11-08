#!/usr/bin/env node
// Recorded voices, made with ElevenLabs (model Eleven v4) so children hear the same voice on every
// phone instead of the device's own:
//
//   he   every Hebrew line the app speaks, voice "Zina – Young & Soulful": every word's Hebrew in
//        data/words.js (boy and girl forms), the land names (data/lands.js) and Pipo's lines
//        (data/lines.js). Manifest data/he-audio.js (HE_AUDIO), clips in public/audio/he/.
//   en   all English, voice "Sarah" (premade): every word alone with a period ("Cow."), the land
//        names and Pipo's English lines. Manifest data/en-audio.js (EN_AUDIO), clips in
//        public/audio/en/.
//
// Each clip is trimmed of silence, levelled to the same loudness and saved as small AAC (mono,
// 56 kbps). The manifest maps text -> clip file (?h= its contents, so a clip made again is fetched
// again). A clip that already exists is never made again, so running it twice costs nothing.
//
//   ELEVENLABS_API_KEY=... NODE_USE_ENV_PROXY=1 node tools/voice/build.mjs [options]
//
//   --set he|en    work on one set only (default: all)
//   --list         print the lines, what's missing, and the characters it would cost; no API calls
//   --limit N      make at most N new clips per set (a test batch)
//   --only "text"  make just this line (may repeat)
//   --redo "text"  make this line again even if it exists (may repeat); e.g. after fixing SPELL
//   --prune        delete clips no line uses any more
//
// NODE_USE_ENV_PROXY=1 only matters behind an HTTPS proxy (Node's fetch ignores HTTPS_PROXY
// otherwise). Needs ffmpeg.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";
import { WORDS } from "../../public/js/data/words.js";
import { LANDS } from "../../public/js/data/lands.js";
import { TALK, SAY, SAY_EN } from "../../public/js/data/lines.js";

const ROOT = join(fileURLToPath(import.meta.url), "../../..");
const MODEL = "eleven_v4";
const LUFS = -16;                        // loudness every clip is brought to
const PEAK_DB = -1.5;                    // and never louder than this
const API = "https://api.elevenlabs.io/v1";

// What to send for a line when the plain spelling comes out wrong: niqqud for Hebrew
// (e.g. "סַפָּה"), a respelling for English. The clip is still found by the text the app uses.
export const SPELL = { he: {}, en: {} };

// ---------- lines ----------
export function hebrewLines() {
  const lines = [];
  const add = t => { t = String(t || "").trim(); if (t && !lines.includes(t)) lines.push(t); };
  for (const g of WORDS) for (const s of g.subs) for (const w of s.w) w[2].split("|").forEach(add);
  Object.values(LANDS).forEach(L => add(L.he));
  Object.values(TALK).forEach(t => [...t.m, ...t.f].forEach(add));
  Object.values(SAY).forEach(add);
  return lines;
}
export function englishWords() {
  const lines = [];
  for (const g of WORDS) for (const s of g.subs) for (const w of s.w) if (!lines.includes(w[0])) lines.push(w[0]);
  return lines;
}
// every English line the app speaks: the words, the land names, Pipo's English lines
export function englishLines() {
  const lines = englishWords();
  const add = t => { if (t && !lines.includes(t)) lines.push(t); };
  Object.values(LANDS).forEach(L => add(L.en));
  Object.values(TALK).forEach(t => t.en.forEach(add));
  Object.values(SAY_EN).forEach(add);
  return lines;
}
export const fileFor = (text, prefix = "he") => prefix + "-" + createHash("sha1").update(text.normalize("NFC")).digest("hex").slice(0, 12) + ".m4a";

export const SETS = {
  he: { voice: "Tbj9UQjXon5RB9MPEyc2", // Zina – Young & Soulful (shared voice library, Hebrew)
    lang: "he", speed: 0.9, dir: "he", manifest: "he-audio.js", name: "HE_AUDIO", lines: hebrewLines,
    say: t => SPELL.he[t] || t,
    about: "Hebrew text -> recorded clip in public/audio/he/ (voice: Zina – Young & Soulful, ElevenLabs Eleven v4).\n// Lines missing here use the device's Hebrew voice." },
  en: { voice: "EXAVITQu4vr4xnSDxMaL", // Sarah (premade ElevenLabs voice, American)
    lang: "en", speed: 0.9, dir: "en", manifest: "en-audio.js", name: "EN_AUDIO", lines: englishLines,
    // a word alone gets a capital and a period ("Cow."), so it's said as a whole, finished word
    say: t => SPELL.en[t] || (/[.!?]$/.test(t) ? t : t.charAt(0).toUpperCase() + t.slice(1) + "."),
    about: "English text -> recorded clip in public/audio/en/ (voice: Sarah, ElevenLabs Eleven v4): every word,\n// the land names and Pipo's English lines." }
};
for (const [id, set] of Object.entries(SETS)) {
  set.id = id;
  set.out = join(ROOT, "public/audio", set.dir);
  set.file = t => fileFor(t, id);
}

// ---------- ElevenLabs ----------
const key = () => process.env.ELEVENLABS_API_KEY || "";
async function api(path, init = {}, tries = 5) {
  for (let i = 1; ; i++) {
    const r = await fetch(API + path, { ...init, headers: { "xi-api-key": key(), ...(init.headers || {}) } });
    if (r.ok) return r;
    const body = await r.text();
    if ((r.status === 429 || r.status >= 500) && i < tries) { await new Promise(res => setTimeout(res, 2000 * i)); continue; }
    throw new Error(`${path}: ${r.status} ${body.slice(0, 300)}`);
  }
}
async function speak(set, text, settings) {
  const r = await api(`/text-to-speech/${set.voice}?output_format=mp3_44100_128`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: set.say(text), model_id: MODEL, language_code: set.lang, voice_settings: settings })
  });
  return Buffer.from(await r.arrayBuffer());
}

// ---------- audio: trim, level, encode ----------
const ff = args => execFileSync("ffmpeg", ["-hide_banner", "-nostdin", "-y", ...args], { stdio: ["ignore", "pipe", "pipe"] });
// silence off both ends (keeping 40 ms so nothing is clipped), soft 10/30 ms fades against clicks
const TRIM = [
  "silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.04",
  "areverse",
  "silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.04",
  "afade=t=in:d=0.03",
  "areverse",
  "afade=t=in:d=0.01"
].join(",");
export function makeClip(mp3, out) {
  const dir = mkdtempSync(join(tmpdir(), "voice-"));
  try {
    const src = join(dir, "in.mp3"), trimmed = join(dir, "trimmed.wav");
    writeFileSync(src, mp3);
    ff(["-v", "error", "-i", src, "-af", TRIM, "-ac", "1", "-ar", "44100", trimmed]);
    const gain = LUFS - integrated(trimmed);
    ff(["-v", "error", "-i", trimmed, "-af", `volume=${gain.toFixed(2)}dB,alimiter=limit=${Math.pow(10, PEAK_DB / 20).toFixed(3)}:level=false:attack=1:release=20`,
      "-ac", "1", "-ar", "44100", "-c:a", "aac", "-b:a", "56k", "-movflags", "+faststart", out]);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
// integrated loudness (LUFS); padded with silence so even a one-syllable word is long enough to
// measure (the silence is gated out)
function integrated(file) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostdin", "-i", file, "-af", "apad=whole_dur=3,loudnorm=print_format=json", "-f", "null", "-"], { encoding: "utf8" });
  const json = r.stderr.slice(r.stderr.lastIndexOf("{"));
  const i = parseFloat(JSON.parse(json).input_i);
  if (!isFinite(i)) throw new Error("could not measure loudness of " + file);
  return i;
}

// ---------- manifest ----------
function writeManifest(set, lines) {
  const map = {};
  // ?h= changes when a clip is made again (--redo), so phones fetch the new one instead of the saved copy
  for (const t of lines) {
    const f = join(set.out, set.file(t));
    if (existsSync(f)) map[t] = set.file(t) + "?h=" + createHash("sha1").update(readFileSync(f)).digest("hex").slice(0, 8);
  }
  writeFileSync(join(ROOT, "public/js/data", set.manifest),
    "// " + set.about + "\n// Written by tools/voice/build.mjs; don't edit by hand.\n" +
    `export const ${set.name} = {\n` + Object.entries(map).map(([t, f]) => `  ${JSON.stringify(t)}: ${JSON.stringify(f)}`).join(",\n") + "\n};\n");
  return Object.keys(map).length;
}

async function build(set, args) {
  const opt = name => args.flatMap((a, i) => (a === name ? [args[i + 1]] : []));
  const lines = set.lines(), has = t => existsSync(join(set.out, set.file(t)));
  mkdirSync(set.out, { recursive: true });
  const redo = new Set(opt("--redo")), only = opt("--only");
  let todo = lines.filter(t => redo.has(t) || !has(t));
  if (only.length) todo = todo.filter(t => only.includes(t));
  const limit = parseInt(opt("--limit")[0], 10);
  if (limit >= 0) todo = todo.slice(0, limit);
  const chars = todo.reduce((n, t) => n + set.say(t).length, 0);
  console.log(`[${set.id}] ${lines.length} lines, ${lines.filter(has).length} recorded; making ${todo.length} (${chars} characters).`);

  if (args.includes("--list")) {
    for (const t of lines) console.log((has(t) ? "  ok  " : "  --  ") + set.file(t) + "  " + t);
    return;
  }
  if (args.includes("--prune")) {
    const used = new Set(lines.map(set.file));
    for (const f of readdirSync(set.out)) if (f.endsWith(".m4a") && !used.has(f)) { unlinkSync(join(set.out, f)); console.log("removed", f); }
  }
  if (todo.length) {
    if (!key()) { console.error("Set ELEVENLABS_API_KEY."); process.exit(1); }
    const settings = { ...(await (await api(`/voices/${set.voice}/settings`)).json()), speed: set.speed };
    let next = 0, made = 0, failed = 0;
    const worker = async () => {
      while (next < todo.length) {
        const t = todo[next++];
        try {
          makeClip(await speak(set, t, settings), join(set.out, set.file(t)));
          made++; console.log(`  ${made}/${todo.length}  ${set.file(t)}  ${t}`);
        } catch (e) { failed++; console.error("  failed:", t, e.message); }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    console.log(`[${set.id}] made ${made}${failed ? `, ${failed} failed (run again to retry)` : ""}.`);
  }
  console.log(`[${set.id}] manifest: ${writeManifest(set, lines)} of ${lines.length} lines have a clip.`);
}

// ---------- main ----------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const pick = args.flatMap((a, i) => (a === "--set" ? [args[i + 1]] : []));
  for (const id of pick.length ? pick : Object.keys(SETS)) {
    if (!SETS[id]) { console.error("Unknown set " + id + "; sets: " + Object.keys(SETS).join(", ")); process.exit(1); }
    await build(SETS[id], args);
  }
}
