import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./jwt-payload.interface";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(dto);
    const token = await this.authService.generateToken(user);

    /**
     * Store JWT in HttpOnly cookie to mitigate XSS risks.
     * Production environments enforce the 'secure' flag for HTTPS-only transmission.
     */
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { user };
  }

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.sendForgotPassword(body.email);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body() body: { token: string; password: string; confirmPassword: string },
  ) {
    return this.authService.resetPassword(body);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: { user: JwtPayload }) {
    return req.user;
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", { path: "/" });

    return {
      success: true,
      message: "login.messages.success.logoutSuccessful",
    };
  }
}
