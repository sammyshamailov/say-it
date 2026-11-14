// Listen & tap: hear the word, tap its picture among two to four.
import { html } from "../../core/html.js";
import { wait, onTap, replay } from "../../core/dom.js";
import { store } from "../../state.js";
import { shuffle } from "../../services/store.js";
import { ALL_KEYS, WORD } from "../../data/index.js";
import { CONFUSABLE, confusable } from "../../data/stages.js";
import { Sound } from "../../services/sound.js";
import { I } from "../../ui/icons.js";
import { pic } from "../../ui/picture.js";
import { Mascot } from "../../ui/mascot.js";
import { buddy } from "../../ui/components.js";

// How many pictures to choose from grows with the word's tier: 2 (tier 1), 3 (tier 2), 4 (tier 3
// and up), one fewer the first time a word is asked. A word asked again (a review, the answer
// that counts towards "remembered") always gets at least 3, so a lucky tap is less likely.
//
// The wrong pictures are ones the child has a reason to consider, so the word has to be listened
// to: first the other words of this round, then words already met in the same land, and only then
// the rest of the land. (Before 2.14 a new word's wrong pictures came from all the words of the
// game: next to a globe never seen before, the horse Pipo had just shown needed no listening.)
// A well-known word competes with met words of its own subcategory first (harder: cow vs sheep).
// Words a child mixes up (puppy/dog) only meet from tier 3 on, once the word is well known: then
// one is the wrong answer on purpose. Never two of the same picture or word.
export function choices(p, k, roundWords = []) {
  const w = WORD[k], r = store.rec(p, k), lvl = r ? r.lvl : 0;
  const n = lvl === 0 ? Math.max(2, Math.min(4, w.tier + 1) - 1) : Math.max(3, Math.min(4, w.tier + 1));
  const tricky = w.tier >= 3 && lvl >= 2;
  const met = x => !!store.rec(p, x);
  const land = w.group.subs.flatMap(s => s.keys);
  const tiers = lvl >= 2 ? [w.sub.keys.filter(met), roundWords, land.filter(met), w.sub.keys, land]
    : [roundWords, land.filter(met), land];
  let pool = tiers.flatMap(t => shuffle(t)).concat(shuffle(ALL_KEYS)).filter(x => x !== k && !confusable(k, x));
  if (tricky) pool = shuffle([...(CONFUSABLE[k] || [])]).slice(0, 1).concat(pool);
  const out = [k];
  for (const x of pool) {
    if (out.length >= n) break;
    const o = WORD[x];
    if (o.en !== w.en && o.pic !== w.pic && !out.some(y => WORD[y].pic === o.pic || WORD[y].en === o.en)) out.push(x);
  }
  return shuffle(out);
}

export async function tap(ctx, step) {
  const { player: p } = ctx, w = WORD[step.k], opts = choices(p, step.k, ctx.round.words);
  let tries = 0, locked = false;
  const { root, $, $$ } = ctx.frame(html`
    <div class="mascot-row">
      ${buddy("idle", p.outfit, "clamp(110px,30vw,150px)")}
      <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
        <button class="b3 hear c-sky" id="hear" aria-label="Hear the word again">${I.speaker}</button>
        <button class="b3 slow c-tile" id="slow" aria-label="Hear it slowly">${I.turtle}</button>
      </div>
    </div>
    <div class="cards n${opts.length}">${opts.map(k => html`<button class="b3 card c-tile" data-k="${k}" aria-label="${WORD[k].en}">${pic(WORD[k].pic, { player: p })}</button>`)}</div>`, { stars: true });
  const mood = m => Mascot.set($("#buddy"), m, p.outfit);
  $("#hear").onclick = () => Sound.word(w.en);
  $("#slow").onclick = () => Sound.word(w.en, true);

  onTap(root, "[data-k]", async b => {
    if (locked || !ctx.alive()) return;
    if (b.dataset.k === step.k) {
      locked = true;
      b.className = "b3 card c-mint";
      b.innerHTML = String(html`${pic(w.pic, { player: p })}<span class="say">${w.en}</span><span class="tick">${I.check}</span>`);
      $$("[data-k]").forEach(o => { if (o !== b) o.classList.add("dim"); });
      mood("happy"); Sound.sfx("good");
      if (tries === 0) { store.mark(p, step.k, true, { again: !!step.again }); ctx.award(1); }
      await Sound.talk("cheer", p.gender); if (!ctx.alive()) return;
      await Sound.word(w.en); if (!ctx.alive()) return;
      await wait(350); ctx.next();
    } else {
      tries++;
      replay(b, "wiggle");
      Sound.sfx("soft"); mood("oops");
      if (tries === 1) { store.mark(p, step.k, false); ctx.requeue(step.k); }
      if (tries >= 2) root.querySelector(`[data-k="${CSS.escape(step.k)}"]`).classList.add("glow");
      await Sound.word(w.en, tries >= 2);
      if (ctx.alive() && !locked) mood("idle");
    }
  });

  await wait(350);
  if (ctx.alive()) Sound.word(w.en);
}
