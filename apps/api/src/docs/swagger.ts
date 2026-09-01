import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { EnvironmentVariables } from "../config/environment";

export function configureSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  if (!configService.get("SWAGGER_ENABLED", { infer: true })) return;

  const config = new DocumentBuilder()
    .setTitle("Art News API")
    .setDescription("Public and editorial API for the Art News platform.")
    .setVersion("1.0")
    .addTag("Health", "API readiness")
    .addTag("Articles", "Published article discovery")
    .addTag("Categories", "Public editorial categories")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, documentFactory, {
    jsonDocumentUrl: "api/docs-json",
    customSiteTitle: "Art News API Docs",
  });
}
