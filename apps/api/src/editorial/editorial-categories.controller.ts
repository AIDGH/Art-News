import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { EditorialCategoriesService } from "./editorial-categories.service";

@Controller("editorial/categories")
@UseGuards(SessionAuthGuard)
@ApiTags("Editorial categories")
export class EditorialCategoriesController {
  constructor(private readonly categoriesService: EditorialCategoriesService) {}

  @Get()
  @ApiOperation({ summary: "List categories for the editorial panel" })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: "Create an editorial category" })
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an editorial category" })
  update(@Param("id") id: string, @Body() body: UpdateCategoryDto) {
    return this.categoriesService.update(id, body);
  }
}
