import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

/**
 * Administrative controller for managing user accounts and roles.
 */
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Retrieves all active roles available for user assignment. */
  @Get("roles")
  getRoles() {
    return this.usersService.findAllRoles();
  }

  /** Lists all users in the system. */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /** Retrieves detailed information for a specific user. */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  /** Provisions a new user account. */
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  /** Updates user profile metadata and role associations. */
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  /** Toggles the account status between active and inactive. */
  @Patch(":id/toggle")
  toggle(@Param("id") id: string) {
    return this.usersService.toggleStatus(id);
  }

  /** Permanently deletes a user record. */
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  /** Administrative password override for a specific user. */
  @Patch(":id/password")
  updatePassword(@Param("id") id: string, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(id, dto);
  }
}
