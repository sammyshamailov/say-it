// Installing the game on the home screen (for parents; shown at first run and in the parent area).
// Android Chrome offers a real install prompt. iPhone and iPad have none: the parent has to use the
// browser's share button, so there we show how. Nothing is shown once the game runs installed.
import { html, raw } from "../core/html.js";

let evt = null;            // Android's install prompt, once the browser offers it
const waiting = new Set(); // screens to redraw their install panel when the prompt arrives
addEventListener("beforeinstallprompt", e => { e.preventDefault(); evt = e; waiting.forEach(f => f()); });
addEventListener("appinstalled", () => { evt = null; waiting.forEach(f => f()); });

const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const installed = () => matchMedia("(display-mode: standalone)").matches || !!navigator.standalone;

// the share button as iPhone and iPad draw it
const SHARE = raw(`<svg class="share-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3.5"/><path d="M8 7l4-4 4 4"/><path d="M8 10.5H6.5A1.5 1.5 0 0 0 5 12v7a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-7a1.5 1.5 0 0 0-1.5-1.5H16"/></svg>`);

// What to show: "ios" (how-to), "prompt" (a button), or null (installed, or the browser can't install).
export function installKind() {
  if (installed()) return null;
  if (evt) return "prompt";
  return isIOS ? "ios" : null;
}

// The inside of the install panel. moved: also say that progress made in the browser doesn't follow
// to the installed game on iPhone and iPad (they keep the two apart), for the parent area.
export function installBody(kind, { moved = false } = {}) {
  if (kind === "prompt") return html`<h2>התקנה כאפליקציה</h2>
    <p class="small">המשחק נפתח מהמסך הראשי, במסך מלא ובלי שורת הכתובת.</p>
    <div class="row"><button class="b3 pbtn c-yellow" data-install>התקנה</button></div>`;
  if (kind === "ios") return html`<h2>התקנה כאפליקציה</h2>
    <p class="small">באייפון ובאייפד מתקינים דרך הדפדפן. המשחק נפתח במסך מלא, בלי שורת הכתובת.</p>
    <ol class="steps">
      <li><span>לוחצים על כפתור השיתוף</span>${SHARE}</li>
      <li><span>בוחרים ״הוספה למסך הבית״ <span class="en-ltr">(Add to Home Screen)</span></span></li>
      <li><span>פותחים את המשחק מהמסך הראשי</span></li>
    </ol>
    ${moved ? html`<p class="small">שימו לב: ההתקדמות שנצברה בדפדפן לא עוברת לבד לאפליקציה המותקנת. יוצרים כאן קוד העברה ומקלידים אותו באפליקציה.</p>`
      : html`<p class="small">כדאי להתקין עכשיו, לפני שמתחילים: ההתקדמות בדפדפן לא עוברת לבד לאפליקציה המותקנת.</p>`}`;
  return "";
}

// Keep an install panel in `host` up to date: drawn now, redrawn when Android's prompt arrives, hidden
// when there's nothing to show. Returns a function that stops watching (call it when the screen goes).
export function installPanel(host, opts) {
  const draw = () => {
    if (!host.isConnected) return waiting.delete(draw);
    const kind = installKind();
    host.hidden = !kind;
    host.className = kind ? "panel install" : "";
    host.innerHTML = String(installBody(kind, opts));
    const b = host.querySelector("[data-install]");
    if (b) b.onclick = async () => {
      const e = evt; if (!e) return;
      e.prompt();
      try { await e.userChoice; } catch (err) {}
      evt = null; draw();
    };
  };
  waiting.add(draw);
  draw();
  return () => waiting.delete(draw);
}
