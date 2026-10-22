// Run against a local `next start` AFTER building, so the fixture is a new upload.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { copyFile, mkdir, readFile, unlink } from "node:fs/promises";
import { constants } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const base = process.argv[2] ?? "http://127.0.0.1:3002";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Local verification only");
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const filename = `${Date.now()}-${randomUUID()}.jpg`;
const target = path.join(root, "public/uploads", filename);
const original = await readFile(path.join(root, "public/images/articles/shootinga-cast-return.jpg"));
await mkdir(path.dirname(target), { recursive: true });
await copyFile(path.join(root, "public/images/articles/shootinga-cast-return.jpg"), target, constants.COPYFILE_EXCL);

try {
  const source = `/image-source/${filename}`;
  const raw = await fetch(`${base}${source}`);
  assert.equal(raw.status, 200, "New upload must be readable without restarting Next");
  assert.deepEqual(Buffer.from(await raw.arrayBuffer()), original);
  const url = `${base}/_next/image?url=${encodeURIComponent(source)}&w=384&q=75`;
  const first = await fetch(url, { headers: { Accept: "image/webp" } });
  assert.equal(first.status, 200);
  assert.match(first.headers.get("content-type"), /image\/webp/);
  const optimized = Buffer.from(await first.arrayBuffer());
  assert.equal((await sharp(optimized).metadata()).width, 384);
  assert.ok(optimized.length < original.length, "Thumbnail should be smaller than the original");
  const cached = await fetch(url, { headers: { Accept: "image/webp" } });
  assert.equal(cached.status, 200);
  assert.equal(cached.headers.get("x-nextjs-cache"), "HIT");
  assert.deepEqual(Buffer.from(await cached.arrayBuffer()), optimized);
  for (const invalid of ["secret.txt", "..%2F.env", filename.replace(".jpg", ".mp4"), `1-${randomUUID()}.jpg`]) {
    assert.equal((await fetch(`${base}/image-source/${invalid}`)).status, 404);
  }
  assert.deepEqual(await readFile(target), original, "Original download must remain untouched");
  console.log(JSON.stringify({ originalBytes: original.length, thumbnailBytes: optimized.length, savedPercent: Math.round(100 * (1 - optimized.length / original.length)), cache: "HIT", newUpload: "OK", invalidPaths: "404", originalUnchanged: true }));
} finally {
  await unlink(target);
}
