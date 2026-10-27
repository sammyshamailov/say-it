// Daily sweep: delete transfer codes nobody used. Runs at 03:00 UTC.
import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore({ name: "transfers", consistency: "strong" });
  const { blobs } = await store.list();
  let removed = 0;
  for (const { key } of blobs) {
    const meta = await store.getMetadata(key);
    if (!meta || !meta.metadata || meta.metadata.expires < Date.now()) { await store.delete(key); removed++; }
  }
  console.log(`transfer cleanup: removed ${removed} of ${blobs.length}`);
};

export const config = { schedule: "0 3 * * *" };
