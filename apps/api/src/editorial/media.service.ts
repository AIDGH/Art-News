import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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
  "video/mp4": ".mp4",
  "video/webm": ".webm",
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
    const video = file.mimetype.startsWith("video/");
    if (!extensions[file.mimetype] || file.size > (video ? 30 : 8) * 1024 * 1024) {
      throw new BadRequestException(video ? "حجم ویدیو باید حداکثر ۳۰ مگابایت باشد" : "حجم تصویر باید حداکثر ۸ مگابایت باشد");
    }
    const buffer = file.buffer;
    const signatures: Record<string, boolean> = {
      "image/jpeg": buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
      "image/png": buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      "image/gif": ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString()),
      "image/webp": buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP",
      "video/mp4": buffer.subarray(4, 8).toString() === "ftyp",
      "video/webm": buffer.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])),
    };
    if (!signatures[file.mimetype]) throw new BadRequestException("محتوای فایل با فرمت اعلام‌شده تطابق ندارد");
    await mkdir(this.uploadDirectory, { recursive: true });
    const filename = `${Date.now()}-${randomUUID()}${extensions[file.mimetype]}`;
    const target = path.join(this.uploadDirectory, filename);
    await writeFile(target, file.buffer);

    try {
      const media = await this.prisma.mediaAsset.create({
        data: {
          kind: video ? "VIDEO" : "IMAGE",
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

  async findAll(includeVideo = false) {
    const data = await this.prisma.mediaAsset.findMany({
      where: { kind: { in: includeVideo ? ["IMAGE", "VIDEO"] : ["IMAGE"] } },
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
