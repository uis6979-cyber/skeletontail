import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./common/email/email.module";
import { MailModule } from "./common/mail/mail.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProfileModule } from "./profile/profile.module";
import { RolesModule } from "./roles/roles.module";
import { UsersModule } from "./users/users.module";
/**
 * Root application module.
 * Orchestrates the main components and imports feature modules.
 */
@Module({
  controllers: [AppController],
  imports: [
    BullModule.forRoot({
      connection: {
        host: "localhost",
        port: 6379,
      },
    }),

    AuthModule,
    UsersModule,
    PrismaModule,
    EmailModule,
    MailModule,
    ProfileModule,
    RolesModule,
  ],
})
export class AppModule {}
