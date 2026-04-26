import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  /**
   * Persists the new avatar path for a specific user.
   */
  async updateAvatar(userId: string, file: Express.Multer.File) {
    const avatarUrl = `/uploads/avatars/${file.filename}`;

    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });
  }

  /**
   * Retrieves complete profile data for the authenticated user.
   * Throws a 404 with an i18n key if the user record is missing.
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
}
