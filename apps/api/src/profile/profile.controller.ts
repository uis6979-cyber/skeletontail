import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtPayload } from "../auth/jwt-payload.interface";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import type { UpdateProfileData } from "./profile.service";
import { ProfileService } from "./profile.service";
import { avatarStorage } from "./storage";

@Controller("profile")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req: { user: JwtPayload }) {
    return this.profileService.getProfile(req.user.sub);
  }

  /**
   * Handles user avatar updates with a 2MB limit and local disk persistence.
   */
  @Patch("avatar")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: avatarStorage,
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async updateAvatar(
    @Req() req: { user: JwtPayload },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("profile.messages.errors.noFileReceived");
    }

    return this.profileService.updateAvatar(req.user.sub, file);
  }

  @Patch()
  async updateProfile(
    @Req() req: { user: JwtPayload },
    @Body() body: UpdateProfileData,
  ) {
    return this.profileService.updateProfile(req.user.sub, body);
  }
}
