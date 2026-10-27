// Progress lives on this device only (localStorage). Nothing is sent anywhere.
(function(){
  const KEY = "sayit2";
  const DAY = 864e5;
  const DUE = [0, 10*60e3, DAY, 3*DAY, 7*DAY, 21*DAY]; // wait after reaching each level

  // Flat word index: key "sub/word"
  const WORD = {};          // key -> {key, en, pic, he, alts, sub, group}
  const SUBS = {};          // subId -> sub (with .group)
  WORDS.forEach(g => g.subs.forEach(s => {
    s.group = g; SUBS[s.id] = s;
    s.keys = s.w.map(w => {
      const key = s.id + "/" + w[0];
      WORD[key] = {key, en:w[0], pic:w[1], he:w[2], alts:w[3]||[], sub:s, group:g};
      return key;
    });
  }));

  const AVATARS = ["🦁","🦄","🐯","🐼","🐸","🦊","🐶","🐱","🐰","🐻","🦖","🐬","🦋","🚀","⚽","🌸","🐵","🐧","🦉","🐙"];

  function blank(){ return {v:2, profiles:[], lastId:null, created:Date.now(),
    settings:{music:false, sfx:true, sayMode:"auto", hebrew:true, unlockAll:false, mascot:"Pipo"}}; }

  function newProfile(name, avatar, gender){
    return {id:"k"+Date.now().toString(36)+Math.random().toString(36).slice(2,6), name:name||"", avatar:avatar||"🦁",
      gender:gender==="f"?"f":"m", stars:0, spent:0, outfit:null, stickers:[], words:{}, done:{}, playMs:0, rounds:0, lastPlayed:0};
  }

  // ---- migrate from the first version (keys sayit-players, sayit-got-<id>) ----
  function migrate(){
    let old = null;
    try{ old = JSON.parse(localStorage.getItem("sayit-players")||"null"); }catch(e){}
    if(!Array.isArray(old) || !old.length){
      // first version also had default profiles saved only implicitly; check star keys
      const ids = ["p1","p2"].filter(id=>localStorage.getItem("sayit-got-"+id));
      if(!ids.length) return null;
      old = ids.map(id=>({id, name:id==="p2"?"My daughter":"My son", avatar:id==="p2"?"🦄":"🦁", gender:id==="p2"?"f":"m"}));
    }
    const s = blank();
    old.forEach((p,i)=>{
      const np = newProfile(p.name, p.avatar, p.gender || (p.id==="p2"?"f":"m"));
      np.id = p.id || ("p"+(i+1));
      let got = {};
      try{ got = JSON.parse(localStorage.getItem("sayit-got-"+p.id)||"{}"); }catch(e){}
      Object.keys(got).forEach(k=>{
        if(!WORD[k]) return;
        // a star in the first version meant the child said the word correctly
        np.words[k] = {lvl:3, due:Date.now()+3*DAY, right:1, wrong:0, said:1, clear:1, seen:Date.now()};
        np.stars++;
      });
      s.profiles.push(np);
    });
    let last = null; try{ last = localStorage.getItem("sayit-last"); }catch(e){}
    s.lastId = s.profiles.some(p=>p.id===last) ? last : s.profiles[0].id;
    s.migratedFrom = 1;
    return s; // old keys are left untouched on purpose
  }

  let state;
  try{ state = JSON.parse(localStorage.getItem(KEY)||"null"); }catch(e){ state = null; }
  if(!state || state.v!==2) state = migrate() || blank();
  state.settings = Object.assign(blank().settings, state.settings||{});
  let saveTimer = null;
  function save(now){
    clearTimeout(saveTimer);
    const go = ()=>{ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} };
    if(now) go(); else saveTimer = setTimeout(go, 250);
  }
  save(true);
  try{ navigator.storage && navigator.storage.persist && navigator.storage.persist(); }catch(e){}
  // never lose the last answer when the app is swiped away
  addEventListener("pagehide", ()=>save(true));
  document.addEventListener("visibilitychange", ()=>{ if(document.hidden) save(true); });

  // ---- moving progress between phones (transfer code or backup file) ----
  function isSave(d){
    return !!d && typeof d==="object" && d.v===2 && Array.isArray(d.profiles) &&
      d.profiles.every(p=>p && typeof p.id==="string" && p.words && typeof p.words==="object");
  }
  function exportData(){ return JSON.parse(JSON.stringify(state)); }
  function replaceAll(d){
    if(!isSave(d)) return false;
    const fresh = blank();
    d.settings = Object.assign(fresh.settings, d.settings||{});
    d.profiles = d.profiles.map(p=>Object.assign(newProfile(p.name, p.avatar, p.gender), p));
    if(!d.profiles.some(p=>p.id===d.lastId)) d.lastId = d.profiles[0] ? d.profiles[0].id : null;
    state = d; save(true);
    return true;
  }

  // ---- word progress / spaced repetition ----
  function rec(p, key){ return p.words[key]; }
  function mark(p, key, ok){
    const r = p.words[key] || (p.words[key] = {lvl:0, due:0, right:0, wrong:0, said:0, clear:0, seen:Date.now()});
    if(ok){ r.right++; r.lvl = Math.min(5, r.lvl+1); }
    else { r.wrong++; r.lastWrong = Date.now(); r.lvl = Math.max(0, r.lvl-1); }
    r.due = Date.now() + DUE[r.lvl];
    save();
  }
  function markSaid(p, key, clear){
    const r = p.words[key] || (p.words[key] = {lvl:0, due:0, right:0, wrong:0, said:0, clear:0, seen:Date.now()});
    r.said++; if(clear) r.clear++;
    save();
  }
  const learned = (p, key) => (p.words[key]?.lvl||0) >= 3;
  const toPractice = p => Object.keys(p.words).filter(k => WORD[k] && p.words[k].wrong>0 && p.words[k].lvl<=1);
  function dueKeys(p, keys){
    const now = Date.now();
    return keys.filter(k => p.words[k] && p.words[k].due <= now)
      .sort((a,b)=> p.words[a].lvl - p.words[b].lvl || p.words[a].due - p.words[b].due);
  }

  // ---- star shop ----
  // p.stars counts every star ever earned and never goes down (parents see it, lands use it).
  // The purse is what's left to spend. Bought things are kept forever in p.owned.
  const purse = p => Math.max(0, (p.stars||0) - (p.spent||0));
  const owns = (p, id) => Array.isArray(p.owned) && p.owned.includes(id);
  function buy(p, id, price){
    if(owns(p, id) || purse(p) < price) return false;
    p.owned = [...(p.owned||[]), id]; p.spent = (p.spent||0) + price;
    save(true); return true;
  }
  const knows = (p, key) => !!(p.words[key] && p.words[key].right > 0);

  // ---- map progression ----
  function subStarted(p, s){ return s.keys.some(k=>p.words[k]); }
  function subDone(p, s){ return !!p.done[s.id]; }
  function subCrown(p, s){ return s.keys.every(k=>learned(p,k)); }
  function subProgress(p, s){ return s.keys.filter(k=>p.words[k]).length / s.keys.length; }
  function landUnlocked(p, gi){
    if(state.settings.unlockAll || gi===0) return true;
    const g = WORDS[gi], prev = WORDS[gi-1];
    if(g.subs.some(s=>subStarted(p,s)||subDone(p,s))) return true;
    return prev.subs.filter(s=>subDone(p,s)).length >= 2 && landUnlocked(p, gi-1);
  }
  function subUnlocked(p, s){
    const gi = WORDS.indexOf(s.group);
    if(!landUnlocked(p, gi)) return false;
    if(state.settings.unlockAll) return true;
    const i = s.group.subs.indexOf(s);
    return i===0 || subDone(p,s) || subStarted(p,s) || subDone(p, s.group.subs[i-1]);
  }
  function nextSub(p){
    for(const g of WORDS) for(const s of g.subs) if(subUnlocked(p,s) && !subDone(p,s)) return s;
    // everything open is done: the stone with the most words due
    let best = null, bestN = -1;
    for(const g of WORDS) for(const s of g.subs){ if(!subUnlocked(p,s)) continue; const n = dueKeys(p, s.keys).length; if(n>bestN){ best=s; bestN=n; } }
    return best || WORDS[0].subs[0];
  }
  function currentLand(p){ return WORDS.indexOf(nextSub(p).group); }

  // ---- build one round for a stone ----
  function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function buildRound(p, s){
    const fresh = s.keys.filter(k=>!p.words[k]).slice(0,3);
    const pool = [];
    WORDS.forEach(g=>g.subs.forEach(x=>{ if(subUnlocked(p,x)) pool.push(...x.keys); }));
    const dueHere = dueKeys(p, s.keys), dueAll = dueKeys(p, pool);
    const review = [];
    for(const k of [...dueHere, ...dueAll]) if(!fresh.includes(k) && !review.includes(k) && review.length < 6-fresh.length) review.push(k);
    let words = [...fresh, ...review];
    if(words.length < 4){
      for(const k of shuffle(s.keys)) if(!words.includes(k) && words.length<5) words.push(k);
    }
    return {sub:s, fresh, words};
  }

  window.Store = {
    get state(){ return state; }, save, WORD, SUBS, AVATARS, newProfile, mark, markSaid, rec, learned, toPractice, dueKeys,
    subStarted, subDone, subCrown, subProgress, landUnlocked, subUnlocked, nextSub, currentLand, buildRound, shuffle,
    player(){ return state.profiles.find(p=>p.id===state.lastId) || null; },
    setPlayer(id){ state.lastId = id; save(); },
    addStars(p, n){ p.stars += n; save(); },
    reset(){ state = blank(); save(true); },
    isSave, exportData, replaceAll, purse, owns, buy, knows
  };
})();
