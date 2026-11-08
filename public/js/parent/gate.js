// The parents' gate: tap three numbers written as Hebrew words.
// Easy for a parent, a 1-in-504 guess for a child who can't read yet.
import { html } from "../core/html.js";
import { mount, onTap, replay } from "../core/dom.js";
import { nav } from "../core/router.js";
import { store } from "../state.js";
import { shuffle } from "../services/store.js";
import { Sound } from "../services/sound.js";
import { SAY } from "../data/he-lines.js";
import { I } from "../ui/icons.js";
import { Mascot } from "../ui/mascot.js";
import { iconButton } from "../ui/components.js";

const HE_NUM = ["", "אחת", "שתיים", "שלוש", "ארבע", "חמש", "שש", "שבע", "שמונה", "תשע"];
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function gate() {
  let want = [], got = [];
  const { root, $, $$ } = mount(document.getElementById("app"), html`<div class="screen">
    <div class="top">${iconButton({ id: "back", icon: I.back, label: "חזרה" })}</div>
    <div class="gate" style="flex:1;justify-content:center" lang="he" dir="rtl">
      <div style="width:120px">${Mascot.svg("listen")}</div>
      <p style="margin:0;font-size:20px;font-weight:600">להורים: הקישו את המספרים לפי הסדר</p>
      <p class="gate-words" id="words" aria-live="polite"></p>
      <div class="gate-dots" id="dots" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="keypad" id="pad" dir="ltr">${DIGITS.map(n => html`<button class="b3 c-tile" data-n="${n}">${n}</button>`)}</div>
    </div></div>`);
  const words = $("#words"), dots = $$("#dots i");
  const pick = () => { want = shuffle(DIGITS).slice(0, 3); got = []; };
  const show = () => {
    words.textContent = want.map(n => HE_NUM[n]).join(" · ");
    dots.forEach((d, i) => d.classList.toggle("on", i < got.length));
  };
  pick(); show();

  $("#back").onclick = () => nav.back();
  onTap(root, "[data-n]", b => {
    if (got.length >= 3) return; // a wrong code is being reset
    got.push(+b.dataset.n); show();
    if (got.length < 3) return;
    if (got.every((n, i) => n === want[i])) { Sound.sfx("unlock"); nav.replace("dashboard"); return; }
    Sound.sfx("soft");
    replay($("#pad"), "wiggle");
    setTimeout(() => { pick(); show(); }, 400);
  });

  // for the child: a friendly spoken hint that this part is for grown-ups
  if (store.settings.hebrew && Sound.hasHebrew(SAY.grownUp)) Sound.hebrew(SAY.grownUp);
  else Sound.speak("Ask a grown-up!", "en", .8);
}
