// Icons, all drawn here so nothing depends on an icon font or a network request.
import { raw } from "../core/html.js";

export const I = {
  home: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 4l8 7.5"/><path d="M6.5 10v9.5h11V10"/></svg>`),
  back: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>`),
  next: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13"/><path d="M13 6l6 6-6 6"/></svg>`),
  speaker: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>`),
  mute: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6"/></svg>`),
  play: raw(`<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`),
  star: (fill = "#fff", stroke = "#1A1640") => raw(`<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/></svg>`),
  lock: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="#B9B3F0" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`),
  mic: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/></svg>`),
  check: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="#20A86E" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`),
  book: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M4 5.5C7 4 10 4 12 6c2-2 5-2 8-.5V19c-3-1.5-6-1.5-8 .5-2-2-5-2-8-.5z" fill="currentColor" fill-opacity=".25"/><path d="M12 6v13.5"/></svg>`),
  shirt: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M8 3.5 4 6l1.5 4.5L8 9.5V20h8V9.5l2.5 1L20 6l-4-2.5c-.5 1.6-2 2.5-4 2.5s-3.5-.9-4-2.5z" fill="currentColor" fill-opacity=".25"/></svg>`),
  turtle: raw(`<svg viewBox="0 0 32 24"><ellipse cx="15" cy="13" rx="10" ry="7" fill="#3DDC97"/><path d="M8 13h14M15 6v14" stroke="#20A86E" stroke-width="1.5"/><circle cx="27" cy="13" r="4" fill="#B8F5D8"/><rect x="8" y="17" width="4" height="5" rx="2" fill="#B8F5D8"/><rect x="18" y="17" width="4" height="5" rx="2" fill="#B8F5D8"/></svg>`),
  q: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .9-1 1.6V15"/><circle cx="12" cy="18.5" r=".6" fill="currentColor"/></svg>`),
  crown: raw(`<svg class="crown" viewBox="0 0 34 26" role="img" aria-label="all learned"><path d="M3 22 L5 6 L12 13 L17 3 L22 13 L29 6 L31 22 Z" fill="#FFD23F" stroke="#1A1640" stroke-width="2.4" stroke-linejoin="round"/></svg>`),
  bag: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 12H6.2z" fill="currentColor" fill-opacity=".25"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>`),
  gear: raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`)
};
// padlock on the parents' button (the name "gear" is kept from the first version's icon)
I.parents = I.gear;
// the play triangle in white, for the "hear my voice" button
I.playWhite = raw(String(I.play).replace('fill="currentColor"', 'fill="#fff"').replace('stroke="currentColor"', 'stroke="#fff"'));
I.checkWhite = raw(String(I.check).replace('stroke="#20A86E"', 'stroke="#fff"'));
I.bookBig = raw(String(I.book).replace("<svg", '<svg width="40" height="40"'));
