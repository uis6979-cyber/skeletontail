import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { MailService } from "src/common/mail/mail.service";

/**
 * Background worker for processing email-related jobs.
 * Decouples SMTP interactions from the main request-response cycle.
 */
@Processor("email")
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  // The MailService dependency is implicitly injected by NestJS.
  constructor(private readonly mailService: MailService) {
    super();
  }

  /**
   * Orchestrates job processing based on job name.
   */
  async process(job: Job<{ email: string; token: string }>): Promise<void> {
    switch (job.name) {
      case "reset-password":
        await this.handleResetPassword(job.data);
        break;
      default:
        this.logger.warn(`Received unhandled job type: ${job.name}`);
    }
  }

  private async handleResetPassword(data: {
    email: string;
    token: string;
  }): Promise<void> {
    try {
      await this.mailService.sendForgotPassword(data.email, data.token);
      this.logger.log(
        `Successfully sent reset password email to: ${data.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process reset password email for ${data.email}`,
        error.stack,
      );
      throw error; // Re-throw to trigger BullMQ retry logic
    }
  }
}
