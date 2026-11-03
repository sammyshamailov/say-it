// Mascot outfits. svg is drawn over the mascot, back (if any) behind it (viewBox 0 -8 124 108).
// slot: head, face, neck or back. The mascot wears one thing per slot at a time.
// land: for sale only once that land of the map is open
// stars: the old automatic unlock point (players from before the shop keep the hats they had)
// price: what the hat costs in the shop now
const O = "#1A1640";

export const OUTFITS = [
    {id:"party", slot:"head", stars:25, price:6, svg:`<path d="M58 34 L70 6 L82 32 Z" fill="#FFD23F" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="70" cy="6" r="5" fill="#FF4D8D" stroke="${O}" stroke-width="2.5"/><path d="M62 26 L78 24" stroke="#FF4D8D" stroke-width="3"/>`},
    {id:"shades", slot:"face", stars:50, price:6, svg:`<rect x="70" y="42" width="30" height="15" rx="7" fill="${O}"/><path d="M62 48 L70 47" stroke="${O}" stroke-width="3"/><path d="M75 46 L82 46" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`},
    {id:"flower", slot:"head", stars:75, price:7, svg:`<g transform="translate(52 30)"><circle cx="0" cy="-7" r="6" fill="#FF8A3D"/><circle cx="7" cy="0" r="6" fill="#FF8A3D"/><circle cx="0" cy="7" r="6" fill="#FF8A3D"/><circle cx="-7" cy="0" r="6" fill="#FF8A3D"/><circle r="5" fill="#FFD23F" stroke="${O}" stroke-width="2"/></g>`},
    {id:"crown", slot:"head", stars:100, price:10, svg:`<path d="M52 34 L54 16 L62 25 L69 12 L76 25 L84 16 L86 34 Z" fill="#FFD23F" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="69" cy="28" r="3" fill="#FF4D8D"/>`},
    {id:"cap", slot:"head", stars:130, price:7, svg:`<path d="M50 34 Q 68 8 88 30 Z" fill="#4CC9F0" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M84 30 Q 98 28 106 34 Q 94 37 84 34 Z" fill="#1F95BC" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>`},
    {id:"bow", slot:"head", stars:160, price:7, svg:`<path d="M60 26 L48 18 L48 34 Z M60 26 L72 18 L72 34 Z" fill="#FF4D8D" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="60" cy="26" r="4" fill="#C22A66" stroke="${O}" stroke-width="2"/>`},
    {id:"phones", slot:"head", stars:200, price:8, svg:`<path d="M56 46 Q 70 12 96 38" fill="none" stroke="${O}" stroke-width="5"/><rect x="50" y="42" width="10" height="16" rx="4" fill="#9B5DE5" stroke="${O}" stroke-width="2.5"/>`},
    {id:"wizard", slot:"head", stars:250, price:10, svg:`<path d="M54 34 L74 0 L88 32 Z" fill="#9B5DE5" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M70 14 l2 4 4 .5 -3 3 .8 4 -3.8-2 -3.8 2 .8-4 -3-3 4-.5z" fill="#FFD23F"/><path d="M48 34 Q 70 40 94 32" stroke="${O}" stroke-width="5" fill="none" stroke-linecap="round"/>`},
    // one for each land, for sale once that land is open
    {id:"safari", slot:"head", land:"animals", price:8, svg:`<path d="M50 33 Q 50 10 70 10 Q 90 10 90 33 Z" fill="#E3BE7A" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M51 26 L89 26 L90 33 L50 33 Z" fill="#8A6234"/><ellipse cx="70" cy="34" rx="30" ry="5.5" fill="#C9A060" stroke="${O}" stroke-width="3"/>`},
    {id:"chef", slot:"head", land:"food", price:8, svg:`<circle cx="60" cy="12" r="10" fill="#fff" stroke="${O}" stroke-width="3"/><circle cx="84" cy="12" r="10" fill="#fff" stroke="${O}" stroke-width="3"/><circle cx="72" cy="6" r="11" fill="#fff" stroke="${O}" stroke-width="3"/><rect x="57" y="14" width="30" height="19" rx="3" fill="#fff" stroke="${O}" stroke-width="3"/><path d="M64 18 L64 30 M72 18 L72 30 M80 18 L80 30" stroke="#E4E0F5" stroke-width="2.5"/>`},
    {id:"hearts", slot:"face", land:"people", price:8, svg:`<path d="M62 47 L70 46" stroke="${O}" stroke-width="3"/><path d="M84 63 C 66 51 67 36 78 37.5 C 81 38 83 41 84 43 C 85 41 87 38 90 37.5 C 101 36 102 51 84 63 Z" fill="#FF4D8D" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M76 43 Q 78 40 81 41" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>`},
    {id:"propeller", slot:"head", land:"things", price:9, svg:`<path d="M70 16 L70 6" stroke="${O}" stroke-width="3"/><ellipse cx="61" cy="5" rx="9" ry="3.2" fill="#4CC9F0" stroke="${O}" stroke-width="2.5"/><ellipse cx="79" cy="5" rx="9" ry="3.2" fill="#9B5DE5" stroke="${O}" stroke-width="2.5"/><circle cx="70" cy="5" r="2.8" fill="#FFD23F" stroke="${O}" stroke-width="2"/><path d="M52 34 Q 52 16 70 16 Q 88 16 88 34 Z" fill="#FFD23F" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M70 16 Q 62 24 62 34 L78 34 Q 78 24 70 16 Z" fill="#FF4D8D" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>`},
    {id:"pirate", slot:"head", land:"outside", price:9, svg:`<path d="M44 33 Q 50 12 70 12 Q 90 12 96 33 Q 70 24 44 33 Z" fill="#2B2A44" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M47 30 Q 70 22 93 30" stroke="#FFD23F" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="70" cy="19" r="4.5" fill="#fff"/><circle cx="68.3" cy="18.5" r="1.1" fill="${O}"/><circle cx="71.7" cy="18.5" r="1.1" fill="${O}"/>`},
    {id:"gradcap", slot:"head", land:"learning", price:9, svg:`<path d="M56 21 L56 32 Q 70 37 84 32 L84 21 Z" fill="#2B2A44" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M44 18 L70 8 L96 18 L70 28 Z" fill="#3B3960" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M70 18 L92 21 L92 32" stroke="#FFD23F" stroke-width="2.5" fill="none"/><circle cx="70" cy="18" r="2.5" fill="#FFD23F"/><path d="M89 32 L95 32 L94 38 L90 38 Z" fill="#FFD23F"/>`},
    // everyday things
    {id:"bowtie", slot:"neck", price:6, svg:`<path d="M90 80 L82 75 L82 85 Z M90 80 L98 75 L98 85 Z" fill="#4CC9F0" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="90" cy="80" r="3.2" fill="#1F95BC" stroke="${O}" stroke-width="2"/>`},
    {id:"glasses", slot:"face", price:7, svg:`<path d="M66 48 L52 44" stroke="${O}" stroke-width="6" stroke-linecap="round"/><path d="M66 48 L52 44" stroke="#9B5DE5" stroke-width="2.5" stroke-linecap="round"/><circle cx="84" cy="50" r="18" fill="#CFF3FF33" stroke="${O}" stroke-width="7"/><circle cx="84" cy="50" r="18" fill="none" stroke="#9B5DE5" stroke-width="3"/>`},
    {id:"antennae", slot:"head", price:7, svg:`<path d="M60 31 Q 56 18 52 10 M78 30 Q 82 18 86 10" stroke="${O}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="52" cy="10" r="5" fill="#FFD23F" stroke="${O}" stroke-width="2.5"/><circle cx="86" cy="10" r="5" fill="#FFD23F" stroke="${O}" stroke-width="2.5"/><path d="M50 36 Q 68 26 88 34" stroke="${O}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M50 36 Q 68 26 88 34" stroke="#FF4D8D" stroke-width="3" fill="none" stroke-linecap="round"/>`},
    // big ones to save up for (back: drawn behind the mascot)
    {id:"cape", slot:"back", price:20, back:`<path d="M52 38 Q 28 16 4 34 Q 2 66 9 95 Q 30 100 50 88 Z" fill="#E63946" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M40 30 Q 18 24 8 40 Q 6 64 12 88" stroke="#FF7A85" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      svg:`<circle cx="46" cy="44" r="4.5" fill="#FFD23F" stroke="${O}" stroke-width="2.5"/>`},
    {id:"wings", slot:"back", price:25, back:`<ellipse cx="34" cy="28" rx="13" ry="22" transform="rotate(-32 34 28)" fill="#B9E6FF" stroke="${O}" stroke-width="3"/><ellipse cx="50" cy="22" rx="10" ry="19" transform="rotate(-8 50 22)" fill="#FFD6EE" stroke="${O}" stroke-width="3"/><path d="M30 16 Q 36 26 42 38 M50 8 Q 50 22 52 36" stroke="#ffffffcc" stroke-width="2.5" fill="none" stroke-linecap="round"/>`},
    {id:"royal", slot:"head", price:30, svg:`<path d="M54 32 Q 70 2 86 32 Z" fill="#C1121F" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M50 36 L50 18 L58 26 L64 12 L70 24 L76 12 L82 26 L90 18 L90 36 Z" fill="#FFD23F" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="58" cy="31" r="2.6" fill="#4CC9F0"/><circle cx="70" cy="31" r="3" fill="#FF4D8D"/><circle cx="82" cy="31" r="2.6" fill="#3DDC97"/><circle cx="50" cy="18" r="2.6" fill="#fff" stroke="${O}" stroke-width="1.5"/><circle cx="64" cy="12" r="2.6" fill="#fff" stroke="${O}" stroke-width="1.5"/><circle cx="76" cy="12" r="2.6" fill="#fff" stroke="${O}" stroke-width="1.5"/><circle cx="90" cy="18" r="2.6" fill="#fff" stroke="${O}" stroke-width="1.5"/>`}

  ];

export const OUTFIT = Object.fromEntries(OUTFITS.map(o => [o.id, o]));
// what a player wears: older saves keep one id, newer ones a list (one per slot)
export const worn = outfit => [].concat(outfit || []).filter(id => OUTFIT[id]);
// put one on, replacing whatever was in its slot; a second tap takes it off
export function toggleWear(outfit, id) {
  const now = worn(outfit);
  if (now.includes(id)) return now.filter(x => x !== id);
  return [...now.filter(x => OUTFIT[x].slot !== OUTFIT[id].slot), id];
}
