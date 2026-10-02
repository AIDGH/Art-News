import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  @ApiOperation({ summary: "List recent images, optionally including advertising videos" })
  findAll(@Query("includeVideo") includeVideo?: string) {
    return this.mediaService.findAll(includeVideo === "true");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update media metadata" })
  updateMetadata(
    @Param("id") id: string,
    @Body() body: UpdateMediaDto,
  ) {
    return this.mediaService.updateMetadata(id, body);
  }

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload an image, GIF, or advertising video" })
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 30 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];
        const isAllowed = allowed.includes(file.mimetype);
        callback(
          isAllowed
            ? null
            : new BadRequestException("فرمت فایل پشتیبانی نمی‌شود"),
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
    if (!file) throw new BadRequestException("فایل رسانه الزامی است");
    return this.mediaService.uploadImage(file, alt, credit);
  }
}
