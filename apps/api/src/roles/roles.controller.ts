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
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RolesService } from "./roles.service";

@Controller("roles")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get("permissions")
  @RequirePermissions("roles.view")
  async getPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Get()
  @RequirePermissions("roles.view")
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(":id")
  @RequirePermissions("roles.view")
  async findOne(@Param("id") id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @RequirePermissions("roles.create")
  async create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Patch(":id")
  @RequirePermissions("roles.edit")
  async update(@Param("id") id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  /**
   * Toggles the active status of a specific role.
   */
  @Patch(":id/toggle")
  @RequirePermissions("roles.edit")
  async toggle(@Param("id") id: string) {
    return this.rolesService.toggleStatus(id);
  }
}
