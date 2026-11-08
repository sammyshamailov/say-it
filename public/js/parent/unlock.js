// Parent area: the first land is free; an unlock code from /api/unlock opens all lands on this phone.
import { html } from "../core/html.js";
import { store } from "../state.js";
import { Sound } from "../services/sound.js";

const API = "/api/unlock";

export function unlockPanel() {
  if (store.unlocked()) return html`<div class="panel"><h2>כל המפה פתוחה</h2>
    <p class="small">כל שש הארצות פתוחות לכל הילדים בטלפון הזה. ההרשאה עוברת לטלפון אחר יחד עם קוד העברה או גיבוי.</p></div>`;
  return html`<div class="panel" id="unlockp"><h2>פתיחת כל המפה</h2>
    <p class="small">ג'ונגל החיות, הארץ הראשונה, חינם. קוד פתיחה פותח את כל שש הארצות (484 מילים) לכל הילדים בטלפון הזה, בתשלום אחד.</p>
    <div class="field"><label for="ucode">קוד פתיחה</label>
      <input type="text" id="ucode" class="code-in" dir="ltr" maxlength="11" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABCDE-FGHJK"></div>
    <div class="row"><button class="b3 pbtn c-yellow" id="ugo">פתיחה</button></div>
    <p class="small" id="umsg" role="status"></p></div>`;
}

// done() runs after the map was unlocked (redraw the parent area).
export function wireUnlock(root, done) {
  const go = root.querySelector("#ugo");
  if (!go) return;
  const input = root.querySelector("#ucode"), msg = root.querySelector("#umsg");
  const say = (t, err) => { msg.textContent = t; msg.classList.toggle("err", !!err); };
  go.onclick = async () => {
    const code = input.value.trim();
    if (code.replace(/[^0-9a-z]/gi, "").length !== 10) return say("הקוד בנוי מ־10 אותיות ומספרים, למשל ABCDE-FGHJK.", true);
    go.disabled = true; say("בודק…");
    try {
      const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code }) });
      if (r.status === 404) return say("הקוד לא נכון. בדקו אותו ונסו שוב.", true);
      if (!r.ok) throw new Error(r.status);
      store.unlock(code);
      Sound.sfx("unlock");
      done();
    } catch (e) {
      say("אין חיבור לאינטרנט, או שהשרת לא זמין. נסו שוב בעוד רגע.", true);
    } finally {
      go.disabled = false;
    }
  };
}
