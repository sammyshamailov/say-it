# Say It! Words

A game for young Hebrew-speaking children learning their first English words, through pictures, sound and voice. No reading needed, no ads, no accounts, no tracking. Progress is saved on the device.

Live: https://say-it-words.netlify.app/

## How it plays

- **Map**: six lands (Animal Jungle, Yummy Town, Me and Friends, Toy House, Adventure Road, Learning Castle). Each land has stepping stones, one per word group. Finishing stones opens the next land.
- **A round (3–5 minutes)**: meet new words → Listen & tap → Say it → a bonus game (Pop the bubbles or Memory match) → Well done, with stars and a sticker.
- **Say it**: on Android Chrome the browser's speech recognition checks the word and gives a bonus star. Everywhere else, and after one unheard try, "Echo" records the child, plays their voice back, then the model word. Every real attempt earns a star.
- **Spaced repetition**: each word has a level per child; a miss lowers it and brings the word back in the same round and later rounds.
- **Rewards**: stars, a sticker book (tap a sticker to hear its word), and mascot outfits every 25–50 stars. Nothing is ever lost.
- **Parent area**: hold the lock button for 3 seconds. Words learned, words to practice, time played, profiles, settings (sounds, music, Hebrew help, speaking mode, unlock all), microphone info, credits. Hebrew, right to left.

## Files

| Path | What |
| --- | --- |
| `index.html` | App shell |
| `css/app.css` | "Toy Box Bright" design |
| `js/words.js` | The 326 words: picture, Hebrew, accepted alternatives |
| `js/audio-map.js` | Word → recording on Wikimedia Commons |
| `js/store.js` | Progress, profiles, spaced repetition, migration from version 1 |
| `js/audio.js` | Recordings, device voices, effects, music |
| `js/speech.js` | Microphone, Echo recording, speech recognition, forgiving match |
| `js/mascot.js` | The chameleon mascot and outfits (SVG) |
| `js/app.js` | Screens and mini-games |
| `js/parent.js` | Parent gate and parent area |
| `sw.js` | Offline support |
| `netlify.toml` | Netlify settings |

No build step: edit and push. When you change files, bump the version (`?v=` in `index.html`, `VERSION` and the file list in `sw.js`) so phones pick up the update.

## Saved data

Stored in the browser's localStorage under `sayit2`. On first launch it imports profiles and stars from version 1 (`sayit-players`, `sayit-got-*`) and leaves those keys untouched.

## Credits

- Word recordings: Wiktionary and Lingua Libre contributors on [Wikimedia Commons](https://commons.wikimedia.org), CC BY-SA (each file's page on Commons names its author and exact licence). Played as Commons' MP3 versions. Words without a recording use the device's voice.
- Font: [Fredoka](https://github.com/google/fonts/tree/main/ofl/fredoka), SIL Open Font License (`fonts/OFL.txt`), subset to Latin + Hebrew.
- Pictures: the device's emoji.
