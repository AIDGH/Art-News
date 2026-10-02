import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../database/prisma.module";
import { AdvertisementsController, EditorialAdvertisementsController } from "./advertisements.controller";
import { AdvertisementsService } from "./advertisements.service";

@Module({ imports: [PrismaModule, AuthModule], controllers: [AdvertisementsController, EditorialAdvertisementsController], providers: [AdvertisementsService] })
export class AdvertisementsModule {}
