import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Retrieves a single role by ID.
   * Throws localized NotFoundException if the record does not exist.
   */
  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          select: {
            permissionId: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException("roles.messages.errors.roleNotFound");
    }

    return {
      ...role,
      permissions: role.permissions.map((p) => p.permissionId),
    };
  }
  /**
   * Provisions a new role along with its initial permission mappings.
   */
  async create(dto: CreateRoleDto) {
    const { permissions, ...roleData } = dto;

    return this.prisma.role.create({
      data: {
        ...roleData,
        isActive: dto.isActive ?? true,
        permissions: permissions?.length
          ? {
              create: permissions.map((permissionId) => ({
                permissionId,
              })),
            }
          : undefined,
      },
      include: {
        permissions: true,
      },
    });
  }

  /**
   * Updates role metadata and synchronizes permission relationships.
   * Existing permission mappings are purged and replaced with the provided set.
   */
  async update(id: string, dto: UpdateRoleDto) {
    await this.findOne(id);

    const { permissions, ...roleData } = dto;

    return this.prisma.role.update({
      where: { id },
      data: {
        ...roleData,
        permissions: permissions
          ? {
              deleteMany: {},
              create: permissions.map((permissionId) => ({
                permissionId,
              })),
            }
          : undefined,
      },
      include: {
        permissions: true,
      },
    });
  }

  /**
   * Toggles the active status of a role.
   * Enforces a constraint to prevent disabling roles that have active user associations.
   */
  async toggleStatus(id: string) {
    const role = await this.findOne(id);

    if (role.isActive) {
      const activeUsersCount = await this.prisma.user.count({
        where: {
          isActive: true,
          roles: {
            some: {
              roleId: role.id,
            },
          },
        },
      });

      if (activeUsersCount > 0) {
        throw new BadRequestException({
          message: [
            {
              field: "isActive",
              message: "roles.messages.errors.roleHasActiveUsers",
            },
          ],
          meta: { activeUsersCount },
        });
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        isActive: !role.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.role.delete({
      where: { id },
    });
  }

  /**
   * Retrieves all permissions currently flagged as active, sorted by module.
   */
  async findAllPermissions() {
    return this.prisma.permission.findMany({
      where: { isActive: true },
      orderBy: { module: "asc" },
    });
  }
}
