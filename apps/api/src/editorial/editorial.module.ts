import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../database/prisma.module";
import { EditorialArticlesController } from "./editorial-articles.controller";
import { EditorialArticlesService } from "./editorial-articles.service";
import { EditorialCategoriesController } from "./editorial-categories.controller";
import { EditorialCategoriesService } from "./editorial-categories.service";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    EditorialArticlesController,
    EditorialCategoriesController,
    MediaController,
  ],
  providers: [EditorialArticlesService, EditorialCategoriesService, MediaService],
})
export class EditorialModule {}
