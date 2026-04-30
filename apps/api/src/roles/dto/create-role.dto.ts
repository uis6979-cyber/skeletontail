import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({
    message: "roles.messages.validations.nameRequired",
  })
  name: string;

  @IsString()
  @IsNotEmpty({
    message: "roles.messages.validations.slugRequired",
  })
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsNotEmpty({
    message: "roles.messages.validations.permissionsRequired",
  })
  permissions?: string[];
}
