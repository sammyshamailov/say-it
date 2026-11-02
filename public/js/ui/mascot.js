// The mascot: an original little chameleon. Moods: idle, happy, listen, oops. Hats come from the shop.
import { raw } from "../core/html.js";
import { OUTFITS } from "../data/outfits.js";

const O = "#1A1640";
const EYES = {
  idle: `<circle cx="84" cy="50" r="15" fill="#fff" stroke="${O}" stroke-width="4"/><circle cx="88" cy="50" r="7" fill="${O}"/><circle cx="90" cy="47" r="2.2" fill="#fff"/><ellipse class="lid" cx="84" cy="50" rx="16" ry="16" fill="#3DDC97" stroke="${O}" stroke-width="4"/>`,
  happy: `<circle cx="84" cy="50" r="15" fill="#fff" stroke="${O}" stroke-width="4"/><path d="M77 53 Q 84 43 91 53" fill="none" stroke="${O}" stroke-width="4" stroke-linecap="round"/>`,
  listen: `<circle cx="84" cy="50" r="15" fill="#fff" stroke="${O}" stroke-width="4"/><circle cx="79" cy="49" r="7" fill="${O}"/><circle cx="81" cy="46" r="2.2" fill="#fff"/>`,
  oops: `<circle cx="84" cy="50" r="15" fill="#fff" stroke="${O}" stroke-width="4"/><circle cx="85" cy="54" r="7" fill="${O}"/><circle cx="87" cy="51" r="2.2" fill="#fff"/>`
};
const MOUTHS = {
  idle: `<path d="M78 70 Q 88 78 98 70" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>`,
  happy: `<path d="M76 66 Q 88 86 100 66 Z" fill="${O}"/><path d="M82 74 Q 88 80 94 74" fill="#FF4D8D"/>`,
  listen: `<path d="M82 72 Q 88 75 94 71" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>`,
  oops: `<ellipse cx="90" cy="72" rx="5" ry="4" fill="${O}"/>`
};
const ARMS = {
  happy: `<path d="M44 52 L 30 26" stroke="${O}" stroke-width="12" stroke-linecap="round"/><path d="M44 52 L 30 26" stroke="#20A86E" stroke-width="6" stroke-linecap="round"/>`,
  listen: `<path d="M48 50 C 34 40 38 24 52 28" fill="none" stroke="${O}" stroke-width="11" stroke-linecap="round"/><path d="M48 50 C 34 40 38 24 52 28" fill="none" stroke="#20A86E" stroke-width="5" stroke-linecap="round"/>`
};
const BODY = `<path d="M26 72 C 8 72 6 50 19 46 C 30 43 34 55 25 58" fill="none" stroke="${O}" stroke-width="14" stroke-linecap="round"/>
      <path d="M26 72 C 8 72 6 50 19 46 C 30 43 34 55 25 58" fill="none" stroke="#3DDC97" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="62" cy="64" rx="38" ry="27" fill="#3DDC97" stroke="${O}" stroke-width="4"/>
      <path d="M40 42 Q 50 26 64 36 Q 74 24 84 36" fill="#FF4D8D" stroke="${O}" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="62" cy="76" rx="24" ry="10" fill="#B8F5D8"/>
      <rect x="40" y="82" width="12" height="14" rx="6" fill="#20A86E" stroke="${O}" stroke-width="3"/>
      <rect x="72" y="82" width="12" height="14" rx="6" fill="#20A86E" stroke="${O}" stroke-width="3"/>
      <circle cx="98" cy="64" r="4.5" fill="#FF8FB5" opacity=".8"/>`;

const hatSvg = id => OUTFITS.find(x => x.id === id)?.svg || "";

// mood decides face and arm; extra classes (idle animation, happy bounce) go in cls
function svg(mood = "idle", outfit = null, cls = "") {
  return raw(`<svg class="buddy ${mood} ${cls}" viewBox="0 -8 124 108" aria-hidden="true"><g class="body">
      ${ARMS[mood] || ""}${BODY}${EYES[mood] || ""}${MOUTHS[mood] || ""}${hatSvg(outfit)}
    </g></svg>`);
}

export const Mascot = {
  svg,
  OUTFITS,
  // swap the mood of an on-screen mascot (el is the element holding it)
  set(el, mood, outfit, cls = "") { if (el && el.isConnected) el.innerHTML = String(svg(mood, outfit, cls)); }
};
