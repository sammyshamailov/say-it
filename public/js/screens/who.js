// Who's playing? One big card per child.
import { html } from "../core/html.js";
import { mount, onTap } from "../core/dom.js";
import { nav } from "../core/router.js";
import { store } from "../state.js";
import { Sound } from "../services/sound.js";
import { I } from "../ui/icons.js";
import { iconButton, topBar } from "../ui/components.js";
import { PROFILE_COLORS } from "../data/lands.js";

// Say hi in the language the name is written in; a placeholder name gets a plain "hi".
function greet(p) {
  if (/[֐-׿]/.test(p.name)) Sound.hebrew("היי " + p.name + "!");
  else if (/^[a-z\s'-]+$/i.test(p.name) && !/^my (son|daughter)$/i.test(p.name)) Sound.speak("Hi " + p.name + "!", "en", .8);
  else Sound.talk("hi", p.gender);
}

export function who() {
  const ps = store.state.profiles;
  const { root, $ } = mount(document.getElementById("app"), html`<div class="screen">
    ${topBar(html`<div class="grow"></div>`, "", iconButton({ id: "parent", icon: I.parents, label: "Parents" }))}
    <div class="who-grid">${ps.map((p, i) => html`<button class="b3 who-card c-${PROFILE_COLORS[i % PROFILE_COLORS.length]}" data-id="${p.id}" aria-label="${p.name}">
      <span class="face">${p.avatar}</span><span class="nm">${p.name}</span><span class="st">⭐ ${store.purse(p)}</span></button>`)}</div></div>`);
  onTap(root, "[data-id]", b => {
    store.setPlayer(b.dataset.id);
    greet(store.player());
    nav.reset("map");
  });
  $("#parent").onclick = () => nav.go("gate");
}
