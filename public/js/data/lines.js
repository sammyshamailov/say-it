// Everything Pipo says, apart from the words themselves (data/words.js) and the land names
// (data/lands.js). Each line is recorded once by tools/voice/build.mjs: Hebrew by Zina into
// public/audio/he/, English by Sarah into public/audio/en/. Change a line here, then run the tool
// again so it gets its recording (`npm test` fails until it has one).

// Feedback, by gender of the player (m boy, f girl), with the English used when Hebrew help is off.
// A word that's spelled the same for a boy and a girl but said differently (סיימת, אותך, אמרת) gets
// niqqud, so each form has its own recording read the right way. Lines the same for both are fine.
export const TALK = {
  cheer: { m: ["כל הכבוד!", "יופי!", "מעולה!", "וואו!", "אלוף!", "איזה יופי!"], f: ["כל הכבוד!", "יופי!", "מעולה!", "וואו!", "אלופה!", "איזה יופי!"],
    en: ["Great job!", "Yes!", "Super!", "You got it!", "Amazing!", "Wow!"] },
  noHear: { m: ["לא שמעתי. נסה שוב!"], f: ["לא שמעתי. נסי שוב!"], en: ["I didn't hear you. Try again!"] },
  said: { m: ["שמעתי אוֹתְךָ! כל הכבוד!"], f: ["שמעתי אוֹתָךְ! כל הכבוד!"], en: ["I heard you!"] },
  clear: { m: ["וואו, אָמַרְתָּ מושלם!"], f: ["וואו, אָמַרְתְּ מושלם!"], en: ["Wow, perfect!"] },
  done: { m: ["כל הכבוד! סִיַּמְתָּ!"], f: ["כל הכבוד! סִיַּמְתְּ!"], en: ["Well done!"] },
  whats: { m: ["מה זה?"], f: ["מה זה?"], en: ["What's this?"] },
  hi: { m: ["היי!"], f: ["היי!"], en: ["Hi!"] }
};

// Single lines spoken by a screen, in Hebrew (Hebrew help on) and English (Hebrew help off).
export const SAY_EN = {
  grownUp: "Ask a grown-up!",  // a child opens the parents' gate
  hi: "Hi!"                    // who's playing: a child with an English name
};
export const SAY = {
  grownUp: "זה בשביל אבא או אמא!",                       // a child opens the parents' gate
  landLocked: "כדי לשחק כאן, צריך לבקש מההורים לפתוח"     // a land that isn't unlocked yet
};
