// Say it: the child says the word. Speech recognition checks it where available (bonus star);
// otherwise, and after one unheard try, "Echo" records the child, plays their voice back, then the word.
// Every real attempt earns a star. No microphone: the child says it out loud and taps a big star.
import { html } from "../../core/html.js";
import { wait } from "../../core/dom.js";
import { store } from "../../state.js";
import { WORD } from "../../data/index.js";
import { subColor } from "../../data/lands.js";
import { Sound } from "../../services/sound.js";
import * as Speech from "../../services/speech.js";
import { I } from "../../ui/icons.js";
import { heFor } from "../../ui/picture.js";
import { Mascot } from "../../ui/mascot.js";
import { buddy, wordCard } from "../../ui/components.js";
import { micExplain } from "../../parent/mic-explain.js";

export async function say(ctx, step) {
  const { player: p } = ctx, w = WORD[step.k];
  let busy = false, attempts = 0, rewarded = false, myVoice = null;
  const { root, $ } = ctx.frame(html`
    ${wordCard(w, p, subColor(w.sub))}
    <div class="say-row" style="min-height:96px">
      ${buddy("listen", p.outfit, "clamp(100px,26vw,130px)")}
      <div class="levels" id="lv" aria-hidden="true">${Array.from({ length: 7 }, () => html`<i></i>`)}</div>
      <button class="b3 echo c-white" id="echo" hidden aria-label="Hear my voice">
        <span class="pl">${I.playWhite}</span>
        <span style="font-size:30px">${p.avatar}</span>
      </button>
    </div>
    <div style="flex:1"></div>
    <div class="say-row">
      <div class="side" aria-hidden="true"></div>
      <button class="b3 mic c-pink" id="mic" aria-label="Say it" disabled>${I.mic}</button>
      <button class="b3 side c-mint" id="next" aria-label="Next" hidden>${I.next}</button>
      <div class="side" id="nextph" aria-hidden="true"></div>
    </div>`, { stars: true });

  // the child's recording lives only for this step
  ctx.round.onCleanup(() => { if (myVoice) URL.revokeObjectURL(myVoice); });

  const mood = m => Mascot.set($("#buddy"), m, p.outfit);
  const bars = [...root.querySelectorAll("#lv i")];
  const level = v => bars.forEach((b, i) => {
    const k = 1 - Math.abs(i - 3) / 4;
    b.style.height = (10 + v * 54 * k * (0.7 + Math.random() * 0.3)) + "px";
  });
  const showNext = () => { $("#next").hidden = false; $("#nextph").hidden = true; $("#next").classList.add("glow"); };

  // The mic stays locked while the app is talking, so the child waits for the word to finish
  // (and the app never records its own voice as the child's).
  let talking = 0;
  const lockMic = on => { const m = $("#mic"); if (m) m.disabled = on; };
  async function talk(play) {
    talking++; lockMic(true);
    try { await play(); } finally { talking--; if (!talking && ctx.alive()) lockMic(false); }
  }

  $("#hear").onclick = () => { if (!busy) talk(() => Sound.word(w.en)); };
  const hb = $("#heb"); if (hb) hb.onclick = () => { if (!busy) talk(() => Sound.hebrew(heFor(w, p)).then(() => Sound.word(w.en))); };
  $("#next").onclick = () => ctx.next();
  $("#echo").onclick = () => { if (myVoice && !busy) talk(async () => { await Sound.playUrl(myVoice, 1); await Sound.word(w.en); }); };

  const reward = clear => talk(async () => {
    mood("happy");
    if (!rewarded) { rewarded = true; store.markSaid(p, step.k, clear); ctx.award(clear ? 2 : 1); }
    Sound.sfx("good");
    await Sound.talk(clear ? "clear" : "said", p.gender); if (!ctx.alive()) return;
    if (myVoice) { await Sound.playUrl(myVoice, 1); if (!ctx.alive()) return; await wait(200); }
    await Sound.word(w.en);
    if (ctx.alive()) showNext();
  });
  const missed = () => talk(async () => {
    attempts++;
    mood("oops");
    await Sound.talk("noHear", p.gender); if (!ctx.alive()) return;
    await Sound.word(w.en);
    if (ctx.alive()) { mood("listen"); if (attempts >= 2) showNext(); }
  });
  // no microphone: the mic button becomes a big star the child taps after saying the word
  const micDenied = () => {
    const mic = $("#mic");
    mic.className = "b3 mic c-yellow";
    mic.setAttribute("aria-label", "I said it!");
    mic.innerHTML = String(I.star("#fff", "#1A1640"));
    mic.onclick = () => { if (!rewarded && !talking) reward(false); };
    mood("listen");
  };

  $("#mic").onclick = async () => {
    if (busy || talking || !ctx.alive()) return;
    Sound.stop();
    const settings = store.settings;
    if (!settings.micAsked) {
      const ok = await micExplain();
      if (!ok || !ctx.alive()) return;
      settings.micAsked = true; store.save();
    }
    busy = true;
    const mic = $("#mic");
    mic.classList.add("live");
    Sound.hush(true); // no music while the child speaks, so it isn't recorded or heard as their voice
    try {
      // after one unheard try, switch to Echo: it only needs to hear a voice, so every real attempt counts
      let echo = Speech.mode() !== "recognize" || attempts >= 1;
      if (!echo) {
        level(.6);
        const res = await Speech.recognize(); if (!ctx.alive()) return;
        level(0);
        if (res.heard) await reward(Speech.isMatch(res.heard, w.en, w.alts));
        else if (!Speech.hasSR() && Speech.canRecord()) echo = true; // recognition unavailable (offline/blocked): use Echo
        else if (res.error === "not-allowed") micDenied();
        else await missed();
      }
      if (echo) {
        if (!Speech.canRecord()) throw new Error("no-mic");
        const res = await Speech.record(level); if (!ctx.alive()) return;
        if (res.spoke) {
          if (myVoice) URL.revokeObjectURL(myVoice);
          myVoice = res.url;
          if (myVoice) $("#echo").hidden = false;
          $("#lv").hidden = true;
          await reward(false);
        } else await missed();
      }
    } catch (e) {
      if (ctx.alive()) micDenied();
    } finally {
      Sound.hush(false); busy = false;
      if (ctx.alive()) mic.classList.remove("live");
    }
  };

  await talk(async () => { await wait(300); if (ctx.alive()) await Sound.word(w.en); });
  if (!ctx.alive()) return;
  if (store.settings.micAsked && (await Speech.permission()) === "denied") micDenied();
  if (ctx.alive()) $("#mic").classList.add("glow");
}
