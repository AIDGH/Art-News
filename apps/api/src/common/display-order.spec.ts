import { ConflictException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { PrismaService } from "../database/prisma.service";
import { EditorialArticlesService } from "../editorial/editorial-articles.service";
import { AdvertisementsService } from "../advertisements/advertisements.service";
import { CreateArticleDto } from "../editorial/dto/create-article.dto";
import { UpdateSiteSettingsDto } from "../site-settings/dto/update-site-settings.dto";
import { assertCompleteOrder, DisplayOrderDto } from "./display-order.dto";

describe("Visual display order and editor validation", () => {
  const ids = ["a8913c90-f775-4679-a1fe-8d8c0ad72c11", "a8913c90-f775-4679-a1fe-8d8c0ad72c12"];

  it("allows a complete permutation but rejects duplicates, missing and stale IDs", async () => {
    expect(() => assertCompleteOrder([...ids].reverse(), ids)).not.toThrow();
    for (const submitted of [[ids[0]], [ids[0], ids[0]], [ids[0], "unknown"]]) {
      expect(() => assertCompleteOrder(submitted, ids)).toThrow(ConflictException);
    }
    expect(await validate(plainToInstance(DisplayOrderDto, { ids }))).toEqual([]);
    expect((await validate(plainToInstance(DisplayOrderDto, { ids: [ids[0], ids[0]] }))).length).toBeGreaterThan(0);
    expect((await validate(plainToInstance(DisplayOrderDto, { ids: ["invalid"] }))).length).toBeGreaterThan(0);
  });

  it("saves slider order atomically and refuses a changed selection before writing", async () => {
    const placements = { findMany: jest.fn().mockResolvedValue(ids.map((articleId) => ({ articleId }))), update: jest.fn() };
    const prisma = { homepagePlacement: placements, $transaction: jest.fn(async (callback) => callback(prisma)) };
    const service = new EditorialArticlesService(prisma as unknown as PrismaService);
    jest.spyOn(service, "findFeaturedOrder").mockResolvedValue({ data: [] });
    await service.saveFeaturedOrder([...ids].reverse());
    expect(placements.update.mock.calls.map(([query]) => [query.where.articleId_slot.articleId, query.data.displayOrder])).toEqual([[ids[1], 0], [ids[0], 1]]);
    placements.update.mockClear();
    await expect(service.saveFeaturedOrder([ids[0]])).rejects.toBeInstanceOf(ConflictException);
    expect(placements.update).not.toHaveBeenCalled();
  });

  it("saves all ad IDs in the requested order without changing dates or enabled state", async () => {
    const ads = { findMany: jest.fn().mockResolvedValue(ids.map((id) => ({ id }))), update: jest.fn() };
    const prisma = { advertisement: ads, $transaction: jest.fn(async (callback) => callback(prisma)) };
    const service = new AdvertisementsService(prisma as unknown as PrismaService);
    jest.spyOn(service, "findDisplayOrder").mockResolvedValue({ data: [] });
    await service.saveDisplayOrder([...ids].reverse());
    expect(ads.update.mock.calls.map(([query]) => query)).toEqual([
      { where: { id: ids[1] }, data: { displayOrder: 0 } }, { where: { id: ids[0] }, data: { displayOrder: 1 } },
    ]);
  });

  it("accepts safe manual slugs with hyphens and underscores while rejecting URL separators", async () => {
    const base = { title: "عنوان خبر نمونه", lead: "متن لید خبر نمونه", body: "متن کامل خبر نمونه برای اعتبارسنجی", categoryId: ids[0] };
    for (const slug of ["news--2026-test", "news_test-", "لیلا-حاتمی", "news-test"]) {
      expect(await validate(plainToInstance(CreateArticleDto, { ...base, slug }))).toEqual([]);
    }
    for (const slug of ["news/test", "news?test", "news#test", "news test", "../test"]) {
      expect((await validate(plainToInstance(CreateArticleDto, { ...base, slug }))).length).toBeGreaterThan(0);
    }
  });

  it("preserves compatibility for old settings clients and rejects blank or null promo text", async () => {
    const base = { footerDescription: "متن فوتر", aboutBody: "" };
    expect(await validate(plainToInstance(UpdateSiteSettingsDto, base))).toEqual([]);
    expect(await validate(plainToInstance(UpdateSiteSettingsDto, { ...base, ecranPromoText: "متن جدید" }))).toEqual([]);
    for (const ecranPromoText of ["   ", null]) {
      expect((await validate(plainToInstance(UpdateSiteSettingsDto, { ...base, ecranPromoText }))).length).toBeGreaterThan(0);
    }
  });
});
