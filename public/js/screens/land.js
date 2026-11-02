// One land: a stepping stone per word group, with progress bars and crowns.
import { html } from "../core/html.js";
import { mount, onTap } from "../core/dom.js";
import { nav } from "../core/router.js";
import { store } from "../state.js";
import { WORDS, SUBS } from "../data/index.js";
import { LANDS, subColor } from "../data/lands.js";
import { round } from "../round/round.js";
import { I } from "../ui/icons.js";
import { pic } from "../ui/picture.js";
import { iconButton, starsPill, nope } from "../ui/components.js";

function stone(p, s, isNext) {
  const open = store.subUnlocked(p, s), prog = Math.round(store.subProgress(p, s) * 100);
  return html`<button class="b3 stone c-${subColor(s)} ${open ? "" : "locked"} ${isNext ? "next" : ""}" data-sub="${s.id}" aria-label="${s.name}${open ? "" : ", locked"}">
    <span class="pic">${pic(s.pic, { player: p })}</span>${open ? html`<span class="bar"><i style="width:${prog}%"></i></span>` : html`<span class="lock">${I.lock}</span>`}${store.subCrown(p, s) ? I.crown : ""}</button>`;
}

export function land(gi) {
  const p = store.player(), g = WORDS[gi], nxt = store.nextSub(p);
  const { root, $ } = mount(document.getElementById("app"), html`<div class="screen">
    <div class="top">${iconButton({ id: "back", icon: I.home, label: "Back to map" })}
      <div class="grow land-title"><span>${pic(g.pic, { player: p })}</span><span>${LANDS[g.id].en}</span></div>${starsPill(p)}</div>
    <div class="stones">${g.subs.map(s => stone(p, s, s === nxt))}</div></div>`);
  $("#back").onclick = () => nav.back();
  onTap(root, "[data-sub]", b => {
    const s = SUBS[b.dataset.sub];
    if (!store.subUnlocked(p, s)) return nope(b);
    round.start(s);
  });
}
