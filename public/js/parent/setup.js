// First run: welcome, how to install (when the game isn't installed), add the first child, or bring
// progress over from another phone.
import { html } from "../core/html.js";
import { mount } from "../core/dom.js";
import { nav } from "../core/router.js";
import { Mascot } from "../ui/mascot.js";
import { profileForm } from "./profile-form.js";
import { enterCode } from "./transfer.js";
import { installPanel } from "./install.js";

export function setup() {
  const { $ } = mount(document.getElementById("app"), html`<div class="screen"><div class="parent" lang="he">
    <div style="display:flex;justify-content:center"><div style="width:150px">${Mascot.svg("happy")}</div></div>
    <div class="panel">
      <h2>ברוכים הבאים ל־<span class="en-ltr">Say It! Words</span></h2>
      <p class="small" style="font-size:16px">משחק מילים באנגלית לילדים שעוד לא קוראים: תמונות, קול ודיבור. ההתקדמות נשמרת רק במכשיר הזה, בלי חשבון ובלי פרסומות.</p>
    </div>
    <div id="installhost" hidden></div>
    <div class="panel" id="form"></div>
    <div class="panel" id="move">
      <h2>עוברים מטלפון אחר?</h2>
      <p class="small">אם הילדים כבר שיחקו בטלפון אחר, אפשר להעביר את כל ההתקדמות עם קוד.</p>
      <div id="movehost"><button class="pbtn c-yellow b3" id="havecode">יש לי קוד העברה</button></div>
    </div>
  </div></div>`);
  const begin = () => nav.reset("start");
  installPanel($("#installhost"));
  profileForm(null, $("#form"), begin);
  $("#havecode").onclick = () => enterCode($("#movehost"), begin);
}
