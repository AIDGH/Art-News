// Run after `next build`. Uses its own API fixture and never contacts production.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { copyFile, unlink } from "node:fs/promises";
import { constants } from "node:fs";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const filename = `${Date.now()}-${randomUUID()}.jpg`;
const uploadDirectory = path.join(root, "public/uploads");
const target = path.join(uploadDirectory, filename);
await copyFile(path.join(root, "public/images/articles/shootinga-cast-return.jpg"), target, constants.COPYFILE_EXCL);
const article = { slug: "preview-fixture", title: "Preview fixture", lead: "", body: "", publishedAt: "2026-10-23T00:00:00Z", category: { slug: "news", title: "News" }, coverImage: { url: `/uploads/${filename}`, alt: "Fixture" } };
const api = createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ data: req.url.startsWith("/articles/featured") ? [article] : [] }));
});
await new Promise(resolve => api.listen(0, "127.0.0.1", resolve));
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3003"], {
  cwd: root, env: { ...process.env, NEWS_UPLOAD_DIRECTORY: uploadDirectory, API_BASE_URL: `http://127.0.0.1:${api.address().port}` }, stdio: "ignore",
});
try {
  let html;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch("http://127.0.0.1:3003/");
      assert.equal(response.status, 200);
      html = await response.text();
      break;
    } catch { await new Promise(resolve => setTimeout(resolve, 250)); }
  }
  assert.ok(html, "Production preview server must start");
  const frame = html.match(/<article class="featured-carousel-slide"[\s\S]*?<\/article>/)?.[0];
  assert.ok(frame, "Single slide must render");
  assert.match(frame, /background-image:url/);
  assert.match(frame, /fetchPriority="high"/i);
  const inline = frame.match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)/)?.[1];
  assert.ok(inline, "Photo preview must be in HTML before any image download");
  const bytes = Buffer.from(inline, "base64");
  const meta = await sharp(bytes).metadata();
  assert.equal(meta.width, 40);
  assert.equal(meta.height, 24);
  assert.ok(bytes.length < 2048);
  assert.match(html, /rel="preload" as="image"/);
  const second = await (await fetch("http://127.0.0.1:3003/")).text();
  assert.ok(second.includes(inline), "Repeat HTML must retain the preview");
  console.log(JSON.stringify({ previewBytes: bytes.length, inlineBeforeImageDownload: true, highPriority: true, preload: true, singleSlide: true }));
} finally {
  server.kill("SIGTERM");
  await new Promise(resolve => api.close(resolve));
  await unlink(target);
}
