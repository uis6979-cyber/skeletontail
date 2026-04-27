import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RolesService } from "./roles.service";

@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get("permissions")
  async getPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  /**
   * Toggles the active status of a specific role.
   */
  @Patch(":id/toggle")
  async toggle(@Param("id") id: string) {
    return this.rolesService.toggleStatus(id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.rolesService.remove(id);
  }
}
