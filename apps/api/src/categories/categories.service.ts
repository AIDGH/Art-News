import { Injectable, NotFoundException } from "@nestjs/common";
import { PublicationStatus } from "../generated/prisma/enums";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

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
                status: PublicationStatus.PUBLISHED,
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
            status: PublicationStatus.PUBLISHED,
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
