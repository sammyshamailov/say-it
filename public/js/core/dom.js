// Small DOM helpers shared by every screen.

export const wait = ms => new Promise(r => setTimeout(r, ms));

// Restart a CSS animation class (pop, wiggle, hop, bump) even if it is already on the element.
export function replay(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

// Replace the host's content and return the new root element plus a scoped querySelector.
export function mount(host, markup) {
  host.innerHTML = String(markup);
  const root = host.firstElementChild;
  return { root, $: sel => root.querySelector(sel), $$: sel => [...root.querySelectorAll(sel)] };
}

// One click listener on a root for every element matching selector (delegation).
// Listeners die with the root, so re-rendering a screen never stacks old handlers.
export function onTap(root, selector, fn) {
  root.addEventListener("click", e => {
    const el = e.target.closest(selector);
    if (el && root.contains(el) && !el.disabled) fn(el, e);
  });
}

// Run fn when the browser has a quiet moment (falls back to a timer where unsupported).
export function whenIdle(fn, timeout = 4000) {
  if ("requestIdleCallback" in window) requestIdleCallback(fn, { timeout });
  else setTimeout(fn, 1500);
}
