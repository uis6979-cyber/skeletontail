import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { handlePrismaError } from "../common/utils/prisma-error.util";
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
   * Retrieves a role by ID with flattened permission IDs for frontend consumption.
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
   * Creates a new role and establishes many-to-many permission relationships.
   */
  async create(dto: CreateRoleDto) {
    try {
      const { permissions, ...roleData } = dto;

      return await this.prisma.role.create({
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
    } catch (error: any) {
      handlePrismaError(error, "roles.messages.validations");
      throw error;
    }
  }

  /**
   * Updates role attributes and synchronizes permissions via a delete-and-recreate strategy.
   */
  async update(id: string, dto: UpdateRoleDto) {
    try {
      await this.findOne(id);

      const { permissions, ...roleData } = dto;

      return await this.prisma.role.update({
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
    } catch (error: any) {
      handlePrismaError(error, "roles.messages.validations");
      throw error;
    }
  }

  /**
   * Toggles role status. Prevents deactivation if the role is assigned to active users.
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

  async findAllPermissions() {
    return this.prisma.permission.findMany({
      where: { isActive: true },
      orderBy: { module: "asc" },
    });
  }
}
