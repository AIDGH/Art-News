import { ArticlesService } from "./articles.service";
import { PrismaService } from "../database/prisma.service";

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
