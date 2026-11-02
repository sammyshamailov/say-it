// Where the app opens: first-run setup, "who's playing?", or straight to the map.
import { nav } from "../core/router.js";
import { store } from "../state.js";

export function start() {
  const ps = store.state.profiles;
  if (!ps.length) return nav.reset("setup");
  if (ps.length === 1) store.setPlayer(ps[0].id);
  if (ps.length > 1) return nav.reset("who");
  nav.reset("map");
}
