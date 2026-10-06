import type { PrismaService } from "../database/prisma.service";
import { CategoriesService } from "./categories.service";

describe("Latest category content", () => {
  const prisma = {
    category: { findMany: jest.fn() },
    mediaPost: { findFirst: jest.fn() },
    $transaction: jest.fn(),
  };
  const service = new CategoriesService(prisma as unknown as PrismaService);
  const cover = { url: "/uploads/cover.png", alt: "کاور" };
  const article = (slug: string, date = "2026-09-01") => ({
    slug, title: slug, publishedAt: new Date(date), coverImage: cover,
  });
  const category = (slug: string, articles: ReturnType<typeof article>[] = []) => ({
    slug, title: slug, description: "", articles,
  });
  const post = (date: string) => ({
    id: "media-post", title: "ویدیوی تازه", publishedAt: new Date(date), cover,
  });

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.category.findMany.mockResolvedValue([]);
    prisma.mediaPost.findFirst.mockResolvedValue(null);
    prisma.$transaction.mockImplementation((queries) => Promise.all(queries));
  });

  it("queries one latest item inside every category, independent of the global article page", async () => {
    prisma.category.findMany.mockResolvedValue([
      category("news", [article("recent-news", "2026-10-01")]),
      category("theater", [article("older-theater", "2025-01-01")]),
      category("report"),
    ]);
    const result = await service.findLatest();
    expect(result.data.map((item) => item.slug)).toEqual(["recent-news", "older-theater"]);
    expect(prisma.category.findMany).toHaveBeenCalledWith(expect.objectContaining({
      select: expect.objectContaining({ articles: expect.objectContaining({
        take: 1, orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
        where: { status: { in: ["PUBLISHED", "SCHEDULED"] }, publishedAt: { lte: expect.any(Date) } },
      }) }),
    }));
  });

  it.each(["photos", "videos"])("shows a newer %s upload instead of a legacy article with its actual cover and date", async (slug) => {
    prisma.category.findMany.mockResolvedValue([category(slug, [article("old-article")])]);
    prisma.mediaPost.findFirst.mockImplementation(({ where }) =>
      Promise.resolve(where.kind === (slug === "photos" ? "PHOTOS" : "VIDEOS") ? post("2026-10-06") : null),
    );
    expect((await service.findLatest()).data[0]).toEqual({
      category: { slug, title: slug, description: "" }, contentType: "MEDIA",
      slug: "media-post", title: "ویدیوی تازه", publishedAt: new Date("2026-10-06"), coverImage: cover,
    });
  });

  it("keeps a newer legacy article when the media upload is older", async () => {
    prisma.category.findMany.mockResolvedValue([category("videos", [article("new-article", "2026-10-05")])]);
    prisma.mediaPost.findFirst.mockResolvedValue(post("2026-09-01"));
    expect((await service.findLatest()).data[0]).toEqual(expect.objectContaining({
      contentType: "ARTICLE", slug: "new-article", coverImage: cover,
    }));
  });

  it("includes media-only categories and excludes empty categories without fabricating report news", async () => {
    prisma.category.findMany.mockResolvedValue([category("report"), category("videos")]);
    prisma.mediaPost.findFirst.mockResolvedValue(post("2026-10-01"));
    const result = await service.findLatest();
    expect(result.data.map((item) => item.category.slug)).toEqual(["videos"]);
    expect(result.data[0].contentType).toBe("MEDIA");
  });

  it("excludes draft, archived and future media without loading video files or album contents", async () => {
    await service.findLatest();
    for (const kind of ["PHOTOS", "VIDEOS"]) {
      expect(prisma.mediaPost.findFirst).toHaveBeenCalledWith({
        where: { kind, status: "PUBLISHED", publishedAt: { lte: expect.any(Date) } },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }, { id: "desc" }],
        select: { id: true, title: true, publishedAt: true, cover: { select: { url: true, alt: true } } },
      });
    }
  });
});
