// The map: one long trail through six photographed lands, easy at the bottom, hard at the top.
// Every stone is a round. The glowing stone (with the mascot next to it) is the one Play starts;
// any open stone can be tapped. A land with many stones repeats its photo, mirrored, above itself.
import { html } from "../core/html.js";
import { mount, onTap } from "../core/dom.js";
import { nav } from "../core/router.js";
import { store } from "../state.js";
import { WORDS } from "../data/index.js";
import { LANDS, panelsFor, trailPoints } from "../data/lands.js";
import { LAND_STAGES, STAGE } from "../data/stages.js";
import { Sound } from "../services/sound.js";
import { SAY } from "../data/he-lines.js";
import { canBuy } from "../services/shop.js";
import { round } from "../round/round.js";
import { I } from "../ui/icons.js";
import { pic } from "../ui/picture.js";
import { Mascot } from "../ui/mascot.js";
import { iconButton, starsPill, soundButton, wireSoundButton, nope } from "../ui/components.js";

export const MAP_V = 1; // bump when the map pictures change, so phones fetch the new ones
export const mapImg = name => `img/map/${name}.webp?m=${MAP_V}`;
export const mapPictureUrls = () =>
  [...Object.keys(LANDS), "stone-1", "stone-2", "stone-3", "stone-4", "stone-5", "chest", "chest-open", "star", "sign", "lock",
    ...Object.values(LANDS).flatMap(L => L.stickers.map(s => s[0]))].map(mapImg);

function stone(p, st, [x, y], next) {
  const open = store.stageOpen(p, st), done = store.stageDone(p, st);
  const state = done ? "done" : open ? "open" : "locked";
  let face;
  if (st.kind === "chest") face = html`<img class="prop" src="${mapImg(done ? "chest-open" : "chest")}" alt="" draggable="false">`;
  else if (st.kind === "party") face = html`<img class="prop" src="${mapImg("star")}" alt="" draggable="false">`;
  else face = html`<img class="base" src="${mapImg("stone-" + st.tier)}" alt="" draggable="false"><span class="pic">${pic(st.pic, { player: p, lazy: true })}</span>`;
  const prog = st.kind === "word" && open && !done && store.stageStarted(p, st)
    ? html`<span class="bar"><i style="width:${Math.round(store.stageProgress(p, st) * 100)}%"></i></span>` : "";
  const mark = done ? html`<span class="tick">${I.star("#FFD23F", "#1A1640")}</span>`
    : open ? "" : html`<img class="lockp" src="${mapImg("lock")}" alt="" draggable="false">`;
  const label = st.kind === "word" ? st.sub.name : st.kind === "chest" ? "Treasure chest" : "Party";
  return html`<button class="spot ${st.kind} ${state} ${next ? "next" : ""}" data-st="${st.id}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%"
    aria-label="${label}${open ? "" : ", locked"}">${face}${prog}${mark}</button>`;
}

function landPanels(p, g, gi, next) {
  const L = LANDS[g.id], stones = LAND_STAGES[gi], n = panelsFor(L, stones.length);
  const done = store.landDone(p, gi);
  const panels = [];
  for (let j = 0; j < n; j++) {
    // stones shared out evenly, so the last photo of a land isn't left nearly empty
    const part = stones.slice(Math.round(j * stones.length / n), Math.round((j + 1) * stones.length / n)), mirrored = j % 2 === 1;
    const pts = trailPoints(L, part.length, mirrored);
    const nextAt = part.indexOf(next);
    const extras = [];
    if (j === 0) {
      const [x] = pts[0];
      // the land's sign stands beside its first stone, on the side away from the mascot
      const sx = Math.min(84, Math.max(16, x > 50 ? x + 28 : x - 28));
      extras.push(html`<button class="sign" data-land="${gi}" style="left:${sx}%;top:96%" aria-label="${L.en}">
        <img src="${mapImg("sign")}" alt="" draggable="false"><span>${L.en}</span></button>`);
      for (const [name, sx, sy, at] of L.stickers) if (done >= at)
        extras.push(html`<img class="sticker-w" src="${mapImg(name)}" alt="" draggable="false" style="left:${sx}%;top:${sy}%">`);
    }
    if (nextAt >= 0) {
      const [x, y] = pts[nextAt];
      extras.push(html`<div class="map-buddy ${x > 50 ? "left" : "right"}" style="left:${x}%;top:${y}%">${Mascot.svg("idle", p.outfit)}</div>`);
    }
    panels.push(html`<div class="land-panel" data-land-of="${g.id}" style="aspect-ratio:${L.ratio}">
      <img class="bg ${mirrored ? "flip" : ""}" src="${mapImg(g.id)}" alt="" draggable="false" decoding="async" loading="${gi < 1 ? "eager" : "lazy"}">
      ${extras}${part.map((st, i) => stone(p, st, pts[i], st === next))}</div>`);
  }
  return panels;
}

export function map() {
  const p = store.player();
  if (!p) return nav.reset("start");
  const next = store.nextStage(p);
  // bottom to top: the first land's first stone is at the very bottom
  const panels = WORDS.flatMap((g, gi) => landPanels(p, g, gi, next));
  const { root, $ } = mount(document.getElementById("app"), html`<div class="screen">
    <div class="top">
      <button class="b3 avatar-btn c-pink" id="who" aria-label="Change player">${p.avatar}</button>
      <div class="grow"></div>${starsPill(p)}${soundButton()}
      ${iconButton({ id: "parent", icon: I.parents, label: "Parents" })}
    </div>
    <div class="map" id="map"><div class="world">${panels.reverse().map((x, i) => html`<div class="layer" style="z-index:${panels.length - i}">${x}</div>`)}</div>
      <button class="b3 find c-yellow" id="find" aria-label="Show where I am">${Mascot.svg("happy", p.outfit)}</button></div>
    <div class="dock">
      ${iconButton({ id: "book", color: "purple", icon: I.book, label: "Sticker book" })}
      <button class="b3 play c-yellow" id="play" aria-label="Play">${I.play}Play</button>
      ${iconButton({ id: "shop", color: "mint", icon: I.bag, label: "Garden and shop", cls: canBuy(p) ? "glow" : "" })}
    </div></div>`);

  const mapEl = $("#map");
  const toNext = smooth => root.querySelector(".spot.next")?.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
  toNext(false);
  // the button that brings the glowing stone back shows only when it's off screen
  const findBtn = $("#find");
  const syncFind = () => {
    const s = root.querySelector(".spot.next");
    if (!s) return (findBtn.hidden = true);
    const a = s.getBoundingClientRect(), b = mapEl.getBoundingClientRect();
    findBtn.hidden = a.bottom > b.top && a.top < b.bottom;
  };
  // the music of the land in the middle of the screen
  const panelsEls = [...root.querySelectorAll("[data-land-of]")];
  let musicFrame = 0;
  const syncMusic = () => {
    musicFrame = 0;
    const b = mapEl.getBoundingClientRect(), mid = (b.top + b.bottom) / 2;
    const at = panelsEls.find(x => { const r = x.getBoundingClientRect(); return r.top <= mid && r.bottom >= mid; });
    if (at) Sound.scene(at.dataset.landOf);
  };
  mapEl.addEventListener("scroll", syncFind, { passive: true });
  mapEl.addEventListener("scroll", () => { if (!musicFrame) musicFrame = requestAnimationFrame(syncMusic); }, { passive: true });
  requestAnimationFrame(syncFind);
  requestAnimationFrame(syncMusic);
  findBtn.onclick = () => toNext(true);

  onTap(root, "[data-st]", b => {
    const st = STAGE[b.dataset.st];
    if (!store.landPaid(st.land)) {
      // a land the phone hasn't unlocked yet: a parent opens it in the parent area
      nope(b);
      if (store.settings.hebrew) Sound.hebrew(SAY.landLocked);
      return;
    }
    if (!store.stageOpen(p, st)) return nope(b);
    round.start(st);
  });
  onTap(root, "[data-land]", async b => {
    const L = LANDS[WORDS[+b.dataset.land].id];
    await Sound.speak(L.en, "en", .8);
    if (store.settings.hebrew) Sound.hebrew(L.he);
  });
  $("#play").onclick = () => round.start(store.nextStage(p));
  $("#who").onclick = () => nav.go("who");
  $("#book").onclick = () => nav.go("stickers");
  $("#shop").onclick = () => nav.go("garden");
  $("#parent").onclick = () => nav.go("gate");
  wireSoundButton(root);
}
