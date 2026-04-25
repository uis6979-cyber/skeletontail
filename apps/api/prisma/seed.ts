import { Permission, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    {
      name: "permissions.users.view.name",
      slug: "users.view",
      module: "users",
      action: "view",
      description: "permissions.users.view.description",
    },
    {
      name: "permissions.users.create.name",
      slug: "users.create",
      module: "users",
      action: "create",
      description: "permissions.users.create.description",
    },
    {
      name: "permissions.users.edit.name",
      slug: "users.edit",
      module: "users",
      action: "edit",
      description: "permissions.users.edit.description",
    },
    {
      name: "permissions.users.delete.name",
      slug: "users.delete",
      module: "users",
      action: "delete",
      description: "permissions.users.delete.description",
    },
    {
      name: "permissions.roles.view.name",
      slug: "roles.view",
      module: "roles",
      action: "view",
      description: "permissions.roles.view.description",
    },
    {
      name: "permissions.roles.create.name",
      slug: "roles.create",
      module: "roles",
      action: "create",
      description: "permissions.roles.create.description",
    },
    {
      name: "permissions.roles.edit.name",
      slug: "roles.edit",
      module: "roles",
      action: "edit",
      description: "permissions.roles.edit.description",
    },
    {
      name: "permissions.roles.delete.name",
      slug: "roles.delete",
      module: "roles",
      action: "delete",
      description: "permissions.roles.delete.description",
    },
    {
      name: "permissions.profile.view.name",
      slug: "profile.view",
      module: "profile",
      action: "view",
      description: "permissions.profile.view.description",
    },
    {
      name: "permissions.profile.edit.name",
      slug: "profile.edit",
      module: "profile",
      action: "edit",
      description: "permissions.profile.edit.description",
    },
    {
      name: "permissions.dashboard.view.name",
      slug: "dashboard.view",
      module: "dashboard",
      action: "view",
      description: "permissions.dashboard.view.description",
    },
  ];

  const roles = [
    {
      name: "roles.admin.name",
      slug: "admin",
      description: "roles.admin.description",
    },
    {
      name: "roles.developer.name",
      slug: "developer",
      description: "roles.developer.description",
    },
    {
      name: "roles.user.name",
      slug: "user",
      description: "roles.user.description",
    },
  ];

  const createdPermissions: Permission[] = [];

  for (const permission of permissions) {
    const record = await prisma.permission.upsert({
      where: { slug: permission.slug },
      update: {
        name: permission.name,
        description: permission.description,
      },
      create: permission,
    });
    createdPermissions.push(record);
  }

  // Upsert roles and link them with all defined system permissions
  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {
        name: role.name,
        description: role.description,
      },
      create: {
        ...role,
        permissions: {
          create: createdPermissions.map((permission) => ({
            permission: {
              connect: { slug: permission.slug },
            },
          })),
        },
      },
    });
  }

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

  console.log("Seeding complete.");
}

main()
  .catch((error) => {
    console.error("Critical seeding failure:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
