import { IsEmail, IsNotEmpty, IsString } from "class-validator";

/**
 * LoginDto
 * Data Transfer Object for user login. Enforces validation rules
 * and provides i18n keys for client-side error mapping.
 */
export class LoginDto {
  @IsEmail({}, { message: "login.messages.errors.emailInvalid" })
  @IsNotEmpty({ message: "login.messages.errors.emailRequired" })
  email: string;

  @IsString({ message: "login.messages.errors.passwordRequired" }) // Ensure it's a string
  @IsNotEmpty({ message: "login.messages.errors.passwordRequired" })
  password: string;
}
