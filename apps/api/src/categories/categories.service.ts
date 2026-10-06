import { Injectable, NotFoundException } from "@nestjs/common";
import { MediaPostKind, PublicationStatus } from "../generated/prisma/enums";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findLatest() {
    const now = new Date();
    const mediaSelect = {
      id: true,
      title: true,
      publishedAt: true,
      cover: { select: { url: true, alt: true } },
    } as const;
    const [categories, photo, video] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
        select: {
          slug: true,
          title: true,
          description: true,
          articles: {
            where: {
              status: { in: [PublicationStatus.PUBLISHED, PublicationStatus.SCHEDULED] },
              publishedAt: { lte: now },
            },
            orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
            take: 1,
            select: {
              slug: true,
              title: true,
              publishedAt: true,
              coverImage: { select: { url: true, alt: true } },
            },
          },
        },
      }),
      ...[MediaPostKind.PHOTOS, MediaPostKind.VIDEOS].map((kind) =>
        this.prisma.mediaPost.findFirst({
          where: { kind, status: PublicationStatus.PUBLISHED, publishedAt: { lte: now } },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }, { id: "desc" }],
          select: mediaSelect,
        }),
      ),
    ]);

    return {
      data: categories.flatMap(({ articles, ...category }) => {
        const article = articles[0];
        const media = category.slug === "photos" ? photo : category.slug === "videos" ? video : null;
        if (media?.publishedAt && (!article?.publishedAt || media.publishedAt >= article.publishedAt)) {
          return [{
            category, contentType: "MEDIA", slug: media.id, title: media.title,
            publishedAt: media.publishedAt, coverImage: media.cover,
          }];
        }
        return article?.publishedAt ? [{ ...article, category, contentType: "ARTICLE" }] : [];
      }),
    };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      select: {
        slug: true,
        title: true,
        description: true,
        _count: {
          select: {
            articles: {
              where: {
                status: {
                  in: [
                    PublicationStatus.PUBLISHED,
                    PublicationStatus.SCHEDULED,
                  ],
                },
                publishedAt: { lte: new Date() },
              },
            },
          },
        },
      },
    });

    return {
      data: categories.map(({ _count, ...category }) => ({
        ...category,
        articleCount: _count.articles,
      })),
    };
  }

  async findArticles(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: {
        slug: true,
        title: true,
        description: true,
        articles: {
          where: {
            status: {
              in: [
                PublicationStatus.PUBLISHED,
                PublicationStatus.SCHEDULED,
              ],
            },
            publishedAt: { lte: new Date() },
          },
          orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
          select: {
            slug: true,
            title: true,
            lead: true,
            publishedAt: true,
            author: { select: { username: true, displayName: true } },
            coverImage: {
              select: { url: true, alt: true, credit: true },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" was not found`);
    }

    return { data: category };
  }
}
