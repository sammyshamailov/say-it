// Listen & tap: hear the word, tap its picture among two or three.
import { html } from "../../core/html.js";
import { wait, onTap, replay } from "../../core/dom.js";
import { store } from "../../state.js";
import { shuffle } from "../../services/store.js";
import { WORDS, WORD } from "../../data/index.js";
import { Sound } from "../../services/sound.js";
import { I } from "../../ui/icons.js";
import { pic } from "../../ui/picture.js";
import { Mascot } from "../../ui/mascot.js";
import { buddy } from "../../ui/components.js";

// New words get 2 pictures, known ones 3. Well-known words compete with their own group
// (harder: cow vs sheep), others with pictures from anywhere. Never two of the same picture or word.
function choices(p, k) {
  const w = WORD[k], r = store.rec(p, k), n = !r || r.lvl === 0 ? 2 : 3;
  const same = r && r.lvl >= 2 ? w.sub.keys : [];
  let pool = shuffle(same.filter(x => x !== k));
  if (pool.length < n - 1) {
    const all = [];
    WORDS.forEach(g => g.subs.forEach(s => { if (s !== w.sub || same.length) all.push(...s.keys); }));
    pool = pool.concat(shuffle(all));
  }
  const out = [k];
  for (const x of pool) {
    if (out.length >= n) break;
    const o = WORD[x];
    if (o.en !== w.en && o.pic !== w.pic && !out.some(y => WORD[y].pic === o.pic)) out.push(x);
  }
  return shuffle(out);
}

export async function tap(ctx, step) {
  const { player: p } = ctx, w = WORD[step.k], opts = choices(p, step.k);
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
      if (tries === 0) { store.mark(p, step.k, true); ctx.award(1); }
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
