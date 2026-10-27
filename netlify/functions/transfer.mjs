// Move progress to another phone with a short one-time code.
// POST /api/transfer  {data:{...}}  -> {code, expires}
// GET  /api/transfer?code=K7P42Q   -> {data:{...}}   (the code is deleted when read)
// Codes expire after 15 minutes. Nothing else is kept: no names, no IPs, no accounts.
import { getStore } from "@netlify/blobs";

const TTL = 15 * 60 * 1000;
const MAX_BYTES = 200 * 1024;
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O, 1/I/L
const CODE_RE = /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, b => ALPHABET[b % ALPHABET.length]).join("");
}

export function cleanCode(raw) {
  return String(raw || "").toUpperCase().replace(/[^0-9A-Z]/g, ""); // "k7p-42q" -> "K7P42Q"
}

// Light check that this is a Say It! save, so the store can't be used for anything else.
export function looksLikeSave(d) {
  return d && typeof d === "object" && d.v === 2 && Array.isArray(d.profiles) && d.profiles.length <= 12 &&
    d.profiles.every(p => p && typeof p === "object" && typeof p.id === "string" && typeof p.words === "object");
}

export async function handle(req, store) {
  const url = new URL(req.url);

  if (req.method === "POST") {
    const text = await req.text();
    if (text.length > MAX_BYTES) return json({ error: "too-big" }, 413);
    let body;
    try { body = JSON.parse(text); } catch { return json({ error: "bad-json" }, 400); }
    if (!looksLikeSave(body && body.data)) return json({ error: "bad-data" }, 400);
    const expires = Date.now() + TTL;
    for (let i = 0; i < 5; i++) {
      const code = newCode();
      const { modified } = await store.set(code, JSON.stringify(body.data), { onlyIfNew: true, metadata: { expires } });
      if (modified) return json({ code, expires });
    }
    return json({ error: "busy" }, 503);
  }

  if (req.method === "GET") {
    const code = cleanCode(url.searchParams.get("code"));
    if (!CODE_RE.test(code)) return json({ error: "not-found" }, 404);
    const entry = await store.getWithMetadata(code, { consistency: "strong" });
    if (!entry) return json({ error: "not-found" }, 404);
    await store.delete(code);
    if (!entry.metadata || entry.metadata.expires < Date.now()) return json({ error: "expired" }, 410);
    return json({ data: JSON.parse(entry.data) });
  }

  return json({ error: "method" }, 405);
}

export default async (req) => {
  try {
    return await handle(req, getStore({ name: "transfers", consistency: "strong" }));
  } catch (err) {
    console.error("transfer failed", err);
    return json({ error: "server" }, 500);
  }
};

export const config = { path: "/api/transfer", method: ["GET", "POST"] };
