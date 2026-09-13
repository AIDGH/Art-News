import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PublicationStatus } from "../../generated/prisma/enums";
import { ArticleSourceDto } from "./article-source.dto";

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(220)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(220)
  @Matches(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u)
  slug!: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(600)
  lead!: string;

  @ApiProperty()
  @IsString()
  @MinLength(20)
  @MaxLength(200000)
  body!: string;

  @ApiProperty()
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  coverImageId?: string;

  @ApiPropertyOptional({ enum: PublicationStatus })
  @IsOptional()
  @IsEnum(PublicationStatus)
  status: PublicationStatus = PublicationStatus.DRAFT;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  publishedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(220)
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(320)
  seoDescription?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  tags: string[] = [];

  @ApiPropertyOptional({ type: [ArticleSourceDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ArticleSourceDto)
  sources: ArticleSourceDto[] = [];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured = false;

  @ApiPropertyOptional({ minimum: 0, maximum: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(20)
  featuredOrder = 0;
}
