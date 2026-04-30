import { Gender } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: "users.messages.validations.firstNameRequired",
  })
  firstName: string;

  @IsString()
  @IsNotEmpty({
    message: "users.messages.validations.lastNameRequired",
  })
  lastName: string;

  @IsEmail(
    {},
    {
      message: "users.messages.validations.invalidEmail",
    },
  )
  @IsNotEmpty({
    message: "users.messages.validations.emailRequired",
  })
  email: string;

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

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsEnum(Gender, {
    message: "users.messages.validations.invalidGender",
  })
  gender?: Gender;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
