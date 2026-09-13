import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class ArticleSourceDto {
  @ApiProperty()
  @IsUrl({ require_protocol: true })
  @MaxLength(1000)
  url!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(240)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  publisher?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  author?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  publishedAt?: string;
}
