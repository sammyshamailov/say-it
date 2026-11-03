// The six lands of the map (one per word group): their photo, the trail drawn in it, and the
// little things that appear on it as a child plays (world stickers).
//
// path      the middle of the trail in the photo, bottom to top, as [x%, y%] of the picture
// ratio     width / height of the photo
// stickers  [picture, x%, y%, share of the land's stones done before it appears]
// A land with more stones than its trail has room for repeats its photo, mirrored, above itself.
import { groupIndex, subIndex } from "./index.js";

export const LANDS = {
  animals: { en: "Animal Jungle", he: "ג'ונגל החיות", c: "mint", ratio: 841 / 1870,
    path: [[55,95],[58,88],[52,82],[38,78],[32,73],[38,68],[48,64],[62,60],[68,56],[66,52],[50,49],[34,47],[22,45],[20,42],[28,40],[42,39],[60,38],[76,35],[78,31],[66,29],[48,28],[30,27],[12,25],[10,22],[22,20],[42,19],[56,17],[54,13],[46,10],[46,5]],
    stickers: [["zebra", 72, 24, .3], ["lion", 47, 45, .65]] },
  food: { en: "Yummy Town", he: "עיר הטעמים", c: "pink", ratio: 941 / 1672,
    path: [[50,94],[52,88],[54,82],[46,77],[36,73],[32,68],[38,63],[50,60],[62,57],[66,53],[56,50],[40,48],[30,45],[32,41],[46,39],[60,37],[64,33],[54,29],[40,26],[32,22],[40,18],[52,15],[54,10],[46,6],[44,2]],
    stickers: [["basket", 25, 54, .3], ["stall", 58, 44, .65]] },
  people: { en: "Me and Friends", he: "אני והחברים", c: "purple", ratio: 941 / 1672,
    path: [[48,95],[52,88],[54,83],[46,77],[36,73],[34,68],[42,65],[56,62],[68,58],[70,54],[62,51],[48,49],[36,46],[32,42],[40,39],[56,37],[66,33],[66,29],[58,26],[46,24],[40,20],[42,16],[52,12],[58,8],[56,3]],
    stickers: [["picnic", 76, 91, .3], ["puppy", 40, 11, .65]] },
  things: { en: "Toy House", he: "בית הצעצועים", c: "sky", ratio: 941 / 1672,
    path: [[46,96],[46,89],[40,84],[30,80],[26,75],[32,71],[44,68],[58,65],[64,61],[60,57],[48,53],[34,51],[24,48],[24,44],[34,42],[50,40],[64,37],[62,33],[52,31],[36,28],[26,25],[26,21],[38,18],[52,16],[58,13],[56,8],[54,3]],
    stickers: [["train", 16, 47, .3], ["teddy", 80, 88, .65]] },
  outside: { en: "Adventure Road", he: "דרך ההרפתקאות", c: "orange", ratio: 841 / 1870,
    path: [[52,88],[52,82],[46,77],[42,72],[50,67],[62,63],[64,59],[54,56],[40,53],[32,50],[36,47],[50,44],[62,42],[76,40],[78,37],[66,34],[50,32],[32,31],[14,29],[12,26],[24,23],[42,21],[56,19],[54,14],[44,10],[44,5]],
    stickers: [["balloon", 12, 4, .3], ["boat", 84, 33, .65]] },
  learning: { en: "Learning Castle", he: "טירת הלמידה", c: "yellow", ratio: 941 / 1672,
    path: [[40,96],[36,91],[24,87],[16,83],[22,78],[36,75],[52,72],[66,69],[72,65],[62,61],[46,58],[30,55],[20,51],[26,48],[40,46],[56,44],[68,41],[66,37],[54,35],[40,33],[28,30],[28,27],[40,26],[54,24],[60,22]],
    stickers: [["palm", 10, 76, .3], ["rainbow", 50, 52, .65]] }
};

// Room for stones: a stone is about 16% of the screen wide (a chest 18%, its lock pokes out a
// little more), so no two stones of one photo may sit closer than MIN picture widths, measured
// straight across the picture, not along the trail: where the trail bends back on itself,
// stones far apart on the trail can still land on top of each other.
const MIN = 0.22; // in widths of the picture

const gap = (L, a, b) => Math.hypot((a[0] - b[0]) / 100, (a[1] - b[1]) / 100 / L.ratio);

// The trail as a list of points about 1% of a picture width apart, with the distance along the
// trail at each one.
const traces = new Map();
function trace(L) {
  if (traces.has(L)) return traces.get(L);
  const out = [];
  let total = 0;
  for (let i = 1; i < L.path.length; i++) {
    const p0 = L.path[i - 1], p1 = L.path[i], d = gap(L, p0, p1), steps = Math.max(1, Math.ceil(d / 0.01));
    for (let k = i === 1 ? 0 : 1; k <= steps; k++) {
      const f = k / steps;
      out.push({ x: p0[0] + (p1[0] - p0[0]) * f, y: p0[1] + (p1[1] - p0[1]) * f, t: total + d * f });
    }
    total += d;
  }
  traces.set(L, out);
  return out;
}

// Walk up the trail, dropping a stone once it is at least `step` along the trail from the last
// one and at least MIN away from every stone so far.
function walk(L, step, max = Infinity) {
  const tr = trace(L), total = tr[tr.length - 1].t, from = total * 0.04, to = total * 0.96;
  const out = [];
  let lastT = -Infinity;
  for (const q of tr) {
    if (out.length >= max) break;
    if (q.t < from || q.t > to || q.t - lastT < step) continue;
    if (out.some(o => gap(L, o, [q.x, q.y]) < MIN)) continue;
    out.push([q.x, q.y]); lastT = q.t;
  }
  return out;
}

// most stones one photo holds
const capacity = L => walk(L, MIN).length;

// n stones spread as widely as the trail allows (bottom to top), as [x%, y%]; mirrored for the copies.
export function trailPoints(L, n, mirrored = false) {
  if (n <= 0) return [];
  let pts;
  if (n === 1) {
    const tr = trace(L), mid = tr[tr.length - 1].t / 2;
    const q = tr.find(o => o.t >= mid);
    pts = [[q.x, q.y]];
  } else {
    // the longest step along the trail that still fits n stones
    let lo = MIN, hi = trace(L).at(-1).t;
    for (let i = 0; i < 24; i++) { const s = (lo + hi) / 2; if (walk(L, s).length >= n) lo = s; else hi = s; }
    pts = walk(L, lo, n);
  }
  return pts.map(([x, y]) => [mirrored ? 100 - x : x, y]);
}

// closest two of these points, in picture widths
export function closest(L, pts) {
  let min = Infinity;
  for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) min = Math.min(min, gap(L, pts[a], pts[b]));
  return min;
}

// How many copies of the photo a land needs for n stones.
export const panelsFor = (L, n) => Math.max(1, Math.ceil(n / capacity(L)));

const SUB_COLORS = ["mint", "pink", "purple", "sky", "orange", "yellow"];
export const subColor = s => SUB_COLORS[(groupIndex(s.group) + subIndex(s)) % SUB_COLORS.length];

export const PROFILE_COLORS = ["pink", "sky", "mint", "purple", "orange", "yellow"];

export const AVATARS = ["🦁","🦄","🐯","🐼","🐸","🦊","🐶","🐱","🐰","🐻","🦖","🐬","🦋","🚀","⚽","🌸","🐵","🐧","🦉","🐙"];
