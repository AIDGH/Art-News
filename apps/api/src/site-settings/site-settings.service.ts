import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import type { UpdateSiteSettingsDto } from "./dto/update-site-settings.dto";
import {
  DEFAULT_SITE_SETTINGS,
  SITE_SETTINGS_ID,
} from "./site-settings.constants";

@Injectable()
export class SiteSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async find() {
    const settings = await this.prisma.siteSettings.findUnique({
      where: { id: SITE_SETTINGS_ID },
      select: { footerDescription: true, aboutBody: true, updatedAt: true },
    });

    return { data: settings ?? { ...DEFAULT_SITE_SETTINGS, updatedAt: null } };
  }

  async update(dto: UpdateSiteSettingsDto) {
    const data = {
      footerDescription: dto.footerDescription.trim(),
      aboutBody: dto.aboutBody.trim(),
    };
    const settings = await this.prisma.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      update: data,
      create: { id: SITE_SETTINGS_ID, ...data },
      select: { footerDescription: true, aboutBody: true, updatedAt: true },
    });

    return { data: settings };
  }
}
