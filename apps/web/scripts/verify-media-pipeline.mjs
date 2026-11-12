// Run after building API and web. All writes go to a unique temporary directory.
import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";

const root = fileURLToPath(new URL("../", import.meta.url));
const apiRequire = createRequire(new URL("../../api/package.json", import.meta.url));
const { Test } = apiRequire("@nestjs/testing");
const { ConfigService } = apiRequire("@nestjs/config");
const { PrismaService } = apiRequire("./dist/database/prisma.service.js");
const { MediaController } = apiRequire("./dist/editorial/media.controller.js");
const { MediaService } = apiRequire("./dist/editorial/media.service.js");
const { SessionAuthGuard } = apiRequire("./dist/auth/session-auth.guard.js");
const directory = await mkdtemp(path.join(os.tmpdir(), "cinema-media-pipeline-"));
let app;
let web;
try {
  const testModule = await Test.createTestingModule({ controllers: [MediaController], providers: [MediaService, { provide: ConfigService, useValue: { get: () => directory } }, { provide: PrismaService, useValue: { mediaAsset: { create: async ({ data }) => ({ id: randomUUID(), ...data }) } } }] })
    .overrideGuard(SessionAuthGuard).useValue({ canActivate: () => true }).compile();
  app = testModule.createNestApplication({ logger: false });
  app.setGlobalPrefix("api/v1");
  await app.listen(4001, "127.0.0.1");
  const probe = createServer();
  await new Promise(resolve => probe.listen(0, "127.0.0.1", resolve));
  const webPort = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const webBase = `http://127.0.0.1:${webPort}`;
  let logs = "";
  web = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(webPort)], { cwd: root, env: { ...process.env, NEWS_UPLOAD_DIRECTORY: directory }, stdio: ["ignore", "pipe", "pipe"] });
  const capture = chunk => { logs = (logs + chunk).slice(-4000); };
  web.stdout.on("data", capture);
  web.stderr.on("data", capture);
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { ready = (await fetch(`${webBase}/images/placeholder.svg`)).status < 500; if (ready) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(ready, `Local Next server must start: ${logs}`);
  const sample = Buffer.from(await readFile(new URL("../../api/src/editorial/fixtures/upload.mp4.base64", import.meta.url), "utf8"), "base64");
  for (const size of [15, 29, 31]) {
    const bytes = Buffer.alloc(size * 1024 * 1024);
    sample.copy(bytes);
    // A legal MP4 `free` box makes a playable small sample into a large upload.
    bytes.writeUInt32BE(bytes.length - sample.length, sample.length);
    bytes.write("free", sample.length + 4);
    const body = new FormData();
    body.append("file", new Blob([bytes], { type: "video/mp4" }), `sample-${size}.mp4`);
    const start = Date.now();
    const response = await fetch(`${webBase}/api/v1/editorial/media`, { method: "POST", body });
    assert.equal(response.status, size > 30 ? 413 : 201, `${size} MiB through Next and real Multer`);
    if (size <= 30) {
      const { data } = await response.json();
      const stored = await readFile(path.join(directory, path.basename(data.url)));
      assert.equal(createHash("sha256").update(stored).digest("hex"), createHash("sha256").update(bytes).digest("hex"));
    }
    console.log(JSON.stringify({ sizeMiB: size, status: response.status, ms: Date.now() - start }));
  }
} finally {
  web?.kill("SIGTERM");
  await app?.close();
  await rm(directory, { recursive: true, force: true });
}
