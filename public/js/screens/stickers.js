// The sticker book: one sticker per finished round; tap one to hear its word.
import { html } from "../core/html.js";
import { mount, onTap } from "../core/dom.js";
import { nav } from "../core/router.js";
import { store } from "../state.js";
import { Sound } from "../services/sound.js";
import { I } from "../ui/icons.js";
import { pic } from "../ui/picture.js";
import { iconButton, starsPill } from "../ui/components.js";

export function stickers() {
  const p = store.player();
  const total = Math.max(24, Math.ceil((p.stickers.length + 1) / 6) * 6);
  const slots = Array.from({ length: total }, (_, i) => p.stickers[i]);
  const { root, $ } = mount(document.getElementById("app"), html`<div class="screen">
    <div class="top">${iconButton({ id: "back", icon: I.back, label: "Back" })}<div class="grow land-title">${I.bookBig}</div>${starsPill(p)}</div>
    <div class="book">${slots.map((s, i) => s
      ? html`<button class="b3 slot c-white" data-i="${i}" aria-label="${s.en}">${pic(s.pic, { lazy: true, player: p })}</button>`
      : html`<div class="b3 slot empty" aria-hidden="true"></div>`)}</div></div>`);
  $("#back").onclick = () => nav.back();
  onTap(root, "[data-i]", b => Sound.word(p.stickers[+b.dataset.i].en));
}
