// Well done: the stars earned, a new sticker, and where to go next.
import { html, raw } from "../../core/html.js";
import { mount, wait } from "../../core/dom.js";
import { nav } from "../../core/router.js";
import { store } from "../../state.js";
import { WORD } from "../../data/index.js";
import { Sound } from "../../services/sound.js";
import { canBuy } from "../../services/shop.js";
import { I } from "../../ui/icons.js";
import { pic } from "../../ui/picture.js";
import { Mascot } from "../../ui/mascot.js";
import { iconButton } from "../../ui/components.js";
import { round } from "../round.js";

// gold stars that drop into the jar one after another
const starAt = i => raw(String(I.star("#FFD23F", "#1A1640")).replace("<svg", `<svg style="animation-delay:${.15 + i * .08}s"`));

export async function finish(r) {
  const p = r.player;
  const words = r.words.map(k => WORD[k]);
  // the sticker shown: a word of the round that is now remembered (it's in colour in the album), else any
  const kept = words.filter(w => store.remembered(p, w.key));
  const from = kept.length ? kept : words;
  const prize = from[Math.floor(Math.random() * from.length)];
  store.finishRound(p, r.sub, prize, r.takeTime(false));
  // After the day's rounds, or when nothing more can be learned today, Pipo goes to sleep: the big
  // button leads to the garden instead of another round.
  const rest = store.resting(p);
  const shopNow = !rest && canBuy(p);
  const n = Math.min(r.stars, 14);
  const { $ } = mount(document.getElementById("app"), html`<div class="screen"><div class="done">
      <div style="width:clamp(140px,40vw,190px)" id="buddy">${Mascot.svg("happy", p.outfit)}</div>
      <h1>Well done!</h1>
      <div class="jar" aria-label="${r.stars} stars">${Array.from({ length: n }, (_, i) => starAt(i))}</div>
      <button class="sticker" id="stk" aria-label="New sticker: ${prize.en}">${pic(prize.pic, { player: p })}</button>
      ${shopNow ? iconButton({ id: "shopnow", color: "mint", icon: I.bag, label: "Garden and shop", cls: "glow" }) : ""}
    </div>
    <div class="dock">
      ${iconButton({ id: "home", icon: I.home, label: "Map" })}
      ${rest ? html`<button class="b3 play c-mint" id="garden" aria-label="Garden and shop">${I.bag}</button>`
        : html`<button class="b3 play c-yellow" id="again" aria-label="Play more">${I.play}</button>`}
      ${iconButton({ id: "book", color: "purple", icon: I.book, label: "Sticker book" })}
    </div></div>`);
  // the party stone (end of a land) gets its jingle; otherwise the fanfare
  if (!(r.sub.kind === "party" && Sound.jingle())) Sound.sfx("fanfare");
  $("#stk").onclick = () => Sound.word(prize.en);
  $("#home").onclick = () => nav.reset("map");
  if (rest) $("#garden").onclick = () => { nav.base("map"); nav.go("garden"); };
  else $("#again").onclick = () => { nav.base("map"); round.start(store.nextStage(p)); };
  $("#book").onclick = () => { nav.base("map"); nav.go("stickers"); };
  if (shopNow) $("#shopnow").onclick = () => { nav.base("map"); nav.go("garden"); };
  await wait(500);
  await Sound.talk("done", p.gender);
  if (rest && $("#buddy").isConnected) { await wait(900); Mascot.set($("#buddy"), "sleep", p.outfit); }
}
