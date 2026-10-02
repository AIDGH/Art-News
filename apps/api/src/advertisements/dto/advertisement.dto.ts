import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsISO8601, IsOptional, IsString, IsUUID, IsUrl, Max, MaxLength, Min, MinLength, IsIn } from "class-validator";
import { AdvertisementPlacement } from "../../generated/prisma/enums";

export class CreateAdvertisementDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @IsUUID()
  mediaId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1200)
  text?: string | null;

  @IsOptional()
  @IsUrl({ protocols: ["http", "https"], require_protocol: true })
  @MaxLength(2000)
  targetUrl?: string | null;

  @IsOptional()
  @IsEnum(AdvertisementPlacement)
  placement?: AdvertisementPlacement;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsISO8601()
  startsAt?: string | null;

  @IsOptional()
  @IsISO8601()
  endsAt?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1000)
  displayOrder?: number;
}

export class UpdateAdvertisementDto extends PartialType(CreateAdvertisementDto) {}

export class AdvertisementQueryDto {
  @IsOptional()
  @IsEnum(AdvertisementPlacement)
  placement?: AdvertisementPlacement;

  @IsOptional()
  @IsIn(["active", "inactive"])
  status?: "active" | "inactive";
}
