// The garden (animals the child adopted) and the star shop shelf.
import { html } from "../core/html.js";
import { mount, onTap, replay } from "../core/dom.js";
import { nav } from "../core/router.js";
import { openSheet } from "../core/sheet.js";
import { store } from "../state.js";
import { WORD } from "../data/index.js";
import { Sound } from "../services/sound.js";
import { pets, hats, ownedPets } from "../services/shop.js";
import { LANDS } from "../data/lands.js";
import { worn, toggleWear } from "../data/outfits.js";
import { I } from "../ui/icons.js";
import { pic } from "../ui/picture.js";
import { Mascot } from "../ui/mascot.js";
import { iconButton, starsPill, nope } from "../ui/components.js";

// Price as a row of star icons (no numbers to read): gold for stars you have, outlines for the rest.
// Big prices use big stars worth five each, so the row still fits on a tile.
const priceRow = (price, have) => {
  const big = price > 10, unit = big ? 5 : 1, n = Math.ceil(price / unit);
  return html`<span class="price ${big ? "big" : ""}" aria-label="${price} stars">${Array.from({ length: n }, (_, i) =>
    have >= (i + 1) * unit ? I.star("#FFD23F", "#1A1640") : I.star("#EEEAFB", "#B9B3F0"))}</span>`;
};

function shelfItem(p, x, have) {
  const owned = store.owns(p, x.id);
  const art = x.kind === "pet" ? pic(x.w.pic, { player: p }) : Mascot.svg("idle", x.hat); // hats are shown on the mascot
  const label = (x.kind === "pet" ? x.w.en : x.hat) + (owned ? "" : x.known ? ", " + x.price + " stars" : x.land ? ", opens in " + LANDS[x.land].en : ", not learned yet");
  const on = x.kind === "hat" && worn(p.outfit).includes(x.hat);
  return html`<button class="b3 item c-white ${x.known ? "" : "shadow"} ${on ? "on" : ""}" data-item="${x.id}" aria-label="${label}">
    <span class="art ${x.kind === "hat" ? "onbuddy" : ""}">${art}</span>${owned || !x.known ? "" : priceRow(x.price, have)}</button>`;
}

let tab = "pets"; // remembered while the app is open

export function garden({ justBought } = {}) {
  const p = store.player();
  const shelf = tab === "pets" ? pets(p) : hats(p);
  const have = store.purse(p);
  const { root, $ } = mount(document.getElementById("app"), html`<div class="screen">
    <div class="top">${iconButton({ id: "back", icon: I.back, label: "Back" })}<div class="grow"></div>${starsPill(p)}</div>
    <div class="garden" id="garden">
      <button class="me" id="me" aria-label="Your friend">${Mascot.svg("happy", p.outfit)}</button>
      ${ownedPets(p).map((k, i) => html`<button class="pet ${k === justBought ? "new" : ""}" data-pet="${k}" style="animation-delay:${-(i * 0.37) % 2.4}s" aria-label="${WORD[k].en}">${pic(WORD[k].pic, { player: p })}</button>`)}
    </div>
    <div class="tabs" role="tablist">
      <button class="b3 c-mint" data-tab="pets" role="tab" aria-pressed="${tab === "pets"}" aria-label="Animals">🐾</button>
      <button class="b3 c-purple" data-tab="hats" role="tab" aria-pressed="${tab === "hats"}" aria-label="Hats">${I.shirt}</button>
    </div>
    <div class="shelf">
      ${tab === "hats" ? html`<button class="b3 item c-white ${worn(p.outfit).length ? "" : "on"}" data-hat="" aria-label="Nothing on"><span class="art onbuddy">${Mascot.svg("idle", null)}</span></button>` : ""}
      ${shelf.map(x => shelfItem(p, x, have))}
    </div></div>`);

  $("#back").onclick = () => nav.back();
  $("#me").onclick = () => { replay($("#me .buddy"), "hop"); Sound.sfx("good"); };
  onTap(root, "[data-pet]", b => { replay(b, "hop"); Sound.word(WORD[b.dataset.pet].en); });
  onTap(root, "[data-tab]", b => { tab = b.dataset.tab; nav.refresh(); });
  onTap(root, "[data-hat]", () => { p.outfit = null; store.save(); nav.refresh(); });
  onTap(root, "[data-item]", b => {
    const x = shelf.find(s => s.id === b.dataset.item);
    if (x.kind === "hat" && store.owns(p, x.id)) { p.outfit = toggleWear(p.outfit, x.hat); store.save(); Sound.sfx("good"); return nav.refresh(); }
    if (!x.known) { nope(b); if (x.kind === "pet") Sound.word(x.w.en); return; } // pets not learned yet: say it as a hint to keep playing
    offer(p, x);
  });
}

// The "buy?" sheet: the thing big, its price in stars, and a big tick. A first tap never spends.
function offer(p, x) {
  const have = store.purse(p), ok = have >= x.price;
  const sheet = openSheet({
    className: "sheet buy",
    backdropCloses: true,
    content: html`<div class="big-art">${x.kind === "pet" ? html`<span class="pet-big">${pic(x.w.pic, { player: p })}</span>` : html`<div style="width:170px">${Mascot.svg("happy", x.hat)}</div>`}</div>
      ${priceRow(x.price, have)}
      <div class="row" style="justify-content:center">
        ${iconButton({ id: "no", icon: I.back, label: "No" })}
        <button class="b3 c-mint yes ${ok ? "glow" : ""}" id="yes" aria-label="Yes"${ok ? "" : " disabled"}>${I.checkWhite}</button>
      </div>`
  });
  if (x.kind === "pet") Sound.word(x.w.en); else if (!ok) Sound.sfx("soft");
  sheet.$("#no").onclick = () => sheet.close();
  sheet.$("#yes").onclick = () => {
    sheet.close();
    if (!store.buy(p, x.id, x.price)) return;
    Sound.sfx("unlock");
    if (x.kind === "hat") { p.outfit = toggleWear(p.outfit, x.hat); store.save(); return nav.refresh(); }
    garden({ justBought: x.key });
    setTimeout(() => Sound.word(x.w.en), 450);
  };
}
