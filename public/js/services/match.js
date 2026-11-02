// Forgiving match between what speech recognition heard and the word (kept from the first version).
function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ")
    .replace(/\b(a|an|the|it'?s|its|is|that|this|um|uh|my|i said)\b/g, " ").replace(/\s+/g, " ").trim();
}

function lev(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let p = [...Array(n + 1).keys()];
  for (let i = 1; i <= m; i++) {
    const c = [i];
    for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    p = c;
  }
  return p[n];
}

export function isMatch(heard, target, alts) {
  const goals = [target, ...(alts || [])].map(norm);
  for (const h of heard) {
    const n = norm(h); if (!n) continue;
    const words = n.split(" "), joined = n.replace(/ /g, "");
    for (const g of goals) {
      const gj = g.replace(/ /g, "");
      if (n === g || joined === gj || (" " + n + " ").includes(" " + g + " ")) return true;
      const cands = [joined, ...words];
      for (let i = 0; i < words.length - 1; i++) cands.push(words[i] + words[i + 1]);
      for (const c of cands) {
        const d = lev(c, gj);
        if (gj.length >= 5 && d <= 2) return true;
        if (gj.length >= 3 && gj.length < 5 && d <= 1 && c[0] === gj[0]) return true;
      }
    }
  }
  return false;
}
