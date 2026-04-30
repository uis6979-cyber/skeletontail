import { IsNotEmpty, IsString, MinLength } from "class-validator";

/**
 * Data Transfer Object for password change operations.
 * Uses translation keys for validation messages to support cross-stack i18n.
 */
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({
    message: "profile.editModal.messages.errors.currentPasswordRequired",
  })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({
    message: "profile.editModal.messages.errors.newPasswordRequired",
  })
  @MinLength(8, { message: "profile.editModal.messages.errors.newPasswordMin" })
  newPassword: string;

  @IsString()
  @IsNotEmpty({
    message: "profile.editModal.messages.errors.confirmPasswordRequired",
  })
  confirmPassword: string;
}
