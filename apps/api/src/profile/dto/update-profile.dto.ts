import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

/**
 * Data Transfer Object for profile updates. Validation messages use i18n keys for consistent localization.
 */
export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty({
    message: "profile.editModal.messages.errors.firstNameRequired",
  })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: "profile.editModal.messages.errors.lastNameRequired" })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: "profile.editModal.messages.errors.phoneRequired" })
  phone: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: "profile.editModal.messages.errors.birthDateInvalid" },
  )
  birthDate?: string;

  @IsString()
  @IsNotEmpty({ message: "profile.editModal.messages.errors.genderRequired" })
  @IsIn(["male", "female"], {
    message: "profile.editModal.messages.errors.genderInvalid",
  })
  gender: "male" | "female";
}
