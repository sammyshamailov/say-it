// The end of a treasure-chest stone: knock on the chest three times, it opens and stars fly out.
// A chest is a review round with a sure prize at the end, so it feels different from a word stone.
import { html, raw } from "../../core/html.js";
import { wait, replay } from "../../core/dom.js";
import { Sound } from "../../services/sound.js";
import { I } from "../../ui/icons.js";
import { Mascot } from "../../ui/mascot.js";
import { buddy } from "../../ui/components.js";
import { mapImg } from "../../screens/map.js";

export const CHEST_STARS = 5;
const KNOCKS = 3;

export async function chest(ctx) {
  const { player: p } = ctx;
  let knocks = 0, open = false;
  const { $ } = ctx.frame(html`
    <div class="chest-game">
      <button class="chest-btn glow-soft" id="chest" aria-label="Open the treasure chest">
        <img src="${mapImg("chest")}" alt="" draggable="false">
        <span class="burst-stars" aria-hidden="true">${Array.from({ length: CHEST_STARS }, (_, i) =>
          raw(String(I.star("#FFD23F", "#1A1640")).replace("<svg", `<svg style="--a:${-60 + i * 30}deg;animation-delay:${i * .07}s"`)))}</span>
      </button>
      ${buddy("idle", p.outfit, "clamp(110px,30vw,150px)")}
    </div>`, { stars: true });
  const mood = m => Mascot.set($("#buddy"), m, p.outfit);
  $("#chest").onclick = async () => {
    if (open || !ctx.alive()) return;
    knocks++;
    replay($("#chest"), "knock"); Sound.sfx("flip");
    if (knocks < KNOCKS) return;
    open = true;
    await wait(250); if (!ctx.alive()) return;
    $("#chest img").src = mapImg("chest-open");
    $("#chest").classList.remove("glow-soft");
    $("#chest").classList.add("opened");
    Sound.sfx("unlock"); mood("happy");
    await wait(500); if (!ctx.alive()) return;
    ctx.award(CHEST_STARS);
    await Sound.talk("cheer", p.gender); if (!ctx.alive()) return;
    await wait(700);
    ctx.next();
  };
}
