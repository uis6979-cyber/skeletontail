import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { MailService } from "../mail/mail.service";

@Processor("email")
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();

    console.log("🔥 WORKER STARTED");
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log("📩 PROCESSING JOB:", job.data);

    if (job.name === "reset-password") {
      await this.mailService.sendForgotPassword(job.data.email, job.data.token);

      console.log("✅ EMAIL SENT TO:", job.data.email);
    }
  }
}
