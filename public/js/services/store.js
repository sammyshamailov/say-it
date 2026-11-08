// Progress lives on this device only (localStorage). Nothing is sent anywhere.
// createStore() takes its storage and clock as arguments, so tests run it in Node with fakes.
import { WORD } from "../data/index.js";
import { STAGES, LAND_STAGES, confusable } from "../data/stages.js";
import { OUTFITS } from "../data/outfits.js";
import { Emitter } from "../core/emitter.js";

export const KEY = "sayit2";
// words that moved to another group in 2.5 (old key -> new key)
const MOVED = { "wild/dinosaur": "dinos/dinosaur", "clothes/glasses": "accessories/glasses", "clothes/crown": "accessories/crown" };
const DAY = 864e5;
const DUE = [0, 10 * 60e3, DAY, 3 * DAY, 7 * DAY, 21 * DAY]; // wait after reaching each level
// the calendar day (on this phone) of a moment, to count the days a word was answered right
const dayOf = t => { const d = new Date(t); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); };

export function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const blankSettings = () => ({ music: true, musicV: 2, sfx: true, sayMode: "auto", hebrew: true, unlockAll: false, mascot: "Pipo" });
const blank = now => ({ v: 2, profiles: [], lastId: null, created: now, settings: blankSettings() });
const newRecord = now => ({ lvl: 0, due: 0, right: 0, wrong: 0, said: 0, clear: 0, seen: now });

export function isSave(d) {
  return !!d && typeof d === "object" && d.v === 2 && Array.isArray(d.profiles) &&
    d.profiles.every(p => p && typeof p.id === "string" && p.words && typeof p.words === "object");
}

export function createStore({ storage, now = Date.now } = {}) {
  const events = new Emitter();
  const read = k => { try { return storage.getItem(k); } catch (e) { return null; } };

  function newProfile(name, avatar, gender) {
    return { id: "k" + now().toString(36) + Math.random().toString(36).slice(2, 6), name: name || "", avatar: avatar || "🦁",
      gender: gender === "f" ? "f" : "m", stars: 0, spent: 0, owned: [], outfit: null, stickers: [], words: {}, done: {},
      stages: {}, mapV: 3, playMs: 0, rounds: 0, lastPlayed: 0 };
  }

  // Players from before the shop keep every hat they had already unlocked.
  // Players from before the big map (2.5) keep their words and see their finished stones done.
  function upgradeProfile(p) {
    if (!Array.isArray(p.owned)) p.owned = OUTFITS.filter(o => (p.stars || 0) >= o.stars).map(o => "hat:" + o.id);
    if (typeof p.spent !== "number") p.spent = 0;
    if (!p.done) p.done = {};
    if (!p.stages) p.stages = {};
    if ((p.mapV || 0) < 3) {
      const oldSub = {}; // word key -> the group it was in before 2.5
      for (const [from, to] of Object.entries(MOVED)) {
        if (p.words[from] && !p.words[to]) p.words[to] = p.words[from];
        delete p.words[from];
        p.owned = p.owned.map(id => (id === "pet:" + from ? "pet:" + to : id));
        oldSub[to] = from.split("/")[0];
      }
      // a stone is done if the child finished its group before and met one of its words
      for (const st of STAGES) if (st.kind === "word" &&
        st.keys.some(k => p.words[k] && p.done[oldSub[k] || WORD[k].sub.id])) p.stages[st.id] = true;
      p.mapV = 3;
    }
    return p;
  }

  // ---- migrate from the first version (keys sayit-players, sayit-got-<id>) ----
  function migrate() {
    let old = null;
    try { old = JSON.parse(read("sayit-players") || "null"); } catch (e) {}
    if (!Array.isArray(old) || !old.length) {
      // the first version also had default profiles saved only implicitly; check star keys
      const ids = ["p1", "p2"].filter(id => read("sayit-got-" + id));
      if (!ids.length) return null;
      old = ids.map(id => ({ id, name: id === "p2" ? "My daughter" : "My son", avatar: id === "p2" ? "🦄" : "🦁", gender: id === "p2" ? "f" : "m" }));
    }
    const s = blank(now());
    old.forEach((p, i) => {
      const np = newProfile(p.name, p.avatar, p.gender || (p.id === "p2" ? "f" : "m"));
      np.id = p.id || "p" + (i + 1);
      delete np.owned; // decided by upgradeProfile from the stars below
      let got = {};
      try { got = JSON.parse(read("sayit-got-" + p.id) || "{}"); } catch (e) {}
      Object.keys(got).forEach(k => {
        if (!WORD[k]) return;
        // a star in the first version meant the child said the word correctly
        np.words[k] = { lvl: 3, due: now() + 3 * DAY, right: 1, wrong: 0, said: 1, clear: 1, seen: now() };
        np.stars++;
      });
      s.profiles.push(np);
    });
    const last = read("sayit-last");
    s.lastId = s.profiles.some(p => p.id === last) ? last : s.profiles[0].id;
    s.migratedFrom = 1;
    return s; // old keys are left untouched on purpose
  }

  let state = null;
  try { state = JSON.parse(read(KEY) || "null"); } catch (e) {}
  if (!state || state.v !== 2) state = migrate() || blank(now());
  state.settings = Object.assign(blankSettings(), state.settings || {});
  // 2.6 brought a real soundtrack: switch the music on once (parents can still turn it off)
  if (!(state.settings.musicV >= 2)) Object.assign(state.settings, { music: true, musicV: 2 });
  state.profiles.forEach(upgradeProfile);

  let saveTimer = null;
  function save(immediately) {
    clearTimeout(saveTimer);
    const write = () => { try { storage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
    if (immediately) write(); else saveTimer = setTimeout(write, 250);
  }
  save(true);

  // ---- moving progress between phones (transfer code or backup file) ----
  const exportData = () => JSON.parse(JSON.stringify(state));
  function replaceAll(d) {
    if (!isSave(d)) return false;
    d.settings = Object.assign(blankSettings(), d.settings || {});
    d.profiles = d.profiles.map(p => {
      const base = newProfile(p.name, p.avatar, p.gender);
      delete base.owned; // an older save without a shop gets its hats from upgradeProfile
      delete base.mapV; delete base.stages; // and one from before the big map its stones
      return upgradeProfile(Object.assign(base, p));
    });
    if (!d.profiles.some(p => p.id === d.lastId)) d.lastId = d.profiles[0] ? d.profiles[0].id : null;
    d.unlocked = d.unlocked || state.unlocked || null; // restoring an older backup never locks the map again
    state = d;
    save(true);
    return true;
  }

  // ---- word progress / spaced repetition ----
  const rec = (p, key) => p.words[key];
  const recFor = (p, key) => p.words[key] || (p.words[key] = newRecord(now()));
  function meet(p, key) { if (!p.words[key]) { recFor(p, key); save(); } }
  function mark(p, key, ok) {
    const r = recFor(p, key);
    if (ok) {
      r.right++; r.lvl = Math.min(5, r.lvl + 1);
      const d = dayOf(now());
      if (r.rightDay !== d) { r.rightDay = d; r.days = (r.days || 0) + 1; }
    }
    else { r.wrong++; r.lastWrong = now(); r.lvl = Math.max(0, r.lvl - 1); }
    r.due = now() + DUE[r.lvl];
    save();
  }
  function markSaid(p, key, clear) {
    const r = recFor(p, key);
    r.said++; if (clear) r.clear++;
    save();
  }
  const learned = (p, key) => (p.words[key]?.lvl || 0) >= 3;
  // remembered: answered right (first try, in Listen & tap) on two different days
  const remembered = (p, key) => (p.words[key]?.days || 0) >= 2;
  const knows = (p, key) => !!(p.words[key] && p.words[key].right > 0);
  const toPractice = p => Object.keys(p.words).filter(k => WORD[k] && p.words[k].wrong > 0 && p.words[k].lvl <= 1);
  function dueKeys(p, keys) {
    const t = now();
    return keys.filter(k => p.words[k] && p.words[k].due <= t)
      .sort((a, b) => p.words[a].lvl - p.words[b].lvl || p.words[a].due - p.words[b].due);
  }

  // ---- stars and the shop ----
  // p.stars counts every star ever earned and never goes down (parents see it, lands use it).
  // The purse is what's left to spend. Bought things are kept forever in p.owned.
  const purse = p => Math.max(0, (p.stars || 0) - (p.spent || 0));
  const owns = (p, id) => Array.isArray(p.owned) && p.owned.includes(id);
  function addStars(p, n) { p.stars += n; save(); events.emit("stars", p, n); }
  function buy(p, id, price) {
    if (owns(p, id) || purse(p) < price) return false;
    p.owned = [...(p.owned || []), id];
    p.spent = (p.spent || 0) + price;
    save(true);
    events.emit("stars", p, -price);
    return true;
  }

  // ---- map progression ----
  // The map is played one land at a time, up the trail. The first land is open from the start;
  // a land opens once 40% of the easy (tier 1-2) word stones of the land below are done (or the
  // child has already played in it). Inside a land, a tier opens once 70% of the stones of the
  // tier below are done, and every stone of an open tier can be played. A chest opens when the
  // stones of its tier are done, the party stone when 70% of the land is.
  // A word stone is "met" once all its words were shown, and "done" once all of them were
  // remembered (answered right on two different days). Chests and parties are done after a round.
  // Only the first land is free. A parent unlock code (checked by /api/unlock) opens every land
  // for every child on the phone; it travels with transfer codes and backups. "Unlock all" and the
  // already-played rule work only inside lands the phone may use.
  const OPEN_SHARE = 0.7, LAND_SHARE = 0.4;
  const FREE_LANDS = 1;
  const unlocked = () => !!state.unlocked;
  const landPaid = gi => gi < FREE_LANDS || unlocked();
  function unlock(code) { state.unlocked = { at: now(), code: String(code || "").slice(0, 12) }; save(true); }
  const stageMet = (p, st) => st.keys.every(k => p.words[k]);
  const stageDone = (p, st) => st.kind === "word" ? st.keys.every(k => remembered(p, k)) : !!p.stages[st.id];
  const stageStarted = (p, st) => st.kind === "word" && st.keys.some(k => p.words[k]);
  // a word stone fills in two halves: meeting each word, then remembering it on a second day
  const stageProgress = (p, st) => st.keys.reduce((s, k) => s + (remembered(p, k) ? 2 : p.words[k] ? 1 : 0), 0) / (2 * st.keys.length);
  const stageCrown = (p, st) => st.keys.every(k => learned(p, k));
  const landWords = LAND_STAGES.map(land => land.filter(st => st.kind === "word"));
  const landEasy = landWords.map(list => list.filter(st => st.tier <= 2));
  const shareDone = (p, list, share) => list.filter(st => stageDone(p, st)).length >= share * list.length;
  const mostlyDone = (p, list) => shareDone(p, list, OPEN_SHARE);
  function landOpen(p, gi) {
    if (!landPaid(gi)) return false;
    if (gi <= 0 || state.settings.unlockAll) return true;
    if (landWords[gi].some(st => stageDone(p, st) || stageStarted(p, st))) return true;
    return shareDone(p, landEasy[gi - 1], LAND_SHARE) && landOpen(p, gi - 1);
  }
  function tierOpen(p, gi, t) {
    if (!landOpen(p, gi)) return false;
    if (t <= 1 || state.settings.unlockAll) return true;
    const words = landWords[gi];
    if (mostlyDone(p, words.filter(st => st.tier === t - 1)) && tierOpen(p, gi, t - 1)) return true;
    return words.some(st => st.tier === t && (stageDone(p, st) || stageStarted(p, st)));
  }
  function stageOpen(p, st) {
    if (!landPaid(st.land)) return false;
    if (state.settings.unlockAll || stageDone(p, st)) return true;
    if (!landOpen(p, st.land)) return false;
    if (st.kind === "word") return tierOpen(p, st.land, st.tier);
    if (st.kind === "chest") return landWords[st.land].filter(x => x.tier === st.tier).every(x => stageDone(p, x));
    return mostlyDone(p, landWords[st.land]);
  }
  // The stone the map glows on and the Play button starts. It follows the trail, so Pipo doesn't
  // hop around the map between sessions: the lowest open stone with something new (words not met
  // yet, or a chest/party not played); then the lowest open stone not done that has words due;
  // then (everything open is done) the open stone with the most words due, which can be in an
  // earlier land; then the lowest open stone not done.
  function nextStage(p) {
    for (const st of STAGES) if (!stageDone(p, st) && stageOpen(p, st) && (st.kind !== "word" || !stageMet(p, st))) return st;
    for (const st of STAGES) if (!stageDone(p, st) && stageOpen(p, st) && dueKeys(p, st.keys).length) return st;
    let best = null, bestN = 0;
    for (const st of STAGES) {
      if (!stageOpen(p, st)) continue;
      const n = dueKeys(p, st.keys).length;
      if (n > bestN) { best = st; bestN = n; }
    }
    if (best) return best;
    for (const st of STAGES) if (!stageDone(p, st) && stageOpen(p, st)) return st;
    return STAGES[0];
  }
  const landDone = (p, gi) => LAND_STAGES[gi].filter(st => stageDone(p, st)).length / LAND_STAGES[gi].length;

  // ---- build one round for a stone ----
  // Word stone: up to 3 new words, then words due for review: its own first, then from the same
  // land only, so a round keeps to the place the child chose (no cow in the fruit stone). Chest
  // and party stones: review only, of their land and then of the lands below, which is where
  // older lands come back. Below tier 3 a round never holds two words a child mixes up.
  function buildRound(p, st) {
    const easy = st.tier < 3;
    const clash = (k, list) => easy && list.some(x => confusable(k, x));
    const fresh = [];
    if (st.kind === "word") for (const k of st.keys) if (!p.words[k] && fresh.length < 3 && !clash(k, fresh)) fresh.push(k);
    const near = x => st.kind === "word" ? x.land === st.land : x.land <= st.land;
    const open = [];
    for (const x of STAGES) if (x.kind === "word" && near(x) && (stageDone(p, x) || stageOpen(p, x))) open.push(...x.keys);    const met = st.keys.filter(k => p.words[k]);
    const words = [...fresh];
    const add = (k, max) => { if (words.length < max && !words.includes(k) && !clash(k, words)) words.push(k); };
    for (const k of [...dueKeys(p, st.keys), ...dueKeys(p, open)]) add(k, 6);
    if (words.length < 4) for (const k of shuffle(met)) add(k, 5);
    if (words.length < 4) for (const k of shuffle(st.keys)) add(k, 5);
    return { sub: st, fresh, words };
  }

  // A finished round earns a sticker. A chest or party stone is done after one round; a word
  // stone is done by its words (see stageDone), so it needs no flag.
  function finishRound(p, st, sticker, playedMs) {
    if (st.kind !== "word") p.stages[st.id] = true;
    p.rounds++; p.lastPlayed = now();
    p.stickers.push({ pic: sticker.pic, en: sticker.en, at: now() });
    p.playMs += playedMs;
    save(true);
  }
  function addPlayTime(p, ms, immediately) { if (p && ms > 0) { p.playMs += ms; save(immediately); } }

  // ---- profiles ----
  const player = () => state.profiles.find(p => p.id === state.lastId) || null;
  function setPlayer(id) { state.lastId = id; save(); }
  function addProfile(p) { state.profiles.push(p); state.lastId = p.id; save(true); }
  function removeProfile(p) {
    state.profiles = state.profiles.filter(x => x !== p);
    if (state.lastId === p.id) state.lastId = state.profiles[0]?.id || null;
    save(true);
  }

  return {
    get state() { return state; },
    get settings() { return state.settings; },
    on: (t, f) => events.on(t, f),
    save, reset() { state = blank(now()); save(true); },
    newProfile, addProfile, removeProfile, player, setPlayer,
    rec, meet, mark, markSaid, learned, remembered, knows, toPractice, dueKeys,
    purse, owns, addStars, buy,
    unlocked, landPaid, unlock,
    stageDone, stageMet, stageStarted, stageProgress, stageCrown, landOpen, tierOpen, stageOpen, nextStage, landDone,
    buildRound, finishRound, addPlayTime,
    isSave, exportData, replaceAll
  };
}
