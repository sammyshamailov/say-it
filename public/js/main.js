// Say It! Words: the entry point. Registers every screen with the router and starts the app.
//
//   core/      html templates, DOM helpers, router, sheets, events (no app knowledge)
//   data/      words, recordings, lands, hats
//   services/  store (progress), sound, speech, shop rules
//   ui/        icons, pictures, mascot, shared components
//   screens/   map, land, who, stickers, garden
//   round/     the round controller and one module per step (meet, tap, say, pop, memory, finish)
//   parent/    gate, parent area, first run, transfer, microphone explanation
import { nav } from "./core/router.js";
import { replay } from "./core/dom.js";
import { anySheetOpen, closeTopSheet } from "./core/sheet.js";
import { store } from "./state.js";
import { Sound } from "./services/sound.js";
import { round } from "./round/round.js";
import { wireStarsPills } from "./ui/components.js";
import { allPictureUrls } from "./ui/picture.js";
import { start } from "./screens/start.js";
import { who } from "./screens/who.js";
import { map } from "./screens/map.js";
import { land } from "./screens/land.js";
import { stickers } from "./screens/stickers.js";
import { garden } from "./screens/garden.js";
import { gate } from "./parent/gate.js";
import { dashboard } from "./parent/dashboard.js";
import { setup } from "./parent/setup.js";
import { registerServiceWorker } from "./pwa.js";

const app = document.getElementById("app");

nav.register("start", start).register("setup", setup).register("who", who)
  .register("map", map).register("land", land).register("stickers", stickers).register("garden", garden)
  .register("round", round.show).register("gate", gate).register("dashboard", dashboard);
// leaving the round for any other screen stops it
nav.beforeShow(name => { if (name !== "round") round.leave(); });
// the back button closes an open sheet first
nav.interceptBack(closeTopSheet);
nav.attachHistory();

wireStarsPills(app);

// tap feedback on every chunky button
app.addEventListener("pointerdown", e => {
  const b = e.target.closest(".b3");
  if (!b || b.disabled) return;
  Sound.unlock(); Sound.sfx("tap");
  replay(b, "pop");
});
// browsers only allow sound after the first touch
addEventListener("pointerdown", () => { Sound.unlock(); Sound.syncMusic(); }, { once: true });
// no music while the app is in the background
document.addEventListener("visibilitychange", () => { if (document.hidden) Sound.music(false); else Sound.syncMusic(); });

registerServiceWorker({
  // safe to reload for an update: not in a round, no sheet open, not in the parent area or first-run form
  isCalm: () => !round.active && !anySheetOpen() && !document.querySelector(".parent, .gate"),
  downloads: () => ({ pictures: allPictureUrls(), recordings: Sound.recordingUrls() })
});

// modules run after the document is parsed, so the app can start right away
nav.reset("start");
