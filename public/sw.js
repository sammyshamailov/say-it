// Service worker: makes the app work offline after the first visit.
const VERSION = "2.1.0";
const APP = "sayit-app-" + VERSION;
const AUDIO = "sayit-audio";
const SHELL = [
  "./", "index.html", "manifest.webmanifest",
  "css/app.css?v=2.1.0", "fonts/fredoka.woff",
  "js/words.js?v=2.1.0", "js/audio-map.js?v=2.1.0", "js/store.js?v=2.1.0", "js/audio.js?v=2.1.0",
  "js/speech.js?v=2.1.0", "js/mascot.js?v=2.1.0", "js/app.js?v=2.1.0", "js/parent.js?v=2.1.0", "js/boot.js?v=2.1.0",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/maskable-512.png"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(APP).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("sayit-app-") && k!==APP).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});

self.addEventListener("fetch", e=>{
  const url = new URL(e.request.url);
  if(e.request.method !== "GET") return;
  if(url.hostname === "upload.wikimedia.org"){
    e.respondWith(caches.open(AUDIO).then(async c=>{
      const hit = await c.match(e.request, {ignoreSearch:true});
      if(hit) return hit;
      const r = await fetch(e.request);
      if(r.ok) c.put(e.request, r.clone());
      return r;
    }));
    return;
  }
  if(url.origin !== location.origin) return;
  if(url.pathname.startsWith("/api/")) return; // transfer codes always go to the network
  // app files: cache first, refresh in the background
  e.respondWith(caches.open(APP).then(async c=>{
    const hit = await c.match(e.request, {ignoreSearch: e.request.mode==="navigate"}) || (e.request.mode==="navigate" ? await c.match("index.html") : null);
    const net = fetch(e.request).then(r=>{ if(r.ok && r.type==="basic") c.put(e.request, r.clone()); return r; }).catch(()=>null);
    return hit || (await net) || new Response("Offline", {status:503});
  }));
});

// Download every word recording once, a few at a time, so words play offline.
let caching = false;
self.addEventListener("message", e=>{
  if(!e.data || e.data.type !== "cache-audio" || caching) return;
  caching = true;
  const files = e.data.files || [];
  e.waitUntil((async ()=>{
    const c = await caches.open(AUDIO);
    const todo = [];
    for(const f of files){ if(!(await c.match(f))) todo.push(f); }
    let i = 0;
    async function worker(){
      while(i < todo.length){
        const f = todo[i++];
        try{ const r = await fetch(f, {mode:"cors"}); if(r.ok) await c.put(f, r); }catch(err){}
        await new Promise(r=>setTimeout(r, 150));
      }
    }
    await Promise.all([worker(), worker(), worker()]);
    caching = false;
  })());
});
