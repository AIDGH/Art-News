import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import type { INestApplication } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";

describe("Media multipart upload", () => {
  let app: INestApplication;
  let directory: string;
  let base: string;
  let video: Buffer;
  const create = jest.fn(async ({ data }) => ({ id: "fixture-media", ...data }));

  beforeAll(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), "cinema-upload-test-"));
    video = Buffer.from(await readFile(path.join(__dirname, "fixtures/upload.mp4.base64"), "utf8"), "base64");
    const module = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [MediaService, { provide: ConfigService, useValue: { get: () => directory } }, { provide: PrismaService, useValue: { mediaAsset: { create } } }],
    }).overrideGuard(SessionAuthGuard).useValue({ canActivate: () => true }).compile();
    app = module.createNestApplication();
    await app.listen(0, "127.0.0.1");
    base = await app.getUrl();
  });

  afterAll(async () => {
    await app?.close();
    // Only this test's uniquely created temporary directory is removed.
    if (directory) await rm(directory, { recursive: true, force: true });
  });

  const upload = async (bytes: Buffer, name: string, type: string) => {
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(bytes)], { type }), name);
    return fetch(`${base}/editorial/media`, { method: "POST", body: form });
  };

  it.each(["video/mp4", "application/octet-stream", "", "video/x-m4v"])("accepts a real MP4 with picker MIME %s", async (mime) => {
    const response = await upload(video, mime === "video/x-m4v" ? "clip.m4v" : "CLIP.MP4", mime);
    expect(response.status).toBe(201);
    const { data } = await response.json() as { data: { url: string; mimeType: string; kind: string } };
    expect(data.mimeType).toBe("video/mp4");
    expect(data.kind).toBe("VIDEO");
    expect(await readFile(path.join(directory, path.basename(data.url)))).toEqual(video);
  });

  it("rejects renamed non-video content and unsupported MOV without writing files", async () => {
    const before = await readdir(directory);
    expect((await upload(Buffer.from("not a video"), "clip.mp4", "application/octet-stream")).status).toBe(400);
    expect((await upload(video, "clip.mov", "video/quicktime")).status).toBe(400);
    expect(await readdir(directory)).toEqual(before);
  });

  it("enforces the 30 MiB multipart limit", async () => {
    const before = await readdir(directory);
    expect((await upload(Buffer.alloc(31 * 1024 * 1024), "clip.mp4", "video/mp4")).status).toBe(413);
    expect(await readdir(directory)).toEqual(before);
  });
});
