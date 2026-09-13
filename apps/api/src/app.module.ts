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
  ],
})
export class AppModule {}
