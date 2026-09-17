import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { UpdateSiteSettingsDto } from "./dto/update-site-settings.dto";
import { SiteSettingsService } from "./site-settings.service";

@Controller("editorial/site-settings")
@UseGuards(SessionAuthGuard)
@ApiTags("Editorial site settings")
export class EditorialSiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  @ApiOperation({ summary: "Read site text settings in the editorial panel" })
  find() {
    return this.siteSettingsService.find();
  }

  @Put()
  @ApiOperation({ summary: "Update footer and about-page text" })
  update(@Body() body: UpdateSiteSettingsDto) {
    return this.siteSettingsService.update(body);
  }
}
