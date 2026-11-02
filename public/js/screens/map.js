// The map: one land per word group, the mascot standing next to the current one.
import { html } from "../core/html.js";
import { mount, onTap } from "../core/dom.js";
import { nav } from "../core/router.js";
import { store } from "../state.js";
import { WORDS } from "../data/index.js";
import { LANDS } from "../data/lands.js";
import { Sound } from "../services/sound.js";
import { canBuy } from "../services/shop.js";
import { round } from "../round/round.js";
import { I } from "../ui/icons.js";
import { pic } from "../ui/picture.js";
import { Mascot } from "../ui/mascot.js";
import { iconButton, starsPill, soundButton, wireSoundButton, nope } from "../ui/components.js";

function landNode(p, g, gi, isCur) {
  const L = LANDS[g.id], open = store.landUnlocked(p, gi);
  const done = g.subs.filter(s => store.subDone(p, s)).length;
  const crown = g.subs.every(s => store.subCrown(p, s));
  const lit = Math.ceil(3 * done / g.subs.length);
  const starsRow = done ? html`<span class="mini-stars" aria-hidden="true">${[0, 1, 2].map(i => I.star(i < lit ? "#FFD23F" : "none", "#FFD23F"))}</span>` : "";
  const btn = html`<button class="b3 land c-${L.c} ${open ? "" : "locked"} ${isCur ? "current" : ""}" data-land="${gi}" aria-label="${L.en}${open ? "" : ", locked"}">
    <span class="pic">${pic(g.pic, { player: p })}</span>${open ? "" : html`<span class="lock">${I.lock}</span>`}${crown ? I.crown : ""}${starsRow}</button>`;
  const buddy = isCur ? html`<div class="buddy-wrap" style="display:flex;flex-direction:column;align-items:flex-start;gap:4px"><span class="bubble">Let's go!</span>${Mascot.svg("idle", p.outfit)}</div>` : "";
  return html`<div class="node">${gi % 2 ? [buddy, btn] : [btn, buddy]}</div>`;
}

export function map() {
  const p = store.player();
  if (!p) return nav.reset("start");
  const cur = store.currentLand(p);
  const { root, $ } = mount(document.getElementById("app"), html`<div class="screen">
    <div class="top">
      <button class="b3 avatar-btn c-pink" id="who" aria-label="Change player">${p.avatar}</button>
      <div class="grow"></div>${starsPill(p)}${soundButton()}
      ${iconButton({ id: "parent", icon: I.parents, label: "Parents" })}
    </div>
    <div class="map" id="map"><div class="path">${WORDS.map((g, gi) => landNode(p, g, gi, gi === cur))}</div></div>
    <div class="dock">
      ${iconButton({ id: "book", color: "purple", icon: I.book, label: "Sticker book" })}
      <button class="b3 play c-yellow" id="play" aria-label="Play">${I.play}Play</button>
      ${iconButton({ id: "shop", color: "mint", icon: I.bag, label: "Garden and shop", cls: canBuy(p) ? "glow" : "" })}
    </div></div>`);
  root.querySelector(".land.current")?.scrollIntoView({ block: "center" });

  onTap(root, "[data-land]", b => {
    const gi = +b.dataset.land;
    if (!store.landUnlocked(p, gi)) return nope(b);
    Sound.speak(LANDS[WORDS[gi].id].en, "en", .8);
    nav.go("land", gi);
  });
  $("#play").onclick = () => round.start(store.nextSub(p));
  $("#who").onclick = () => nav.go("who");
  $("#book").onclick = () => nav.go("stickers");
  $("#shop").onclick = () => nav.go("garden");
  $("#parent").onclick = () => nav.go("gate");
  wireSoundButton(root);
}
