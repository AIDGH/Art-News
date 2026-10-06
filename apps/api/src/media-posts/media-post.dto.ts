import { Transform, Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsIn, IsInt, IsOptional, IsString, IsUUID, IsUrl, Max, MaxLength, Min, MinLength } from "class-validator";
import { MediaPostKind } from "../generated/prisma/enums";

export class MediaPostStatusDto {
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status!: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export class SaveMediaPostDto extends MediaPostStatusDto {
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  description?: string | null;

  @Transform(({ value }) => typeof value === "string" ? value.trim() || null : value)
  @IsOptional()
  @IsUrl({ protocols: ["http", "https"], require_protocol: true }, { message: "لینک باید یک آدرس کامل با http یا https باشد." })
  @MaxLength(2000)
  targetUrl?: string | null;

  @IsEnum(MediaPostKind)
  kind!: MediaPostKind;

  @IsUUID()
  coverId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ArrayUnique()
  @IsUUID("all", { each: true })
  mediaIds!: string[];
}

export class MediaPostQueryDto {
  @IsOptional()
  @IsEnum(MediaPostKind)
  kind?: MediaPostKind;

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED", "ARCHIVED"])
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100000)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(30)
  pageSize: number = 12;
}
