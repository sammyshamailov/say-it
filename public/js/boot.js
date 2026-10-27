// Offline support and updates.
// (Kept in its own file so the Content-Security-Policy can forbid inline scripts.)
if("serviceWorker" in navigator){
  // Was this page already run by a service worker? If not, the first one taking over isn't an update.
  const hadWorker = !!navigator.serviceWorker.controller;

  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("sw.js").then(reg=>{
      const files = [...new Set(Object.values(window.AUDIO_MAP||{}))].map(f=>Sound.mediaUrl(f));
      const send = ()=>{ const w = reg.active || navigator.serviceWorker.controller; if(w) w.postMessage({type:"cache-audio", files}); };
      if(reg.active) send(); else navigator.serviceWorker.ready.then(send);

      // An installed app that comes back from the background isn't reloaded by the phone,
      // so look for a new version every time it's shown again (at most once a minute).
      let lastCheck = Date.now();
      document.addEventListener("visibilitychange", ()=>{
        if(document.visibilityState !== "visible" || Date.now() - lastCheck < 60e3) return;
        lastCheck = Date.now(); reg.update().catch(()=>{});
      });
    }).catch(()=>{});
  });

  // A new version took over: reload into it at a calm moment (never mid-round or mid-form).
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", ()=>{
    if(!hadWorker || reloading) return;
    reloading = true;
    const tryNow = ()=>{
      if(window.Screens && Screens.calm && !Screens.calm()) return setTimeout(tryNow, 2000);
      location.reload();
    };
    tryNow();
  });
}
