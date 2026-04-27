import { Permission, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  // Define system permissions using translation keys for localization
  const permissions = [
    {
      name: "Ver roles",
      slug: "roles.view",
      module: "roles",
      action: "view",
      description: "ver detalle de roles",
    },
    {
      name: "Crear rol",
      slug: "roles.create",
      module: "roles",
      action: "create",
      description: "Crear nuevo rol",
    },
    {
      name: "Editar rol",
      slug: "roles.edit",
      module: "roles",
      action: "edit",
      description: "Editar rol existente",
    },
    {
      name: "Cambiar estado rol",
      slug: "roles.status",
      module: "roles",
      action: "status",
      description: "Cambiar el estado de rol",
    },
    // Users
    {
      name: "Ver usuarios",
      slug: "users.view",
      module: "users",
      action: "view",
      description: "Ver detalle de usuarios",
    },
    {
      name: "Crear usuario",
      slug: "users.create",
      module: "users",
      action: "create",
      description: "Crear nuevo usuario",
    },
    {
      name: "Editar usuario",
      slug: "users.edit",
      module: "users",
      action: "edit",
      description: "Editar usuario existente",
    },
    {
      name: "Cambiar estado usuario",
      slug: "users.status",
      module: "users",
      action: "status",
      description: "Cambiar el estado de usuario",
    },
    // Dashboard
    {
      name: "Dashboard",
      slug: "dashboard.view",
      module: "dashboard",
      action: "view",
      description: "Dashboard",
    },
    // Profile
    {
      name: "Ver perfil",
      slug: "profile.view",
      module: "profile",
      action: "view",
      description: "Ver perfil de usuario logueado",
    },
    {
      name: "Editar perfil",
      slug: "profile.edit",
      module: "profile",
      action: "edit",
      description: "Editar perfil de usuario logueado",
    },
  ];

  // Define system roles using translation keys
  const roles = [
    {
      name: "Admin",
      slug: "admin",
      description: "Admin role",
    },
    {
      name: "Developer",
      slug: "developer",
      description: "Developer role",
    },
    {
      name: "User",
      slug: "user",
      description: "User role",
    },
  ];

  const createdPermissions: Permission[] = [];

  for (const permission of permissions) {
    // Ensure all defined permissions exist and are up to date
    const record = await prisma.permission.upsert({
      where: { slug: permission.slug },
      update: {
        name: permission.name,
        description: permission.description,
        module: permission.module,
        action: permission.action,
      },
      create: permission,
    });

    createdPermissions.push(record);
  }

  const allPermissionSlugs = createdPermissions.map((p) => p.slug);
  const userPermissionSlugs = [
    "dashboard.view",
    "profile.view",
    "profile.edit",
  ];

  for (const role of roles) {
    let assignedSlugs: string[] = [];

    assignedSlugs =
      role.slug === "admin" || role.slug === "developer"
        ? allPermissionSlugs
        : userPermissionSlugs;

    if (role.slug === "user") {
      assignedSlugs = userPermissionSlugs;
    }

    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {
        name: role.name,
        description: role.description,
      },
      create: {
        ...role,
        permissions: {
          create: assignedSlugs.map((slug) => ({
            permission: {
              connect: { slug },
            },
          })),
        },
      },
    });
  }

  // Seed initial administrative and system users
  const defaultPassword = await bcrypt.hash("12345678", 10);
  const users = [
    {
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "System",
      roles: ["admin"],
    },
    {
      email: "developer@example.com",
      firstName: "Developer",
      lastName: "System",
      roles: ["developer"],
    },
    {
      email: "user@example.com",
      firstName: "User",
      lastName: "System",
      roles: ["user"],
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        password: defaultPassword,
        isActive: true,
      },
      create: {
        email: user.email,
        password: defaultPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: {
          create: user.roles.map((slug) => ({
            role: {
              connect: { slug },
            },
          })),
        },
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed execution failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
