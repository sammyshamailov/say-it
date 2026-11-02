// Memory match: a picture card pairs with its sound card.
import { html } from "../../core/html.js";
import { wait } from "../../core/dom.js";
import { shuffle } from "../../services/store.js";
import { WORD } from "../../data/index.js";
import { Sound } from "../../services/sound.js";
import { I } from "../../ui/icons.js";
import { pic } from "../../ui/picture.js";
import { Mascot } from "../../ui/mascot.js";
import { buddy } from "../../ui/components.js";

export async function memory(ctx, step) {
  const { player: p } = ctx;
  const deck = shuffle(step.keys.flatMap(k => [{ k, kind: "pic" }, { k, kind: "snd" }]));
  let open = [], left = step.keys.length, busy = false;
  const { $$, $ } = ctx.frame(html`
    <div class="mascot-row" style="min-height:100px">${buddy("idle", p.outfit, "clamp(96px,26vw,124px)")}</div>
    <div class="memo">${deck.map((_, i) => html`<button class="b3 mcard c-purple" data-i="${i}" aria-label="Card"><span class="back">${I.q}</span></button>`)}</div>`, { stars: true });
  const els = $$(".mcard");
  const mood = m => Mascot.set($("#buddy"), m, p.outfit);
  const face = (el, c) => {
    if (c.kind === "pic") { el.classList.add("open"); el.innerHTML = String(pic(WORD[c.k].pic, { player: p })); }
    else { el.classList.add("snd"); el.innerHTML = String(I.speaker); }
  };
  const hide = el => { el.classList.remove("open", "snd"); el.innerHTML = String(html`<span class="back">${I.q}</span>`); };

  els.forEach((el, i) => el.onclick = async () => {
    if (busy || !ctx.alive() || el.classList.contains("gone") || open.some(o => o.i === i)) return;
    const c = deck[i];
    Sound.sfx("flip"); face(el, c);
    if (c.kind === "snd") Sound.word(WORD[c.k].en);
    open.push({ i, c });
    if (open.length < 2) return;
    busy = true;
    const [a, b] = open; open = [];
    if (a.c.k === b.c.k && a.c.kind !== b.c.kind) {
      await wait(700); if (!ctx.alive()) return;
      Sound.sfx("good"); mood("happy");
      await Sound.word(WORD[a.c.k].en); if (!ctx.alive()) return;
      els[a.i].classList.add("gone"); els[b.i].classList.add("gone");
      if (!--left) { ctx.award(1); await Sound.talk("cheer", p.gender); await wait(300); return ctx.next(); }
    } else {
      await wait(1300); if (!ctx.alive()) return;
      hide(els[a.i]); hide(els[b.i]); mood("idle");
    }
    busy = false;
  });
}
