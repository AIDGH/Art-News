import { ArticlesService } from "./articles.service";
import { PrismaService } from "../database/prisma.service";
import { NotFoundException } from "@nestjs/common";

describe("Article sitemap", () => {
  it("only selects public article URLs and real dates, excluding drafts, archives and future publications", async () => {
    const data = [{ slug: "خبر-تازه", updatedAt: new Date("2026-10-08"), publishedAt: new Date("2026-10-07") }];
    const findMany = jest.fn().mockResolvedValue(data);
    const service = new ArticlesService({ article: { findMany } } as unknown as PrismaService);
    await expect(service.findSitemap()).resolves.toEqual({ data });
    expect(findMany).toHaveBeenCalledWith({
      where: {
        status: { in: ["PUBLISHED", "SCHEDULED"] },
        publishedAt: { lte: expect.any(Date) },
      },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    });
  });
});

describe("Short sharing links", () => {
  const id = "dfee779a-87f0-4229-8ce0-54c6946292fa";
  const encoded = Buffer.from(id.replaceAll("-", ""), "hex").toString("base64url");
  const article = { findFirst: jest.fn() };
  const mediaPost = { findFirst: jest.fn() };
  const service = new ArticlesService({ article, mediaPost } as unknown as PrismaService);
  beforeEach(() => jest.resetAllMocks());

  it("rejects malformed and noncanonical codes before querying content", async () => {
    for (const code of ["", "a../secret", `x${encoded}`, `a${encoded}=`, `a${encoded.slice(0, -1)}r`]) {
      await expect(service.resolveShortLink(code)).rejects.toBeInstanceOf(NotFoundException);
    }
    expect(article.findFirst).not.toHaveBeenCalled();
    expect(mediaPost.findFirst).not.toHaveBeenCalled();
  });

  it("resolves the current Persian slug by stable ID and gates publication", async () => {
    article.findFirst.mockResolvedValue({ slug: "حالا-تو-بگو-چه-کار-کنیم" });
    expect(await service.resolveShortLink(`a${encoded}`)).toEqual({ data: { path: `/articles/${encodeURIComponent("حالا-تو-بگو-چه-کار-کنیم")}` } });
    expect(article.findFirst).toHaveBeenCalledWith({
      where: { id, status: { in: ["PUBLISHED", "SCHEDULED"] }, publishedAt: { lte: expect.any(Date) } },
      select: { slug: true },
    });
    article.findFirst.mockResolvedValue({ slug: "new-title" });
    expect(await service.resolveShortLink(`a${encoded}`)).toEqual({ data: { path: "/articles/new-title" } });
  });

  it("does not fall back to another record when the article is private or deleted", async () => {
    article.findFirst.mockResolvedValue(null);
    await expect(service.resolveShortLink(`a${encoded}`)).rejects.toBeInstanceOf(NotFoundException);
    expect(mediaPost.findFirst).not.toHaveBeenCalled();
  });

  it("resolves film/photo links and applies media publication checks", async () => {
    mediaPost.findFirst.mockResolvedValue({ id, kind: "VIDEOS" });
    expect(await service.resolveShortLink(`m${encoded}`)).toEqual({ data: { path: `/articles/${id}` } });
    expect(mediaPost.findFirst).toHaveBeenCalledWith({
      where: { id, status: "PUBLISHED", publishedAt: { lte: expect.any(Date) } }, select: { id: true, kind: true },
    });
    mediaPost.findFirst.mockResolvedValue({ id, kind: "PHOTOS" });
    expect(await service.resolveShortLink(`m${encoded}`)).toEqual({ data: { path: "/category/photos" } });
    mediaPost.findFirst.mockResolvedValue(null);
    await expect(service.resolveShortLink(`m${encoded}`)).rejects.toBeInstanceOf(NotFoundException);
  });
});
