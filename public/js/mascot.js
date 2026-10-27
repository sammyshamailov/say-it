// The mascot: an original little chameleon. Moods: idle, happy, listen, oops. Outfits unlock with stars.
(function(){
  const O = "#1A1640";
  const OUTFITS = [
    {id:"party", stars:25, svg:`<path d="M58 34 L70 6 L82 32 Z" fill="#FFD23F" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="70" cy="6" r="5" fill="#FF4D8D" stroke="${O}" stroke-width="2.5"/><path d="M62 26 L78 24" stroke="#FF4D8D" stroke-width="3"/>`},
    {id:"shades", stars:50, svg:`<rect x="70" y="42" width="30" height="15" rx="7" fill="${O}"/><path d="M62 48 L70 47" stroke="${O}" stroke-width="3"/><path d="M75 46 L82 46" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`},
    {id:"flower", stars:75, svg:`<g transform="translate(52 30)"><circle cx="0" cy="-7" r="6" fill="#FF8A3D"/><circle cx="7" cy="0" r="6" fill="#FF8A3D"/><circle cx="0" cy="7" r="6" fill="#FF8A3D"/><circle cx="-7" cy="0" r="6" fill="#FF8A3D"/><circle r="5" fill="#FFD23F" stroke="${O}" stroke-width="2"/></g>`},
    {id:"crown", stars:100, svg:`<path d="M52 34 L54 16 L62 25 L69 12 L76 25 L84 16 L86 34 Z" fill="#FFD23F" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="69" cy="28" r="3" fill="#FF4D8D"/>`},
    {id:"cap", stars:130, svg:`<path d="M50 34 Q 68 8 88 30 Z" fill="#4CC9F0" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M84 30 Q 98 28 106 34 Q 94 37 84 34 Z" fill="#1F95BC" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>`},
    {id:"bow", stars:160, svg:`<path d="M60 26 L48 18 L48 34 Z M60 26 L72 18 L72 34 Z" fill="#FF4D8D" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="60" cy="26" r="4" fill="#C22A66" stroke="${O}" stroke-width="2"/>`},
    {id:"phones", stars:200, svg:`<path d="M56 46 Q 70 12 96 38" fill="none" stroke="${O}" stroke-width="5"/><rect x="50" y="42" width="10" height="16" rx="4" fill="#9B5DE5" stroke="${O}" stroke-width="2.5"/>`},
    {id:"wizard", stars:250, svg:`<path d="M54 34 L74 0 L88 32 Z" fill="#9B5DE5" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M70 14 l2 4 4 .5 -3 3 .8 4 -3.8-2 -3.8 2 .8-4 -3-3 4-.5z" fill="#FFD23F"/><path d="M48 34 Q 70 40 94 32" stroke="${O}" stroke-width="5" fill="none" stroke-linecap="round"/>`}
  ];

  function svg(mood="idle", outfit=null, label=""){
    const eye = {
      idle:`<circle cx="84" cy="50" r="15" fill="#fff" stroke="${O}" stroke-width="4"/><circle cx="88" cy="50" r="7" fill="${O}"/><circle cx="90" cy="47" r="2.2" fill="#fff"/><ellipse class="lid" cx="84" cy="50" rx="16" ry="16" fill="#3DDC97" stroke="${O}" stroke-width="4"/>`,
      happy:`<circle cx="84" cy="50" r="15" fill="#fff" stroke="${O}" stroke-width="4"/><path d="M77 53 Q 84 43 91 53" fill="none" stroke="${O}" stroke-width="4" stroke-linecap="round"/>`,
      listen:`<circle cx="84" cy="50" r="15" fill="#fff" stroke="${O}" stroke-width="4"/><circle cx="79" cy="49" r="7" fill="${O}"/><circle cx="81" cy="46" r="2.2" fill="#fff"/>`,
      oops:`<circle cx="84" cy="50" r="15" fill="#fff" stroke="${O}" stroke-width="4"/><circle cx="85" cy="54" r="7" fill="${O}"/><circle cx="87" cy="51" r="2.2" fill="#fff"/>`
    }[mood] || "";
    const mouth = {
      idle:`<path d="M78 70 Q 88 78 98 70" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>`,
      happy:`<path d="M76 66 Q 88 86 100 66 Z" fill="${O}"/><path d="M82 74 Q 88 80 94 74" fill="#FF4D8D"/>`,
      listen:`<path d="M82 72 Q 88 75 94 71" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>`,
      oops:`<ellipse cx="90" cy="72" rx="5" ry="4" fill="${O}"/>`
    }[mood] || "";
    const arm = mood==="happy" ? `<path d="M44 52 L 30 26" stroke="${O}" stroke-width="12" stroke-linecap="round"/><path d="M44 52 L 30 26" stroke="#20A86E" stroke-width="6" stroke-linecap="round"/>`
      : mood==="listen" ? `<path d="M48 50 C 34 40 38 24 52 28" fill="none" stroke="${O}" stroke-width="11" stroke-linecap="round"/><path d="M48 50 C 34 40 38 24 52 28" fill="none" stroke="#20A86E" stroke-width="5" stroke-linecap="round"/>` : "";
    const o = OUTFITS.find(x=>x.id===outfit);
    return `<svg class="buddy ${mood}" viewBox="0 -8 124 108" ${label?`role="img" aria-label="${label}"`:'aria-hidden="true"'}><g class="body">
      ${arm}
      <path d="M26 72 C 8 72 6 50 19 46 C 30 43 34 55 25 58" fill="none" stroke="${O}" stroke-width="14" stroke-linecap="round"/>
      <path d="M26 72 C 8 72 6 50 19 46 C 30 43 34 55 25 58" fill="none" stroke="#3DDC97" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="62" cy="64" rx="38" ry="27" fill="#3DDC97" stroke="${O}" stroke-width="4"/>
      <path d="M40 42 Q 50 26 64 36 Q 74 24 84 36" fill="#FF4D8D" stroke="${O}" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="62" cy="76" rx="24" ry="10" fill="#B8F5D8"/>
      <rect x="40" y="82" width="12" height="14" rx="6" fill="#20A86E" stroke="${O}" stroke-width="3"/>
      <rect x="72" y="82" width="12" height="14" rx="6" fill="#20A86E" stroke="${O}" stroke-width="3"/>
      <circle cx="98" cy="64" r="4.5" fill="#FF8FB5" opacity=".8"/>
      ${eye}${mouth}${o?o.svg:""}
    </g></svg>`;
  }
  function outfitSVG(id){ const o = OUTFITS.find(x=>x.id===id); return `<svg viewBox="40 0 70 62" aria-hidden="true">${o?o.svg:""}</svg>`; }

  window.Mascot = { svg, OUTFITS, outfitSVG,
    unlocked(stars){ return OUTFITS.filter(o=>stars>=o.stars); },
    // swap the mood of an on-screen mascot
    set(el, mood, outfit){ if(el) el.innerHTML = svg(mood, outfit); } };
})();
