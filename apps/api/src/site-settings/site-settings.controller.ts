import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SiteSettingsService } from "./site-settings.service";

@Controller("site-settings")
@ApiTags("Site settings")
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  @ApiOperation({ summary: "Read public site text settings" })
  find() {
    return this.siteSettingsService.find();
  }
}
