import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../database/prisma.module";
import { EditorialCommentsController, EngagementController } from "./engagement.controller";
import { EngagementService } from "./engagement.service";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [EngagementController, EditorialCommentsController],
  providers: [EngagementService],
})
export class EngagementModule {}
