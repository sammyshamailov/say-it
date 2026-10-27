// The garden and the star shop.
// Kids spend stars on animals whose English word they already know (the animal then lives in
// their garden and says its name when tapped) and on hats for the mascot. Nothing is ever lost,
// and nothing here can be bought with real money.
(function(){
  const app = document.getElementById("app");
  const S = Store, P = () => S.player();
  const $ = sel => app.querySelector(sel);
  const { esc, pic, I } = window.UI;

  const PET_PRICE = 5;
  const ANIMALS = WORDS.find(g=>g.id==="animals").subs.flatMap(s=>s.keys);
  const petId = key => "pet:" + key, hatId = id => "hat:" + id;

  // Players from before the shop keep every hat they had already unlocked.
  function ensure(p){
    if(!Array.isArray(p.owned)){
      p.owned = Mascot.OUTFITS.filter(o=>(p.stars||0) >= o.stars).map(o=>hatId(o.id));
      if(typeof p.spent !== "number") p.spent = 0;
      S.save();
    }
  }

  // What's on the shelf: animals the child has met (known ones for sale, the rest as shadows), and hats.
  function pets(p){
    const met = ANIMALS.filter(k=>p.words[k] && !S.owns(p, petId(k)));
    const list = met.length || ANIMALS.some(k=>S.owns(p, petId(k))) ? met : S.SUBS.farm.keys.slice(0,4);
    return list.map(k=>({kind:"pet", id:petId(k), key:k, w:S.WORD[k], price:PET_PRICE, known:S.knows(p,k)}))
      .sort((a,b)=> (b.known - a.known));
  }
  const hats = () => Mascot.OUTFITS.map(o=>({kind:"hat", id:hatId(o.id), hat:o.id, price:o.price, known:true}));
  const canBuy = p => { ensure(p); const n = S.purse(p);
    return pets(p).some(x=>x.known && x.price<=n) || hats().some(x=>!S.owns(p,x.id) && x.price<=n); };

  // Price as a row of star icons (no numbers to read): gold for stars you have, outlines for the rest.
  function priceRow(price, have){
    return `<span class="price" aria-label="${price} stars">${Array.from({length:price},(_,i)=>
      i < have ? I.star("#FFD23F","#1A1640") : I.star("#EEEAFB","#B9B3F0")).join("")}</span>`;
  }

  let tab = "pets";
  function garden(){
    const p = P(); ensure(p);
    const mine = ANIMALS.filter(k=>S.owns(p, petId(k)));
    const shelf = tab==="pets" ? pets(p) : hats();
    const have = S.purse(p);
    app.innerHTML = `<div class="screen">
      <div class="top"><button class="b3 icon c-tile" id="back" aria-label="Back">${I.back}</button><div class="grow"></div>${UI.starsPill()}</div>
      <div class="garden" id="garden">
        <button class="me" id="me" aria-label="Your friend">${Mascot.svg("happy", p.outfit)}</button>
        ${mine.map((k,i)=>`<button class="pet" data-pet="${k}" style="animation-delay:${-(i*0.37)%2.4}s" aria-label="${esc(S.WORD[k].en)}">${pic(S.WORD[k].pic)}</button>`).join("")}
      </div>
      <div class="tabs" role="tablist">
        <button class="b3 c-mint" data-tab="pets" role="tab" aria-pressed="${tab==="pets"}" aria-label="Animals">🐾</button>
        <button class="b3 c-purple" data-tab="hats" role="tab" aria-pressed="${tab==="hats"}" aria-label="Hats">${I.shirt}</button>
      </div>
      <div class="shelf">
        ${tab==="hats" ? `<button class="b3 item c-white ${!p.outfit?"on":""}" data-hat="" aria-label="No hat"><span class="art onbuddy">${Mascot.svg("idle", null)}</span></button>` : ""}
        ${shelf.map(x=>{
          const owned = S.owns(p, x.id);
          const art = x.kind==="pet" ? pic(x.w.pic) : Mascot.svg("idle", x.hat); // hats are shown on the mascot
          const label = x.kind==="pet" ? x.w.en : x.hat;
          const on = x.kind==="hat" && p.outfit===x.hat;
          return `<button class="b3 item c-white ${x.known?"":"shadow"} ${on?"on":""}" data-item="${x.id}" aria-label="${esc(label)}${owned?"":x.known?", "+x.price+" stars":", not learned yet"}">
            <span class="art ${x.kind==="hat"?"onbuddy":""}">${art}</span>${owned || !x.known ? "" : priceRow(x.price, have)}</button>`;
        }).join("")}
      </div></div>`;

    $("#back").onclick = Nav.back;
    $("#me").onclick = ()=>{ const m = $("#me .buddy"); m.classList.remove("hop"); void m.offsetWidth; m.classList.add("hop"); Sound.sfx("good"); };
    app.querySelectorAll("[data-pet]").forEach(b=>b.onclick = ()=>{
      b.classList.remove("hop"); void b.offsetWidth; b.classList.add("hop"); Sound.word(S.WORD[b.dataset.pet].en);
    });
    app.querySelectorAll("[data-tab]").forEach(b=>b.onclick = ()=>{ tab = b.dataset.tab; garden(); });
    const nohat = app.querySelector('[data-hat=""]'); if(nohat) nohat.onclick = ()=>{ p.outfit = null; S.save(); garden(); };
    app.querySelectorAll("[data-item]").forEach(b=>b.onclick = ()=>{
      const x = shelf.find(s=>s.id===b.dataset.item);
      if(x.kind==="hat" && S.owns(p, x.id)){ p.outfit = x.hat; S.save(); Sound.sfx("good"); return garden(); }
      if(!x.known){ // a word not learned yet: say it, and wiggle as a hint to keep playing
        b.classList.remove("wiggle"); void b.offsetWidth; b.classList.add("wiggle"); Sound.word(x.w.en); return;
      }
      offer(p, x);
    });
  }

  // The "buy?" sheet: the thing big, its price in stars, and a big tick. A first tap never spends.
  function offer(p, x){
    const have = S.purse(p), ok = have >= x.price;
    const v = document.createElement("div");
    v.className = "veil"; v.setAttribute("role","dialog"); v.setAttribute("aria-modal","true");
    v.innerHTML = `<div class="sheet buy">
      <div class="big-art">${x.kind==="pet" ? `<span class="pet-big">${pic(x.w.pic)}</span>` : `<div style="width:170px">${Mascot.svg("happy", x.hat)}</div>`}</div>
      ${priceRow(x.price, have)}
      <div class="row" style="justify-content:center">
        <button class="b3 icon c-tile" id="no" aria-label="No">${I.back}</button>
        <button class="b3 c-mint yes ${ok?"glow":""}" id="yes" aria-label="Yes" ${ok?"":"disabled"}>${I.check.replace('stroke="#20A86E"','stroke="#fff"')}</button>
      </div></div>`;
    document.body.appendChild(v);
    const close = ()=> v.remove();
    v.querySelector("#no").onclick = close;
    v.onclick = e=>{ if(e.target===v) close(); };
    if(x.kind==="pet") Sound.word(x.w.en); else if(!ok) Sound.sfx("soft");
    v.querySelector("#yes").onclick = ()=>{
      if(!S.buy(p, x.id, x.price)) return close();
      close(); Sound.sfx("unlock");
      if(x.kind==="hat"){ p.outfit = x.hat; S.save(); }
      garden();
      if(x.kind==="pet"){
        const el = app.querySelector(`[data-pet="${CSS.escape(x.key)}"]`); if(el) el.classList.add("new");
        setTimeout(()=>Sound.word(x.w.en), 450);
      }
    };
  }

  window.Shop = { garden, ensure, canBuy };
})();
