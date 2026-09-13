import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SessionAuthGuard, type EditorialRequest } from "../auth/session-auth.guard";
import { CreateArticleDto } from "./dto/create-article.dto";
import { EditorialArticleQueryDto } from "./dto/editorial-article-query.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { EditorialArticlesService } from "./editorial-articles.service";

@Controller("editorial/articles")
@UseGuards(SessionAuthGuard)
@ApiTags("Editorial articles")
export class EditorialArticlesController {
  constructor(private readonly articlesService: EditorialArticlesService) {}

  @Get()
  @ApiOperation({ summary: "List all editorial articles" })
  findAll(@Query() query: EditorialArticleQueryDto) {
    return this.articlesService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an article for editing" })
  findOne(@Param("id") id: string) {
    return this.articlesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create an editorial article" })
  create(@Body() body: CreateArticleDto, @Req() request: EditorialRequest) {
    return this.articlesService.create(body, request.editorialUser);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an editorial article" })
  update(@Param("id") id: string, @Body() body: UpdateArticleDto) {
    return this.articlesService.update(id, body);
  }

  @Post(":id/archive")
  @ApiOperation({ summary: "Archive an article" })
  archive(@Param("id") id: string) {
    return this.articlesService.archive(id);
  }
}
