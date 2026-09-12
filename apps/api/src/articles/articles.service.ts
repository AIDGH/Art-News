import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client";
import { PublicationStatus } from "../generated/prisma/enums";
import {
  createPaginationMeta,
  type PaginatedResponse,
} from "../common/pagination";
import { PrismaService } from "../database/prisma.service";
import type { ArticleQueryDto } from "./dto/article-query.dto";

const publicArticleSelect = {
  id: true,
  slug: true,
  title: true,
  lead: true,
  body: true,
  seoTitle: true,
  seoDescription: true,
  publishedAt: true,
  updatedAt: true,
  author: { select: { username: true, displayName: true } },
  category: {
    select: { slug: true, title: true, description: true },
  },
  coverImage: {
    select: {
      url: true,
      mimeType: true,
      width: true,
      height: true,
      alt: true,
      credit: true,
      caption: true,
      focalPointX: true,
      focalPointY: true,
    },
  },
  tags: { select: { tag: { select: { slug: true, title: true } } } },
  sources: {
    orderBy: { accessedAt: "asc" as const },
    select: {
      url: true,
      title: true,
      publisher: true,
      author: true,
      publishedAt: true,
      accessedAt: true,
    },
  },
} satisfies Prisma.ArticleSelect;

type PublicArticle = Prisma.ArticleGetPayload<{
  select: typeof publicArticleSelect;
}>;

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ArticleQueryDto,
  ): Promise<PaginatedResponse<PublicArticle>> {
    const now = new Date();
    const search = query.query?.trim();
    const where = {
      status: PublicationStatus.PUBLISHED,
      publishedAt: { lte: now },
      ...(query.category
        ? { category: { slug: query.category } }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { lead: { contains: search } },
            ],
          }
        : {}),
    } satisfies Prisma.ArticleWhereInput;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        where,
        select: publicArticleSelect,
        orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      data: items,
      meta: createPaginationMeta(query.page, query.pageSize, total),
    };
  }

  async findBySlug(slug: string): Promise<{ data: PublicArticle }> {
    const article = await this.prisma.article.findFirst({
      where: {
        slug,
        status: PublicationStatus.PUBLISHED,
        publishedAt: { lte: new Date() },
      },
      select: publicArticleSelect,
    });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" was not found`);
    }

    return { data: article };
  }
}
