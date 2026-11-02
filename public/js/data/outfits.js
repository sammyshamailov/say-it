// Mascot hats. svg is drawn over the mascot (viewBox 0 -8 124 108).
// stars: the old automatic unlock point (players from before the shop keep the hats they had)
// price: what the hat costs in the shop now
const O = "#1A1640";

export const OUTFITS = [
    {id:"party", stars:25, price:6, svg:`<path d="M58 34 L70 6 L82 32 Z" fill="#FFD23F" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="70" cy="6" r="5" fill="#FF4D8D" stroke="${O}" stroke-width="2.5"/><path d="M62 26 L78 24" stroke="#FF4D8D" stroke-width="3"/>`},
    {id:"shades", stars:50, price:6, svg:`<rect x="70" y="42" width="30" height="15" rx="7" fill="${O}"/><path d="M62 48 L70 47" stroke="${O}" stroke-width="3"/><path d="M75 46 L82 46" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`},
    {id:"flower", stars:75, price:7, svg:`<g transform="translate(52 30)"><circle cx="0" cy="-7" r="6" fill="#FF8A3D"/><circle cx="7" cy="0" r="6" fill="#FF8A3D"/><circle cx="0" cy="7" r="6" fill="#FF8A3D"/><circle cx="-7" cy="0" r="6" fill="#FF8A3D"/><circle r="5" fill="#FFD23F" stroke="${O}" stroke-width="2"/></g>`},
    {id:"crown", stars:100, price:10, svg:`<path d="M52 34 L54 16 L62 25 L69 12 L76 25 L84 16 L86 34 Z" fill="#FFD23F" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="69" cy="28" r="3" fill="#FF4D8D"/>`},
    {id:"cap", stars:130, price:7, svg:`<path d="M50 34 Q 68 8 88 30 Z" fill="#4CC9F0" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M84 30 Q 98 28 106 34 Q 94 37 84 34 Z" fill="#1F95BC" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>`},
    {id:"bow", stars:160, price:7, svg:`<path d="M60 26 L48 18 L48 34 Z M60 26 L72 18 L72 34 Z" fill="#FF4D8D" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="60" cy="26" r="4" fill="#C22A66" stroke="${O}" stroke-width="2"/>`},
    {id:"phones", stars:200, price:8, svg:`<path d="M56 46 Q 70 12 96 38" fill="none" stroke="${O}" stroke-width="5"/><rect x="50" y="42" width="10" height="16" rx="4" fill="#9B5DE5" stroke="${O}" stroke-width="2.5"/>`},
    {id:"wizard", stars:250, price:10, svg:`<path d="M54 34 L74 0 L88 32 Z" fill="#9B5DE5" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M70 14 l2 4 4 .5 -3 3 .8 4 -3.8-2 -3.8 2 .8-4 -3-3 4-.5z" fill="#FFD23F"/><path d="M48 34 Q 70 40 94 32" stroke="${O}" stroke-width="5" fill="none" stroke-linecap="round"/>`}
  ];
