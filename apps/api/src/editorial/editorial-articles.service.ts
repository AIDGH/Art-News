import { createHash } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "../generated/prisma/client";
import { HomepageSlot, PublicationStatus } from "../generated/prisma/enums";
import { createPaginationMeta } from "../common/pagination";
import { PrismaService } from "../database/prisma.service";
import type { EditorialUser } from "../auth/auth.service";
import type { CreateArticleDto } from "./dto/create-article.dto";
import type { EditorialArticleQueryDto } from "./dto/editorial-article-query.dto";
import type { UpdateArticleDto } from "./dto/update-article.dto";

const editorialArticleInclude = {
  author: { select: { id: true, displayName: true, username: true } },
  category: true,
  coverImage: true,
  tags: { include: { tag: true } },
  sources: { orderBy: { accessedAt: "asc" as const } },
  homepagePlacements: true,
} satisfies Prisma.ArticleInclude;

function slugifyTag(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
  const suffix = createHash("sha1").update(title).digest("hex").slice(0, 7);
  return `${base || "tag"}-${suffix}`;
}

@Injectable()
export class EditorialArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: EditorialArticleQueryDto) {
    const search = query.query?.trim();
    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.category ? { category: { slug: query.category } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { lead: { contains: search } },
              { slug: { contains: search } },
            ],
          }
        : {}),
    } satisfies Prisma.ArticleWhereInput;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        where,
        include: editorialArticleInclude,
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      data,
      meta: createPaginationMeta(query.page, query.pageSize, total),
    };
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: editorialArticleInclude,
    });
    if (!article) throw new NotFoundException("خبر پیدا نشد");
    return { data: article };
  }

  async create(dto: CreateArticleDto, user: EditorialUser) {
    await this.validatePublication(dto.status, dto.publishedAt, dto.coverImageId);
    try {
      const article = await this.prisma.$transaction(async (transaction) => {
        const created = await transaction.article.create({
          data: {
            title: dto.title.trim(),
            slug: dto.slug.trim(),
            lead: dto.lead.trim(),
            body: dto.body.trim(),
            status: dto.status,
            seoTitle: dto.seoTitle?.trim() || null,
            seoDescription: dto.seoDescription?.trim() || null,
            publishedAt: this.resolvePublishedAt(dto.status, dto.publishedAt),
            authorId: user.id,
            categoryId: dto.categoryId,
            coverImageId: dto.coverImageId || null,
            tags: { create: this.tagRelations(dto.tags) },
            sources: { create: this.sourceData(dto.sources) },
          },
        });
        if (dto.featured) {
          await transaction.homepagePlacement.create({
            data: {
              articleId: created.id,
              slot: HomepageSlot.LEAD,
              displayOrder: dto.featuredOrder,
            },
          });
        }
        return transaction.article.findUniqueOrThrow({
          where: { id: created.id },
          include: editorialArticleInclude,
        });
      });
      return { data: article };
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async update(id: string, dto: UpdateArticleDto) {
    const current = await this.prisma.article.findUnique({ where: { id } });
    if (!current) throw new NotFoundException("خبر پیدا نشد");

    const status = dto.status ?? current.status;
    const publishedAt = dto.publishedAt ?? current.publishedAt?.toISOString();
    const coverImageId = dto.coverImageId ?? current.coverImageId ?? undefined;
    await this.validatePublication(status, publishedAt, coverImageId);

    try {
      const article = await this.prisma.$transaction(async (transaction) => {
        await transaction.article.update({
          where: { id },
          data: {
            ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
            ...(dto.slug !== undefined ? { slug: dto.slug.trim() } : {}),
            ...(dto.lead !== undefined ? { lead: dto.lead.trim() } : {}),
            ...(dto.body !== undefined ? { body: dto.body.trim() } : {}),
            ...(dto.categoryId !== undefined
              ? { categoryId: dto.categoryId }
              : {}),
            ...(dto.coverImageId !== undefined
              ? { coverImageId: dto.coverImageId || null }
              : {}),
            ...(dto.status !== undefined ? { status: dto.status } : {}),
            ...(dto.publishedAt !== undefined || dto.status === PublicationStatus.PUBLISHED
              ? { publishedAt: this.resolvePublishedAt(status, publishedAt) }
              : {}),
            ...(dto.seoTitle !== undefined
              ? { seoTitle: dto.seoTitle.trim() || null }
              : {}),
            ...(dto.seoDescription !== undefined
              ? { seoDescription: dto.seoDescription.trim() || null }
              : {}),
            ...(dto.tags !== undefined
              ? {
                  tags: {
                    deleteMany: {},
                    create: this.tagRelations(dto.tags),
                  },
                }
              : {}),
            ...(dto.sources !== undefined
              ? {
                  sources: {
                    deleteMany: {},
                    create: this.sourceData(dto.sources),
                  },
                }
              : {}),
          },
        });

        if (dto.featured === true) {
          await transaction.homepagePlacement.upsert({
            where: { articleId_slot: { articleId: id, slot: HomepageSlot.LEAD } },
            create: {
              articleId: id,
              slot: HomepageSlot.LEAD,
              displayOrder: dto.featuredOrder ?? 0,
            },
            update: { displayOrder: dto.featuredOrder ?? 0 },
          });
        } else if (dto.featured === false) {
          await transaction.homepagePlacement.deleteMany({
            where: { articleId: id, slot: HomepageSlot.LEAD },
          });
        }

        return transaction.article.findUniqueOrThrow({
          where: { id },
          include: editorialArticleInclude,
        });
      });
      return { data: article };
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async archive(id: string) {
    const article = await this.prisma.article.update({
      where: { id },
      data: {
        status: PublicationStatus.ARCHIVED,
        homepagePlacements: { deleteMany: {} },
      },
      include: editorialArticleInclude,
    }).catch(() => null);
    if (!article) throw new NotFoundException("خبر پیدا نشد");
    return { data: article };
  }

  private async validatePublication(
    status: PublicationStatus,
    publishedAt?: string,
    coverImageId?: string,
  ): Promise<void> {
    if (
      (status === PublicationStatus.PUBLISHED ||
        status === PublicationStatus.SCHEDULED) &&
      !coverImageId
    ) {
      throw new BadRequestException("برای انتشار، تصویر اصلی خبر الزامی است");
    }
    if (status === PublicationStatus.SCHEDULED && !publishedAt) {
      throw new BadRequestException("برای زمان‌بندی، تاریخ انتشار الزامی است");
    }
    if (
      coverImageId &&
      (status === PublicationStatus.PUBLISHED ||
        status === PublicationStatus.SCHEDULED)
    ) {
      const media = await this.prisma.mediaAsset.findUnique({
        where: { id: coverImageId },
        select: { alt: true, credit: true },
      });
      if (!media?.alt.trim()) {
        throw new BadRequestException(
          "برای انتشار، متن جایگزین تصویر اصلی الزامی است",
        );
      }
      if (!media.credit?.trim()) {
        throw new BadRequestException(
          "برای انتشار، اعتبار یا منبع تصویر اصلی الزامی است",
        );
      }
    }
  }

  private resolvePublishedAt(
    status: PublicationStatus,
    publishedAt?: string,
  ): Date | null {
    if (publishedAt) return new Date(publishedAt);
    return status === PublicationStatus.PUBLISHED ? new Date() : null;
  }

  private tagRelations(tags: string[]) {
    return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))].map(
      (title) => ({
        tag: {
          connectOrCreate: {
            where: { title },
            create: { title, slug: slugifyTag(title) },
          },
        },
      }),
    );
  }

  private sourceData(sources: CreateArticleDto["sources"]) {
    return sources.map((source) => ({
      url: source.url,
      title: source.title?.trim() || null,
      publisher: source.publisher?.trim() || null,
      author: source.author?.trim() || null,
      publishedAt: source.publishedAt ? new Date(source.publishedAt) : null,
    }));
  }

  private handleWriteError(error: unknown): never {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new ConflictException("این شناسه یا عنوان قبلاً ثبت شده است");
    }
    throw error;
  }
}
