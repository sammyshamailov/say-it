// Feed Pipo: Pipo asks for something by its word; tap its picture and it flies to him.
// The same listening as Listen & tap, as a game: three plates, three words, no score kept.
import { html } from "../../core/html.js";
import { wait, replay } from "../../core/dom.js";
import { shuffle } from "../../services/store.js";
import { WORD } from "../../data/index.js";
import { Sound } from "../../services/sound.js";
import { I } from "../../ui/icons.js";
import { pic } from "../../ui/picture.js";
import { Mascot } from "../../ui/mascot.js";
import { buddy } from "../../ui/components.js";

export async function feed(ctx, step) {
  const { player: p } = ctx, targets = shuffle(step.keys);
  // three plates: the round's words, filled up with other words the child has met
  const plates = [...step.keys];
  for (const k of shuffle(Object.keys(p.words).filter(k => WORD[k]))) {
    if (plates.length >= 3) break;
    if (!plates.some(x => WORD[x].en === WORD[k].en || WORD[x].pic === WORD[k].pic)) plates.push(k);
  }
  let ti = 0, busy = true;
  const { root, $, $$ } = ctx.frame(html`
    <div class="feed-top">
      ${buddy("listen", p.outfit, "clamp(170px,50vw,280px)")}
      <button class="b3 hear c-sky" id="hear" aria-label="Hear the word again">${I.speaker}</button>
    </div>
    <div class="plates">${shuffle(plates).map(k => html`<button class="b3 plate c-white" data-k="${k}" aria-label="${WORD[k].en}"><span class="food">${pic(WORD[k].pic, { player: p })}</span></button>`)}</div>`, { stars: true });
  const mood = m => Mascot.set($("#buddy"), m, p.outfit);
  const target = () => WORD[targets[ti]];
  $("#hear").onclick = () => { if (ti < targets.length) Sound.word(target().en); };

  $$(".plate").forEach(b => b.onclick = async () => {
    if (busy || !ctx.alive()) return;
    if (WORD[b.dataset.k].en !== target().en) {
      replay(b, "wiggle"); Sound.sfx("soft"); mood("oops");
      await Sound.word(target().en);
      if (ctx.alive() && !busy) mood("listen");
      return;
    }
    busy = true;
    // the picture flies from its plate to Pipo's mouth
    const food = b.querySelector(".food"), from = food.getBoundingClientRect(), to = $("#buddy").getBoundingClientRect();
    const dx = to.left + to.width * .68 - (from.left + from.width / 2), dy = to.top + to.height * .62 - (from.top + from.height / 2);
    food.style.transition = "transform .45s cubic-bezier(.5,0,.8,.6),opacity .12s .38s";
    food.style.transform = `translate(${dx}px,${dy}px) scale(.25)`;
    food.style.opacity = "0";
    Sound.sfx("flip");
    await wait(460); if (!ctx.alive()) return;
    mood("happy"); Sound.sfx("pop"); Sound.sfx("good");
    await Sound.word(target().en); if (!ctx.alive()) return;
    ti++;
    if (ti >= targets.length) {
      ctx.award(1);
      await Sound.talk("cheer", p.gender); await wait(300);
      return ctx.next();
    }
    // the plate fills up again, the plates change places, and Pipo asks for the next thing
    food.style.transition = "none"; food.style.transform = ""; food.style.opacity = "";
    shuffle($$(".plate")).forEach((el, i) => { el.style.order = i; });
    replay(b, "pop");
    mood("listen");
    await wait(350); if (!ctx.alive()) return;
    await Sound.word(target().en);
    busy = false;
  });

  await wait(350); if (!ctx.alive()) return;
  await Sound.word(target().en);
  busy = false;
}
