// Say It! Words — screens and game flow.
(function(){
  const app = document.getElementById("app");
  const S = Store;
  const st = () => S.state;
  const P = () => S.player();

  // ---------- small helpers ----------
  const I = {
    home:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 4l8 7.5"/><path d="M6.5 10v9.5h11V10"/></svg>`,
    back:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>`,
    next:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13"/><path d="M13 6l6 6-6 6"/></svg>`,
    speaker:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>`,
    mute:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6"/></svg>`,
    play:`<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
    star:(fill="#fff",stroke="#1A1640")=>`<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    lock:`<svg viewBox="0 0 24 24" fill="none" stroke="#B9B3F0" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
    mic:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/></svg>`,
    check:`<svg viewBox="0 0 24 24" fill="none" stroke="#20A86E" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
    book:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M4 5.5C7 4 10 4 12 6c2-2 5-2 8-.5V19c-3-1.5-6-1.5-8 .5-2-2-5-2-8-.5z" fill="currentColor" fill-opacity=".25"/><path d="M12 6v13.5"/></svg>`,
    shirt:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M8 3.5 4 6l1.5 4.5L8 9.5V20h8V9.5l2.5 1L20 6l-4-2.5c-.5 1.6-2 2.5-4 2.5s-3.5-.9-4-2.5z" fill="currentColor" fill-opacity=".25"/></svg>`,
    turtle:`<svg viewBox="0 0 32 24"><ellipse cx="15" cy="13" rx="10" ry="7" fill="#3DDC97"/><path d="M8 13h14M15 6v14" stroke="#20A86E" stroke-width="1.5"/><circle cx="27" cy="13" r="4" fill="#B8F5D8"/><rect x="8" y="17" width="4" height="5" rx="2" fill="#B8F5D8"/><rect x="18" y="17" width="4" height="5" rx="2" fill="#B8F5D8"/></svg>`,
    q:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .9-1 1.6V15"/><circle cx="12" cy="18.5" r=".6" fill="currentColor"/></svg>`,
    crown:`<svg class="crown" viewBox="0 0 34 26" role="img" aria-label="all learned"><path d="M3 22 L5 6 L12 13 L17 3 L22 13 L29 6 L31 22 Z" fill="#FFD23F" stroke="#1A1640" stroke-width="2.4" stroke-linejoin="round"/></svg>`,
    bag:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 12H6.2z" fill="currentColor" fill-opacity=".25"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>`,
    gear:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`
  };
  window.ICONS = I;
  const esc = s => String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function pic(p){
    if(p.startsWith("color:")) return `<span class="color-blob" style="background:${p.slice(6)}"></span>`;
    if(p.startsWith("num:")) return `<span class="num">${p.slice(4)}</span>`;
    if(p.includes("+")) return `<span class="duo">${p.split("+").map(x=>`<span>${x}</span>`).join("")}</span>`;
    return p;
  }
  const heFor = (w, p) => { const [m,f] = w.he.split("|"); return (p && p.gender==="f" && f) ? f : m; };
  const wait = ms => new Promise(r=>setTimeout(r, ms));
  const $ = sel => app.querySelector(sel);
  window.UI = { esc, pic, I, heFor, starsPill };

  const LANDS = {
    animals:{en:"Animal Jungle", he:"ג'ונגל החיות", c:"mint"},
    food:{en:"Yummy Town", he:"עיר הטעמים", c:"pink"},
    people:{en:"Me and Friends", he:"אני והחברים", c:"purple"},
    things:{en:"Toy House", he:"בית הצעצועים", c:"sky"},
    outside:{en:"Adventure Road", he:"דרך ההרפתקאות", c:"orange"},
    learning:{en:"Learning Castle", he:"טירת הלמידה", c:"yellow"}
  };
  const SUBC = ["mint","pink","purple","sky","orange","yellow"];
  const subColor = s => SUBC[(WORDS.indexOf(s.group) + s.group.subs.indexOf(s)) % SUBC.length];

  // tap feedback on every chunky button
  app.addEventListener("pointerdown", e=>{
    const b = e.target.closest(".b3"); if(!b || b.disabled) return;
    Sound.unlock(); Sound.sfx("tap");
    b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
  });

  // ---------- navigation (Android back button goes back a screen) ----------
  // Our own screen stack; the browser history holds one guard entry so the back button
  // steps back a screen instead of leaving the app.
  const stack = [];
  function go(fn, ...args){ stack.push([fn,args]); fn(...args); }
  function back(){
    if(document.querySelector(".veil")){ document.querySelector(".veil").remove(); return; }
    if(stack.length > 1){ leaveRound(); stack.pop(); const [fn,args] = stack[stack.length-1]; fn(...args); }
  }
  try{ history.replaceState({g:0}, ""); history.pushState({g:1}, ""); }catch(e){}
  window.addEventListener("popstate", ()=>{ back(); try{ history.pushState({g:1}, ""); }catch(e){} });
  function toMap(){ leaveRound(); stack.length = 0; stack.push([map,[]]); map(); }
  window.Nav = { go, back, toMap };

  // ---------- header bits ----------
  // the pill shows the stars a child can still spend in the shop
  function starsPill(){ const n = P() ? S.purse(P()) : 0; return `<div class="stars" aria-label="${n} stars">${I.star()}<span>${n}</span></div>`; }
  function bumpStars(n=1){
    const p = P(); S.addStars(p, n); Sound.sfx("star");
    app.querySelectorAll(".stars span").forEach(s=>s.textContent = S.purse(p));
    app.querySelectorAll(".stars").forEach(s=>{ s.classList.remove("bump"); void s.offsetWidth; s.classList.add("bump"); });
  }
  function soundBtn(){ const on = st().settings.sfx; return `<button class="b3 icon c-sky" id="snd" aria-label="${on?"Sound on":"Sound off"}" aria-pressed="${on}">${on?I.speaker:I.mute}</button>`; }
  function wireSound(){ const b = $("#snd"); if(!b) return; b.onclick = ()=>{ const s = st().settings; s.sfx = !s.sfx; S.save(); Sound.music(s.sfx && s.music); b.outerHTML = soundBtn(); wireSound(); }; }

  // ---------- screens ----------
  function who(){
    leaveRound();
    const ps = st().profiles;
    const cols = ["pink","sky","mint","purple","orange","yellow"];
    app.innerHTML = `<div class="screen">
      <div class="top"><div class="grow"></div><button class="b3 icon c-tile" id="parent" aria-label="Parents">${I.gear}</button></div>
      <div class="who-grid">${ps.map((p,i)=>`<button class="b3 who-card c-${cols[i%cols.length]}" data-id="${p.id}" aria-label="${esc(p.name)}">
        <span class="face">${p.avatar}</span><span class="nm">${esc(p.name)}</span><span class="st">⭐ ${S.purse(p)}</span></button>`).join("")}</div></div>`;
    app.querySelectorAll("[data-id]").forEach(b=>b.onclick = ()=>{
      S.setPlayer(b.dataset.id); const p = P();
      if(/[֐-׿]/.test(p.name)) Sound.hebrew("היי " + p.name + "!"); else if(/^[a-z\s'-]+$/i.test(p.name) && !/^my (son|daughter)$/i.test(p.name)) Sound.speak("Hi " + p.name + "!", "en", .8); else Sound.talk("hi", p.gender);
      toMapFresh();
    });
    $("#parent").onclick = ()=> go(Parent.gate);
  }
  function toMapFresh(){ leaveRound(); stack.length = 0; go(map); }

  function map(){
    leaveRound();
    const p = P(); if(!p) return start();
    const cur = S.currentLand(p);
    const nodes = WORDS.map((g,gi)=>{
      const L = LANDS[g.id], open = S.landUnlocked(p, gi), done = g.subs.filter(s=>S.subDone(p,s)).length;
      const crown = g.subs.every(s=>S.subCrown(p,s));
      const isCur = gi===cur;
      const starsRow = done ? `<span class="mini-stars" aria-hidden="true">${[0,1,2].map(i=>I.star(i < Math.ceil(3*done/g.subs.length) ? "#FFD23F" : "none", "#FFD23F")).join("")}</span>` : "";
      const btn = `<button class="b3 land c-${L.c} ${open?"":"locked"} ${isCur?"current":""}" data-land="${gi}" aria-label="${L.en}${open?"":", locked"}">
        <span class="pic">${pic(g.pic)}</span>${open?"":`<span class="lock">${I.lock}</span>`}${crown?I.crown:""}${starsRow}</button>`;
      const buddy = isCur ? `<div class="buddy-wrap" style="display:flex;flex-direction:column;align-items:flex-start;gap:4px"><span class="bubble">Let's go!</span>${Mascot.svg("idle", p.outfit)}</div>` : "";
      return `<div class="node">${gi%2 ? buddy+btn : btn+buddy}</div>`;
    }).join("");
    app.innerHTML = `<div class="screen">
      <div class="top">
        <button class="b3 avatar-btn c-pink" id="who" aria-label="Change player">${p.avatar}</button>
        <div class="grow"></div>${starsPill()}${soundBtn()}
        <button class="b3 icon c-tile" id="parent" aria-label="Parents">${I.gear}</button>
      </div>
      <div class="map" id="map"><div class="path">${nodes}</div></div>
      <div class="dock">
        <button class="b3 icon c-purple" id="book" aria-label="Sticker book">${I.book}</button>
        <button class="b3 play c-yellow" id="play" aria-label="Play">${I.play}Play</button>
        <button class="b3 icon c-mint ${Shop.canBuy(p)?"glow":""}" id="shop" aria-label="Garden and shop">${I.bag}</button>
      </div></div>`;
    app.querySelectorAll(".buddy").forEach(b=>b.classList.add("idle"));
    const m = $("#map"), curEl = app.querySelector(".land.current");
    if(curEl) curEl.scrollIntoView({block:"center"});
    app.querySelectorAll("[data-land]").forEach(b=>b.onclick = ()=>{
      const gi = +b.dataset.land;
      if(!S.landUnlocked(p, gi)){ b.classList.remove("wiggle"); void b.offsetWidth; b.classList.add("wiggle"); Sound.sfx("soft"); return; }
      Sound.speak(LANDS[WORDS[gi].id].en, "en", .8); go(land, gi);
    });
    $("#play").onclick = ()=> startRound(S.nextSub(p));
    $("#who").onclick = ()=> go(who);
    $("#book").onclick = ()=> go(stickers);
    $("#shop").onclick = ()=> go(Shop.garden);
    $("#parent").onclick = ()=> go(Parent.gate);
    wireSound();
  }

  function land(gi){
    leaveRound();
    const p = P(), g = WORDS[gi], L = LANDS[g.id], nxt = S.nextSub(p);
    app.innerHTML = `<div class="screen">
      <div class="top"><button class="b3 icon c-tile" id="back" aria-label="Back to map">${I.home}</button>
        <div class="grow land-title"><span>${pic(g.pic)}</span><span>${L.en}</span></div>${starsPill()}</div>
      <div class="stones">${g.subs.map(s=>{
        const open = S.subUnlocked(p, s), prog = Math.round(S.subProgress(p,s)*100);
        return `<button class="b3 stone c-${subColor(s)} ${open?"":"locked"} ${s===nxt?"next":""}" data-sub="${s.id}" aria-label="${s.name}${open?"":", locked"}">
          <span class="pic">${pic(s.pic)}</span>${open?`<span class="bar"><i style="width:${prog}%"></i></span>`:`<span class="lock">${I.lock}</span>`}${S.subCrown(p,s)?I.crown:""}</button>`;
      }).join("")}</div></div>`;
    $("#back").onclick = back;
    app.querySelectorAll("[data-sub]").forEach(b=>b.onclick = ()=>{
      const s = S.SUBS[b.dataset.sub];
      if(!S.subUnlocked(p, s)){ b.classList.remove("wiggle"); void b.offsetWidth; b.classList.add("wiggle"); Sound.sfx("soft"); return; }
      startRound(s);
    });
  }

  function stickers(){
    const p = P(), total = Math.max(24, Math.ceil((p.stickers.length+1)/6)*6);
    const slots = Array.from({length:total}, (_,i)=>p.stickers[i]);
    app.innerHTML = `<div class="screen">
      <div class="top"><button class="b3 icon c-tile" id="back" aria-label="Back">${I.back}</button><div class="grow land-title">${I.book.replace("<svg",'<svg width="40" height="40"')}</div>${starsPill()}</div>
      <div class="book">${slots.map((s,i)=> s ? `<button class="b3 slot c-white" data-i="${i}" aria-label="${esc(s.en)}">${pic(s.pic)}</button>` : `<div class="b3 slot empty" aria-hidden="true"></div>`).join("")}</div></div>`;
    $("#back").onclick = back;
    app.querySelectorAll("[data-i]").forEach(b=>b.onclick = ()=> Sound.word(p.stickers[+b.dataset.i].en));
  }

  // ---------- round ----------
  let R = null, roundT0 = 0;
  function leaveRound(){
    if(R){ const p = P(); if(p && roundT0){ p.playMs += Date.now()-roundT0; S.save(); } R.dead = true; R = null; }
    roundT0 = 0; Sound.stop(); Speech.release(); clearBubbles();
  }
  document.addEventListener("visibilitychange", ()=>{
    const p = P();
    if(document.hidden){ Sound.music(false); if(R && roundT0 && p){ p.playMs += Date.now()-roundT0; roundT0 = 0; S.save(true); } }
    else { const s = st().settings; Sound.music(s.sfx && s.music); if(R) roundT0 = Date.now(); }
  });

  function startRound(sub){
    const p = P();
    const b = S.buildRound(p, sub);
    const steps = [];
    b.fresh.forEach(k=>steps.push({t:"meet", k}));
    S.shuffle(b.words).forEach(k=>steps.push({t:"tap", k}));
    const sayKeys = [...b.fresh, ...b.words.filter(k=>!b.fresh.includes(k))].slice(0,3);
    sayKeys.forEach(k=>steps.push({t:"say", k}));
    steps.push({t: p.rounds % 2 ? "memory" : "pop", keys: b.words.slice(0, Math.min(3, b.words.length))});
    leaveRound();
    R = {sub, words:b.words, steps, i:0, stars:0, requeued:{}};
    roundT0 = Date.now();
    Sound.prefetch(b.words.map(k=>S.WORD[k].en));
    go(runStep);
  }

  function frame(inner, opts={}){
    const total = R.steps.length;
    const dots = R.steps.map((_,i)=>`<span class="${i<R.i?"done":i===R.i?"now":""}"></span>`).join("");
    app.innerHTML = `<div class="screen">
      <div class="top"><button class="b3 icon c-tile" id="quit" aria-label="Back to map">${I.home}</button>
        <div class="progress" aria-label="Step ${R.i+1} of ${total}">${dots}</div>${opts.stars?starsPill():""}</div>
      <div class="stage">${inner}</div></div>`;
    $("#quit").onclick = toMap;
  }
  function nextStep(){ if(!R) return; R.i++; runStep(); }
  function runStep(){
    if(!R) return toMap();
    const s = R.steps[R.i];
    if(!s) return finish();
    ({meet, tap, say, pop:popGame, memory:memoGame})[s.t](s);
  }
  const alive = r => r === R && !r.dead;

  // Meet a new word
  async function meet(s){
    const r = R, p = P(), w = S.WORD[s.k], c = subColor(w.sub);
    frame(`
      <div class="word-card b3 c-${c}" style="cursor:default">
        <div class="corner l">${st().settings.hebrew?`<button class="b3 c-yellow" id="heb" lang="he" aria-label="Hebrew">עב</button>`:""}</div>
        <div class="corner r"><button class="b3 c-sky" id="hear" aria-label="Hear it">${I.speaker}</button></div>
        <div class="big" id="big">${pic(w.pic)}</div>
        <div class="en" style="color:var(--ink)">${esc(w.en)}</div>
        ${st().settings.hebrew?`<div class="he" lang="he" style="color:var(--ink)">${heFor(w,p)}</div>`:""}
      </div>
      <div class="say-row" style="flex:1">
        <div id="buddy" style="width:clamp(120px,34vw,170px)">${Mascot.svg("happy", p.outfit)}</div>
        <button class="b3 side c-mint" id="next" aria-label="Next" style="width:96px;height:96px;border-radius:30px">${I.next}</button>
      </div>`);
    const hear = ()=>Sound.word(w.en);
    $("#hear").onclick = hear; $("#big").onclick = hear;
    const hb = $("#heb"); if(hb) hb.onclick = ()=> Sound.hebrew(heFor(w,p)).then(()=>Sound.word(w.en));
    $("#next").onclick = ()=>{ if(!S.rec(p, s.k)){ p.words[s.k] = {lvl:0, due:0, right:0, wrong:0, said:0, clear:0, seen:Date.now()}; S.save(); } nextStep(); };
    const nx = $("#next");
    await wait(300); if(alive(r) && nx.isConnected) await Sound.word(w.en);
    if(alive(r) && nx.isConnected) nx.classList.add("glow"); // the child may already have moved on
  }

  // Listen & tap
  function choices(p, k){
    const w = S.WORD[k], r = S.rec(p, k), n = (!r || r.lvl===0) ? 2 : 3;
    const same = (r && r.lvl>=2) ? w.sub.keys : [];
    let pool = S.shuffle(same.filter(x=>x!==k));
    if(pool.length < n-1){ const all = []; WORDS.forEach(g=>g.subs.forEach(s=>{ if(s!==w.sub || same.length) all.push(...s.keys); })); pool = pool.concat(S.shuffle(all)); }
    const out = [k];
    for(const x of pool){ if(out.length>=n) break; const o = S.WORD[x]; if(o.en!==w.en && o.pic!==w.pic && !out.some(y=>S.WORD[y].pic===o.pic)) out.push(x); }
    return S.shuffle(out);
  }
  async function tap(s){
    const r = R, p = P(), w = S.WORD[s.k], opts = choices(p, s.k);
    let tries = 0, locked = false;
    frame(`
      <div class="mascot-row">
        <div id="buddy" style="width:clamp(110px,30vw,150px)">${Mascot.svg("idle", p.outfit)}</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
          <button class="b3 hear c-sky" id="hear" aria-label="Hear the word again">${I.speaker}</button>
          <button class="b3 slow c-tile" id="slow" aria-label="Hear it slowly">${I.turtle}</button>
        </div>
      </div>
      <div class="cards n${opts.length}">${opts.map(k=>`<button class="b3 card c-tile" data-k="${k}" aria-label="${esc(S.WORD[k].en)}">${pic(S.WORD[k].pic)}</button>`).join("")}</div>`, {stars:true});
    $("#buddy .buddy").classList.add("idle");
    $("#hear").onclick = ()=>Sound.word(w.en);
    $("#slow").onclick = ()=>Sound.word(w.en, true);
    app.querySelectorAll("[data-k]").forEach(b=>b.onclick = async ()=>{
      if(locked || !alive(r)) return;
      if(b.dataset.k === s.k){
        locked = true;
        b.className = "b3 card c-mint";
        b.innerHTML = `${pic(w.pic)}<span class="say">${esc(w.en)}</span><span class="tick">${I.check}</span>`;
        app.querySelectorAll("[data-k]").forEach(o=>{ if(o!==b) o.classList.add("dim"); });
        Mascot.set($("#buddy"), "happy", p.outfit); Sound.sfx("good");
        if(tries===0){ S.mark(p, s.k, true); bumpStars(); R.stars++; }
        await Sound.talk("cheer", p.gender); if(!alive(r)) return;
        await Sound.word(w.en); if(!alive(r)) return;
        await wait(350); if(alive(r)) nextStep();
      } else {
        tries++;
        b.classList.remove("wiggle"); void b.offsetWidth; b.classList.add("wiggle");
        Sound.sfx("soft"); Mascot.set($("#buddy"), "oops", p.outfit);
        if(tries===1){ S.mark(p, s.k, false); if(!R.requeued[s.k]){ R.requeued[s.k] = 1; R.steps.splice(R.steps.findIndex(x=>x.t==="pop"||x.t==="memory"), 0, {t:"tap", k:s.k}); } }
        if(tries>=2) app.querySelector(`[data-k="${CSS.escape(s.k)}"]`).classList.add("glow");
        await Sound.word(w.en, tries>=2);
        if(alive(r)) Mascot.set($("#buddy"), "idle", p.outfit);
      }
    });
    await wait(350); if(alive(r)) Sound.word(w.en);
  }

  // Say it (Echo / recognition)
  async function say(s){
    const r = R, p = P(), w = S.WORD[s.k], c = subColor(w.sub);
    let busy = false, attempts = 0, rewarded = false;
    frame(`
      <div class="word-card b3 c-${c}" style="cursor:default">
        <div class="corner l">${st().settings.hebrew?`<button class="b3 c-yellow" id="heb" lang="he" aria-label="Hebrew">עב</button>`:""}</div>
        <div class="corner r"><button class="b3 c-sky" id="hear" aria-label="Hear it">${I.speaker}</button></div>
        <div class="big">${pic(w.pic)}</div>
        <div class="en" style="color:var(--ink)">${esc(w.en)}</div>
        ${st().settings.hebrew?`<div class="he" lang="he" style="color:var(--ink)">${heFor(w,p)}</div>`:""}
      </div>
      <div class="say-row" style="min-height:96px">
        <div id="buddy" style="width:clamp(100px,26vw,130px)">${Mascot.svg("listen", p.outfit)}</div>
        <div class="levels" id="lv" aria-hidden="true">${"<i></i>".repeat(7)}</div>
        <button class="b3 echo c-white" id="echo" hidden aria-label="Hear my voice">
          <span class="pl">${I.play.replace('fill="currentColor"','fill="#fff"').replace('stroke="currentColor"','stroke="#fff"')}</span>
          <span style="font-size:30px">${p.avatar}</span>
        </button>
      </div>
      <div style="flex:1"></div>
      <div class="say-row">
        <div class="side" aria-hidden="true"></div>
        <button class="b3 mic c-pink" id="mic" aria-label="Say it" disabled>${I.mic}</button>
        <button class="b3 side c-mint" id="next" aria-label="Next" hidden>${I.next}</button>
        <div class="side" id="nextph" aria-hidden="true"></div>
      </div>`, {stars:true});
    const bars = [...app.querySelectorAll("#lv i")];
    const level = v=>{ bars.forEach((b,i)=>{ const k = 1 - Math.abs(i-3)/4; b.style.height = (10 + v*54*k*(0.7+Math.random()*0.3)) + "px"; }); };
    let myVoice = null;
    const showNext = ()=>{ $("#next").hidden = false; $("#nextph").hidden = true; $("#next").classList.add("glow"); };

    // The mic stays locked while the app is talking, so the child waits for the word to finish
    // (and the app never records its own voice as the child's).
    let talking = 0;
    const lockMic = on=>{ const m = $("#mic"); if(m) m.disabled = on; };
    const talk = async play=>{
      talking++; lockMic(true);
      try{ await play(); } finally { talking--; if(!talking && alive(r)) lockMic(false); }
    };
    $("#hear").onclick = ()=>{ if(!busy) talk(()=>Sound.word(w.en)); };
    const hb = $("#heb"); if(hb) hb.onclick = ()=>{ if(!busy) talk(()=>Sound.hebrew(heFor(w,p)).then(()=>Sound.word(w.en))); };
    $("#next").onclick = ()=> nextStep();
    $("#echo").onclick = ()=>{ if(myVoice && !busy) talk(async ()=>{ await Sound.playUrl(myVoice, 1); await Sound.word(w.en); }); };

    const reward = (clear)=> talk(async ()=>{
      Mascot.set($("#buddy"), "happy", p.outfit);
      if(!rewarded){ rewarded = true; S.markSaid(p, s.k, clear); bumpStars(clear ? 2 : 1); R.stars += clear ? 2 : 1; }
      Sound.sfx("good");
      await Sound.talk(clear ? "clear" : "said", p.gender); if(!alive(r)) return;
      if(myVoice){ await Sound.playUrl(myVoice, 1); if(!alive(r)) return; await wait(200); }
      await Sound.word(w.en); if(alive(r)) showNext();
    });
    const missed = ()=> talk(async ()=>{
      attempts++;
      Mascot.set($("#buddy"), "oops", p.outfit);
      await Sound.talk("noHear", p.gender); if(!alive(r)) return;
      await Sound.word(w.en);
      if(alive(r)){ Mascot.set($("#buddy"), "listen", p.outfit); if(attempts>=2) showNext(); }
    });

    $("#mic").onclick = async ()=>{
      if(busy || talking || !alive(r)) return;
      Sound.stop();
      if(!st().settings.micAsked){ const ok = await Parent.micExplain(); if(!ok || !alive(r)) return; st().settings.micAsked = true; S.save(); }
      busy = true; const mic = $("#mic"); mic.classList.add("live");
      Sound.hush(true); // no music while the child speaks, so it isn't recorded or heard as their voice
      try{
        // after one unheard try, switch to Echo: it only needs to hear a voice, so every real attempt counts
        let echo = Speech.mode() !== "recognize" || attempts >= 1;
        if(!echo){
          level(.6);
          const res = await Speech.recognize(); if(!alive(r)) return;
          level(0);
          if(res.heard) await reward(Speech.isMatch(res.heard, w.en, w.alts));
          else if(!Speech.hasSR() && Speech.canRecord()) echo = true;   // recognition unavailable (offline/blocked): use Echo
          else if(res.error==="not-allowed") micDenied();
          else await missed();
        }
        if(echo){
          if(!Speech.canRecord()) throw new Error("no-mic");
          const res = await Speech.record(level); if(!alive(r)) return;
          if(res.spoke){ myVoice = res.url; if(myVoice) $("#echo").hidden = false; $("#lv").hidden = true; await reward(false); }
          else await missed();
        }
      }catch(e){
        if(alive(r)) micDenied();
      } finally { Sound.hush(false); busy = false; if(alive(r)) mic.classList.remove("live"); }
    };
    // no microphone: the child says it out loud and taps the star
    const micDenied = ()=>{
      const mic = $("#mic");
      mic.className = "b3 mic c-yellow"; mic.setAttribute("aria-label","I said it!");
      mic.innerHTML = I.star("#fff","#1A1640");
      mic.onclick = ()=>{ if(!rewarded && !talking) reward(false); };
      Mascot.set($("#buddy"), "listen", p.outfit);
    };
    await talk(async ()=>{ await wait(300); if(alive(r)) await Sound.word(w.en); }); if(!alive(r)) return;
    if(st().settings.micAsked) { const perm = await Speech.permission(); if(perm==="denied") micDenied(); }
    if(alive(r)) $("#mic").classList.add("glow");
  }

  // Pop the bubbles
  let bubbleTimer = null;
  function clearBubbles(){ clearInterval(bubbleTimer); bubbleTimer = null; }
  async function popGame(s){
    const r = R, p = P(), targets = S.shuffle(s.keys);
    let ti = 0, speed = 9;
    frame(`
      <div class="mascot-row" style="min-height:96px">
        <div id="buddy" style="width:clamp(96px,26vw,124px)">${Mascot.svg("idle", p.outfit)}</div>
        <button class="b3 hear c-sky" id="hear" aria-label="Hear the word again" style="width:96px;height:96px">${I.speaker}</button>
      </div>
      <div class="pond" id="pond"></div>`, {stars:true});
    const pond = $("#pond");
    const H = ()=>pond.clientHeight;
    const target = ()=>S.WORD[targets[ti]];
    $("#hear").onclick = ()=>Sound.word(target().en);
    let since = 0;
    function spawn(head=0){
      if(!alive(r)) return clearBubbles();
      const t = target(); if(!t) return;
      // distractors never share the target's word ("orange" fruit vs colour) or picture
      const others = WORDS.flatMap(g=>g.subs.flatMap(x=>x.keys)).filter(k=>S.WORD[k].pic!==t.pic && S.WORD[k].en!==t.en);
      const isT = since >= 2 || Math.random() < .4;
      const k = isT ? t.key : others[Math.floor(Math.random()*others.length)];
      since = isT ? 0 : since+1;
      const b = document.createElement("button");
      b.className = "bub"; b.dataset.k = k; b.setAttribute("aria-label", S.WORD[k].en);
      b.innerHTML = pic(S.WORD[k].pic);
      const size = Math.min(128, Math.max(96, pond.clientWidth*.25));
      b.style.left = Math.max(4, Math.random()*(pond.clientWidth - size - 8)) + "px";
      b.style.top = H() + "px";
      b.style.setProperty("--h", H()+"px"); b.style.setProperty("--t", speed+"s");
      if(head) b.style.animationDelay = (-head*speed) + "s"; // start partway up so the pond isn't empty
      b.addEventListener("animationend", ev=>{ if(ev.animationName==="floatup" || ev.animationName==="burst") b.remove(); });
      b.onpointerdown = async ()=>{
        if(!alive(r) || b.classList.contains("burst")) return;
        if(S.WORD[b.dataset.k].en === target().en){
          b.classList.add("burst"); Sound.sfx("pop"); Sound.sfx("good");
          Mascot.set($("#buddy"), "happy", p.outfit);
          ti++; speed = Math.max(6.5, speed-.8);
          if(ti >= targets.length){
            clearBubbles(); bumpStars(); R.stars++;
            await Sound.talk("cheer", p.gender); await wait(400); if(alive(r)) nextStep(); return;
          }
          await Sound.word(target().en);
          if(alive(r)) Mascot.set($("#buddy"), "idle", p.outfit);
        } else {
          b.animate([{opacity:1},{opacity:.35},{opacity:1}], {duration:450}); Sound.sfx("soft"); Sound.word(target().en);
        }
      };
      pond.appendChild(b);
    }
    await wait(250); if(!alive(r)) return;
    await Sound.word(target().en); if(!alive(r)) return;
    [.55,.35,.15,0].forEach(h=>spawn(h)); bubbleTimer = setInterval(()=>spawn(), 1300);
  }

  // Memory match: a picture card pairs with its sound card
  async function memoGame(s){
    const r = R, p = P();
    const deck = S.shuffle(s.keys.flatMap(k=>[{k, kind:"pic"},{k, kind:"snd"}]));
    let open = [], left = s.keys.length, busy = false;
    frame(`
      <div class="mascot-row" style="min-height:100px"><div id="buddy" style="width:clamp(96px,26vw,124px)">${Mascot.svg("idle", p.outfit)}</div></div>
      <div class="memo">${deck.map((c,i)=>`<button class="b3 mcard c-purple" data-i="${i}" aria-label="Card"><span class="back">${I.q}</span></button>`).join("")}</div>`, {stars:true});
    $("#buddy .buddy").classList.add("idle");
    const els = [...app.querySelectorAll(".mcard")];
    const face = (el, c)=>{ if(c.kind==="pic"){ el.classList.add("open"); el.innerHTML = pic(S.WORD[c.k].pic); } else { el.classList.add("snd"); el.innerHTML = I.speaker; } };
    const hide = el=>{ el.classList.remove("open","snd"); el.innerHTML = `<span class="back">${I.q}</span>`; };
    els.forEach((el,i)=>el.onclick = async ()=>{
      if(busy || !alive(r) || el.classList.contains("gone") || open.some(o=>o.i===i)) return;
      const c = deck[i]; Sound.sfx("flip"); face(el, c);
      if(c.kind==="snd") Sound.word(S.WORD[c.k].en);
      open.push({i, c});
      if(open.length < 2) return;
      busy = true;
      const [a,b] = open; open = [];
      if(a.c.k === b.c.k && a.c.kind !== b.c.kind){
        await wait(700); if(!alive(r)) return;
        Sound.sfx("good"); Mascot.set($("#buddy"), "happy", p.outfit);
        await Sound.word(S.WORD[a.c.k].en); if(!alive(r)) return;
        els[a.i].classList.add("gone"); els[b.i].classList.add("gone");
        left--;
        if(!left){ bumpStars(); R.stars++; await Sound.talk("cheer", p.gender); await wait(300); if(alive(r)) nextStep(); }
      } else {
        await wait(1300); if(!alive(r)) return;
        hide(els[a.i]); hide(els[b.i]); Mascot.set($("#buddy"), "idle", p.outfit);
      }
      busy = false;
    });
  }

  // Well done
  async function finish(){
    const r = R, p = P(), sub = R.sub;
    const ws = R.words.map(k=>S.WORD[k]);
    const prize = ws[Math.floor(Math.random()*ws.length)];
    p.done[sub.id] = true; p.rounds++; p.lastPlayed = Date.now();
    p.stickers.push({pic:prize.pic, en:prize.en, at:Date.now()});
    if(roundT0){ p.playMs += Date.now()-roundT0; roundT0 = 0; }
    S.save(true);
    const shopNow = Shop.canBuy(p);
    const n = Math.min(R.stars, 14);
    app.innerHTML = `<div class="screen"><div class="done">
      <div style="width:clamp(140px,40vw,190px)" id="buddy">${Mascot.svg("happy", p.outfit)}</div>
      <h1>Well done!</h1>
      <div class="jar" aria-label="${R.stars} stars">${Array.from({length:n},(_,i)=>I.star("#FFD23F","#1A1640").replace("<svg",`<svg style="animation-delay:${.15+i*.08}s"`)).join("")}</div>
      <button class="sticker" id="stk" aria-label="New sticker: ${esc(prize.en)}">${pic(prize.pic)}</button>
      ${shopNow?`<button class="b3 icon c-mint glow" id="shopnow" aria-label="Garden and shop">${I.bag}</button>`:""}
    </div>
    <div class="dock">
      <button class="b3 icon c-tile" id="home" aria-label="Map">${I.home}</button>
      <button class="b3 play c-yellow" id="again" aria-label="Play more">${I.play}</button>
      <button class="b3 icon c-purple" id="book" aria-label="Sticker book">${I.book}</button>
    </div></div>`;
    $("#buddy .buddy").classList.add("happy");
    Sound.sfx("fanfare");
    $("#stk").onclick = ()=> Sound.word(prize.en);
    $("#home").onclick = toMap;
    $("#again").onclick = ()=>{ stack.length = 0; stack.push([map,[]]); startRound(S.nextSub(p)); };
    $("#book").onclick = ()=>{ toMap(); go(stickers); };
    if(shopNow) $("#shopnow").onclick = ()=>{ toMap(); go(Shop.garden); };
    R.dead = true; R = null; Speech.release();
    await wait(500); Sound.talk("done", p.gender);
  }

  // ---------- start ----------
  function start(){
    leaveRound(); stack.length = 0;
    const s = st();
    s.profiles.forEach(Shop.ensure);
    if(!s.profiles.length){ stack.push([Parent.setup,[]]); return Parent.setup(); }
    if(s.profiles.length === 1) S.setPlayer(s.profiles[0].id);
    if(s.profiles.length > 1){ stack.push([who,[]]); return who(); }
    stack.push([map,[]]); map();
  }
  window.Screens = { map, who, start, toMap, toMapFresh, LANDS };
  window.addEventListener("pointerdown", ()=>{ const s = st().settings; Sound.unlock(); Sound.music(s.sfx && s.music); }, {once:true});
  document.addEventListener("DOMContentLoaded", start); // after parent.js has loaded too
})();
