import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import bcrypt from "bcryptjs";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";
import sharp from "sharp";
import { PrismaService } from "../prisma/prisma.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Processes user avatar updates, including image transformation and asset cleanup.
   */
  async updateAvatar(userId: string, file: Express.Multer.File) {
    try {
      const dir = join(process.cwd(), "public", "uploads", "avatars", userId);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { avatarUrl: true },
      });

      const filename = `avatar-${Date.now()}.png`;
      const fullPath = join(dir, filename);

      await sharp(file.buffer).png().toFile(fullPath);

      const newPath = `/uploads/avatars/${userId}/${filename}`;

      if (user?.avatarUrl) {
        const oldPath = join(
          process.cwd(),
          "public",
          user.avatarUrl.replace(/^\//, ""),
        );
        if (existsSync(oldPath)) {
          try {
            unlinkSync(oldPath);
          } catch (err) {
            console.warn("Failed to delete old avatar:", err);
          }
        }
      }

      return await this.prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: newPath },
        select: { id: true, avatarUrl: true },
      });
    } catch (err) {
      console.error("Avatar upload failed:", err);
      throw new BadRequestException(
        "profile.messages.errors.updateAvatarFailed",
      );
    }
  }

  /** Retrieves user profile with standardized metadata. */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        birthDate: true,
        gender: true,
        language: true,
        avatarUrl: true,
      },
    });

    if (!user) throw new NotFoundException("common.messages.userNotFound");
    return user;
  }

  /** Persists profile updates including birthDate normalization. */
  async updateProfile(userId: string, data: UpdateProfileDto) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          gender: data.gender,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          birthDate: true,
          gender: true,
        },
      });
    } catch (error) {
      console.error("Profile metadata update failure:", error);
      throw new BadRequestException(
        "profile.messages.errors.updateProfileFailed",
      );
    }
  }

  /** Validates current credentials and updates user password. */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = dto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        "profile.editModal.messages.errors.passwordsDontMatch",
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) throw new UnauthorizedException("common.messages.userNotFound");

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestException(
        "profile.editModal.messages.errors.currentPasswordInvalid",
      );
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException(
        "profile.editModal.messages.errors.passwordMustBeDifferent",
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  }
}
