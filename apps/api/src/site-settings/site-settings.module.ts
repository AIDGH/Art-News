import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../database/prisma.module";
import { EditorialSiteSettingsController } from "./editorial-site-settings.controller";
import { SiteSettingsController } from "./site-settings.controller";
import { SiteSettingsService } from "./site-settings.service";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SiteSettingsController, EditorialSiteSettingsController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}
