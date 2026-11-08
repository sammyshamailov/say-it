// Parent unlock codes: the first land is free, a code opens all lands for every child on the phone.
// POST /api/unlock  {code:"ABCDE-FGHJK"}  -> {ok:true} or 404
// A code is 5 random letters plus 5 letters signed from them with UNLOCK_SECRET (HMAC-SHA256),
// so codes need no database and can't be made without the secret. Make codes with
// `UNLOCK_SECRET=... npm run codes 10`. Nothing about the phone or the family is kept.

export const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O, 1/I/L
const CODE_RE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{10}$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export const cleanCode = raw => String(raw || "").toUpperCase().replace(/[^0-9A-Z]/g, ""); // "abcde-fghjk" -> "ABCDEFGHJK"
export const formatCode = c => c.slice(0, 5) + "-" + c.slice(5);

async function sign(secret, id) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("sayit-unlock:" + id)));
  return Array.from(mac.slice(0, 5), b => ALPHABET[b % ALPHABET.length]).join("");
}

export async function makeCode(secret) {
  const id = Array.from(crypto.getRandomValues(new Uint8Array(5)), b => ALPHABET[b % ALPHABET.length]).join("");
  return id + await sign(secret, id);
}

export async function checkCode(secret, raw) {
  const code = cleanCode(raw);
  if (!secret || !CODE_RE.test(code)) return false;
  const want = await sign(secret, code.slice(0, 5));
  let diff = 0;
  for (let i = 0; i < 5; i++) diff |= want.charCodeAt(i) ^ code.charCodeAt(5 + i);
  return diff === 0;
}

export async function handle(req, secret) {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!secret) return json({ error: "not-ready" }, 503);
  let body;
  try { body = JSON.parse((await req.text()).slice(0, 200)); } catch { return json({ error: "bad-json" }, 400); }
  return (await checkCode(secret, body && body.code)) ? json({ ok: true }) : json({ error: "not-found" }, 404);
}

export default async (req) => {
  try {
    return await handle(req, process.env.UNLOCK_SECRET);
  } catch (err) {
    console.error("unlock failed", err);
    return json({ error: "server" }, 500);
  }
};

export const config = { path: "/api/unlock", method: ["POST"] };
