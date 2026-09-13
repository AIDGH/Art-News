import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  alt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  credit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(600)
  caption?: string;
}
