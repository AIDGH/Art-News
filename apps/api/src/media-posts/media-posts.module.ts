import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../database/prisma.module";
import { EditorialMediaPostsController, MediaPostsController } from "./media-posts.controller";
import { MediaPostsService } from "./media-posts.service";

@Module({ imports: [AuthModule, PrismaModule], controllers: [MediaPostsController, EditorialMediaPostsController], providers: [MediaPostsService] })
export class MediaPostsModule {}
