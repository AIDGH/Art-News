import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { UpdateMediaDto } from "./dto/update-media.dto";
import { MediaService } from "./media.service";

type UploadedImage = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

@Controller("editorial/media")
@UseGuards(SessionAuthGuard)
@ApiTags("Editorial media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOperation({ summary: "List recent editorial images" })
  findAll() {
    return this.mediaService.findAll();
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update editorial image metadata" })
  updateMetadata(
    @Param("id") id: string,
    @Body() body: UpdateMediaDto,
  ) {
    return this.mediaService.updateMetadata(id, body);
  }

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload an editorial image" })
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 8 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        const isAllowed = allowed.includes(file.mimetype);
        callback(
          isAllowed
            ? null
            : new BadRequestException("فرمت تصویر پشتیبانی نمی‌شود"),
          isAllowed,
        );
      },
    }),
  )
  upload(
    @UploadedFile() file: UploadedImage | undefined,
    @Body("alt") alt?: string,
    @Body("credit") credit?: string,
  ) {
    if (!file) throw new BadRequestException("فایل تصویر الزامی است");
    return this.mediaService.uploadImage(file, alt, credit);
  }
}
