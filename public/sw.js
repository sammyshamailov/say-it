// Service worker: the app opens instantly from the phone, works offline after the first visit,
// and updates itself in the background.
//
// VERSION and SHELL are written by `npm run release <version>` (tools/release.mjs). A new VERSION
// makes the browser install this worker again, which saves the new app files in a new cache;
// the page then reloads into it at a calm moment (see js/pwa.js).
const VERSION = "2.8.1";
// shell:start
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/app.css?v=2.8.1",
  "fonts/fredoka.woff",
  "js/core/dom.js",
  "js/core/emitter.js",
  "js/core/html.js",
  "js/core/router.js",
  "js/core/sheet.js",
  "js/data/audio-map.js",
  "js/data/index.js",
  "js/data/lands.js",
  "js/data/outfits.js",
  "js/data/stages.js",
  "js/data/words.js",
  "js/main.js?v=2.8.1",
  "js/parent/dashboard.js",
  "js/parent/gate.js",
  "js/parent/mic-explain.js",
  "js/parent/profile-form.js",
  "js/parent/setup.js",
  "js/parent/transfer.js",
  "js/pwa.js",
  "js/round/round.js",
  "js/round/steps/finish.js",
  "js/round/steps/meet.js",
  "js/round/steps/memory.js",
  "js/round/steps/pop.js",
  "js/round/steps/say.js",
  "js/round/steps/tap.js",
  "js/screens/garden.js",
  "js/screens/map.js",
  "js/screens/start.js",
  "js/screens/stickers.js",
  "js/screens/who.js",
  "js/services/match.js",
  "js/services/shop.js",
  "js/services/sound.js",
  "js/services/speech.js",
  "js/services/store.js",
  "js/state.js",
  "js/ui/components.js",
  "js/ui/icons.js",
  "js/ui/mascot.js",
  "js/ui/picture.js",
  "js/version.js",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png"
];
// shell:end

const APP = "sayit-app-" + VERSION;
const AUDIO = "sayit-audio";
const PICS = "sayit-pictures"; // word and map pictures; their address carries ?p= / ?m= <picture version>
const MUSIC = "sayit-music";  // the soundtrack; its address carries ?v= <music version>

self.addEventListener("install", e => {
  // cache:"reload" skips the browser's HTTP cache, so a new version never stores old files
  e.waitUntil(caches.open(APP)
    .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("sayit-app-") && k !== APP).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Saved copy first; otherwise the network, saving what came back (same-site files only).
async function cacheFirst(cacheName, request, { ignoreSearch = false, save = r => r.ok && r.type === "basic", init } = {}) {
  const c = await caches.open(cacheName);
  const hit = await c.match(request, { ignoreSearch });
  if (hit) return hit;
  const r = await fetch(request, init).catch(() => null);
  if (r && save(r)) c.put(request, r.clone());
  return r || new Response("Offline", { status: 503 });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // word recordings from Wikimedia Commons
  if (url.hostname === "upload.wikimedia.org") {
    e.respondWith(cacheFirst(AUDIO, req, { ignoreSearch: true, save: r => r.ok }));
    return;
  }
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) return; // transfer codes always go to the network

  if (url.pathname.includes("/img/words/") || url.pathname.includes("/img/map/")) {
    e.respondWith(cacheFirst(PICS, req));
    return;
  }
  if (url.pathname.includes("/music/")) {
    e.respondWith(cacheFirst(MUSIC, req));
    return;
  }

  // Opening the app: straight from the phone, no waiting for the network. A newer version is
  // found by the browser's own check of this worker file, installed in the background, and
  // shown at the next calm moment.
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      const c = await caches.open(APP);
      const saved = (await c.match("index.html")) || (await c.match("./"));
      if (saved) return saved;
      const r = await fetch(req).catch(() => null);
      return r || new Response("Offline", { status: 503 });
    })());
    return;
  }

  // every other app file is saved in this version's cache when the worker installs
  e.respondWith(cacheFirst(APP, req));
});

// Download every word recording, picture and music track once, a few at a time, so words work offline.
const busy = {};
self.addEventListener("message", e => {
  const d = e.data || {};
  const name = { "cache-audio": AUDIO, "cache-pictures": PICS, "cache-music": MUSIC }[d.type] || null;
  if (!name || busy[name]) return;
  busy[name] = true;
  const files = d.files || [];
  e.waitUntil((async () => {
    try {
      const c = await caches.open(name);
      const have = new Set((await c.keys()).map(k => k.url));
      const abs = f => new URL(f, self.registration.scope).href;
      if (name === PICS || name === MUSIC) { // forget pictures or music from an older version
        const keep = new Set(files.map(abs));
        await Promise.all([...have].filter(u => !keep.has(u)).map(u => c.delete(u)));
      }
      const todo = files.filter(f => !have.has(abs(f)));
      let i = 0;
      const worker = async () => {
        while (i < todo.length) {
          const f = todo[i++];
          try { const r = await fetch(f, name === AUDIO ? { mode: "cors" } : {}); if (r.ok) await c.put(f, r); } catch (err) {}
          await new Promise(r => setTimeout(r, name === AUDIO ? 150 : 30));
        }
      };
      await Promise.all([worker(), worker(), worker()]);
    } finally {
      busy[name] = false;
    }
  })());
});
