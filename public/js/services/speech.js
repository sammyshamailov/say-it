// "Say it": Echo (record + play back, works everywhere with a microphone) and,
// where the browser supports it, speech recognition as a bonus check.
import { store } from "../state.js";
export { isMatch } from "./match.js";

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
let srBroken = false; // set when recognition fails for this session (offline, blocked)

export function mode() {
  if (store.settings.sayMode === "echo") return "echo";
  if (!SR || srBroken || (isIOS && standalone)) return "echo";
  return "recognize";
}
export const hasSR = () => !!SR && !srBroken;
export const canRecord = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

// ---------- microphone ----------
let stream = null;
async function mic() {
  if (stream && stream.active) return stream;
  stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
  return stream;
}
export function release() {
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
}
// The microphone is opened for each recording and closed right after it. While it's open, speech
// recognition can't get it (on Android it then hears nothing, so the child's next first try
// failed), and Android plays sound in "call" mode. Closing it switches the audio back, which
// takes a moment: a sound started during the switch can be lost, so wait before going on.
const SWITCH_BACK_MS = 300;
export async function permission() {
  try { return (await navigator.permissions.query({ name: "microphone" })).state; } catch (e) { return "unknown"; }
}

// Record until the child speaks then pauses (or a time limit). onLevel(0..1) drives the bars.
export async function record(onLevel) {
  const s = await mic();
  const c = new (window.AudioContext || window.webkitAudioContext)();
  const src = c.createMediaStreamSource(s), an = c.createAnalyser();
  an.fftSize = 1024; src.connect(an);
  const buf = new Float32Array(an.fftSize);
  const chunks = [];
  let rec;
  try { rec = new MediaRecorder(s); } catch (e) { rec = null; }
  if (rec) { rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); }; rec.start(); }
  // Children often start talking the instant they tap, so the first 350 ms can't be trusted as
  // "background noise". During that window use a fixed threshold and only average quiet frames;
  // afterwards the threshold follows the room, capped so a noisy start can't make it deaf.
  const START_THR = 0.05, MAX_THR = 0.06;
  const t0 = performance.now();
  let noise = 0.01, n = 0, voiced = 0, spoke = false, lastVoice = 0, last = t0;
  await new Promise(res => {
    (function loop() {
      an.getFloatTimeDomainData(buf);
      let sum = 0; for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
      const now = performance.now(), rms = Math.sqrt(sum / buf.length), t = now - t0, dt = Math.min(50, now - last);
      last = now;
      if (t < 350 && rms < START_THR) noise = (noise * n + rms) / (++n);
      const thr = t < 350 ? START_THR : Math.min(MAX_THR, Math.max(0.02, noise * 3));
      onLevel && onLevel(Math.min(1, rms / (thr * 4)));
      if (rms > thr) { voiced += dt; lastVoice = t; if (voiced > 140) spoke = true; }
      const quietAfter = spoke && t - lastVoice > 750;
      if (quietAfter || t > (spoke ? 5000 : 4500)) return res();
      requestAnimationFrame(loop);
    })();
  });
  onLevel && onLevel(0);
  let blob = null;
  if (rec) { await new Promise(r => { rec.onstop = r; rec.stop(); }); blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" }); }
  try { c.close(); } catch (e) {}
  release();
  await new Promise(r => setTimeout(r, SWITCH_BACK_MS));
  return { spoke, url: blob && spoke ? URL.createObjectURL(blob) : null };
}

// Recognition: resolves {heard:[...]} or {error}
export async function recognize() {
  if (stream) { release(); await new Promise(r => setTimeout(r, SWITCH_BACK_MS)); } // recognition needs the mic to itself
  return new Promise(res => {
    let r;
    try { r = new SR(); } catch (e) { srBroken = true; return res({ error: "unsupported" }); }
    r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
    let out = null;
    r.onresult = e => { out = { heard: Array.from(e.results[0]).map(a => a.transcript) }; };
    r.onerror = e => {
      if (["network", "not-allowed", "service-not-allowed", "audio-capture", "language-not-supported"].includes(e.error)) srBroken = true;
      out = out || { error: e.error };
    };
    r.onend = () => res(out || { error: "no-speech" });
    try { r.start(); } catch (e) { res({ error: "start" }); }
    setTimeout(() => { try { r.stop(); } catch (e) {} }, 7000);
  });
}
