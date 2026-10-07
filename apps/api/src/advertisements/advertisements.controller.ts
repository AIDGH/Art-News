import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { AdvertisementsService } from "./advertisements.service";
import { AdvertisementQueryDto, CreateAdvertisementDto, UpdateAdvertisementDto } from "./dto/advertisement.dto";
import { DisplayOrderDto } from "../common/display-order.dto";

@Controller("advertisements")
@ApiTags("Advertisements")
export class AdvertisementsController {
  constructor(private readonly ads: AdvertisementsService) {}

  @Get()
  @Header("Cache-Control", "no-store")
  findPublic(@Query() query: AdvertisementQueryDto) { return this.ads.findPublic(query); }
}

@Controller("editorial/advertisements")
@UseGuards(SessionAuthGuard)
@ApiTags("Editorial advertisements")
export class EditorialAdvertisementsController {
  constructor(private readonly ads: AdvertisementsService) {}

  @Get()
  findAll(@Query() query: AdvertisementQueryDto) { return this.ads.findAll(query); }

  @Get("display-order")
  findDisplayOrder() { return this.ads.findDisplayOrder(); }

  @Put("display-order")
  saveDisplayOrder(@Body() dto: DisplayOrderDto) { return this.ads.saveDisplayOrder(dto.ids); }

  @Post()
  create(@Body() dto: CreateAdvertisementDto) { return this.ads.create(dto); }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateAdvertisementDto) { return this.ads.update(id, dto); }

  @Post(":id/activate")
  activate(@Param("id") id: string) { return this.ads.activate(id); }

  @Delete(":id")
  remove(@Param("id") id: string) { return this.ads.remove(id); }
}
