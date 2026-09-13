import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { EnvironmentVariables } from "../config/environment";
import { PrismaService } from "../database/prisma.service";

type UploadedImage = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

const extensions: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

@Injectable()
export class MediaService {
  private readonly uploadDirectory: string;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    this.uploadDirectory = path.resolve(
      process.cwd(),
      configService.get("UPLOAD_DIRECTORY", { infer: true }),
    );
  }

  async uploadImage(file: UploadedImage, alt = "", credit = "") {
    await mkdir(this.uploadDirectory, { recursive: true });
    const filename = `${Date.now()}-${randomUUID()}${extensions[file.mimetype]}`;
    const target = path.join(this.uploadDirectory, filename);
    await writeFile(target, file.buffer);

    try {
      const media = await this.prisma.mediaAsset.create({
        data: {
          kind: "IMAGE",
          url: `/uploads/${filename}`,
          mimeType: file.mimetype,
          alt: alt.trim(),
          credit: credit.trim() || null,
        },
      });
      return { data: media };
    } catch (error) {
      await unlink(target).catch(() => undefined);
      throw error;
    }
  }

  async findAll() {
    const data = await this.prisma.mediaAsset.findMany({
      where: { kind: "IMAGE" },
      orderBy: { createdAt: "desc" },
      take: 80,
    });
    return { data };
  }

  async updateMetadata(
    id: string,
    metadata: { alt?: string; credit?: string; caption?: string },
  ) {
    const data = await this.prisma.mediaAsset.update({
      where: { id },
      data: {
        ...(metadata.alt !== undefined ? { alt: metadata.alt.trim() } : {}),
        ...(metadata.credit !== undefined
          ? { credit: metadata.credit.trim() || null }
          : {}),
        ...(metadata.caption !== undefined
          ? { caption: metadata.caption.trim() || null }
          : {}),
      },
    }).catch(() => null);
    if (!data) throw new NotFoundException("تصویر پیدا نشد");
    return { data };
  }
}
