import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
/**
 * Authentication Controller
 *
 * Architecture:
 * - Entry Point: Handles incoming HTTP traffic for auth-related operations.
 * - Business Logic Decoupling: Acts as a thin layer that delegates tasks to the AuthService.
 * - Data Integrity: Uses DTOs (Data Transfer Objects) to enforce strict request schemas.
 */
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * Process user login credentials.
   * Reached by frontend hooks like `useAuth` via POST /auth/login.
   */
  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
  /**
   * Handle new user creation.
   * Consumes registration data validated by RegisterDto.
   */
  @Post("register")
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post("forgot-password")
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.sendForgotPassword(body.email);
  }

  @Post("reset-password")
  resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body);
  }
}
