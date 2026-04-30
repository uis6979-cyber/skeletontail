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
import { memoryStorage } from "multer";
import { JwtPayload } from "../auth/jwt-payload.interface";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileService } from "./profile.service";

@Controller("profile")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Req() req: { user: JwtPayload }) {
    return this.profileService.getProfile(req.user.sub);
  }

  /**
   * Updates user avatar (Max size 2MB).
   */
  @Patch("avatar")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
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
  updateProfile(
    @Req() req: { user: JwtPayload },
    @Body() body: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(req.user.sub, body);
  }

  @Patch("change-password")
  changePassword(
    @Req() req: { user: JwtPayload },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.profileService.changePassword(req.user.sub, dto);
  }
}
