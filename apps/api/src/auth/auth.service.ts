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
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

/**
 * AuthService
 *
 * Orchestrates all authentication-related business logic, including user registration,
 * login, and password recovery. It interacts with the database via Prisma,
 * manages password hashing, and queues email notifications.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    @InjectQueue("email") private emailQueue: Queue,
  ) {}

  async login(dto: LoginDto) {
    /**
     * Authenticates a user with provided credentials.
     * Throws UnauthorizedException if user not found or password invalid.
     */
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException("messages.errors.userNotFound");
    }

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException("messages.errors.invalidPassword");
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  async register(dto: RegisterDto) {
    /**
     * Registers a new user.
     * Throws ConflictException if email already exists.
     */
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException("messages.errors.emailAlreadyExists");
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
   * Initiates the password recovery process.
   * Generates a reset token, stores it, and queues an email for the user.
   * @param email The email of the user requesting a password reset.
   */
  async sendForgotPassword(email: string) {
    try {
      this.logger.log(`Received password reset request for email: ${email}`);

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Using UnauthorizedException for security reasons to avoid leaking user existence
        throw new UnauthorizedException(
          "resetPassword.messages.errors.userNotFound",
        );
      }

      // Generate a unique, cryptographically secure token
      const token = randomUUID();

      // Store the token in the database with an expiration time
      await this.prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 15), // Token valid for 15 minutes
        },
      });

      // Add an email job to the queue for asynchronous processing
      const job = await this.emailQueue.add("reset-password", {
        email,
        token,
      });

      this.logger.log(
        `Password reset email queued for ${email}, Job ID: ${job.id}`,
      );
      return {
        success: true,
        message: "resetPassword.messages.success.resetEmailQueued",
        jobId: job.id,
      };
    } catch (error) {
      this.logger.error(
        `Failed to queue reset email for ${email}: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        "resetPassword.messages.errors.failedToSendResetEmail",
      );
    }
  }

  /**
   * Resets a user's password using a valid token.
   * @param dto Contains the token, new password, and confirmation.
   * Throws BadRequestException for invalid/expired tokens or password mismatch.
   */
  async resetPassword(dto: {
    token: string;
    password: string;
    confirmPassword: string;
  }) {
    // Client-side validation should ideally prevent this, but backend must re-validate
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException(
        "resetPassword.messages.errors.passwordsDontMatch",
      );
    }

    // Retrieve the reset token record and associated user
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
      include: { user: true },
    });

    if (!record) {
      throw new BadRequestException("Invalid token");
    }

    // Check if the token has already been used
    if (record.used) {
      throw new BadRequestException(
        "resetPassword.messages.errors.tokenAlreadyUsed",
      );
    }

    // Check if the token has expired
    if (record.expiresAt < new Date()) {
      throw new BadRequestException(
        "resetPassword.messages.errors.tokenExpired",
      );
    }

    // Hash the new password before updating
    const hashed = await bcrypt.hash(dto.password, 10);

    // Update the user's password
    await this.prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    });

    // Mark the token as used to prevent replay attacks
    await this.prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    return { message: "resetPassword.messages.success.passwordUpdated" };
  }
}
