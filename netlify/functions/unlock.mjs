// Parent unlock codes: the first land is free, a code opens all lands for every child on the phone.
// POST /api/unlock  {code:"ABCDE-FGHJK", device:"<random id>"}  -> {ok:true}, 404 wrong code,
// 409 already used on MAX_DEVICES other devices.
// Each code may open MAX_DEVICES devices. Netlify Blobs (store "unlocks") keeps, per code, only the
// random device ids the app made for itself; entering the code again on the same device is free.
// To give a family a fresh start, delete the code's entry in the "unlocks" store in Netlify.
// A code is 5 random letters plus 5 letters signed from them with UNLOCK_SECRET (HMAC-SHA256),
// so codes need no list of sold codes and can't be made without the secret. Make codes with
// `UNLOCK_SECRET=... npm run codes 10`. Nothing about the family is kept.

export const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O, 1/I/L
const CODE_RE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{10}$/;
const DEVICE_RE = /^[0-9a-z]{12,40}$/;
export const MAX_DEVICES = 2;

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

// store: a Netlify Blobs store (or a stand-in with get/set in the tests)
export async function handle(req, secret, store) {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!secret) return json({ error: "not-ready" }, 503);
  let body;
  try { body = JSON.parse((await req.text()).slice(0, 300)); } catch { return json({ error: "bad-json" }, 400); }
  if (!(await checkCode(secret, body && body.code))) return json({ error: "not-found" }, 404);
  const device = String((body && body.device) || "");
  if (!DEVICE_RE.test(device)) return json({ error: "bad-device" }, 400);
  const code = cleanCode(body.code);
  let devices = [];
  try { devices = JSON.parse((await store.get(code, { consistency: "strong" })) || "[]"); } catch {}
  if (!Array.isArray(devices)) devices = [];
  if (devices.includes(device)) return json({ ok: true });
  if (devices.length >= MAX_DEVICES) return json({ error: "used-up", max: MAX_DEVICES }, 409);
  await store.set(code, JSON.stringify([...devices, device]));
  return json({ ok: true });
}

export default async (req) => {
  try {
    // loaded here, not at the top, so the tests and the code tool can import without the Netlify library
    const { getStore } = await import("@netlify/blobs");
    return await handle(req, process.env.UNLOCK_SECRET, getStore({ name: "unlocks", consistency: "strong" }));
  } catch (err) {
    console.error("unlock failed", err);
    return json({ error: "server" }, 500);
  }
};

export const config = { path: "/api/unlock", method: ["POST"] };
