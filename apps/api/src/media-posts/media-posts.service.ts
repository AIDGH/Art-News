import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import type { Prisma } from "../generated/prisma/client";
import type { MediaPostQueryDto, MediaPostStatusDto, SaveMediaPostDto } from "./media-post.dto";

const include = { cover: true, items: { include: { media: true }, orderBy: { position: "asc" as const } } };

@Injectable()
export class MediaPostsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: MediaPostQueryDto, publicOnly = false) {
    const where: Prisma.MediaPostWhereInput = {
      ...(query.kind ? { kind: query.kind } : {}),
      ...(publicOnly ? { status: "PUBLISHED", publishedAt: { lte: new Date() } } : query.status ? { status: query.status } : {}),
    };
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 12;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.mediaPost.findMany({ where, include, orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }, { id: "desc" }], skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.mediaPost.count({ where }),
    ]);
    return { data, meta: { page, pageSize, total, hasMore: page * pageSize < total } };
  }

  async save(dto: SaveMediaPostDto, id?: string) {
    const current = id ? await this.findOne(id) : null;
    const ids = [...new Set([dto.coverId, ...dto.mediaIds])];
    const media = await this.prisma.mediaAsset.findMany({ where: { id: { in: ids } } });
    const byId = new Map(media.map((item) => [item.id, item]));
    if (media.length !== ids.length) throw new BadRequestException("یکی از فایل‌ها پیدا نشد؛ دوباره انتخاب کنید.");
    if (byId.get(dto.coverId)?.kind !== "IMAGE") throw new BadRequestException("کاور باید تصویر باشد.");
    const kinds = dto.mediaIds.map((mediaId) => byId.get(mediaId)!.kind);
    if (kinds.some((kind) => !["IMAGE", "VIDEO"].includes(kind))) throw new BadRequestException("فقط عکس و ویدیو مجاز است.");
    if (dto.kind === "PHOTOS" && kinds.some((kind) => kind !== "IMAGE")) throw new BadRequestException("آلبوم عکس نمی‌تواند ویدیو داشته باشد.");
    if (dto.kind === "VIDEOS" && !kinds.includes("VIDEO")) throw new BadRequestException("برای بخش فیلم دست‌کم یک ویدیو انتخاب کنید.");
    const data = {
      title: dto.title.trim(), description: dto.description?.trim() || null,
      kind: dto.kind, coverId: dto.coverId, status: dto.status,
      publishedAt: dto.status === "PUBLISHED" ? current?.publishedAt ?? new Date() : current?.publishedAt ?? null,
    };
    const items = dto.mediaIds.map((mediaId, position) => ({ mediaId, position }));
    const post = id
      ? await this.prisma.mediaPost.update({ where: { id }, data: { ...data, items: { deleteMany: {}, create: items } }, include })
      : await this.prisma.mediaPost.create({ data: { ...data, items: { create: items } }, include });
    return { data: post };
  }

  async setStatus(id: string, dto: MediaPostStatusDto) {
    const current = await this.findOne(id);
    const data = await this.prisma.mediaPost.update({ where: { id }, data: {
      status: dto.status,
      publishedAt: dto.status === "PUBLISHED" ? current.publishedAt ?? new Date() : current.publishedAt,
    }, include });
    return { data };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.mediaPost.delete({ where: { id } });
    return { data: { id } };
  }

  private async findOne(id: string) {
    const post = await this.prisma.mediaPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException("محتوا پیدا نشد.");
    return post;
  }
}
