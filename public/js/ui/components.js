// Reusable pieces of screens. Each returns markup (from html``), so screens compose them.
import { html, raw } from "../core/html.js";
import { replay } from "../core/dom.js";
import { I } from "./icons.js";
import { pic, heFor } from "./picture.js";
import { Mascot } from "./mascot.js";
import { store } from "../state.js";
import { Sound } from "../services/sound.js";

// A chunky 3D icon button.
export const iconButton = ({ id, color = "tile", icon, label, cls = "", attrs = "" }) =>
  html`<button class="b3 icon c-${color} ${cls}" id="${id}" aria-label="${label}"${raw(attrs ? " " + attrs : "")}>${icon}</button>`;

// The stars a child can still spend. Every pill on screen updates itself when stars change (see wireStarsPills).
export function starsPill(p = store.player()) {
  const n = p ? store.purse(p) : 0;
  return html`<div class="stars" aria-label="${n} stars">${I.star()}<span>${n}</span></div>`;
}
export function wireStarsPills(root) {
  store.on("stars", (p, delta) => {
    if (p !== store.player()) return;
    const n = store.purse(p);
    root.querySelectorAll(".stars").forEach(s => {
      s.setAttribute("aria-label", n + " stars");
      const span = s.querySelector("span"); if (span) span.textContent = n;
      if (delta > 0) replay(s, "bump");
    });
    if (delta > 0) Sound.sfx("star");
  });
}

// Sound on/off: toggles itself in place.
export const soundButton = () => {
  const on = store.settings.sfx;
  return html`<button class="b3 icon c-sky" id="snd" aria-label="${on ? "Sound on" : "Sound off"}" aria-pressed="${on}">${on ? I.speaker : I.mute}</button>`;
};
export function wireSoundButton(root) {
  const b = root.querySelector("#snd"); if (!b) return;
  b.onclick = () => {
    const s = store.settings; s.sfx = !s.sfx; store.save(); Sound.syncMusic();
    b.outerHTML = String(soundButton());
    wireSoundButton(root);
  };
}

// Top bar: a button on the left, anything in the middle, optional things on the right.
export const topBar = (left, middle = html`<div class="grow"></div>`, right = "") =>
  html`<div class="top">${left}${middle}${right}</div>`;

// Holder for the mascot; its mood is swapped with Mascot.set(el, …).
export const buddy = (mood, outfit, width, extra = "") =>
  html`<div id="buddy" style="width:${raw(width)}${raw(extra)}">${Mascot.svg(mood, outfit)}</div>`;

// The big word card used by "meet" and "say": picture, English word, Hebrew, hear and Hebrew buttons.
// secret: the word and its Hebrew are hidden behind a "?" until the card loses its .secret class
export function wordCard(w, p, color, { tapPicture = false, secret = false } = {}) {
  const hebrew = store.settings.hebrew;
  return html`<div class="word-card b3 c-${color}${secret ? " secret" : ""}" style="cursor:default">
    <div class="corner l">${hebrew ? html`<button class="b3 c-yellow" id="heb" lang="he" aria-label="Hebrew">עב</button>` : ""}</div>
    <div class="corner r"><button class="b3 c-sky" id="hear" aria-label="Hear it">${I.speaker}</button></div>
    <div class="big"${raw(tapPicture ? ' id="big"' : "")}>${pic(w.pic, { player: p })}</div>
    <div class="en" style="color:var(--ink)">${w.en}</div>
    ${hebrew ? html`<div class="he" lang="he" style="color:var(--ink)">${heFor(w, p)}</div>` : ""}
  </div>`;
}

// A locked thing was tapped: wiggle and a soft sound.
export function nope(el) { replay(el, "wiggle"); Sound.sfx("soft"); }
