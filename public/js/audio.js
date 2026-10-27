// Sound: word recordings, device voices (fallback + Hebrew), effects and music.
(function(){
  const S = () => Store.state.settings;

  // ---------- Web Audio (effects + music) ----------
  let ctx = null;
  function ac(){
    if(!ctx){ try{ ctx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } }
    if(ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq, t0, dur, type="sine", vol=0.18, slideTo, out){
    const c = ac(); if(!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, c.currentTime+t0);
    if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime+t0+dur);
    g.gain.setValueAtTime(0.0001, c.currentTime+t0);
    g.gain.exponentialRampToValueAtTime(vol, c.currentTime+t0+0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime+t0+dur);
    o.connect(g).connect(out || c.destination); o.start(c.currentTime+t0); o.stop(c.currentTime+t0+dur+0.05);
  }
  const SFX = {
    tap(){ tone(620,0,.08,"sine",.12,900); },
    good(){ [784,988,1319].forEach((f,i)=>tone(f,i*.09,.22,"triangle",.16)); },
    soft(){ tone(330,0,.25,"triangle",.12,220); },
    pop(){ tone(900,0,.09,"square",.06,200); tone(1400,0,.05,"sine",.08); },
    star(){ [1568,2093,2637].forEach((f,i)=>tone(f,i*.06,.12,"sine",.1)); },
    flip(){ tone(500,0,.07,"triangle",.1,700); },
    fanfare(){ [523,659,784,1047].forEach((f,i)=>tone(f,i*.13,.3,"triangle",.17)); tone(1047,.55,.6,"triangle",.14); },
    unlock(){ [392,523,659,784,1047].forEach((f,i)=>tone(f,i*.07,.2,"sine",.13)); }
  };
  function sfx(name){ if(S().sfx && SFX[name]) SFX[name](); }

  // gentle pentatonic loop
  let musicTimer = null, musicStep = 0;
  const MEL = [523,587,659,784,880,784,659,587, 523,659,784,1047,880,784,659,523];
  const BASS = [131,131,196,196,175,175,196,196];

  // The music steps aside whenever something needs to be heard (a word, Hebrew help, feedback)
  // or recorded (the child's voice), and comes back a moment after it's quiet again.
  let bus = null, hushCount = 0, quietUntil = 0;
  const RETURN_MS = 900;
  function musicBus(){
    const c = ac(); if(!c) return null;
    if(!bus){ bus = c.createGain(); bus.connect(c.destination); }
    return bus;
  }
  function duck(){                      // fade the notes already sounding, in about 0.1 s
    quietUntil = Date.now() + RETURN_MS;
    if(bus && ctx){ bus.gain.cancelScheduledValues(ctx.currentTime); bus.gain.setTargetAtTime(0, ctx.currentTime, 0.03); }
  }
  function hush(on){ hushCount = Math.max(0, hushCount + (on ? 1 : -1)); duck(); }
  const voiceBusy = () => hushCount > 0 || (("speechSynthesis" in window) && speechSynthesis.speaking) || (!el.paused && !el.ended);
  function musicTick(){
    if(voiceBusy()){ duck(); return; }
    if(Date.now() < quietUntil) return;
    const b = musicBus(); if(!b) return;
    if(b.gain.value < 1){ b.gain.cancelScheduledValues(ctx.currentTime); b.gain.setTargetAtTime(1, ctx.currentTime, 0.15); }
    tone(MEL[musicStep%MEL.length], 0, .28, "triangle", .035, null, b);
    if(musicStep%2===0) tone(BASS[(musicStep/2)%BASS.length], 0, .55, "sine", .05, null, b);
    musicStep++;
  }
  function music(on){
    clearInterval(musicTimer); musicTimer = null;
    if(on && S().sfx){ musicTimer = setInterval(musicTick, 340); }
  }

  // ---------- device voices ----------
  let enVoice = null, heVoice = null;
  function pickVoices(){
    if(!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices();
    const en = vs.filter(v=>/^en[-_]/i.test(v.lang));
    const pref = ["Google US English","Samantha","Microsoft Aria","Microsoft Jenny","Karen"];
    enVoice = pref.map(n=>en.find(v=>v.name.includes(n))).find(Boolean) || en.find(v=>/en[-_]US/i.test(v.lang)) || en[0] || null;
    const he = vs.filter(v=>/^(he|iw)/i.test(v.lang));
    heVoice = he.find(v=>/google/i.test(v.name)) || he.find(v=>/carmit/i.test(v.name)) || he[0] || null;
  }
  if("speechSynthesis" in window){ pickVoices(); speechSynthesis.onvoiceschanged = pickVoices; }
  let keep = null;
  function speak(text, lang="en", rate){
    return new Promise(res=>{
      if(!("speechSynthesis" in window)) return res();
      speechSynthesis.cancel();
      const short = text.replace(/[^a-z]/gi,"").length <= 4;
      const u = new SpeechSynthesisUtterance(/[.!?]$/.test(text) ? text : text + ".");
      keep = u; duck();
      if(lang==="he"){ if(heVoice) u.voice = heVoice; u.lang = heVoice ? heVoice.lang : "he-IL"; u.rate = rate || .9; }
      else { if(enVoice) u.voice = enVoice; u.lang = enVoice ? enVoice.lang : "en-US"; u.rate = (rate || .62) * (short ? .9 : 1); }
      u.pitch = 1.1;
      let done = false; const fin = ()=>{ if(!done){ done = true; setTimeout(res, 150); } };
      u.onend = fin; u.onerror = fin; setTimeout(fin, 7000);
      setTimeout(()=>speechSynthesis.speak(u), 60);
    });
  }
  const hasHebrew = () => !!heVoice;

  // ---------- word recordings (Wiktionary contributors on Wikimedia Commons, CC BY-SA) ----------
  const el = new Audio(); el.preload = "auto";
  const blobs = {};
  const MEDIA = "https://upload.wikimedia.org/wikipedia/commons/transcoded/";
  const mediaUrl = f => /^https:/.test(f) ? f : MEDIA + f;
  async function blobFor(file){
    if(blobs[file]) return blobs[file];
    const r = await fetch(mediaUrl(file), {mode:"cors"});
    if(!r.ok) throw new Error("audio " + r.status);
    const u = URL.createObjectURL(await r.blob());
    blobs[file] = u; return u;
  }
  // When a new sound starts (or stop() is called), the sound it cuts off finishes right away
  // with "stopped", instead of waiting for the 8-second safety timer.
  let cutOff = null;
  function playUrl(url, rate=1){
    if(cutOff) cutOff("stopped");
    return new Promise(res=>{
      let done = false; const fin = ok=>{ if(done) return; done = true; if(cutOff===fin) cutOff = null; el.onended = el.onerror = null; res(ok); };
      cutOff = fin;
      duck(); el.pause(); el.src = url; el.currentTime = 0;
      el.preservesPitch = true; el.webkitPreservesPitch = true; el.playbackRate = rate;
      el.onended = ()=>fin(true); el.onerror = ()=>fin(false);
      el.play().catch(()=>fin(false));
      setTimeout(()=>fin(true), 8000);
    });
  }
  function stop(){ if(cutOff) cutOff("stopped"); try{ el.pause(); }catch(e){} if("speechSynthesis" in window) speechSynthesis.cancel(); }

  async function word(en, slow=false){
    stop();
    const file = (window.AUDIO_MAP||{})[en];
    if(file){
      try{ const u = await blobFor(file); const ok = await playUrl(u, slow ? .6 : .9); if(ok) return; }catch(e){}
    }
    return speak(en, "en", slow ? .38 : .62);
  }
  function hebrew(text){ return hasHebrew() ? speak(text, "he") : Promise.resolve(); }
  function prefetch(list){ list.forEach(en=>{ const f=(window.AUDIO_MAP||{})[en]; if(f) blobFor(f).catch(()=>{}); }); }

  // ---------- spoken feedback (Hebrew when the device has a Hebrew voice) ----------
  const TALK = {
    cheer:{m:["כל הכבוד!","יופי!","מעולה!","וואו!","אלוף!","איזה יופי!"], f:["כל הכבוד!","יופי!","מעולה!","וואו!","אלופה!","איזה יופי!"],
      en:["Great job!","Yes!","Super!","You got it!","Amazing!","Wow!"]},
    again:{m:["נסה שוב!"], f:["נסי שוב!"], en:["Try again!"]},
    listen:{m:["תקשיב..."], f:["תקשיבי..."], en:["Listen..."]},
    now:{m:["עכשיו אתה!"], f:["עכשיו את!"], en:["Now you!"]},
    noHear:{m:["לא שמעתי. נסה שוב!"], f:["לא שמעתי. נסי שוב!"], en:["I didn't hear you. Try again!"]},
    find:{m:["איפה...?"], f:["איפה...?"], en:["Where is..."]},
    said:{m:["שמעתי אותך! כל הכבוד!"], f:["שמעתי אותך! כל הכבוד!"], en:["I heard you!"]},
    clear:{m:["וואו, אמרת מושלם!"], f:["וואו, אמרת מושלם!"], en:["Wow, perfect!"]},
    done:{m:["כל הכבוד! סיימת!"], f:["כל הכבוד! סיימת!"], en:["Well done!"]},
    hi:{m:["היי!"], f:["היי!"], en:["Hi!"]}
  };
  function talk(key, gender){
    const t = TALK[key]; if(!t) return Promise.resolve();
    const pick = a => a[Math.floor(Math.random()*a.length)];
    if(S().hebrew && hasHebrew()) return speak(pick(t[gender==="f"?"f":"m"]), "he");
    return speak(pick(t.en), "en", .8);
  }

  window.Sound = { mediaUrl, sfx, music, speak, word, hebrew, prefetch, talk, stop, playUrl, hasHebrew, hush, unlock: ()=>ac() };
})();
