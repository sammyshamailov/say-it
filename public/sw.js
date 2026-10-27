// Service worker: makes the app work offline after the first visit.
const VERSION = "2.2.1";
const APP = "sayit-app-" + VERSION;
const AUDIO = "sayit-audio";
const SHELL = [
  "./", "index.html", "manifest.webmanifest",
  "css/app.css?v=2.2.1", "fonts/fredoka.woff",
  "js/words.js?v=2.2.1", "js/audio-map.js?v=2.2.1", "js/store.js?v=2.2.1", "js/audio.js?v=2.2.1",
  "js/speech.js?v=2.2.1", "js/mascot.js?v=2.2.1", "js/app.js?v=2.2.1", "js/shop.js?v=2.2.1", "js/parent.js?v=2.2.1", "js/boot.js?v=2.2.1",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/maskable-512.png"
];

self.addEventListener("install", e=>{
  // cache:"reload" skips the browser's HTTP cache, so a new version never stores old files
  e.waitUntil(caches.open(APP).then(c=>c.addAll(SHELL.map(u=>new Request(u, {cache:"reload"})))).then(()=>self.skipWaiting()));
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
  // Opening the app: try the network first so a new version shows straight away,
  // but fall back to the saved copy after 3 seconds or when offline.
  if(e.request.mode === "navigate"){
    e.respondWith(caches.open(APP).then(async c=>{
      const saved = async ()=> (await c.match(e.request, {ignoreSearch:true})) || (await c.match("index.html")) || (await c.match("./"));
      const net = fetch(e.request, {cache:"no-cache"}).then(r=>{ if(r.ok && r.type==="basic") c.put("index.html", r.clone()); return r; });
      const timeout = new Promise(res=>setTimeout(res, 3000, null));
      try{ const r = await Promise.race([net, timeout]); if(r && r.ok) return r; }catch(err){}
      return (await saved()) || (await net.catch(()=>null)) || new Response("Offline", {status:503});
    }));
    return;
  }
  // other app files carry ?v=<version> in their address, so the saved copy is always the right one
  e.respondWith(caches.open(APP).then(async c=>{
    const hit = await c.match(e.request);
    if(hit) return hit;
    const r = await fetch(e.request).catch(()=>null);
    if(r && r.ok && r.type==="basic") c.put(e.request, r.clone());
    return r || new Response("Offline", {status:503});
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
