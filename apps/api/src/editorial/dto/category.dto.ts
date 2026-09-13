import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Matches, MaxLength, Min } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  title!: string;

  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder = 0;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
