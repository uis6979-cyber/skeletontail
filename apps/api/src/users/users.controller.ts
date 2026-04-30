import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import { RequirePermissions } from "src/common/decorators/permissions.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/common/guards/permissions.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

/**
 * Administrative controller for managing user accounts and roles.
 */
@Controller("users")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Retrieves all active roles available for user assignment. */
  @Get("roles")
  @RequirePermissions("users.view")
  getRoles() {
    return this.usersService.findAllRoles();
  }

  /** Lists all users in the system. */
  @Get()
  @RequirePermissions("users.view")
  findAll() {
    return this.usersService.findAll();
  }

  /** Retrieves detailed information for a specific user. */
  @Get(":id")
  @RequirePermissions("users.view")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  /** Provisions a new user account. */
  @Post()
  @RequirePermissions("users.create")
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  /** Updates user profile metadata and role associations. */
  @Patch(":id")
  @RequirePermissions("users.edit")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  /** Toggles the account status between active and inactive. */
  @Patch(":id/toggle")
  @RequirePermissions("users.edit")
  toggle(@Param("id") id: string) {
    return this.usersService.toggleStatus(id);
  }

  /** Administrative password override for a specific user. */
  @Patch(":id/password")
  @RequirePermissions("users.edit")
  updatePassword(@Param("id") id: string, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(id, dto);
  }
}
