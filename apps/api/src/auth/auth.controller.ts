import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

/**
 * Entry point for authentication and session management.
 *
 * Architecture:
 * - Session Persistence: Utilizes HTTP-only cookies for JWT storage to mitigate XSS.
 * - Logic Delegation: Orchestrates identity flows through the AuthService.
 */
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Validates credentials and establishes a secure session cookie.
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(dto);
    const token = await this.authService.generateToken(user);

    // Configure cookie with strict security defaults
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Enable only over HTTPS
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });

    return { user };
  }

  /**
   * Processes user registration.
   */
  @Post("register")
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  /**
   * Initiates the password recovery workflow.
   */
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.sendForgotPassword(body.email);
  }

  /**
   * Finalizes password reset using a secure token.
   */
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body);
  }

  /**
   * Invalidates the user session by clearing the auth cookie.
   */
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", {
      path: "/",
    });
    return {
      success: true,
      message: "login.messages.success.logoutSuccessful",
    };
  }
}
