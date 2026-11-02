// Sheet: a modal over the screen (buy?, microphone explanation).
// Every way of leaving it (its own buttons, a tap on the backdrop, the back button) goes
// through close(), so whoever opened it always hears back.
import { html } from "./html.js";

const open = [];

export function openSheet({ content, className = "sheet", lang, dir, backdropCloses = false, onClose = () => {} }) {
  const veil = document.createElement("div");
  veil.className = "veil";
  veil.setAttribute("role", "dialog");
  veil.setAttribute("aria-modal", "true");
  const box = document.createElement("div");
  box.className = className;
  if (lang) box.lang = lang;
  if (dir) box.dir = dir;
  box.innerHTML = String(html`${content}`);
  veil.appendChild(box);
  let closed = false;
  const sheet = {
    el: veil,
    $: sel => veil.querySelector(sel),
    close(result) {
      if (closed) return;
      closed = true;
      veil.remove();
      open.splice(open.indexOf(sheet), 1);
      onClose(result);
    }
  };
  if (backdropCloses) veil.addEventListener("click", e => { if (e.target === veil) sheet.close(); });
  document.body.appendChild(veil);
  open.push(sheet);
  return sheet;
}

export const anySheetOpen = () => open.length > 0;
// closes the top sheet; true if there was one (used by the back button)
export function closeTopSheet() {
  const s = open.at(-1);
  if (!s) return false;
  s.close();
  return true;
}
