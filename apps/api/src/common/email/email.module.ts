import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MailModule } from "../mail/mail.module";
import { EmailProcessor } from "./email.processor";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "email",
    }),
    MailModule,
  ],
  providers: [EmailProcessor],
})
export class EmailModule {}
