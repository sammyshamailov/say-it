// Offline support: cache the app, then each word recording once.
// (Kept in its own file so the Content-Security-Policy can forbid inline scripts.)
if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("sw.js").then(reg=>{
      const files = [...new Set(Object.values(window.AUDIO_MAP||{}))].map(f=>Sound.mediaUrl(f));
      const send = ()=>{ const w = reg.active || navigator.serviceWorker.controller; if(w) w.postMessage({type:"cache-audio", files}); };
      if(reg.active) send(); else navigator.serviceWorker.ready.then(send);
    }).catch(()=>{});
  });
}
