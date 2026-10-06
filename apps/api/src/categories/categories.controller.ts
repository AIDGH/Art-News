import { Controller, Get, Param } from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";

@Controller("categories")
@ApiTags("Categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "List public editorial categories" })
  @ApiOkResponse({ description: "Categories with published article counts" })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get("latest")
  @ApiOperation({ summary: "Get the latest published article or media post per category" })
  @ApiOkResponse({ description: "Category cards with covers and publication dates; empty categories are omitted" })
  findLatest() {
    return this.categoriesService.findLatest();
  }

  @Get(":slug/articles")
  @ApiOperation({ summary: "List published articles in a category" })
  @ApiParam({ name: "slug", example: "visual-arts" })
  @ApiOkResponse({ description: "Category and its published articles" })
  @ApiNotFoundResponse({ description: "Category does not exist" })
  findArticles(@Param("slug") slug: string) {
    return this.categoriesService.findArticles(slug);
  }
}
