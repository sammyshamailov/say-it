// Everything Pipo says in Hebrew, apart from the words themselves (data/words.js) and the land
// names (data/lands.js). Each line is recorded once by tools/voice/build.mjs into
// public/audio/he/; the device's Hebrew voice is only the fallback. Change a line here, then run
// the tool again so it gets its recording.

// Feedback, by gender of the player (m boy, f girl), with the English used when Hebrew help is off.
export const TALK = {
  cheer: { m: ["כל הכבוד!", "יופי!", "מעולה!", "וואו!", "אלוף!", "איזה יופי!"], f: ["כל הכבוד!", "יופי!", "מעולה!", "וואו!", "אלופה!", "איזה יופי!"],
    en: ["Great job!", "Yes!", "Super!", "You got it!", "Amazing!", "Wow!"] },
  noHear: { m: ["לא שמעתי. נסה שוב!"], f: ["לא שמעתי. נסי שוב!"], en: ["I didn't hear you. Try again!"] },
  said: { m: ["שמעתי אותך! כל הכבוד!"], f: ["שמעתי אותך! כל הכבוד!"], en: ["I heard you!"] },
  clear: { m: ["וואו, אמרת מושלם!"], f: ["וואו, אמרת מושלם!"], en: ["Wow, perfect!"] },
  done: { m: ["כל הכבוד! סיימת!"], f: ["כל הכבוד! סיימת!"], en: ["Well done!"] },
  whats: { m: ["מה זה?"], f: ["מה זה?"], en: ["What's this?"] },
  hi: { m: ["היי!"], f: ["היי!"], en: ["Hi!"] }
};

// Single lines spoken by a screen.
export const SAY = {
  grownUp: "זה בשביל אבא או אמא!",                       // a child opens the parents' gate
  landLocked: "כדי לשחק כאן, צריך לבקש מההורים לפתוח"     // a land that isn't unlocked yet
};
