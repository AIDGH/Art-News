import { NotFoundException } from "@nestjs/common";
import type { PrismaService } from "../database/prisma.service";
import { EditorialArticlesService } from "./editorial-articles.service";

describe("Article deletion", () => {
  const prisma = { article: { delete: jest.fn() }, mediaAsset: { delete: jest.fn() } };
  const service = new EditorialArticlesService(prisma as unknown as PrismaService);

  beforeEach(() => jest.resetAllMocks());

  it("deletes only the requested article and preserves uploaded assets", async () => {
    prisma.article.delete.mockResolvedValue({ id: "article-id" });
    expect(await service.remove("article-id")).toEqual({ data: { id: "article-id" } });
    expect(prisma.article.delete).toHaveBeenCalledWith({ where: { id: "article-id" } });
    expect(prisma.mediaAsset.delete).not.toHaveBeenCalled();
  });

  it("reports a missing article without hiding other database errors", async () => {
    prisma.article.delete.mockRejectedValue({ code: "P2025" });
    await expect(service.remove("missing")).rejects.toBeInstanceOf(NotFoundException);
    const failure = new Error("Database unavailable");
    prisma.article.delete.mockRejectedValue(failure);
    await expect(service.remove("article-id")).rejects.toBe(failure);
  });
});
