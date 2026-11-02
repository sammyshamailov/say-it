// Shown once, before the browser first asks for the microphone. Resolves true to go ahead.
// Closing it any other way (back button, "not now") resolves false, so the caller never hangs.
import { html } from "../core/html.js";
import { openSheet } from "../core/sheet.js";
import { Mascot } from "../ui/mascot.js";

export function micExplain() {
  return new Promise(resolve => {
    const sheet = openSheet({
      className: "sheet rtl",
      lang: "he",
      onClose: ok => resolve(ok === true),
      content: html`<div style="display:flex;justify-content:center"><div style="width:120px">${Mascot.svg("listen")}</div></div>
        <h2>להורים: אישור מיקרופון</h2>
        <p>בשלב <span class="en-ltr">Say it</span> הילד אומר את המילה בקול. כדי לשמוע אותו, הדפדפן יבקש עכשיו אישור להשתמש במיקרופון.</p>
        <p class="small">ההקלטה לא נשמרת ולא נשלחת לשום מקום (חוץ מזיהוי הדיבור של הדפדפן, אם הוא פעיל). אפשר לשנות בכל רגע באזור ההורים.</p>
        <div class="row"><button class="b3 pbtn c-mint" id="ok">אישור, להמשיך</button><button class="pbtn" id="no">לא עכשיו</button></div>`
    });
    sheet.$("#ok").focus();
    sheet.$("#ok").onclick = () => sheet.close(true);
    sheet.$("#no").onclick = () => sheet.close(false);
  });
}
