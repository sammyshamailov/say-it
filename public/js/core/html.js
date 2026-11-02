// Safe HTML templates.
//   html`<b>${name}</b>`  escapes every value by default, so text from a save file or a
//   transfer code can never turn into markup. Trusted markup (icons, other templates) is
//   wrapped with raw() or comes from another html`` call. Arrays are joined, null/undefined
//   render as nothing, booleans as "true"/"false" (handy for aria-pressed).
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ESC[c]);

class Raw {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}
export const raw = s => (s instanceof Raw ? s : new Raw(String(s ?? "")));

function part(v) {
  if (v == null) return "";
  if (v instanceof Raw) return v.s;
  if (Array.isArray(v)) return v.map(part).join("");
  return esc(v);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += part(values[i]) + strings[i + 1];
  return new Raw(out);
}
