// Moving progress to another phone: a one-time code through /api/transfer, or a backup file.
import { html } from "../core/html.js";
import { store } from "../state.js";
import { isSave } from "../services/store.js";
import { Sound } from "../services/sound.js";

const API = "/api/transfer";
const fmtCode = c => c.slice(0, 3) + " " + c.slice(3);
const hasProgress = () => store.state.profiles.some(p => p.stars > 0 || Object.keys(p.words).length);
const NET_ERR = "אין חיבור לאינטרנט, או שהשרת לא זמין. נסו שוב בעוד רגע, או השתמשו בגיבוי לקובץ.";

// Upload this phone's progress and show the code with a countdown.
export async function makeCode(host) {
  host.innerHTML = String(html`<p class="small">יוצר קוד…</p>`);
  try {
    const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ data: store.exportData() }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.code) throw new Error(j.error || r.status);
    host.innerHTML = String(html`<p class="small">בטלפון השני: פותחים את <span class="en-ltr">Say It!</span>, נכנסים לאזור ההורים (או למסך הפתיחה) ובוחרים "יש לי קוד". מקלידים:</p>
      <div class="xcode" dir="ltr" aria-label="${j.code.split("").join(" ")}">${fmtCode(j.code)}</div>
      <p class="small" id="left"></p>`);
    const left = host.querySelector("#left");
    const tick = () => {
      if (!left.isConnected) return clearInterval(timer);
      const s = Math.max(0, Math.round((j.expires - Date.now()) / 1000));
      left.textContent = s ? `הקוד עובד פעם אחת ותקף עוד ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} דקות.` : "הקוד פג תוקף. אפשר ליצור קוד חדש.";
      if (!s) clearInterval(timer);
    };
    const timer = setInterval(tick, 1000);
    tick();
  } catch (e) {
    host.innerHTML = String(html`<p class="small err">${e.message === "too-big" ? "יש יותר מדי נתונים להעברה בקוד. השתמשו בגיבוי לקובץ." : NET_ERR}</p>`);
  }
}

// Type a code from the old phone; done() runs after the progress was replaced.
export function enterCode(host, done) {
  host.innerHTML = String(html`<div class="field"><label for="code">קוד העברה מהטלפון הישן</label>
      <input type="text" id="code" class="code-in" dir="ltr" maxlength="7" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="K7P 42Q"></div>
    <div class="row"><button class="b3 pbtn c-mint" id="go">העברה</button></div>
    <p class="small" id="msg"></p>`);
  const inp = host.querySelector("#code"), msg = host.querySelector("#msg"), go = host.querySelector("#go");
  const say = (text, err) => { msg.className = err ? "small err" : "small"; msg.textContent = text; };
  inp.focus();
  inp.oninput = () => { const c = inp.value.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 6); inp.value = c.length > 3 ? fmtCode(c) : c; };
  inp.onkeydown = e => { if (e.key === "Enter") go.click(); };
  go.onclick = async () => {
    const code = inp.value.replace(/\s/g, "");
    if (code.length !== 6) return say("הקוד צריך להיות 6 תווים.", true);
    if (hasProgress() && !confirm("ההתקדמות שבמכשיר הזה תוחלף בזו מהטלפון הישן. להמשיך?")) return;
    go.disabled = true; say("מעביר…");
    try {
      const r = await fetch(API + "?code=" + encodeURIComponent(code), { cache: "no-store" });
      const j = await r.json().catch(() => ({}));
      if (r.status === 404) { go.disabled = false; return say("הקוד לא נמצא. בדקו שהוקלד נכון, או צרו קוד חדש בטלפון הישן.", true); }
      if (r.status === 410) { go.disabled = false; return say("הקוד פג תוקף. צרו קוד חדש בטלפון הישן.", true); }
      if (!r.ok || !store.replaceAll(j.data)) throw new Error("bad");
      Sound.sfx("unlock"); alert("ההתקדמות הועברה!"); done();
    } catch (e) { say(NET_ERR, true); go.disabled = false; }
  };
}

// Offline fallback: a backup file (shared through WhatsApp, Drive, email…)
export async function saveBackup() {
  const name = `say-it-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File([JSON.stringify(store.exportData())], name, { type: "application/json" });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Say It! backup" }); return; }
  } catch (e) { if (e.name === "AbortError") return; }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

export function restoreBackup(input, done) {
  input.onchange = async () => {
    const f = input.files && input.files[0]; input.value = ""; if (!f) return;
    let d = null; try { d = JSON.parse(await f.text()); } catch (e) {}
    if (!isSave(d)) { alert("זה לא קובץ גיבוי של Say It!."); return; }
    if (hasProgress() && !confirm("ההתקדמות שבמכשיר הזה תוחלף בזו שבקובץ. להמשיך?")) return;
    store.replaceAll(d); alert("ההתקדמות שוחזרה!"); done();
  };
  input.click();
}
