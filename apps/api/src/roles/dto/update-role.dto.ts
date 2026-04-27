import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateRoleDto {
  @IsString({ message: "roles.form.name" })
  @IsNotEmpty({ message: "messages.validations.nameRequired" })
  name: string;

  @IsString({ message: "roles.form.slug" })
  @IsNotEmpty({ message: "messages.validations.slugRequired" })
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  permissions?: string[];
}
