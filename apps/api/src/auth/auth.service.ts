import { InjectQueue } from "@nestjs/bullmq";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Queue } from "bullmq";
import { randomUUID } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @InjectQueue("email") private readonly emailQueue: Queue,
  ) {}

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
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException("signup.messages.errors.emailAlreadyExists");
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const role = await this.prisma.role.findUnique({
      where: { slug: "user" },
    });

    if (!role) {
      this.logger.error("Default role 'user' missing from database");
      throw new InternalServerErrorException("common.messages.error");
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        firstName: dto.firstName,
        lastName: dto.lastName,

        roles: {
          create: [
            {
              role: {
                connect: { id: role.id },
              },
            },
          ],
        },
      },
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  async sendForgotPassword(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new UnauthorizedException(
          "resetPassword.messages.errors.userNotFound",
        );
      }

      const token = randomUUID();

      // Recovery tokens default to a 15-minute expiration window
      await this.prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 15),
          used: false,
        },
      });

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

      this.logger.log(`Reset email queued for ${email} [Job: ${job.id}]`);

      return {
        success: true,
        message: "resetPassword.messages.success.resetEmailSent",
        jobId: job.id,
      };
    } catch (error) {
      this.logger.error(
        `Failed to queue reset email for ${email}: ${error.message}`,
      );
      throw new BadRequestException(
        "resetPassword.messages.errors.failedToSendResetEmail",
      );
    }
  }

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
      throw new BadRequestException(
        "resetPassword.messages.errors.invalidToken",
      );
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

    // Perform atomic update to ensure user password change and token invalidation are synchronized
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

  async generateToken(user: { id: string; email: string }): Promise<string> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const roles = userRoles.map((r) => r.role.slug);

    const permissions = userRoles.flatMap((r) =>
      r.role.permissions.map((p) => p.permission.slug),
    );

    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      roles,
      permissions,
    });
  }
}
