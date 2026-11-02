// The six lands on the map (one per word group) and the colours used for stones and cards.
import { groupIndex, subIndex } from "./index.js";

export const LANDS = {
  animals: { en: "Animal Jungle", he: "ג'ונגל החיות", c: "mint" },
  food: { en: "Yummy Town", he: "עיר הטעמים", c: "pink" },
  people: { en: "Me and Friends", he: "אני והחברים", c: "purple" },
  things: { en: "Toy House", he: "בית הצעצועים", c: "sky" },
  outside: { en: "Adventure Road", he: "דרך ההרפתקאות", c: "orange" },
  learning: { en: "Learning Castle", he: "טירת הלמידה", c: "yellow" }
};

const SUB_COLORS = ["mint", "pink", "purple", "sky", "orange", "yellow"];
export const subColor = s => SUB_COLORS[(groupIndex(s.group) + subIndex(s)) % SUB_COLORS.length];

export const PROFILE_COLORS = ["pink", "sky", "mint", "purple", "orange", "yellow"];

export const AVATARS = ["🦁","🦄","🐯","🐼","🐸","🦊","🐶","🐱","🐰","🐻","🦖","🐬","🦋","🚀","⚽","🌸","🐵","🐧","🦉","🐙"];
