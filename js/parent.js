// Parent area (Hebrew, right-to-left) behind a hold-for-3-seconds gate.
(function(){
  const app = document.getElementById("app");
  const S = Store, st = () => S.state;
  const $ = sel => app.querySelector(sel);
  const { esc, pic, I } = window.UI;
  const VERSION = "2.0.0";
  let installEvt = null;
  window.addEventListener("beforeinstallprompt", e=>{ e.preventDefault(); installEvt = e; });

  const toggle = (id, on, label) => `<div class="row"><label id="l-${id}">${label}</label><button class="toggle" role="switch" id="${id}" aria-checked="${!!on}" aria-labelledby="l-${id}"></button></div>`;
  const mins = ms => Math.round(ms/60000);

  // ---------- gate ----------
  function gate(){
    app.innerHTML = `<div class="screen">
      <div class="top"><button class="b3 icon c-tile" id="back" aria-label="חזרה">${I.back}</button></div>
      <div class="gate" style="flex:1;justify-content:center">
        <div style="width:150px">${Mascot.svg("listen")}</div>
        <p lang="he" dir="rtl" style="margin:0;font-size:22px;font-weight:600">להורים: לחצו והחזיקו 3 שניות</p>
        <div class="ring" id="ring"><button id="hold" aria-label="לחצו והחזיקו 3 שניות כדי להיכנס לאזור ההורים">${I.gear}</button></div>
      </div></div>`;
    $("#back").onclick = Nav.back;
    const ring = $("#ring"), hold = $("#hold");
    let t0 = 0, raf = 0;
    const stop = ()=>{ cancelAnimationFrame(raf); t0 = 0; ring.style.setProperty("--p","0%"); };
    hold.addEventListener("pointerdown", e=>{
      e.preventDefault(); hold.setPointerCapture && hold.setPointerCapture(e.pointerId); t0 = performance.now();
      (function tick(){ const p = Math.min(1,(performance.now()-t0)/3000); ring.style.setProperty("--p", (p*100)+"%");
        if(p>=1){ stop(); Sound.sfx("unlock"); Nav.back(); Nav.go(dashboard); return; } if(t0) raf = requestAnimationFrame(tick); })();
    });
    ["pointerup","pointercancel","pointerleave"].forEach(ev=>hold.addEventListener(ev, stop));
    hold.addEventListener("contextmenu", e=>e.preventDefault());
    hold.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); if(e.repeat) return; t0 = performance.now(); } });
  }

  // ---------- first run ----------
  function setup(){
    app.innerHTML = `<div class="screen"><div class="parent" lang="he">
      <div style="display:flex;justify-content:center"><div style="width:150px">${Mascot.svg("happy")}</div></div>
      <div class="panel">
        <h2>ברוכים הבאים ל־<span class="en-ltr">Say It! Words</span></h2>
        <p class="small" style="font-size:16px">משחק מילים באנגלית לילדים שעוד לא קוראים: תמונות, קול ודיבור. ההתקדמות נשמרת רק במכשיר הזה, בלי חשבון ובלי פרסומות.</p>
      </div>
      <div class="panel" id="form"></div>
    </div></div>`;
    profileForm(null, $("#form"), ()=>{ Screens.start(); });
  }

  // ---------- profile form ----------
  function profileForm(p, host, done){
    const draft = p ? {name:p.name, avatar:p.avatar, gender:p.gender} : {name:"", avatar:"🦁", gender:"m"};
    const render = ()=>{
      host.innerHTML = `<h2>${p ? "עריכת פרופיל" : "הוספת ילד או ילדה"}</h2>
        <div class="field"><label for="nm">שם</label><input type="text" id="nm" maxlength="20" value="${esc(draft.name)}" autocomplete="off" dir="auto"></div>
        <div class="field"><span>בן או בת? (למשפטי עידוד בעברית)</span>
          <div class="seg"><button data-g="m" aria-pressed="${draft.gender==="m"}">בן</button><button data-g="f" aria-pressed="${draft.gender==="f"}">בת</button></div></div>
        <div class="field"><span>תמונה</span><div class="avs">${S.AVATARS.map(a=>`<button data-a="${a}" aria-pressed="${a===draft.avatar}" aria-label="${a}">${a}</button>`).join("")}</div></div>
        <div class="row"><button class="b3 pbtn c-mint" id="save">${p ? "שמירה" : "הוספה"}</button>
          ${p ? `<button class="pbtn" id="cancel">ביטול</button><div style="flex:1"></div><button class="pbtn danger" id="del">מחיקה</button>` : ""}</div>`;
      const nm = host.querySelector("#nm");
      nm.oninput = ()=> draft.name = nm.value;
      host.querySelectorAll("[data-g]").forEach(b=>b.onclick = ()=>{ draft.name = nm.value; draft.gender = b.dataset.g; render(); });
      host.querySelectorAll("[data-a]").forEach(b=>b.onclick = ()=>{ draft.name = nm.value; draft.avatar = b.dataset.a; render(); });
      host.querySelector("#save").onclick = ()=>{
        draft.name = nm.value.trim();
        if(!draft.name){ nm.focus(); nm.style.borderColor = "#B3123E"; return; }
        if(p){ Object.assign(p, draft); }
        else { const np = S.newProfile(draft.name, draft.avatar, draft.gender); st().profiles.push(np); st().lastId = np.id; }
        S.save(true); done();
      };
      const c = host.querySelector("#cancel"); if(c) c.onclick = done;
      const d = host.querySelector("#del"); if(d) d.onclick = ()=>{
        if(!confirm(`למחוק את ${p.name} ואת כל ההתקדמות? אי אפשר לבטל.`)) return;
        st().profiles = st().profiles.filter(x=>x!==p);
        if(st().lastId===p.id) st().lastId = st().profiles[0]?.id || null;
        S.save(true); done();
      };
    };
    render();
  }

  // ---------- dashboard ----------
  async function dashboard(){
    const s = st(), set = s.settings;
    const kids = s.profiles.map(p=>{
      const keys = Object.keys(p.words).filter(k=>S.WORD[k]);
      const learned = keys.filter(k=>S.learned(p,k)), practice = S.toPractice(p);
      const chips = list => list.slice(0,40).map(k=>`<span class="chip">${pic(S.WORD[k].pic)} ${esc(S.WORD[k].en)}</span>`).join("");
      return `<div class="panel" data-kid="${p.id}">
        <div class="kid"><span class="face">${p.avatar}</span><span class="nm">${esc(p.name)}</span><button class="pbtn" data-edit="${p.id}" style="background:#F1EFFC">עריכה</button></div>
        <div class="facts">
          <div class="fact"><b>${learned.length}</b><span>מילים שנלמדו</span></div>
          <div class="fact"><b>${practice.length}</b><span>לתרגול</span></div>
          <div class="fact"><b>${mins(p.playMs)}</b><span>דקות משחק</span></div>
        </div>
        <div class="small">${keys.length} מילים נפגשו מתוך ${Object.keys(S.WORD).length} · ${p.rounds} סבבים · ⭐ ${p.stars}${p.lastPlayed?` · שיחק לאחרונה ${new Date(p.lastPlayed).toLocaleDateString("he-IL")}`:""}</div>
        ${practice.length?`<h3>מילים לתרגול</h3><div class="chips">${chips(practice)}</div>`:""}
        ${learned.length?`<details><summary class="small">מילים שנלמדו (${learned.length})</summary><div class="chips" style="margin-top:8px">${chips(learned)}</div></details>`:""}
      </div>`;
    }).join("");

    app.innerHTML = `<div class="screen"><div class="parent" lang="he">
      <div class="top" style="direction:rtl"><button class="b3 icon c-tile" id="back" aria-label="חזרה למשחק" style="transform:scaleX(-1)">${I.back}</button><h1 style="margin:0;font-size:28px">אזור הורים</h1></div>
      ${kids}
      <div id="formhost"></div>
      <button class="b3 pbtn c-mint" id="add" style="align-self:flex-start">+ הוספת ילד או ילדה</button>

      <div class="panel"><h2>הגדרות</h2>
        ${toggle("t-sfx", set.sfx, "צלילים ואפקטים")}
        ${toggle("t-music", set.music, "מוזיקת רקע")}
        ${toggle("t-heb", set.hebrew, "עזרה בעברית (תרגום ועידוד)")}
        ${toggle("t-all", set.unlockAll, "לפתוח את כל המפה")}
        <div class="field"><span>תרגול דיבור (<span class="en-ltr">Say it</span>)</span>
          <div class="seg"><button data-m="auto" aria-pressed="${set.sayMode!=="echo"}">אוטומטי</button><button data-m="echo" aria-pressed="${set.sayMode==="echo"}">הקלטה והשמעה</button></div>
          <p class="small">אוטומטי: במכשירים שתומכים בזיהוי דיבור, האפליקציה גם בודקת את המילה ונותנת כוכב בונוס. בכל מקרה כל ניסיון מקבל כוכב. "הקלטה והשמעה" משמיעה לילד את הקול שלו ואז את המילה, בלי זיהוי.</p>
        </div>
      </div>

      <div class="panel"><h2>מיקרופון</h2>
        <p class="small">המיקרופון משמש רק כשהילד לוחץ על כפתור המיקרופון. ההקלטה נשארת בזיכרון לכמה שניות כדי להשמיע אותה, לא נשמרת ולא נשלחת. בזיהוי דיבור אוטומטי, הדפדפן (Chrome) שולח את הקול לשירות הזיהוי של Google.</p>
        <p class="small" id="micstate"></p>
      </div>

      <div class="panel"><h2>שימוש בלי אינטרנט</h2>
        <p class="small" id="offline">בודק…</p>
        ${installEvt?`<button class="b3 pbtn c-yellow" id="install">התקנה כאפליקציה</button>`:""}
      </div>

      <div class="panel"><h2>קרדיטים</h2>
        <p class="small">הקלטות המילים: תורמי <a href="https://en.wiktionary.org" target="_blank" rel="noopener">Wiktionary</a>, ברישיון <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener">CC BY-SA</a>, דרך <a href="https://dictionaryapi.dev" target="_blank" rel="noopener">dictionaryapi.dev</a>. מילים בלי הקלטה נאמרות בקול של המכשיר.</p>
        <p class="small">גופן Fredoka ברישיון SIL Open Font License. תמונות: אמוג'י של המכשיר. גרסה <span class="en-ltr">${VERSION}</span>.</p>
      </div>
    </div></div>`;

    $("#back").onclick = ()=>{ Sound.sfx("tap"); Screens.start(); };
    app.querySelectorAll("[data-edit]").forEach(b=>b.onclick = ()=>{
      const p = s.profiles.find(x=>x.id===b.dataset.edit);
      const panel = app.querySelector(`[data-kid="${p.id}"]`);
      profileForm(p, panel, ()=>dashboard());
    });
    $("#add").onclick = ()=>{ const host = $("#formhost"); host.className = "panel"; $("#add").hidden = true; profileForm(null, host, ()=>dashboard()); host.scrollIntoView({behavior:"smooth"}); };
    const tg = (id, key, after)=>{ const b = $("#"+id); b.onclick = ()=>{ set[key] = !set[key]; b.setAttribute("aria-checked", set[key]); S.save(); after && after(); }; };
    tg("t-sfx","sfx", ()=>Sound.music(set.sfx && set.music));
    tg("t-music","music", ()=>Sound.music(set.sfx && set.music));
    tg("t-heb","hebrew"); tg("t-all","unlockAll");
    app.querySelectorAll("[data-m]").forEach(b=>b.onclick = ()=>{ set.sayMode = b.dataset.m; S.save(); app.querySelectorAll("[data-m]").forEach(x=>x.setAttribute("aria-pressed", x===b)); });
    const ib = $("#install"); if(ib) ib.onclick = async ()=>{ installEvt.prompt(); await installEvt.userChoice; installEvt = null; ib.remove(); };

    const perm = await Speech.permission();
    const ms = $("#micstate");
    if(ms) ms.textContent = perm==="denied" ? "המיקרופון חסום. כדי לאפשר: הגדרות הדפדפן ← הגדרות אתר ← מיקרופון, ואז לאפשר לאתר הזה." : perm==="granted" ? "המיקרופון מאושר." : "עוד לא התבקש אישור למיקרופון. הוא יתבקש בפעם הראשונה שהילד יגיע לשלב הדיבור.";
    offlineStatus();
  }

  async function offlineStatus(){
    const el = $("#offline"); if(!el) return;
    const files = [...new Set(Object.values(window.AUDIO_MAP||{}))];
    let n = 0;
    try{ const c = await caches.open("sayit-audio"); n = (await c.keys()).length; }catch(e){}
    const wordsWith = Object.keys(window.AUDIO_MAP||{}).length, all = new Set(Object.values(S.WORD).map(w=>w.en)).size;
    el.textContent = `האפליקציה עובדת בלי אינטרנט אחרי הפתיחה הראשונה. הקלטות שמורות במכשיר: ${Math.min(n, files.length)} מתוך ${files.length}. ל־${all - wordsWith} מילים אין הקלטה והן נאמרות בקול של המכשיר.`;
  }

  // ---------- microphone explanation (shown once, before the first permission request) ----------
  function micExplain(){
    return new Promise(res=>{
      const v = document.createElement("div");
      v.className = "veil"; v.setAttribute("role","dialog"); v.setAttribute("aria-modal","true");
      v.innerHTML = `<div class="sheet rtl" lang="he">
        <div style="display:flex;justify-content:center"><div style="width:120px">${Mascot.svg("listen")}</div></div>
        <h2>להורים: אישור מיקרופון</h2>
        <p>בשלב <span class="en-ltr">Say it</span> הילד אומר את המילה בקול. כדי לשמוע אותו, הדפדפן יבקש עכשיו אישור להשתמש במיקרופון.</p>
        <p class="small">ההקלטה לא נשמרת ולא נשלחת לשום מקום (חוץ מזיהוי הדיבור של הדפדפן, אם הוא פעיל). אפשר לשנות בכל רגע באזור ההורים.</p>
        <div class="row"><button class="b3 pbtn c-mint" id="ok">אישור, להמשיך</button><button class="pbtn" id="no">לא עכשיו</button></div>
      </div>`;
      document.body.appendChild(v);
      v.querySelector("#ok").focus();
      v.querySelector("#ok").onclick = ()=>{ v.remove(); res(true); };
      v.querySelector("#no").onclick = ()=>{ v.remove(); res(false); };
    });
  }

  window.Parent = { gate, setup, dashboard, micExplain };
})();
