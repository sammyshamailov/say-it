// Parent area (Hebrew, right-to-left) behind a hold-for-3-seconds gate.
(function(){
  const app = document.getElementById("app");
  const S = Store, st = () => S.state;
  const $ = sel => app.querySelector(sel);
  const { esc, pic, I } = window.UI;
  const VERSION = "2.1.0";
  let installEvt = null;
  window.addEventListener("beforeinstallprompt", e=>{ e.preventDefault(); installEvt = e; });

  const toggle = (id, on, label) => `<div class="row"><label id="l-${id}">${label}</label><button class="toggle" role="switch" id="${id}" aria-checked="${!!on}" aria-labelledby="l-${id}"></button></div>`;
  const mins = ms => Math.round(ms/60000);

  // ---------- gate ----------
  // Three numbers written as Hebrew words: easy for a parent, a 1-in-504 guess for a child who can't read.
  const HE_NUM = ["","אחת","שתיים","שלוש","ארבע","חמש","שש","שבע","שמונה","תשע"];
  function gate(){
    let want = [], got = [];
    const pick = ()=>{ const d = S.shuffle([1,2,3,4,5,6,7,8,9]); want = d.slice(0,3); got = []; };
    pick();
    app.innerHTML = `<div class="screen">
      <div class="top"><button class="b3 icon c-tile" id="back" aria-label="חזרה">${I.back}</button></div>
      <div class="gate" style="flex:1;justify-content:center" lang="he" dir="rtl">
        <div style="width:120px">${Mascot.svg("listen")}</div>
        <p style="margin:0;font-size:20px;font-weight:600">להורים: הקישו את המספרים לפי הסדר</p>
        <p class="gate-words" id="words" aria-live="polite"></p>
        <div class="gate-dots" id="dots" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="keypad" id="pad" dir="ltr">${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="b3 c-tile" data-n="${n}">${n}</button>`).join("")}</div>
      </div></div>`;
    $("#back").onclick = Nav.back;
    const words = $("#words"), dots = [...app.querySelectorAll("#dots i")];
    const show = ()=>{ words.textContent = want.map(n=>HE_NUM[n]).join(" · "); dots.forEach((d,i)=>d.classList.toggle("on", i<got.length)); };
    show();
    app.querySelectorAll("[data-n]").forEach(b=>b.onclick = ()=>{
      got.push(+b.dataset.n); show();
      if(got.length < 3) return;
      if(got.every((n,i)=>n===want[i])){ Sound.sfx("unlock"); Nav.back(); Nav.go(dashboard); return; }
      Sound.sfx("soft");
      const pad = $("#pad"); pad.classList.remove("wiggle"); void pad.offsetWidth; pad.classList.add("wiggle");
      setTimeout(()=>{ pick(); show(); }, 400);
    });
    // for the child: a friendly spoken hint that this part is for grown-ups
    if(Sound.hasHebrew() && st().settings.hebrew) Sound.hebrew("זה בשביל אבא או אמא!"); else Sound.speak("Ask a grown-up!", "en", .8);
  }

  // ---------- moving progress to another phone ----------
  const API = "/api/transfer";
  const fmtCode = c => c.slice(0,3) + " " + c.slice(3);
  const hasProgress = () => st().profiles.some(p => p.stars > 0 || Object.keys(p.words).length);
  const NET_ERR = "אין חיבור לאינטרנט, או שהשרת לא זמין. נסו שוב בעוד רגע, או השתמשו בגיבוי לקובץ.";

  async function makeCode(host){
    host.innerHTML = `<p class="small">יוצר קוד…</p>`;
    try{
      const r = await fetch(API, {method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({data: S.exportData()})});
      const j = await r.json().catch(()=>({}));
      if(!r.ok || !j.code) throw new Error(j.error || r.status);
      host.innerHTML = `<p class="small">בטלפון השני: פותחים את <span class="en-ltr">Say It!</span>, נכנסים לאזור ההורים (או למסך הפתיחה) ובוחרים "יש לי קוד". מקלידים:</p>
        <div class="xcode" dir="ltr" aria-label="${j.code.split("").join(" ")}">${fmtCode(j.code)}</div>
        <p class="small" id="left"></p>`;
      const left = host.querySelector("#left");
      const tick = ()=>{
        if(!left.isConnected) return clearInterval(timer);
        const s = Math.max(0, Math.round((j.expires - Date.now())/1000));
        left.textContent = s ? `הקוד עובד פעם אחת ותקף עוד ${Math.floor(s/60)}:${String(s%60).padStart(2,"0")} דקות.` : "הקוד פג תוקף. אפשר ליצור קוד חדש.";
        if(!s) clearInterval(timer);
      };
      const timer = setInterval(tick, 1000); tick();
    }catch(e){
      host.innerHTML = `<p class="small err">${e.message==="too-big" ? "יש יותר מדי נתונים להעברה בקוד. השתמשו בגיבוי לקובץ." : NET_ERR}</p>`;
    }
  }

  function enterCode(host, done){
    host.innerHTML = `<div class="field"><label for="code">קוד העברה מהטלפון הישן</label>
        <input type="text" id="code" class="code-in" dir="ltr" maxlength="7" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="K7P 42Q"></div>
      <div class="row"><button class="b3 pbtn c-mint" id="go">העברה</button></div>
      <p class="small" id="msg"></p>`;
    const inp = host.querySelector("#code"), msg = host.querySelector("#msg"), go = host.querySelector("#go");
    inp.focus();
    inp.oninput = ()=>{ const c = inp.value.toUpperCase().replace(/[^0-9A-Z]/g,"").slice(0,6); inp.value = c.length>3 ? fmtCode(c) : c; };
    inp.onkeydown = e=>{ if(e.key==="Enter") go.click(); };
    go.onclick = async ()=>{
      const code = inp.value.replace(/\s/g,"");
      if(code.length !== 6){ msg.className = "small err"; msg.textContent = "הקוד צריך להיות 6 תווים."; return; }
      if(hasProgress() && !confirm("ההתקדמות שבמכשיר הזה תוחלף בזו מהטלפון הישן. להמשיך?")) return;
      go.disabled = true; msg.className = "small"; msg.textContent = "מעביר…";
      try{
        const r = await fetch(API + "?code=" + encodeURIComponent(code), {cache:"no-store"});
        const j = await r.json().catch(()=>({}));
        if(r.status===404){ msg.className = "small err"; msg.textContent = "הקוד לא נמצא. בדקו שהוקלד נכון, או צרו קוד חדש בטלפון הישן."; go.disabled = false; return; }
        if(r.status===410){ msg.className = "small err"; msg.textContent = "הקוד פג תוקף. צרו קוד חדש בטלפון הישן."; go.disabled = false; return; }
        if(!r.ok || !S.replaceAll(j.data)) throw new Error("bad");
        Sound.sfx("unlock"); alert("ההתקדמות הועברה!"); done();
      }catch(e){ msg.className = "small err"; msg.textContent = NET_ERR; go.disabled = false; }
    };
  }

  // Offline fallback: a backup file (shared through WhatsApp, Drive, email…)
  async function saveBackup(){
    const name = `say-it-backup-${new Date().toISOString().slice(0,10)}.json`;
    const file = new File([JSON.stringify(S.exportData())], name, {type:"application/json"});
    try{ if(navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file], title:"Say It! backup"}); return; } }
    catch(e){ if(e.name==="AbortError") return; }
    const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
  }
  function restoreBackup(input, done){
    input.onchange = async ()=>{
      const f = input.files && input.files[0]; input.value = ""; if(!f) return;
      let d = null; try{ d = JSON.parse(await f.text()); }catch(e){}
      if(!S.isSave(d)){ alert("זה לא קובץ גיבוי של Say It!."); return; }
      if(hasProgress() && !confirm("ההתקדמות שבמכשיר הזה תוחלף בזו שבקובץ. להמשיך?")) return;
      S.replaceAll(d); alert("ההתקדמות שוחזרה!"); done();
    };
    input.click();
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
      <div class="panel" id="move">
        <h2>עוברים מטלפון אחר?</h2>
        <p class="small">אם הילדים כבר שיחקו בטלפון אחר, אפשר להעביר את כל ההתקדמות עם קוד.</p>
        <div id="movehost"><button class="pbtn c-yellow b3" id="havecode">יש לי קוד העברה</button></div>
      </div>
    </div></div>`;
    profileForm(null, $("#form"), ()=>{ Screens.start(); });
    $("#havecode").onclick = ()=> enterCode($("#movehost"), ()=>Screens.start());
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

      <div class="panel"><h2>העברה לטלפון אחר</h2>
        <p class="small">עוברים לטלפון חדש, או רוצים שהילדים ישחקו גם בטאבלט? יוצרים כאן קוד ומקלידים אותו בטלפון השני. הקוד עובד פעם אחת ונמחק אחרי 15 דקות. ההתקדמות לא נשמרת אצלנו מעבר לזה.</p>
        <div id="xhost"></div>
        <div class="row"><button class="b3 pbtn c-yellow" id="mkcode">יצירת קוד העברה</button><button class="pbtn" id="havecode">יש לי קוד</button></div>
        <details><summary class="small">בלי אינטרנט? גיבוי לקובץ</summary>
          <div class="row" style="margin-top:10px"><button class="pbtn" id="bk">שמירת גיבוי</button><button class="pbtn" id="rs">שחזור מגיבוי</button>
          <input type="file" id="rsfile" accept=".json,application/json" hidden></div>
        </details>
      </div>

      <div class="panel"><h2>שימוש בלי אינטרנט</h2>
        <p class="small" id="offline">בודק…</p>
        ${installEvt?`<button class="b3 pbtn c-yellow" id="install">התקנה כאפליקציה</button>`:""}
      </div>

      <div class="panel"><h2>קרדיטים</h2>
        <p class="small">הקלטות המילים: תורמי <a href="https://en.wiktionary.org" target="_blank" rel="noopener">Wiktionary</a> ו־<a href="https://lingualibre.org" target="_blank" rel="noopener">Lingua Libre</a>, מתוך <a href="https://commons.wikimedia.org" target="_blank" rel="noopener">Wikimedia Commons</a>, ברישיונות <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA</a>. מילים בלי הקלטה נאמרות בקול של המכשיר.</p>
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
    const back = ()=>Screens.start();
    $("#mkcode").onclick = ()=> makeCode($("#xhost"));
    $("#havecode").onclick = ()=> enterCode($("#xhost"), back);
    $("#bk").onclick = saveBackup;
    $("#rs").onclick = ()=> restoreBackup($("#rsfile"), back);
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
