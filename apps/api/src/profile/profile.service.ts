import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";
import { PrismaService } from "../prisma/prisma.service";

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string | Date;
  gender?: "male" | "female";
  language?: "en" | "es";
}

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the user avatar and purges the previous asset from storage to prevent stale files.
   */
  async updateAvatar(userId: string, file: Express.Multer.File) {
    try {
      if (!file?.filename) {
        throw new BadRequestException(
          "profile.messages.errors.updateAvatarFailed",
        );
      }

      const newPath = `/uploads/avatars/${userId}/${file.filename}`;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { avatarUrl: true },
      });

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
            console.warn(
              `Legacy avatar cleanup failed for path: ${oldPath}`,
              err,
            );
          }
        }
      }

      return await this.prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: newPath },
        select: { id: true, avatarUrl: true },
      });
    } catch (err) {
      if (err instanceof BadRequestException) throw err;

      console.error("Avatar persistence failure:", err);
      throw new BadRequestException(
        "profile.messages.errors.updateAvatarFailed",
      );
    }
  }

  /**
   * Retrieves profile data. Throws NotFoundException with a localized key if the user record is missing.
   */
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

    if (!user) {
      throw new NotFoundException("common.messages.userNotFound");
    }

    return user;
  }

  /**
   * Updates profile attributes with conditional field handling and birth date normalization.
   */
  async updateProfile(userId: string, data: UpdateProfileData) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          gender: data.gender,
          language: data.language,
          ...(data.birthDate !== undefined && {
            birthDate: data.birthDate ? new Date(data.birthDate) : null,
          }),
        },
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
    } catch (error) {
      console.error("Profile metadata update failure:", error);
      throw new BadRequestException(
        "profile.messages.errors.updateProfileFailed",
      );
    }
  }
}
