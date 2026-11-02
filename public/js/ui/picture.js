// Word pictures.
//   "img:<id>"     public/img/words/<id>.webp (feelings and actions come in a boy and a girl
//                  version; the player's profile picks one)
//   "color:#hex"   a colour blob      "num:7"  a number
//   "a+b"          two emoji side by side, anything else is an emoji
// Bump PIC_V when the pictures are rebuilt, so phones fetch the new ones.
import { html, raw } from "../core/html.js";
import { WORDS } from "../data/index.js";
import { store } from "../state.js";

const PIC_V = 1;
const GENDERED = /^(feelings|actions)-/;
const HEX = /^#[0-9a-f]{3,8}$/i;
export const picUrl = id => `img/words/${id}.webp?p=${PIC_V}`;

function picId(p, player) {
  let id = p.slice(4);
  if (GENDERED.test(id)) id += player && player.gender === "f" ? "-girl" : "-boy";
  return id;
}

// Every picture file the app can show (both versions of gendered ones), for offline caching.
export function allPictureUrls() {
  const ids = new Set();
  for (const g of WORDS) for (const s of g.subs) for (const w of s.w) {
    if (!w[1].startsWith("img:")) continue;
    const id = w[1].slice(4);
    if (GENDERED.test(id)) { ids.add(id + "-boy"); ids.add(id + "-girl"); } else ids.add(id);
  }
  return [...ids].map(picUrl);
}

// lazy: for long lists (sticker book, parent area) where most pictures start off screen
export function pic(p, { lazy = false, player = store.player() } = {}) {
  p = String(p || "");
  if (p.startsWith("img:")) return html`<img class="wp" src="${picUrl(picId(p, player))}" alt="" draggable="false" decoding="async"${raw(lazy ? ' loading="lazy"' : "")}>`;
  if (p.startsWith("color:")) { const c = p.slice(6); return HEX.test(c) ? html`<span class="color-blob" style="background:${c}"></span>` : raw(""); }
  if (p.startsWith("num:")) return html`<span class="num">${p.slice(4)}</span>`;
  if (p.includes("+")) return html`<span class="duo">${p.split("+").map(x => html`<span>${x}</span>`)}</span>`;
  return html`${p}`;
}

// Hebrew translation, in the girl's form when the word has one ("m|f")
export function heFor(w, player) {
  const [m, f] = w.he.split("|");
  return player && player.gender === "f" && f ? f : m;
}
