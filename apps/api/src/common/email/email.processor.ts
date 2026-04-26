import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { MailService } from "../mail/mail.service";

@Processor("email")
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(
    job: Job<{ email: string; token: string }, void, string>,
  ): Promise<void> {
    const { email, token } = job.data;

    if (job.name === "reset-password") {
      await this.mailService.sendForgotPassword(email, token);
    }
  }
}
