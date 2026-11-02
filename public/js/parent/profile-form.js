// Add or edit a child: name, boy or girl (for Hebrew encouragement), picture.
import { html } from "../core/html.js";
import { store } from "../state.js";
import { AVATARS } from "../data/lands.js";

// p: the profile to edit, or null to add one. done() runs after save, cancel or delete.
export function profileForm(p, host, done) {
  const draft = p ? { name: p.name, avatar: p.avatar, gender: p.gender } : { name: "", avatar: "🦁", gender: "m" };

  function render() {
    host.innerHTML = String(html`<h2>${p ? "עריכת פרופיל" : "הוספת ילד או ילדה"}</h2>
      <div class="field"><label for="nm">שם</label><input type="text" id="nm" maxlength="20" value="${draft.name}" autocomplete="off" dir="auto"></div>
      <div class="field"><span>בן או בת? (למשפטי עידוד בעברית)</span>
        <div class="seg"><button data-g="m" aria-pressed="${draft.gender === "m"}">בן</button><button data-g="f" aria-pressed="${draft.gender === "f"}">בת</button></div></div>
      <div class="field"><span>תמונה</span><div class="avs">${AVATARS.map(a => html`<button data-a="${a}" aria-pressed="${a === draft.avatar}" aria-label="${a}">${a}</button>`)}</div></div>
      <div class="row"><button class="b3 pbtn c-mint" id="save">${p ? "שמירה" : "הוספה"}</button>
        ${p ? html`<button class="pbtn" id="cancel">ביטול</button><div style="flex:1"></div><button class="pbtn danger" id="del">מחיקה</button>` : ""}</div>`);
    const nm = host.querySelector("#nm");
    nm.oninput = () => { draft.name = nm.value; };
    host.querySelector("#save").onclick = () => {
      draft.name = nm.value.trim();
      if (!draft.name) { nm.focus(); nm.style.borderColor = "#B3123E"; return; }
      if (p) { Object.assign(p, draft); store.save(true); }
      else store.addProfile(store.newProfile(draft.name, draft.avatar, draft.gender));
      done();
    };
    const c = host.querySelector("#cancel"); if (c) c.onclick = done;
    const d = host.querySelector("#del");
    if (d) d.onclick = () => {
      if (!confirm(`למחוק את ${p.name} ואת כל ההתקדמות? אי אפשר לבטל.`)) return;
      store.removeProfile(p);
      done();
    };
  }

  // choices re-render the form; one handler on the host (replaced if the form is opened again there)
  host.onclick = e => {
    const g = e.target.closest("[data-g]"), a = e.target.closest("[data-a]");
    if (g) { draft.gender = g.dataset.g; render(); }
    else if (a) { draft.avatar = a.dataset.a; render(); }
  };
  render();
}
