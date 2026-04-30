import { IsNotEmpty, IsString, MinLength } from "class-validator";

/**
 * Data Transfer Object for administrative user password updates.
 */
export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({
    message: "users.messages.validations.passwordRequired",
  })
  @MinLength(8, {
    message: "users.messages.validations.passwordMinLength",
  })
  password: string;

  @IsString()
  @IsNotEmpty({
    message: "users.messages.validations.confirmPasswordRequired",
  })
  @MinLength(8, {
    message: "users.messages.validations.confirmPasswordMinLength",
  })
  confirmPassword: string;
}
