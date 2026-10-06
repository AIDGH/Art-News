import { BadRequestException, NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { PrismaService } from "../database/prisma.service";
import { MediaPostQueryDto, SaveMediaPostDto } from "./media-post.dto";
import { MediaPostsService } from "./media-posts.service";

describe("Media posts", () => {
  const image = "c6f38d84-dbb1-4f30-99b7-5700835de841";
  const video = "e3f38d84-dbb1-4f30-99b7-5700835de842";
  const prisma = {
    mediaAsset: { findMany: jest.fn() },
    mediaPost: { findUnique: jest.fn(), findMany: jest.fn(), count: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    $transaction: jest.fn(),
  };
  const service = new MediaPostsService(prisma as unknown as PrismaService);
  const dto: SaveMediaPostDto = { title: "آلبوم تست", description: "شرح", coverId: image, kind: "PHOTOS", status: "DRAFT", mediaIds: [image] };

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.mediaAsset.findMany.mockResolvedValue([{ id: image, kind: "IMAGE" }]);
    prisma.mediaPost.findUnique.mockResolvedValue({ id: "post", publishedAt: new Date("2026-10-01") });
    prisma.mediaPost.findMany.mockResolvedValue([]);
    prisma.mediaPost.count.mockResolvedValue(0);
    prisma.$transaction.mockImplementation((queries) => Promise.all(queries));
  });

  it("does not expose draft or future posts even if the public query requests them", async () => {
    const result = await service.list({ status: "DRAFT", kind: "PHOTOS", page: 2, pageSize: 12 }, true);
    expect(prisma.mediaPost.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { kind: "PHOTOS", status: "PUBLISHED", publishedAt: { lte: expect.any(Date) } }, skip: 12, take: 12,
    }));
    expect(result.meta).toEqual({ page: 2, pageSize: 12, total: 0, hasMore: false });
  });

  it("creates a draft without a publication timestamp", async () => {
    await service.save(dto);
    expect(prisma.mediaPost.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ publishedAt: null, status: "DRAFT", items: { create: [{ mediaId: image, position: 0 }] } }),
    }));
  });

  it("saves the source link and allows clearing it on edit", async () => {
    await service.save({ ...dto, targetUrl: " https://www.instagram.com/p/test/ " });
    expect(prisma.mediaPost.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ targetUrl: "https://www.instagram.com/p/test/" }),
    }));
    await service.save({ ...dto, targetUrl: null }, "post");
    expect(prisma.mediaPost.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ targetUrl: null }),
    }));
  });

  it("accepts optional HTTP source links and rejects unsafe or incomplete URLs", async () => {
    for (const targetUrl of [undefined, null, "", "  ", " https://www.instagram.com/p/test/ ", "http://example.com/post"]) {
      const value = plainToInstance(SaveMediaPostDto, { ...dto, targetUrl });
      expect(await validate(value)).toEqual([]);
      if (typeof targetUrl === "string" && !targetUrl.trim()) expect(value.targetUrl).toBeNull();
    }
    for (const targetUrl of ["javascript:alert(1)", "data:text/html,test", "ftp://example.com/file", "/post", "instagram.com/p/test", "https://example.com/" + "x".repeat(2000)]) {
      expect((await validate(plainToInstance(SaveMediaPostDto, { ...dto, targetUrl }))).length).toBeGreaterThan(0);
    }
  });

  it("atomically replaces an album in the requested order while preserving its publication date", async () => {
    prisma.mediaAsset.findMany.mockResolvedValue([{ id: image, kind: "IMAGE" }, { id: video, kind: "VIDEO" }]);
    await service.save({ ...dto, kind: "VIDEOS", status: "PUBLISHED", mediaIds: [video, image] }, "post");
    expect(prisma.mediaPost.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({
      publishedAt: new Date("2026-10-01"), items: { deleteMany: {}, create: [{ mediaId: video, position: 0 }, { mediaId: image, position: 1 }] },
    }) }));
  });

  it("rejects video files in photo albums and non-image covers", async () => {
    prisma.mediaAsset.findMany.mockResolvedValue([{ id: image, kind: "IMAGE" }, { id: video, kind: "VIDEO" }]);
    await expect(service.save({ ...dto, mediaIds: [video] })).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.save({ ...dto, kind: "VIDEOS", coverId: video, mediaIds: [image, video] })).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.mediaPost.create).not.toHaveBeenCalled();
  });

  it("requires video in the film section and rejects missing assets", async () => {
    await expect(service.save({ ...dto, kind: "VIDEOS" })).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.save({ ...dto, mediaIds: [video] })).rejects.toBeInstanceOf(BadRequestException);
  });

  it("changes status without losing album contents", async () => {
    await service.setStatus("post", { status: "ARCHIVED" });
    expect(prisma.mediaPost.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "ARCHIVED", publishedAt: new Date("2026-10-01") } }));
    expect(prisma.mediaAsset.findMany).not.toHaveBeenCalled();
  });

  it("publishes a draft with a date", async () => {
    prisma.mediaPost.findUnique.mockResolvedValue({ id: "post", publishedAt: null });
    await service.setStatus("post", { status: "PUBLISHED" });
    expect(prisma.mediaPost.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "PUBLISHED", publishedAt: expect.any(Date) } }));
  });

  it("deletes only the post, not shared uploaded assets", async () => {
    await service.remove("post");
    expect(prisma.mediaPost.delete).toHaveBeenCalledWith({ where: { id: "post" } });
    prisma.mediaPost.findUnique.mockResolvedValue(null);
    await expect(service.remove("missing")).rejects.toBeInstanceOf(NotFoundException);
  });

  it("validates trimmed titles, album size, duplicates, required values and pagination", async () => {
    for (const patch of [{ title: "  " }, { coverId: null }, { status: null }, { mediaIds: [] }, { mediaIds: [image, image] }, { mediaIds: Array.from({ length: 8 }, () => image) }]) {
      expect((await validate(plainToInstance(SaveMediaPostDto, { ...dto, ...patch }))).length).toBeGreaterThan(0);
    }
    expect(await validate(plainToInstance(SaveMediaPostDto, dto))).toEqual([]);
    expect((await validate(plainToInstance(MediaPostQueryDto, { page: 0, pageSize: 100 }))).length).toBe(2);
  });
});
