import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "../generated/prisma/client";
import { CommentStatus, PublicationStatus } from "../generated/prisma/enums";
import { PrismaService } from "../database/prisma.service";
import type { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class EngagementService {
  constructor(private readonly prisma: PrismaService) {}

  private async findArticle(slug: string) {
    const article = await this.prisma.article.findFirst({
      where: {
        slug,
        status: { in: [PublicationStatus.PUBLISHED, PublicationStatus.SCHEDULED] },
        publishedAt: { lte: new Date() },
      },
      select: { id: true },
    });
    if (!article) throw new NotFoundException("خبر پیدا نشد");
    return article;
  }

  async findPublic(slug: string, visitorId?: string) {
    const article = await this.findArticle(slug);
    const [comments, articleLikes, ownArticleLike] = await Promise.all([
      this.prisma.articleComment.findMany({
        where: { articleId: article.id, status: CommentStatus.APPROVED },
        orderBy: { createdAt: "desc" },
        select: {
          id: true, authorName: true, body: true, createdAt: true,
          _count: { select: { likes: true } },
          ...(visitorId ? { likes: { where: { visitorId }, select: { id: true } } } : {}),
        },
      }),
      this.prisma.articleLike.count({ where: { articleId: article.id } }),
      visitorId ? this.prisma.articleLike.count({ where: { articleId: article.id, visitorId } }) : Promise.resolve(0),
    ]);
    return {
      data: {
        articleLikes,
        articleLiked: ownArticleLike > 0,
        comments: comments.map((comment) => ({
          id: comment.id,
          name: comment.authorName,
          body: comment.body,
          createdAt: comment.createdAt,
          likes: comment._count.likes,
          liked: "likes" in comment && Array.isArray(comment.likes) && comment.likes.length > 0,
        })),
      },
    };
  }

  async createComment(slug: string, input: CreateCommentDto, visitorId: string) {
    const article = await this.findArticle(slug);
    const name = input.name.trim();
    const body = input.body.trim();
    if (name.length < 2 || body.length < 3) throw new BadRequestException("نام یا متن نظر کوتاه است");
    const recent = await this.prisma.articleComment.count({
      where: { visitorId, createdAt: { gte: new Date(Date.now() - 60_000) } },
    });
    if (recent) throw new HttpException("لطفاً یک دقیقه بعد نظر بعدی را ارسال کنید", HttpStatus.TOO_MANY_REQUESTS);
    await this.prisma.articleComment.create({
      data: { articleId: article.id, visitorId, authorName: name, body },
    });
    return { data: { submitted: true } };
  }

  async likeArticle(slug: string, visitorId: string) {
    const article = await this.findArticle(slug);
    try {
      await this.prisma.articleLike.create({ data: { articleId: article.id, visitorId } });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) throw error;
    }
    return { data: { likes: await this.prisma.articleLike.count({ where: { articleId: article.id } }), liked: true } };
  }

  async likeComment(slug: string, commentId: string, visitorId: string) {
    const article = await this.findArticle(slug);
    const comment = await this.prisma.articleComment.findFirst({
      where: { id: commentId, articleId: article.id, status: CommentStatus.APPROVED },
      select: { id: true },
    });
    if (!comment) throw new NotFoundException("نظر پیدا نشد");
    try {
      await this.prisma.commentLike.create({ data: { commentId, visitorId } });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) throw error;
    }
    return { data: { likes: await this.prisma.commentLike.count({ where: { commentId } }), liked: true } };
  }

  async listForModeration(status?: string) {
    if (status && !Object.values(CommentStatus).includes(status as CommentStatus)) {
      throw new BadRequestException("وضعیت نامعتبر است");
    }
    const comments = await this.prisma.articleComment.findMany({
      where: status ? { status: status as CommentStatus } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, authorName: true, body: true, status: true,
        createdAt: true, moderatedAt: true,
        article: { select: { title: true, slug: true } },
      },
    });
    return { data: comments };
  }

  async moderate(id: string, status: "APPROVED" | "REJECTED") {
    try {
      const comment = await this.prisma.articleComment.update({
        where: { id },
        data: { status, moderatedAt: new Date() },
        select: { id: true, status: true },
      });
      return { data: comment };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new NotFoundException("نظر پیدا نشد");
      }
      throw error;
    }
  }
}
