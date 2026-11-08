// The parent area (Hebrew, right to left): progress per child, profiles, settings, transfer, credits.
import { html } from "../core/html.js";
import { mount, onTap } from "../core/dom.js";
import { nav } from "../core/router.js";
import { store } from "../state.js";
import { WORD } from "../data/index.js";
import { AUDIO_MAP } from "../data/audio-map.js";
import { Sound } from "../services/sound.js";
import * as Speech from "../services/speech.js";
import { I } from "../ui/icons.js";
import { pic } from "../ui/picture.js";
import { VERSION } from "../version.js";
import { profileForm } from "./profile-form.js";
import { makeCode, enterCode, saveBackup, restoreBackup } from "./transfer.js";
import { unlockPanel, wireUnlock } from "./unlock.js";

let installEvt = null;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; });

const mins = ms => Math.round(ms / 60000);
const toggle = (id, on, label) => html`<div class="row"><label id="l-${id}">${label}</label><button class="toggle" role="switch" id="${id}" aria-checked="${!!on}" aria-labelledby="l-${id}"></button></div>`;
const chips = (p, keys) => keys.slice(0, 40).map(k => html`<span class="chip">${pic(WORD[k].pic, { lazy: true, player: p })} ${WORD[k].en}</span>`);

function kidPanel(p) {
  const keys = Object.keys(p.words).filter(k => WORD[k]);
  const learned = keys.filter(k => store.learned(p, k)), practice = store.toPractice(p);
  return html`<div class="panel" data-kid="${p.id}">
    <div class="kid"><span class="face">${p.avatar}</span><span class="nm">${p.name}</span><button class="pbtn" data-edit="${p.id}" style="background:#F1EFFC">עריכה</button></div>
    <div class="facts">
      <div class="fact"><b>${learned.length}</b><span>מילים שנלמדו</span></div>
      <div class="fact"><b>${practice.length}</b><span>לתרגול</span></div>
      <div class="fact"><b>${mins(p.playMs)}</b><span>דקות משחק</span></div>
    </div>
    <div class="small">${keys.length} מילים נפגשו מתוך ${Object.keys(WORD).length} · ${p.rounds} סבבים · ⭐ ${p.stars}${p.lastPlayed ? ` · שיחק לאחרונה ${new Date(p.lastPlayed).toLocaleDateString("he-IL")}` : ""}</div>
    ${practice.length ? html`<h3>מילים לתרגול</h3><div class="chips">${chips(p, practice)}</div>` : ""}
    ${learned.length ? html`<details><summary class="small">מילים שנלמדו (${learned.length})</summary><div class="chips" style="margin-top:8px">${chips(p, learned)}</div></details>` : ""}
  </div>`;
}

export async function dashboard() {
  const s = store.state, set = s.settings;
  const { root, $, $$ } = mount(document.getElementById("app"), html`<div class="screen"><div class="parent" lang="he">
    <div class="top" style="direction:rtl"><button class="b3 icon c-tile" id="back" aria-label="חזרה למשחק" style="transform:scaleX(-1)">${I.back}</button><h1 style="margin:0;font-size:28px">אזור הורים</h1></div>
    ${s.profiles.map(kidPanel)}
    <div id="formhost"></div>
    <button class="b3 pbtn c-mint" id="add" style="align-self:flex-start">+ הוספת ילד או ילדה</button>

    ${unlockPanel()}

    <div class="panel"><h2>הגדרות</h2>
      ${toggle("t-sfx", set.sfx, "צלילים ואפקטים")}
      ${toggle("t-music", set.music, "מוזיקת רקע")}
      ${toggle("t-heb", set.hebrew, "עזרה בעברית (תרגום ועידוד)")}
      ${store.unlocked() ? toggle("t-all", set.unlockAll, "לפתוח את כל השלבים בלי לחכות") : ""}
      <div class="field"><span>תרגול דיבור (<span class="en-ltr">Say it</span>)</span>
        <div class="seg"><button data-m="auto" aria-pressed="${set.sayMode !== "echo"}">אוטומטי</button><button data-m="echo" aria-pressed="${set.sayMode === "echo"}">הקלטה והשמעה</button></div>
        <p class="small">אוטומטי: במכשירים שתומכים בזיהוי דיבור, האפליקציה גם בודקת את המילה ונותנת כוכב בונוס. בכל מקרה כל ניסיון מקבל כוכב. "הקלטה והשמעה" משמיעה לילד את הקול שלו ואז את המילה, בלי זיהוי.</p>
      </div>
    </div>

    <div class="panel"><h2>מיקרופון</h2>
      <p class="small">המיקרופון משמש רק כשהילד לוחץ על כפתור המיקרופון. ההקלטה נשארת בזיכרון לכמה שניות כדי להשמיע אותה, לא נשמרת ולא נשלחת. בזיהוי דיבור אוטומטי, הדפדפן (Chrome) שולח את הקול לשירות הזיהוי של Google.</p>
      <p class="small" id="micstate"></p>
    </div>

    <div class="panel"><h2>העברה לטלפון אחר</h2>
      <p class="small">עוברים לטלפון חדש, או רוצים שהילדים ישחקו גם בטאבלט? יוצרים כאן קוד ומקלידים אותו בטלפון השני. הקוד עובד פעם אחת ונמחק אחרי 15 דקות. ההתקדמות לא נשמרת אצלנו מעבר לזה.</p>
      <div id="xhost"></div>
      <div class="row"><button class="b3 pbtn c-yellow" id="mkcode">יצירת קוד העברה</button><button class="pbtn" id="havecode">יש לי קוד</button></div>
      <details><summary class="small">בלי אינטרנט? גיבוי לקובץ</summary>
        <div class="row" style="margin-top:10px"><button class="pbtn" id="bk">שמירת גיבוי</button><button class="pbtn" id="rs">שחזור מגיבוי</button>
        <input type="file" id="rsfile" accept=".json,application/json" hidden></div>
      </details>
    </div>

    <div class="panel"><h2>שימוש בלי אינטרנט</h2>
      <p class="small" id="offline">בודק…</p>
      ${installEvt ? html`<button class="b3 pbtn c-yellow" id="install">התקנה כאפליקציה</button>` : ""}
    </div>

    <div class="panel"><h2>קרדיטים</h2>
      <p class="small">הקלטות המילים: תורמי <a href="https://en.wiktionary.org" target="_blank" rel="noopener">Wiktionary</a> ו־<a href="https://lingualibre.org" target="_blank" rel="noopener">Lingua Libre</a>, מתוך <a href="https://commons.wikimedia.org" target="_blank" rel="noopener">Wikimedia Commons</a>, ברישיונות <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA</a>. מילים בלי הקלטה נאמרות בקול של המכשיר.</p>
      <p class="small">הקול בעברית: Zina (Young &amp; Soulful) מ־<a href="https://elevenlabs.io" target="_blank" rel="noopener">ElevenLabs</a>.</p>
      <p class="small">גופן Fredoka ברישיון SIL Open Font License. תמונות: איורים שנוצרו במיוחד לאפליקציה. גרסה <span class="en-ltr">${VERSION}</span>.</p>
    </div>
  </div></div>`);

  const restart = () => nav.reset("start");
  $("#back").onclick = () => { Sound.sfx("tap"); restart(); };

  onTap(root, "[data-edit]", b => {
    const p = s.profiles.find(x => x.id === b.dataset.edit);
    profileForm(p, root.querySelector(`[data-kid="${CSS.escape(p.id)}"]`), () => nav.refresh());
  });
  $("#add").onclick = () => {
    const host = $("#formhost");
    host.className = "panel"; $("#add").hidden = true;
    profileForm(null, host, () => nav.refresh());
    host.scrollIntoView({ behavior: "smooth" });
  };

  const bindToggle = (id, key, after) => {
    const b = $("#" + id);
    b.onclick = () => { set[key] = !set[key]; b.setAttribute("aria-checked", set[key]); store.save(); after && after(); };
  };
  bindToggle("t-sfx", "sfx", Sound.syncMusic);
  bindToggle("t-music", "music", Sound.syncMusic);
  bindToggle("t-heb", "hebrew");
  if ($("#t-all")) bindToggle("t-all", "unlockAll");
  wireUnlock(root, () => nav.refresh());
  onTap(root, "[data-m]", b => {
    set.sayMode = b.dataset.m; store.save();
    $$("[data-m]").forEach(x => x.setAttribute("aria-pressed", x === b));
  });

  $("#mkcode").onclick = () => makeCode($("#xhost"));
  $("#havecode").onclick = () => enterCode($("#xhost"), restart);
  $("#bk").onclick = saveBackup;
  $("#rs").onclick = () => restoreBackup($("#rsfile"), restart);
  const ib = $("#install");
  if (ib) ib.onclick = async () => { installEvt.prompt(); await installEvt.userChoice; installEvt = null; ib.remove(); };

  const ms = $("#micstate"), perm = await Speech.permission();
  if (ms.isConnected) ms.textContent = perm === "denied" ? "המיקרופון חסום. כדי לאפשר: הגדרות הדפדפן ← הגדרות אתר ← מיקרופון, ואז לאפשר לאתר הזה."
    : perm === "granted" ? "המיקרופון מאושר." : "עוד לא התבקש אישור למיקרופון. הוא יתבקש בפעם הראשונה שהילד יגיע לשלב הדיבור.";
  offlineStatus($("#offline"));
}

async function offlineStatus(el) {
  const files = new Set(Object.values(AUDIO_MAP));
  let n = 0;
  try { n = (await (await caches.open("sayit-audio")).keys()).length; } catch (e) {}
  const all = new Set(Object.values(WORD).map(w => w.en)).size, withRecording = Object.keys(AUDIO_MAP).length;
  if (el.isConnected) el.textContent = `האפליקציה עובדת בלי אינטרנט אחרי הפתיחה הראשונה. הקלטות שמורות במכשיר: ${Math.min(n, files.size)} מתוך ${files.size}. ל־${all - withRecording} מילים אין הקלטה והן נאמרות בקול של המכשיר.`;
}
