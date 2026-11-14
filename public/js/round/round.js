// A round (3–5 minutes): meet new words → what's this? → listen & tap → say it → a bonus game → well done.
// Each kind of step is its own module in ./steps, looked up by name (strategy pattern), and gets a
// StepContext with everything it needs. A step must stop when ctx.alive() turns false: the child
// may leave the round at any moment (home button, back button, app in the background).
import { html } from "../core/html.js";
import { mount } from "../core/dom.js";
import { nav } from "../core/router.js";
import { store } from "../state.js";
import { shuffle } from "../services/store.js";
import { Sound } from "../services/sound.js";
import * as Speech from "../services/speech.js";
import { I } from "../ui/icons.js";
import { iconButton, starsPill } from "../ui/components.js";
import { meet } from "./steps/meet.js";
import { tap } from "./steps/tap.js";
import { say } from "./steps/say.js";
import { pop } from "./steps/pop.js";
import { memory } from "./steps/memory.js";
import { feed } from "./steps/feed.js";
import { chest } from "./steps/chest.js";
import { finish } from "./steps/finish.js";
import { mapImg } from "../screens/map.js";

const STEPS = { meet, tap, say, whats: say, pop, memory, feed, chest };
// the bonus game at the end of a round, in turn; a treasure chest stone ends by opening its chest
const BONUS = ["pop", "feed", "memory"];
const isBonus = t => BONUS.includes(t) || t === "chest";

class Round {
  constructor(player, sub, words, steps) {
    Object.assign(this, { player, sub, words, steps, i: 0, stars: 0, requeued: new Set(), dead: false });
    this.startedAt = Date.now(); // 0 while not counting (in the background)
    this.cleanups = [];
  }
  // time played since the last check, and restart the clock (or stop it)
  takeTime(keepCounting = true) {
    const ms = this.startedAt ? Date.now() - this.startedAt : 0;
    this.startedAt = keepCounting ? Date.now() : 0;
    return ms;
  }
  // a step registers what must be stopped when it ends (timers, recordings)
  onCleanup(fn) { this.cleanups.push(fn); }
  cleanup() { this.cleanups.splice(0).forEach(fn => { try { fn(); } catch (e) {} }); }
}

let current = null;

// The order of steps for one round. "What's this?" asks for words met in earlier rounds, before
// the round says them again (naming from memory is the speaking that teaches most, so it gets two
// of the three turns when there are words for it); "Say it" is for the new ones. Three of the two
// together at most.
function plan(p, b) {
  const steps = [];
  const old = b.words.filter(k => !b.fresh.includes(k));
  const recall = shuffle(old).slice(0, b.fresh.length ? 2 : 3);
  b.fresh.forEach(k => steps.push({ t: "meet", k }));
  recall.forEach(k => steps.push({ t: "whats", k }));
  shuffle(b.words).forEach(k => steps.push({ t: "tap", k }));
  b.fresh.slice(0, 3 - recall.length).forEach(k => steps.push({ t: "say", k }));
  steps.push({ t: b.sub.kind === "chest" ? "chest" : BONUS[p.rounds % BONUS.length], keys: b.words.slice(0, Math.min(3, b.words.length)) });
  return steps;
}

function start(sub) {
  const p = store.player();
  const b = store.buildRound(p, sub);
  leave();
  current = new Round(p, sub, b.words, plan(p, b));
  nav.go("round");
}

// Stop the round (time played is kept).
function leave() {
  if (current) {
    store.addPlayTime(current.player, current.takeTime(false));
    current.dead = true;
    current.cleanup();
    current = null;
  }
  Sound.stop();
  Speech.release();
}

// What a step can use. Built fresh for every step, bound to the round it belongs to.
function contextFor(r) {
  const p = r.player;
  return {
    round: r,
    player: p,
    alive: () => r === current && !r.dead,
    next() { if (r !== current || r.dead) return; r.cleanup(); r.i++; show(); },
    award(n = 1) { store.addStars(p, n); r.stars += n; },
    // the frame around every step: home button, progress dots, optional stars pill
    frame(inner, { stars = false } = {}) {
      const dots = r.steps.map((_, i) => html`<span class="${i < r.i ? "done" : i === r.i ? "now" : ""}"></span>`);
      const m = mount(document.getElementById("app"), html`<div class="screen">
        <div class="top">${iconButton({ id: "quit", icon: I.home, label: "Back to map" })}
          <div class="progress" aria-label="Step ${r.i + 1} of ${r.steps.length}">${dots}</div>${stars ? starsPill(p) : ""}</div>
        <div class="stage">${inner}</div></div>`);
      m.$("#quit").onclick = () => nav.reset("map");
      return m;
    },
    // put a missed word back in the round, before the bonus game (once per word); `again` tells
    // the step that a right answer this time doesn't count as a day the word was remembered
    requeue(k) {
      if (r.requeued.has(k)) return;
      r.requeued.add(k);
      const at = r.steps.findIndex(x => isBonus(x.t));
      r.steps.splice(at < 0 ? r.steps.length : at, 0, { t: "tap", k, again: true });
    }
  };
}

// The "round" screen: runs the current step, or the well-done screen after the last one.
function show() {
  const r = current;
  if (!r) return nav.reset("map");
  const step = r.steps[r.i];
  if (!step) {
    current = null;
    r.dead = true;
    r.cleanup();
    Speech.release();
    return finish(r);
  }
  // the land's photo, blurred, behind the round (see #app.in-round in app.css)
  // (a full address: a relative one in a custom property is resolved from the stylesheet's folder)
  document.getElementById("app").style.setProperty("--round-bg", `url("${new URL(mapImg(r.sub.group.id), document.baseURI).href}")`);
  Sound.scene(BONUS.includes(step.t) ? "games" : r.sub.group.id);
  STEPS[step.t](contextFor(r), step);
}

// time spent with the app in the background doesn't count as play
document.addEventListener("visibilitychange", () => {
  if (!current) return;
  if (document.hidden) store.addPlayTime(current.player, current.takeTime(false), true);
  else current.takeTime(true);
});

export const round = {
  start, leave, show,
  get active() { return !!current; }
};
