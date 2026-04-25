import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  imports: [PrismaModule],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
