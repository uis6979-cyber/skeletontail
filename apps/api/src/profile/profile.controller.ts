import {
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
import { ProfileService } from "./profile.service";
import { avatarStorage } from "./storage";

@Controller("profile")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Req() req: { user: JwtPayload }) {
    return this.profileService.getProfile(req.user.sub);
  }

  /**
   * Updates the user's avatar.
   * File size is restricted to 2MB.
   */
  @Patch("avatar")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: avatarStorage,
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  updateAvatar(
    @Req() req: { user: JwtPayload },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.updateAvatar(req.user.sub, file);
  }
}
