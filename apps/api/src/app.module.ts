import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ArticlesModule } from "./articles/articles.module";
import { CategoriesModule } from "./categories/categories.module";
import { AuthModule } from "./auth/auth.module";
import {
  environmentFilePaths,
  environmentValidationSchema,
} from "./config/environment";
import { HealthModule } from "./health/health.module";
import { EditorialModule } from "./editorial/editorial.module";
import { SiteSettingsModule } from "./site-settings/site-settings.module";
import { EngagementModule } from "./engagement/engagement.module";
import { AdvertisementsModule } from "./advertisements/advertisements.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: environmentFilePaths,
      validationSchema: environmentValidationSchema,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),
    HealthModule,
    AuthModule,
    ArticlesModule,
    CategoriesModule,
    EditorialModule,
    SiteSettingsModule,
    EngagementModule,
    AdvertisementsModule,
  ],
})
export class AppModule {}
