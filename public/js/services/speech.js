// "Say it": Echo, record the child and play it back (works everywhere with a microphone).
// Speech recognition was used as a first check until 2.14.5; it kept no recording to play back.

export const canRecord = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

// ---------- microphone ----------
let stream = null;
async function mic() {
  if (stream && stream.active) return stream;
  // No echo cancellation: on Android it puts the phone's sound in "call" mode, and what played
  // right after a recording (the word, the child's own voice) was lost or went to the earpiece.
  // Nothing plays while the child speaks (music is silenced, the app waits), so there's no echo.
  stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: true } });
  return stream;
}
export function release() {
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
}
// The microphone is opened for each recording and closed right after it. While it's open, speech
// recognition can't get it (on Android it then hears nothing, so the child's next first try
// failed), and Android plays sound in "call" mode. Closing it switches the audio back, which
// takes a moment: a sound started during the switch can be lost, so wait before going on.
const SWITCH_BACK_MS = 350; // 600 in 2.14.2; without echo cancellation the switch is short
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
      const quietAfter = spoke && t - lastVoice > 550;
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
