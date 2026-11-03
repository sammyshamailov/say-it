// Offline support and updates (the page side; the worker is public/sw.js).
import { whenIdle } from "./core/dom.js";

// isCalm(): true when reloading for an update won't interrupt anything (on the map, no round, no form)
// downloads(): {pictures, recordings, music} to keep on the phone for offline play
export function registerServiceWorker({ isCalm, downloads }) {
  if (!("serviceWorker" in navigator)) return;
  // Was this page already run by a service worker? If not, the first one taking over isn't an update.
  const hadWorker = !!navigator.serviceWorker.controller;

  addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(reg => {
      // Fetch every picture and recording once, but only after the first screen is up and the
      // phone is idle, so the download never competes with starting the app.
      const send = () => whenIdle(() => {
        const w = reg.active || navigator.serviceWorker.controller; if (!w) return;
        const { pictures, recordings, music } = downloads();
        w.postMessage({ type: "cache-pictures", files: pictures });
        w.postMessage({ type: "cache-audio", files: recordings });
        w.postMessage({ type: "cache-music", files: music });
      });
      if (reg.active) send(); else navigator.serviceWorker.ready.then(send);

      // An installed app that comes back from the background isn't reloaded by the phone,
      // so look for a new version every time it's shown again (at most once a minute).
      let lastCheck = Date.now();
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState !== "visible" || Date.now() - lastCheck < 60e3) return;
        lastCheck = Date.now();
        reg.update().catch(() => {});
      });
    }).catch(() => {});
  });

  // A new version took over: reload into it at a calm moment (never mid-round or mid-form).
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadWorker || reloading) return;
    reloading = true;
    const tryNow = () => (isCalm() ? location.reload() : setTimeout(tryNow, 2000));
    tryNow();
  });
}
