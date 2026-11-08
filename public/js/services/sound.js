// Sound: recorded voices (English: Sarah, Hebrew: Zina; the device's voices only if a clip can't
// play), effects and music.
import { store } from "../state.js";
import { EN_AUDIO } from "../data/en-audio.js";
import { HE_AUDIO } from "../data/he-audio.js";
import { TALK } from "../data/lines.js";

const settings = () => store.settings;
const pick = a => a[Math.floor(Math.random() * a.length)];

// ---------- Web Audio (effects + music) ----------
let ctx = null;
function ac() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
function tone(freq, t0, dur, type = "sine", vol = 0.18, slideTo, out) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out || c.destination); o.start(t); o.stop(t + dur + 0.05);
}
const SFX = {
  tap() { tone(620, 0, .08, "sine", .12, 900); },
  good() { [784, 988, 1319].forEach((f, i) => tone(f, i * .09, .22, "triangle", .16)); },
  soft() { tone(330, 0, .25, "triangle", .12, 220); },
  pop() { tone(900, 0, .09, "square", .06, 200); tone(1400, 0, .05, "sine", .08); },
  star() { [1568, 2093, 2637].forEach((f, i) => tone(f, i * .06, .12, "sine", .1)); },
  flip() { tone(500, 0, .07, "triangle", .1, 700); },
  fanfare() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .13, .3, "triangle", .17)); tone(1047, .55, .6, "triangle", .14); },
  unlock() { [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, i * .07, .2, "sine", .13)); }
};
function sfx(name) { if (settings().sfx && SFX[name]) SFX[name](); }

// ---------- word recordings element (declared before the music, which checks it) ----------
const el = new Audio();
el.preload = "auto";

// ---------- soundtrack ----------
// One looping track per place: the theme (start, who's playing, sticker book), each land of the
// map (the land in view; in a round, the stone's land), the mini-games and the garden. The party
// stone gets a short jingle. Files are made by tools/music/build.py and saved for offline play.
//
// The music steps aside whenever something needs to be heard (a word, Hebrew help, feedback):
// it drops to a whisper, and goes silent while the child's voice is recorded. It comes back a
// moment after it's quiet again.
export const MUSIC_V = 1; // bump when the music files change, so phones fetch the new ones
const TRACKS = ["theme", "animals", "food", "people", "things", "outside", "learning", "games", "garden", "party"];
const musicUrl = name => `music/${name}.m4a?v=${MUSIC_V}`;
const LEVEL = 0.3;      // the music under everything else
const UNDER_VOICE = 0.12; // while a voice is talking
const RETURN_MS = 900;
let bus = null, hushCount = 0, quietUntil = 0, watchTimer = null;
let musicOn = false, want = "theme", cur = null; // cur: the track playing now {name, el, g}
const players = new Map(); // name -> {el, g, ready: Promise}

function musicBus() {
  const c = ac(); if (!c) return null;
  if (!bus) {
    const master = c.createGain(); master.gain.value = LEVEL; master.connect(c.destination);
    bus = c.createGain(); bus.connect(master);
  }
  return bus;
}
function rampTo(param, v, tc) { if (!ctx) return; param.cancelScheduledValues(ctx.currentTime); param.setTargetAtTime(v, ctx.currentTime, tc); }
function duck() { // the music steps back in about 0.1 s
  quietUntil = Date.now() + RETURN_MS;
  if (bus) rampTo(bus.gain, hushCount > 0 ? 0 : UNDER_VOICE, 0.03);
}
function hush(on) { hushCount = Math.max(0, hushCount + (on ? 1 : -1)); duck(); }
const voiceBusy = () => hushCount > 0 || (("speechSynthesis" in window) && speechSynthesis.speaking) || (!el.paused && !el.ended);
function watch() {
  if (voiceBusy()) return duck();
  if (Date.now() >= quietUntil && bus && bus.gain.value < .99) rampTo(bus.gain, 1, 0.25);
}

// A player per track: an <audio> element fed from a downloaded copy (no streaming, so it works
// offline and loops cleanly), routed through Web Audio so its volume can be faded on every phone.
function player(name) {
  if (players.has(name)) return players.get(name);
  const c = ac(), b = musicBus(); if (!c || !b) return null;
  const a = new Audio(); a.loop = name !== "party"; a.preload = "auto";
  const g = c.createGain(); g.gain.value = 0;
  try { c.createMediaElementSource(a).connect(g); } catch (e) { return null; }
  g.connect(b);
  const pl = { name, el: a, g };
  pl.ready = fetch(musicUrl(name)).then(r => { if (!r.ok) throw new Error("music " + r.status); return r.blob(); })
    .then(blob => { a.src = URL.createObjectURL(blob); });
  pl.ready.catch(() => players.delete(name)); // try again next time
  players.set(name, pl);
  return pl;
}
function fadeOut(pl) {
  rampTo(pl.g.gain, 0, 0.35);
  setTimeout(() => { if (cur !== pl) pl.el.pause(); }, 1500);
}
async function switchTo(name) {
  if (cur && cur.name === name) { if (cur.el.src) { rampTo(cur.g.gain, 1, 0.5); if (cur.el.paused) cur.el.play().catch(() => {}); } return; }
  if (cur) fadeOut(cur);
  const pl = player(name); cur = pl;
  if (!pl) return;
  try { await pl.ready; } catch (e) { return; }
  if (cur !== pl || !musicOn) return;
  if (pl.el.ended || name === "party") pl.el.currentTime = 0; // a land you come back to carries on where it was
  rampTo(pl.g.gain, 1, 0.5);
  pl.el.play().catch(() => {}); // blocked until the next touch on some phones; see main.js
}
// The screen says which music belongs to it.
function scene(name) {
  if (!TRACKS.includes(name) || name === "party") return;
  want = name;
  if (musicOn && !(cur && cur.name === "party" && !cur.el.paused)) switchTo(name);
}
// The party stone's jingle, instead of the fanfare. Then the music carries on. False if music is off.
function jingle() {
  if (!musicOn) return false;
  const pl = player("party"); if (!pl) return false;
  switchTo("party");
  pl.el.onended = () => { if (cur === pl && musicOn) switchTo(want); };
  return true;
}
function music(on) {
  musicOn = !!on;
  clearInterval(watchTimer); watchTimer = null;
  if (musicOn) { watchTimer = setInterval(watch, 200); switchTo(want); }
  else if (cur) { const pl = cur; cur = null; fadeOut(pl); }
}
// music follows the settings: on only when both sounds and music are on
const syncMusic = () => music(settings().sfx && settings().music);
// after a touch: start music a phone wouldn't let start on its own
const nudgeMusic = () => { if (musicOn && cur && cur.el.paused && cur.el.src && !(cur.name === "party" && cur.el.ended)) cur.el.play().catch(() => {}); };
const musicUrls = () => TRACKS.map(musicUrl);

// ---------- device voices ----------
let enVoice = null, heVoice = null, keep = null;
function pickVoices() {
  if (!("speechSynthesis" in window)) return;
  const vs = speechSynthesis.getVoices();
  const en = vs.filter(v => /^en[-_]/i.test(v.lang));
  const pref = ["Google US English", "Samantha", "Microsoft Aria", "Microsoft Jenny", "Karen"];
  enVoice = pref.map(n => en.find(v => v.name.includes(n))).find(Boolean) || en.find(v => /en[-_]US/i.test(v.lang)) || en[0] || null;
  const he = vs.filter(v => /^(he|iw)/i.test(v.lang));
  heVoice = he.find(v => /google/i.test(v.name)) || he.find(v => /carmit/i.test(v.name)) || he[0] || null;
}
if ("speechSynthesis" in window) { pickVoices(); speechSynthesis.onvoiceschanged = pickVoices; }

function speak(text, lang = "en", rate) {
  return new Promise(res => {
    if (!("speechSynthesis" in window)) return res();
    speechSynthesis.cancel();
    const short = text.replace(/[^a-z]/gi, "").length <= 4;
    const u = new SpeechSynthesisUtterance(/[.!?]$/.test(text) ? text : text + ".");
    keep = u; // some browsers drop the end event if the utterance is garbage-collected
    duck();
    if (lang === "he") { if (heVoice) u.voice = heVoice; u.lang = heVoice ? heVoice.lang : "he-IL"; u.rate = rate || .9; }
    else { if (enVoice) u.voice = enVoice; u.lang = enVoice ? enVoice.lang : "en-US"; u.rate = (rate || .62) * (short ? .9 : 1); }
    u.pitch = 1.1;
    let done = false;
    const fin = () => { if (!done) { done = true; setTimeout(res, 150); } };
    u.onend = fin; u.onerror = fin; setTimeout(fin, 7000);
    setTimeout(() => speechSynthesis.speak(u), 60);
  });
}

// ---------- recorded clips ----------
// When a new sound starts (or stop() is called), the sound it cuts off finishes right away
// with "stopped", instead of waiting for the 8-second safety timer.
let cutOff = null;
function playUrl(url, rate = 1) {
  if (cutOff) cutOff("stopped");
  return new Promise(res => {
    let done = false;
    const fin = ok => {
      if (done) return; done = true;
      if (cutOff === fin) cutOff = null;
      el.onended = el.onerror = null;
      res(ok);
    };
    cutOff = fin;
    duck(); el.pause(); el.src = url; el.currentTime = 0;
    el.preservesPitch = true; el.webkitPreservesPitch = true; el.playbackRate = rate;
    el.onended = () => fin(true); el.onerror = () => fin(false);
    el.play().catch(() => fin(false));
    setTimeout(() => fin(true), 8000);
  });
}
function stop() {
  if (cutOff) cutOff("stopped");
  try { el.pause(); } catch (e) {}
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

// ---------- English: Sarah's clips (tools/voice/build.mjs) ----------
// Every word and every English line has one. The device's voice speaks only if a clip can't play
// (e.g. the very first start without internet, before the clips are saved).
export const SLOW_RATE = 0.65; // the turtle button: the clip (already a little slow) slower still, pitch kept
async function english(text, slow = false) {
  stop();
  if (EN_AUDIO[text]) {
    const ok = await playUrl("audio/en/" + EN_AUDIO[text], slow ? SLOW_RATE : 1);
    if (ok) return; // played, or cut off by the next sound
  }
  return speak(text, "en", slow ? .38 : .62);
}
const word = english;

// ---------- Hebrew: recorded clips (tools/voice/build.mjs), the device's Hebrew voice as fallback ----------
const heUrl = text => (HE_AUDIO[text] ? "audio/he/" + HE_AUDIO[text] : null);
// can this line be said in Hebrew on this phone? (always, once it has a clip)
const hasHebrew = text => !!(text && HE_AUDIO[text]) || !!heVoice;
async function hebrew(text) {
  const url = heUrl(text);
  if (url) {
    stop();
    const ok = await playUrl(url);
    if (ok) return; // played, or cut off by the next sound
  }
  if (heVoice) return speak(text, "he");
}

const voiceUrls = () => [...Object.values(EN_AUDIO).map(f => "audio/en/" + f), ...Object.values(HE_AUDIO).map(f => "audio/he/" + f)];

// ---------- spoken feedback (Hebrew when Hebrew help is on; lines in data/lines.js) ----------
function talk(key, gender) {
  const t = TALK[key]; if (!t) return Promise.resolve();
  const he = pick(t[gender === "f" ? "f" : "m"]);
  if (settings().hebrew && hasHebrew(he)) return hebrew(he);
  return english(pick(t.en));
}

export const Sound = {
  sfx, music, syncMusic, scene, jingle, nudgeMusic, word, english, hebrew, talk, stop, playUrl, hasHebrew, hush,
  voiceUrls, musicUrls, unlock: () => ac()
};
