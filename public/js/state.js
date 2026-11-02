// The one store the app uses, saved in this browser's localStorage.
import { createStore } from "./services/store.js";

export const store = createStore({ storage: localStorage });

// never lose the last answer when the app is swiped away
addEventListener("pagehide", () => store.save(true));
document.addEventListener("visibilitychange", () => { if (document.hidden) store.save(true); });
try { navigator.storage?.persist?.(); } catch (e) {}
