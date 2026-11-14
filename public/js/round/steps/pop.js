// Pop the bubbles: pictures float up; pop the one whose word you hear.
import { html } from "../../core/html.js";
import { wait } from "../../core/dom.js";
import { shuffle } from "../../services/store.js";
import { ALL_KEYS, WORD } from "../../data/index.js";
import { Sound } from "../../services/sound.js";
import { I } from "../../ui/icons.js";
import { pic } from "../../ui/picture.js";
import { Mascot } from "../../ui/mascot.js";
import { buddy } from "../../ui/components.js";

const randomOf = a => a[Math.floor(Math.random() * a.length)];

export async function pop(ctx, step) {
  const { player: p } = ctx, targets = shuffle(step.keys);
  let ti = 0, speed = 9, since = 0, timer = null;
  const { $ } = ctx.frame(html`
    <div class="mascot-row" style="min-height:96px">
      ${buddy("idle", p.outfit, "clamp(96px,26vw,124px)")}
      <button class="b3 hear c-sky" id="hear" aria-label="Hear the word again" style="width:96px;height:96px">${I.speaker}</button>
    </div>
    <div class="pond" id="pond"></div>`, { stars: true });
  const pond = $("#pond");
  const stopSpawning = () => { clearInterval(timer); timer = null; };
  ctx.round.onCleanup(stopSpawning);
  const target = () => WORD[targets[ti]];
  const mood = m => Mascot.set($("#buddy"), m, p.outfit);
  const finished = () => ti >= targets.length;
  $("#hear").onclick = () => { if (!finished()) Sound.word(target().en); };

  // The other bubbles are words the child has met (all the words of the game only while there are
  // too few), so the right one is found by its word, not by being the only familiar picture. They
  // never share the target's word ("orange" fruit vs colour) or picture.
  const met = Object.keys(p.words).filter(k => WORD[k]);
  const from = met.length >= 6 ? met : ALL_KEYS;
  let others = [], othersFor = null;
  const distractors = t => {
    if (othersFor !== t) { othersFor = t; others = from.filter(k => WORD[k].pic !== t.pic && WORD[k].en !== t.en); }
    return others;
  };

  async function popped(b) {
    // bubbles still float while the mascot cheers: taps after the last word do nothing
    if (!ctx.alive() || finished() || b.classList.contains("burst")) return;
    if (WORD[b.dataset.k].en !== target().en) {
      b.animate([{ opacity: 1 }, { opacity: .35 }, { opacity: 1 }], { duration: 450 });
      Sound.sfx("soft"); Sound.word(target().en);
      return;
    }
    b.classList.add("burst"); Sound.sfx("pop"); Sound.sfx("good");
    mood("happy");
    ti++; speed = Math.max(6.5, speed - .8);
    if (finished()) {
      stopSpawning(); ctx.award(1);
      await Sound.talk("cheer", p.gender); await wait(400);
      return ctx.next();
    }
    await Sound.word(target().en);
    if (ctx.alive()) mood("idle");
  }

  // head: start partway up so the pond isn't empty at the beginning
  function spawn(head = 0) {
    if (!ctx.alive()) return stopSpawning();
    const t = target(); if (!t) return;
    const isTarget = since >= 2 || Math.random() < .4;
    const k = isTarget ? t.key : randomOf(distractors(t));
    since = isTarget ? 0 : since + 1;
    const H = pond.clientHeight, size = Math.min(128, Math.max(96, pond.clientWidth * .25));
    const b = document.createElement("button");
    b.className = "bub"; b.dataset.k = k; b.setAttribute("aria-label", WORD[k].en);
    b.innerHTML = String(pic(WORD[k].pic, { player: p }));
    b.style.left = Math.max(4, Math.random() * (pond.clientWidth - size - 8)) + "px";
    b.style.top = H + "px";
    b.style.setProperty("--h", H + "px");
    b.style.setProperty("--t", speed + "s");
    if (head) b.style.animationDelay = (-head * speed) + "s";
    b.addEventListener("animationend", ev => { if (ev.animationName === "floatup" || ev.animationName === "burst") b.remove(); });
    b.onpointerdown = () => popped(b);
    pond.appendChild(b);
  }

  await wait(250); if (!ctx.alive()) return;
  await Sound.word(target().en); if (!ctx.alive()) return;
  [.55, .35, .15, 0].forEach(h => spawn(h));
  timer = setInterval(() => spawn(), 1300);
}
