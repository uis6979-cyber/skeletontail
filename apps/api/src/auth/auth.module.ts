import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
/**
 * Authentication Module
 *
 * Architecture:
 * - Orchestration Layer: Centralizes auth logic, controllers, and providers.
 * - Dependency Management: Imports UsersModule to interact with user identity data.
 * - Integration: Provides the underlying API services that the frontend "useAuth" hook
 *   and service layer consume.
 */
@Module({
  // External modules required for auth logic (e.g., database access via UsersModule)
  imports: [
    BullModule.registerQueue({
      name: "email",
    }),
    UsersModule,
  ], // Provides User-related data access
  controllers: [AuthController], // Exposes authentication endpoints
  providers: [AuthService], // Encapsulates authentication business logic
  exports: [AuthService], // Allows AuthService to be used by other modules (e.g., for Guards)
})
export class AuthModule {}
