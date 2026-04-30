import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import bcrypt from "bcryptjs";
import { handlePrismaError } from "../common/utils/prisma-error.util";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Retrieves all users with their assigned roles.
   */
  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        roles: { select: { roleId: true } },
      },
    });
  }

  /**
   * Retrieves a single user by ID.
   * Normalizes avatar URLs and flattens role associations for the UI.
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: { select: { roleId: true } },
      },
    });

    if (!user) {
      throw new NotFoundException("common.messages.userNotFound");
    }

    if (user.avatarUrl && !user.avatarUrl.startsWith("http")) {
      user.avatarUrl = `${API_URL}${user.avatarUrl}`;
    }

    return {
      ...user,
      roles: user.roles.map((r) => r.roleId),
    };
  }

  /** Provisions a new user account and handles initial role assignment. */
  async create(dto: CreateUserDto) {
    try {
      const { roles, confirmPassword, birthDate, ...userData } = dto;

      if (dto.password !== confirmPassword) {
        throw new BadRequestException([
          {
            field: "confirmPassword",
            message: "users.messages.validations.passwordsDontMatch",
          },
        ]);
      }

      return await this.prisma.user.create({
        data: {
          ...userData,
          birthDate: birthDate ? new Date(birthDate) : null,
          isActive: dto.isActive ?? true,
          roles: roles?.length
            ? {
                create: roles.map((roleId) => ({ roleId })),
              }
            : undefined,
        },
        include: { roles: true },
      });
    } catch (error: any) {
      handlePrismaError(error, "users.messages.validations");
      throw error;
    }
  }

  /** Updates user metadata and synchronizes role associations. */
  async update(id: string, dto: UpdateUserDto) {
    try {
      await this.findOne(id);

      const { roles, birthDate, ...userData } = dto;

      const cleanData = Object.fromEntries(
        Object.entries({
          ...userData,
          birthDate: birthDate ? new Date(birthDate) : undefined,
        }).filter(([_, v]) => v !== undefined),
      );

      return await this.prisma.user.update({
        where: { id },
        data: {
          ...cleanData,
          roles: roles?.length
            ? {
                deleteMany: {},
                create: roles.map((roleId) => ({ roleId })),
              }
            : undefined,
        },
        include: { roles: true },
      });
    } catch (error: any) {
      handlePrismaError(error, "users.messages.validations");
      throw error;
    }
  }

  /** Toggles the account status between active and inactive. */
  async toggleStatus(id: string) {
    try {
      const user = await this.findOne(id);

      return this.prisma.user.update({
        where: { id },
        data: {
          isActive: !user.isActive,
        },
      });
    } catch (error: any) {
      handlePrismaError(error, "users.messages.validations");
      throw error;
    }
  }

  /** Permanently deletes a user record. */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }

  /** Fetches active roles available for user assignment. */
  async findAllRoles() {
    return this.prisma.role.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  /** Updates a user's password with hashing. */
  async updatePassword(id: string, dto: UpdatePasswordDto) {
    try {
      await this.findOne(id);

      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException([
          {
            field: "confirmPassword",
            message: "users.messages.validations.passwordMismatch",
          },
        ]);
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      return await this.prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });
    } catch (error: any) {
      handlePrismaError(error, "users.messages.validations");
      throw error;
    }
  }
}
