// The sticker album: every word of the lands the child can play, land by land. A word's sticker is
// in colour once it was answered right, gets a gold frame once it is remembered (right on two
// days), and is a shadow to collect before that. Tap a sticker to hear its word. It is the
// child's own picture of what they know. (Before 2.14: one random sticker per finished round.)
import { html } from "../core/html.js";
import { mount, onTap } from "../core/dom.js";
import { nav } from "../core/router.js";
import { store } from "../state.js";
import { WORDS, WORD } from "../data/index.js";
import { LANDS } from "../data/lands.js";
import { Sound } from "../services/sound.js";
import { I } from "../ui/icons.js";
import { pic } from "../ui/picture.js";
import { iconButton, starsPill, nope } from "../ui/components.js";

function sticker(p, k) {
  const w = WORD[k];
  const state = store.remembered(p, k) ? "gold" : store.knows(p, k) ? "got" : "shadow";
  return html`<button class="slot ${state}" data-k="${k}" aria-label="${state === "shadow" ? "Not collected yet" : w.en}">${pic(w.pic, { lazy: true, player: p })}</button>`;
}

function land(p, g, gi) {
  const L = LANDS[g.id];
  if (!store.landOpen(p, gi)) return html`<div class="album-land">
    <button class="b3 album-head c-tile locked" data-land="${gi}" aria-label="${L.en}, locked">${pic(g.pic, { player: p })}<span class="lk">${I.lock}</span></button></div>`;
  // easiest words first, so the page fills from the top as the child goes up the land
  const keys = g.subs.flatMap(s => s.keys).sort((a, b) => WORD[a].tier - WORD[b].tier);
  const share = keys.filter(k => store.remembered(p, k)).length / keys.length;
  return html`<div class="album-land">
    <button class="b3 album-head c-${L.c}" data-land="${gi}" aria-label="${L.en}">${pic(g.pic, { player: p })}
      <span class="bar"><i style="width:${Math.round(share * 100)}%"></i></span></button>
    <div class="album-grid">${keys.map(k => sticker(p, k))}</div></div>`;
}

export function stickers() {
  const p = store.player();
  const { root, $ } = mount(document.getElementById("app"), html`<div class="screen">
    <div class="top">${iconButton({ id: "back", icon: I.back, label: "Back" })}<div class="grow land-title">${I.bookBig}</div>${starsPill(p)}</div>
    <div class="album">${WORDS.map((g, gi) => land(p, g, gi))}</div></div>`);
  $("#back").onclick = () => nav.back();
  onTap(root, "[data-k]", b => {
    if (b.classList.contains("shadow")) return nope(b);
    Sound.word(WORD[b.dataset.k].en);
  });
  onTap(root, "[data-land]", async b => {
    const L = LANDS[WORDS[+b.dataset.land].id];
    await Sound.english(L.en);
    if (store.settings.hebrew) Sound.hebrew(L.he);
  });
}
