import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";

export class ArticleQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: "Filter by category slug" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  category?: string;

  @ApiPropertyOptional({ description: "Search article title and lead" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  query?: string;
}
