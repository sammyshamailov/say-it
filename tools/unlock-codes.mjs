// Print parent unlock codes:  UNLOCK_SECRET=... npm run codes 10
// The secret must be the same as UNLOCK_SECRET in Netlify (Site configuration → Environment variables).
import { makeCode, formatCode } from "../netlify/functions/unlock.mjs";

const secret = process.env.UNLOCK_SECRET;
const n = Math.max(1, Math.min(1000, Number(process.argv[2]) || 1));
if (!secret) { console.error("Set UNLOCK_SECRET first (the same value as in Netlify)."); process.exit(1); }
for (let i = 0; i < n; i++) console.log(formatCode(await makeCode(secret)));
