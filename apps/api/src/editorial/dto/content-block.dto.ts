import { ArrayMaxSize, IsArray, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { ContentBlockKind } from "../../generated/prisma/enums";

export class ContentBlockDto {
  @IsEnum(ContentBlockKind)
  kind!: ContentBlockKind;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  text?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(7)
  @IsUUID(undefined, { each: true })
  mediaIds?: string[];
}
