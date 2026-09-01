import { Controller, Get, Param, Query } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { ArticlesService } from "./articles.service";
import { ArticleQueryDto } from "./dto/article-query.dto";

@Controller("articles")
@ApiTags("Articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: "List published articles" })
  @ApiOkResponse({ description: "Paginated public articles" })
  @ApiBadRequestResponse({ description: "Invalid query parameters" })
  findAll(@Query() query: ArticleQueryDto) {
    return this.articlesService.findAll(query);
  }

  @Get(":slug")
  @ApiOperation({ summary: "Get a published article by slug" })
  @ApiParam({ name: "slug", example: "an-art-news-story" })
  @ApiOkResponse({ description: "Published article detail" })
  @ApiNotFoundResponse({ description: "Article is missing or not public" })
  findBySlug(@Param("slug") slug: string) {
    return this.articlesService.findBySlug(slug);
  }
}
