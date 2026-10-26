// "Say it": Echo (record + play back, works everywhere with a microphone) and,
// where the browser supports it, speech recognition as a bonus check.
(function(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  let srBroken = false; // set when recognition fails for this session (offline, blocked)

  function mode(){
    const m = Store.state.settings.sayMode;
    if(m === "echo") return "echo";
    if(!SR || srBroken || (isIOS && standalone)) return "echo";
    return "recognize";
  }
  const canRecord = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

  // ---------- forgiving match (kept from the first version) ----------
  function norm(s){ return s.toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\b(a|an|the|it'?s|its|is|that|this|um|uh|my|i said)\b/g," ").replace(/\s+/g," ").trim(); }
  function lev(a,b){ const m=a.length,n=b.length; if(!m) return n; if(!n) return m; let p=[...Array(n+1).keys()];
    for(let i=1;i<=m;i++){ const c=[i]; for(let j=1;j<=n;j++) c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1)); p=c; } return p[n]; }
  function isMatch(heard, target, alts){
    const goals = [target, ...(alts||[])].map(norm);
    for(const h of heard){
      const n = norm(h); if(!n) continue;
      const words = n.split(" "), joined = n.replace(/ /g,"");
      for(const g of goals){
        const gj = g.replace(/ /g,"");
        if(n===g || joined===gj || (" "+n+" ").includes(" "+g+" ")) return true;
        const cands = [joined, ...words]; for(let i=0;i<words.length-1;i++) cands.push(words[i]+words[i+1]);
        for(const c of cands){ const d = lev(c,gj);
          if(gj.length>=5 && d<=2) return true;
          if(gj.length>=3 && gj.length<5 && d<=1 && c[0]===gj[0]) return true; }
      }
    }
    return false;
  }

  // ---------- microphone ----------
  let stream = null;
  async function mic(){
    if(stream && stream.active) return stream;
    stream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true, noiseSuppression:true, autoGainControl:true}});
    return stream;
  }
  function release(){ if(stream){ stream.getTracks().forEach(t=>t.stop()); stream = null; } }
  async function permission(){
    try{ const p = await navigator.permissions.query({name:"microphone"}); return p.state; }catch(e){ return "unknown"; }
  }

  // Record until the child speaks then pauses (or a time limit). onLevel(0..1) drives the bars.
  async function record(onLevel){
    const s = await mic();
    const c = new (window.AudioContext||window.webkitAudioContext)();
    const src = c.createMediaStreamSource(s), an = c.createAnalyser(); an.fftSize = 1024; src.connect(an);
    const buf = new Float32Array(an.fftSize);
    const chunks = []; let rec;
    try{ rec = new MediaRecorder(s); }catch(e){ rec = null; }
    if(rec){ rec.ondataavailable = e=>{ if(e.data && e.data.size) chunks.push(e.data); }; rec.start(); }
    const t0 = performance.now(); let noise = 0.01, n = 0, voiced = 0, spoke = false, lastVoice = 0;
    await new Promise(res=>{
      (function loop(){
        an.getFloatTimeDomainData(buf);
        let sum = 0; for(let i=0;i<buf.length;i++) sum += buf[i]*buf[i];
        const rms = Math.sqrt(sum/buf.length), t = performance.now()-t0;
        if(t < 350){ noise = (noise*n + rms)/(++n); }
        const thr = Math.max(0.02, noise*3);
        onLevel && onLevel(Math.min(1, rms/(thr*4)));
        if(t >= 350 && rms > thr){ voiced += 16; lastVoice = t; if(voiced > 140) spoke = true; }
        const quietAfter = spoke && t - lastVoice > 750;
        if(quietAfter || t > (spoke ? 5000 : 4500)) return res();
        requestAnimationFrame(loop);
      })();
    });
    onLevel && onLevel(0);
    let blob = null;
    if(rec){ await new Promise(r=>{ rec.onstop = r; rec.stop(); }); blob = new Blob(chunks, {type: rec.mimeType || "audio/webm"}); }
    try{ c.close(); }catch(e){}
    return {spoke, url: blob && spoke ? URL.createObjectURL(blob) : null};
  }

  // Recognition: resolves {heard:[...], error}
  function recognize(){
    return new Promise(res=>{
      let r; try{ r = new SR(); }catch(e){ srBroken = true; return res({error:"unsupported"}); }
      r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
      let out = null;
      r.onresult = e=>{ out = {heard: Array.from(e.results[0]).map(a=>a.transcript)}; };
      r.onerror = e=>{
        if(["network","not-allowed","service-not-allowed","audio-capture","language-not-supported"].includes(e.error)) srBroken = true;
        out = out || {error:e.error};
      };
      r.onend = ()=> res(out || {error:"no-speech"});
      try{ r.start(); }catch(e){ res({error:"start"}); }
      setTimeout(()=>{ try{ r.stop(); }catch(e){} }, 7000);
    });
  }

  window.Speech = { mode, canRecord, record, recognize, isMatch, mic, release, permission, hasSR: ()=>!!SR && !srBroken };
})();
