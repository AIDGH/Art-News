import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import type { Advertisement } from "../generated/prisma/client";
import type { AdvertisementQueryDto, CreateAdvertisementDto, UpdateAdvertisementDto } from "./dto/advertisement.dto";

function adStatus(ad: Advertisement, now = new Date()) {
  if (!ad.enabled) return "DISABLED";
  if (ad.endsAt && ad.endsAt <= now) return "EXPIRED";
  if (ad.startsAt && ad.startsAt > now) return "SCHEDULED";
  return "ACTIVE";
}

@Injectable()
export class AdvertisementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic(query: AdvertisementQueryDto) {
    const now = new Date();
    const data = await this.prisma.advertisement.findMany({
      where: {
        enabled: true,
        placement: { in: ["ALL", query.placement ?? "ALL"] },
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
        ],
      },
      select: { id: true, title: true, text: true, targetUrl: true, media: { select: { url: true, mimeType: true, alt: true } } },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    return { data };
  }

  async findAll(query: AdvertisementQueryDto) {
    const rows = await this.prisma.advertisement.findMany({
      include: { media: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    const now = new Date();
    const data = rows.map((ad) => ({ ...ad, effectiveStatus: adStatus(ad, now) }));
    return { data: data.filter((ad) => !query.status || (query.status === "active" ? ad.effectiveStatus === "ACTIVE" : ad.effectiveStatus !== "ACTIVE")) };
  }

  async create(dto: CreateAdvertisementDto) {
    await this.validate(dto.mediaId, dto.startsAt, dto.endsAt);
    const data = await this.prisma.advertisement.create({
      data: {
        title: dto.title.trim(), text: dto.text?.trim() || null, targetUrl: dto.targetUrl || null,
        mediaId: dto.mediaId, placement: dto.placement ?? "ALL", enabled: dto.enabled ?? true,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null, displayOrder: dto.displayOrder ?? 0,
      }, include: { media: true },
    });
    return { data: { ...data, effectiveStatus: adStatus(data) } };
  }

  async update(id: string, dto: UpdateAdvertisementDto) {
    for (const key of ["title", "mediaId", "enabled", "placement", "displayOrder"] as const) {
      if (dto[key] === null) throw new BadRequestException("مقدار این فیلد نمی‌تواند خالی باشد");
    }
    const current = await this.findOne(id);
    const startsAt = dto.startsAt === undefined ? current.startsAt?.toISOString() : dto.startsAt;
    const endsAt = dto.endsAt === undefined ? current.endsAt?.toISOString() : dto.endsAt;
    await this.validate(dto.mediaId ?? current.mediaId, startsAt, endsAt);
    const data = await this.prisma.advertisement.update({
      where: { id }, data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.text !== undefined ? { text: dto.text?.trim() || null } : {}),
        ...(dto.targetUrl !== undefined ? { targetUrl: dto.targetUrl || null } : {}),
        ...(dto.mediaId !== undefined ? { mediaId: dto.mediaId } : {}),
        ...(dto.placement !== undefined ? { placement: dto.placement } : {}),
        ...(dto.enabled !== undefined ? { enabled: dto.enabled } : {}),
        ...(dto.displayOrder !== undefined ? { displayOrder: dto.displayOrder } : {}),
        ...(dto.startsAt !== undefined ? { startsAt: startsAt ? new Date(startsAt) : null } : {}),
        ...(dto.endsAt !== undefined ? { endsAt: endsAt ? new Date(endsAt) : null } : {}),
      }, include: { media: true },
    });
    return { data: { ...data, effectiveStatus: adStatus(data) } };
  }

  async activate(id: string) {
    const current = await this.findOne(id);
    const now = new Date();
    return this.update(id, { enabled: true, startsAt: now.toISOString(), endsAt: current.endsAt && current.endsAt <= now ? null : current.endsAt?.toISOString() });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.advertisement.delete({ where: { id } });
    return { data: { id } };
  }

  private async findOne(id: string) {
    const ad = await this.prisma.advertisement.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException("تبلیغ پیدا نشد");
    return ad;
  }

  private async validate(mediaId: string, startsAt?: string | null, endsAt?: string | null) {
    const media = await this.prisma.mediaAsset.findUnique({ where: { id: mediaId } });
    if (!media || !["IMAGE", "VIDEO"].includes(media.kind)) throw new BadRequestException("فایل تبلیغ باید تصویر، گیف یا ویدیو باشد");
    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) throw new BadRequestException("پایان نمایش باید بعد از شروع آن باشد");
  }
}
