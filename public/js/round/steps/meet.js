// Meet a new word: the picture, the word said aloud, and its Hebrew meaning.
import { html } from "../../core/html.js";
import { wait } from "../../core/dom.js";
import { store } from "../../state.js";
import { WORD } from "../../data/index.js";
import { subColor } from "../../data/lands.js";
import { Sound } from "../../services/sound.js";
import { I } from "../../ui/icons.js";
import { heFor } from "../../ui/picture.js";
import { buddy, wordCard } from "../../ui/components.js";

export async function meet(ctx, step) {
  const { player: p } = ctx, w = WORD[step.k];
  const { $ } = ctx.frame(html`
    ${wordCard(w, p, subColor(w.sub), { tapPicture: true })}
    <div class="say-row" style="flex:1">
      ${buddy("happy", p.outfit, "clamp(120px,34vw,170px)")}
      <button class="b3 side c-mint" id="next" aria-label="Next" style="width:96px;height:96px;border-radius:30px">${I.next}</button>
    </div>`);
  const hear = () => Sound.word(w.en);
  $("#hear").onclick = hear;
  $("#big").onclick = hear;
  const hb = $("#heb"); if (hb) hb.onclick = () => Sound.hebrew(heFor(w, p)).then(() => Sound.word(w.en));
  const next = $("#next");
  next.onclick = () => { store.meet(p, step.k); ctx.next(); };

  await wait(300);
  if (ctx.alive() && next.isConnected) await Sound.word(w.en);
  if (ctx.alive() && next.isConnected) next.classList.add("glow"); // the child may already have moved on
}
