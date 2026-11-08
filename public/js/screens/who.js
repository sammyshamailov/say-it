// Who's playing? One big card per child.
import { html } from "../core/html.js";
import { mount, onTap } from "../core/dom.js";
import { nav } from "../core/router.js";
import { store } from "../state.js";
import { Sound } from "../services/sound.js";
import { SAY_EN } from "../data/lines.js";
import { I } from "../ui/icons.js";
import { iconButton, topBar } from "../ui/components.js";
import { PROFILE_COLORS } from "../data/lands.js";

// A name can't be recorded ahead of time, and the device's voice saying it would sound like
// someone else, so Pipo just says hi: in English to an English name, otherwise "היי!" (or "Hi!"
// when Hebrew help is off).
function greet(p) {
  if (/^[a-z\s'-]+$/i.test(p.name) && !/^my (son|daughter)$/i.test(p.name)) Sound.english(SAY_EN.hi);
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
