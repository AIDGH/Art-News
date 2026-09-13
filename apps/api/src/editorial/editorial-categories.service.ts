import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import type { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

@Injectable()
export class EditorialCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      include: { _count: { select: { articles: true } } },
    });
    return { data };
  }

  async create(dto: CreateCategoryDto) {
    try {
      return {
        data: await this.prisma.category.create({
          data: {
            title: dto.title.trim(),
            slug: dto.slug.trim(),
            description: dto.description?.trim() || null,
            sortOrder: dto.sortOrder,
          },
        }),
      };
    } catch {
      throw new ConflictException("این دسته‌بندی یا شناسه قبلاً وجود دارد");
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.slug !== undefined ? { slug: dto.slug.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() || null }
          : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    }).catch(() => null);
    if (!category) throw new NotFoundException("دسته‌بندی پیدا نشد");
    return { data: category };
  }
}
