import { BadRequestException } from "@nestjs/common";
import { AdvertisementsService } from "./advertisements.service";
import type { PrismaService } from "../database/prisma.service";

describe("AdvertisementsService", () => {
  const now = new Date("2026-10-02T12:00:00Z");
  const record = {
    id: "ad", title: "Banner", text: null, targetUrl: null, mediaId: "image",
    placement: "HOME", enabled: true, startsAt: null, endsAt: null,
    displayOrder: 5, createdAt: now, updatedAt: now,
  };
  const prisma = {
    advertisement: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    mediaAsset: { findUnique: jest.fn() },
  };
  const service = new AdvertisementsService(prisma as unknown as PrismaService);

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now);
    jest.resetAllMocks();
    prisma.mediaAsset.findUnique.mockResolvedValue({ kind: "IMAGE" });
    prisma.advertisement.findUnique.mockResolvedValue(record);
    prisma.advertisement.update.mockImplementation(async ({ data }) => ({ ...record, ...data }));
  });

  afterEach(() => jest.useRealTimers());

  it("filters public ads by placement and current time", async () => {
    prisma.advertisement.findMany.mockResolvedValue([]);
    await service.findPublic({ placement: "ARTICLE" });
    expect(prisma.advertisement.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        enabled: true,
        placement: { in: ["ALL", "ARTICLE"] },
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
        ],
      },
    }));
  });

  it("separates active ads from scheduled, expired, and disabled ones", async () => {
    prisma.advertisement.findMany.mockResolvedValue([
      record,
      { ...record, id: "scheduled", startsAt: new Date(now.getTime() + 1) },
      { ...record, id: "expired", endsAt: now },
      { ...record, id: "disabled", enabled: false },
    ]);
    expect((await service.findAll({ status: "active" })).data.map((ad) => ad.id)).toEqual(["ad"]);
    expect((await service.findAll({ status: "inactive" })).data.map((ad) => ad.effectiveStatus))
      .toEqual(["SCHEDULED", "EXPIRED", "DISABLED"]);
  });

  it("does not reset placement, order or dates during a disable-only patch", async () => {
    await service.update("ad", { enabled: false });
    expect(prisma.advertisement.update).toHaveBeenCalledWith({
      where: { id: "ad" }, data: { enabled: false }, include: { media: true },
    });
  });

  it("reactivates expired ads now and clears the elapsed end date", async () => {
    prisma.advertisement.findUnique.mockResolvedValue({ ...record, endsAt: now });
    await service.activate("ad");
    expect(prisma.advertisement.update).toHaveBeenCalledWith(expect.objectContaining({
      data: { enabled: true, startsAt: now, endsAt: null },
    }));
  });

  it("rejects invalid dates and null required patch fields", async () => {
    await expect(service.update("ad", { startsAt: now.toISOString(), endsAt: now.toISOString() }))
      .rejects.toBeInstanceOf(BadRequestException);
    await expect(service.update("ad", { title: null } as never))
      .rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.advertisement.update).not.toHaveBeenCalled();
  });

  it("deletes the ad record without deleting the shared media", async () => {
    await service.remove("ad");
    expect(prisma.advertisement.delete).toHaveBeenCalledWith({ where: { id: "ad" } });
  });
});
