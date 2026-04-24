import { InjectQueue } from "@nestjs/bullmq";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { Queue } from "bullmq";
import { randomUUID } from "crypto";
import * as jwt from "jsonwebtoken";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

/**
 * Handles authentication business logic including session management,
 * user registration, and secure password recovery workflows.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    @InjectQueue("email") private readonly emailQueue: Queue,
  ) {}

  /**
   * Authenticates user and returns base identity for token generation.
   */
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException("login.messages.errors.userNotFound");
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException("login.messages.errors.invalidPassword");
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  async register(dto: RegisterDto) {
    /**
     * Registers a new user.
     * Enforces email uniqueness and secures credentials.
     */
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException("signup.messages.errors.emailAlreadyExists");
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  /**
   * Orchestrates the password recovery initiation.
   * Generates a short-lived secure token and offloads email delivery to the queue.
   */
  async sendForgotPassword(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        // Security: Avoid leaking user existence to mitigate enumeration attacks
        throw new UnauthorizedException(
          "resetPassword.messages.errors.userNotFound",
        );
      }

      const token = randomUUID();

      // Persistence: 15-minute TTL for recovery tokens
      await this.prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 15),
        },
      });

      // Asynchronous Processing: Queue the email job
      const job = await this.emailQueue.add(
        "reset-password",
        {
          email,
          token,
        },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 1000 },
        },
      );

      this.logger.log(
        `Password reset email queued for ${email}, Job ID: ${job.id}`,
      this.logger.log(`Reset email queued for ${email} [Job: ${job.id}]`);

      return {
        success: true,
        message: "resetPassword.messages.success.resetEmailSent",
        jobId: job.id,
      };
    } catch (error) {
      this.logger.error(`Reset email queueing failed: ${error.message}`);
      throw new BadRequestException(
        "resetPassword.messages.errors.failedToSendResetEmail",
      );
    }
  }

  /**
   * Finalizes the password reset using the provided recovery token.
   * Implements strict validation for token usage and expiry.
   */
  async resetPassword(dto: {
    token: string;
    password: string;
    confirmPassword: string;
  }) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException(
        "resetPassword.messages.errors.passwordsDontMatch",
      );
    }

    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
      include: { user: true },
    });

    if (!record) {
      throw new BadRequestException("resetPassword.messages.errors.invalidToken");
    }

    if (record.used) {
      throw new BadRequestException(
        "resetPassword.messages.errors.tokenAlreadyUsed",
      );
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException(
        "resetPassword.messages.errors.tokenExpired",
      );
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    // Atomically update user and invalidate token
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { password: hashed },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { used: true },
      }),
    ]);

    return { message: "resetPassword.messages.success.passwordUpdated" };
  }

  /**
   * Generates a JWT for the authenticated user session.
   */
  async generateToken(user: any) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );
  }
}
