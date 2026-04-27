import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
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
