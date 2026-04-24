import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

/**
 * RegisterDto
 * Data Transfer Object for user registration. Enforces validation rules
 * and provides i18n keys for client-side error mapping.
 */
export class RegisterDto {
  @IsEmail({}, { message: "signup.messages.errors.emailInvalid" })
  @IsNotEmpty({ message: "signup.messages.errors.emailRequired" })
  email: string;

  @IsString({ message: "signup.messages.errors.passwordRequired" }) // Ensure it's a string
  @MinLength(6, { message: "signup.messages.errors.passwordMinLength" })
  @IsNotEmpty({ message: "signup.messages.errors.passwordRequired" })
  password: string;

  @IsString({ message: "signup.messages.errors.firstNameRequired" }) // Ensure it's a string
  @IsNotEmpty({ message: "signup.messages.errors.firstNameRequired" })
  firstName: string;

  @IsString({ message: "signup.messages.errors.lastNameRequired" }) // Ensure it's a string
  @IsNotEmpty({ message: "signup.messages.errors.lastNameRequired" })
  lastName: string;
}
