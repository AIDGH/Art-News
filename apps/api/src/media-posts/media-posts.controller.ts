import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { MediaPostQueryDto, MediaPostStatusDto, SaveMediaPostDto } from "./media-post.dto";
import { MediaPostsService } from "./media-posts.service";

@Controller("media-posts")
export class MediaPostsController {
  constructor(private readonly posts: MediaPostsService) {}
  @Get()
  @Header("Cache-Control", "no-store")
  list(@Query() query: MediaPostQueryDto) { return this.posts.list(query, true); }

  @Get(":id")
  @Header("Cache-Control", "no-store")
  async getOne(@Param("id") id: string) {
    const post = await this.posts.findOnePublic(id);
    return { data: post };
  }
}

@Controller("editorial/media-posts")
@UseGuards(SessionAuthGuard)
export class EditorialMediaPostsController {
  constructor(private readonly posts: MediaPostsService) {}
  @Get()
  list(@Query() query: MediaPostQueryDto) { return this.posts.list(query); }
  @Post()
  create(@Body() dto: SaveMediaPostDto) { return this.posts.save(dto); }
  @Put(":id")
  update(@Param("id") id: string, @Body() dto: SaveMediaPostDto) { return this.posts.save(dto, id); }
  @Patch(":id/status")
  status(@Param("id") id: string, @Body() dto: MediaPostStatusDto) { return this.posts.setStatus(id, dto); }
  @Delete(":id")
  remove(@Param("id") id: string) { return this.posts.remove(id); }
}
