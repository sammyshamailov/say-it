#!/usr/bin/env node
// Hebrew voice clips: every Hebrew line the app speaks, recorded by the ElevenLabs voice
// "Zina – Young & Soulful" (model Eleven v4), so children hear the same warm voice on every phone
// instead of the device's own Hebrew voice (which many phones don't even have).
//
// Lines:  every word's Hebrew in data/words.js (boy and girl forms), the land names in
//         data/lands.js, and Pipo's lines in data/he-lines.js.
// Writes: public/audio/he/<hash>.m4a          one small AAC clip per line (mono, 56 kbps)
//         public/js/data/he-audio.js          the manifest: Hebrew text -> clip file (?h= its contents)
//
// A clip that already exists is never made again, so running it twice costs nothing.
//
//   ELEVENLABS_API_KEY=... NODE_USE_ENV_PROXY=1 node tools/voice/build.mjs [options]
//
//   --list         print the lines, what's missing, and the characters it would cost; no API calls
//   --limit N      make at most N new clips (a test batch)
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
import { TALK, SAY } from "../../public/js/data/he-lines.js";

const ROOT = join(fileURLToPath(import.meta.url), "../../..");
const OUT = join(ROOT, "public/audio/he");
const MANIFEST = join(ROOT, "public/js/data/he-audio.js");

const VOICE = "Tbj9UQjXon5RB9MPEyc2";   // Zina – Young & Soulful (shared voice library, Hebrew)
const MODEL = "eleven_v4";
const SPEED = 0.9;                       // a little slower than normal, for 4-year-olds
const LUFS = -16;                        // loudness every clip is brought to
const PEAK_DB = -1.5;                    // and never louder than this
const API = "https://api.elevenlabs.io/v1";

// What to send for a line when the plain spelling comes out wrong (add niqqud, e.g. "סַפָּה").
// The clip is still found by the plain text the app uses.
export const SPELL = {};

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
export const fileFor = text => "he-" + createHash("sha1").update(text.normalize("NFC")).digest("hex").slice(0, 12) + ".m4a";

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
async function speak(text, settings) {
  const r = await api(`/text-to-speech/${VOICE}?output_format=mp3_44100_128`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: SPELL[text] || text, model_id: MODEL, language_code: "he", voice_settings: settings })
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
  const dir = mkdtempSync(join(tmpdir(), "he-voice-"));
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
function writeManifest(lines) {
  const map = {};
  // ?h= changes when a clip is made again (--redo), so phones fetch the new one instead of the saved copy
  for (const t of lines) {
    const f = join(OUT, fileFor(t));
    if (existsSync(f)) map[t] = fileFor(t) + "?h=" + createHash("sha1").update(readFileSync(f)).digest("hex").slice(0, 8);
  }
  writeFileSync(MANIFEST,
    "// Hebrew text -> recorded clip in public/audio/he/ (voice: Zina – Young & Soulful, ElevenLabs Eleven v4).\n" +
    "// Written by tools/voice/build.mjs; don't edit by hand. Lines missing here use the device's Hebrew voice.\n" +
    "export const HE_AUDIO = {\n" + Object.entries(map).map(([t, f]) => `  ${JSON.stringify(t)}: ${JSON.stringify(f)}`).join(",\n") + "\n};\n");
  return Object.keys(map).length;
}

// ---------- main ----------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const opt = (name) => args.flatMap((a, i) => (a === name ? [args[i + 1]] : []));
  const lines = hebrewLines();
  mkdirSync(OUT, { recursive: true });
  const redo = new Set(opt("--redo"));
  const only = opt("--only");
  let todo = lines.filter(t => redo.has(t) || !existsSync(join(OUT, fileFor(t))));
  if (only.length) todo = todo.filter(t => only.includes(t));
  const limit = parseInt(opt("--limit")[0], 10);
  if (limit >= 0) todo = todo.slice(0, limit);
  const chars = todo.reduce((n, t) => n + (SPELL[t] || t).length, 0);
  console.log(`${lines.length} Hebrew lines, ${lines.length - lines.filter(t => !existsSync(join(OUT, fileFor(t)))).length} recorded; making ${todo.length} (${chars} characters).`);

  if (args.includes("--list")) {
    for (const t of lines) console.log((existsSync(join(OUT, fileFor(t))) ? "  ok  " : "  --  ") + fileFor(t) + "  " + t);
    process.exit(0);
  }
  if (args.includes("--prune")) {
    const used = new Set(lines.map(fileFor));
    for (const f of readdirSync(OUT)) if (f.endsWith(".m4a") && !used.has(f)) { unlinkSync(join(OUT, f)); console.log("removed", f); }
  }
  if (todo.length) {
    if (!key()) { console.error("Set ELEVENLABS_API_KEY."); process.exit(1); }
    const settings = { ...(await (await api(`/voices/${VOICE}/settings`)).json()), speed: SPEED };
    let next = 0, made = 0, failed = 0;
    const worker = async () => {
      while (next < todo.length) {
        const t = todo[next++];
        try {
          makeClip(await speak(t, settings), join(OUT, fileFor(t)));
          made++; console.log(`  ${made}/${todo.length}  ${fileFor(t)}  ${t}`);
        } catch (e) { failed++; console.error("  failed:", t, e.message); }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    console.log(`Made ${made}${failed ? `, ${failed} failed (run again to retry)` : ""}.`);
  }
  console.log(`Manifest: ${writeManifest(lines)} of ${lines.length} lines have a clip.`);
}
