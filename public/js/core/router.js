// Screen navigation with a registry of named screens and our own back stack.
// The browser history holds one guard entry, so the Android back button steps back a screen
// (or closes an open sheet) instead of leaving the app.
export class Router {
  #screens = new Map();
  #stack = [];
  #before = () => {};
  #intercept = () => false;

  register(name, screen) { this.#screens.set(name, screen); return this; }
  // called before any screen is shown (the round uses it to stop when you leave it)
  beforeShow(fn) { this.#before = fn; }
  // a back press is offered here first (open sheets close themselves); return true to consume it
  interceptBack(fn) { this.#intercept = fn; }

  get current() { return this.#stack.at(-1)?.[0] ?? null; }

  #show(name, args) {
    const screen = this.#screens.get(name);
    if (!screen) throw new Error("No screen named " + name);
    this.#before(name);
    screen(...args);
  }
  go(name, ...args) { this.#stack.push([name, args]); this.#show(name, args); }
  // start over from this screen (nothing to go back to)
  reset(name, ...args) { this.#stack.length = 0; this.go(name, ...args); }
  // make this screen the bottom of the stack without showing it (the next go() goes on top)
  base(name, ...args) { this.#stack.length = 0; this.#stack.push([name, args]); }
  // swap the current screen for another (the gate hands over to the parent area)
  replace(name, ...args) { this.#stack.pop(); this.go(name, ...args); }
  // draw the current screen again with its arguments
  refresh() { const top = this.#stack.at(-1); if (top) this.#show(top[0], top[1]); }
  back() {
    if (this.#intercept()) return;
    if (this.#stack.length < 2) return;
    this.#stack.pop();
    const [name, args] = this.#stack.at(-1);
    this.#show(name, args);
  }

  // hook the hardware/browser back button
  attachHistory() {
    try { history.replaceState({ g: 0 }, ""); history.pushState({ g: 1 }, ""); } catch (e) {}
    addEventListener("popstate", () => {
      this.back();
      try { history.pushState({ g: 1 }, ""); } catch (e) {}
    });
  }
}

export const nav = new Router();
