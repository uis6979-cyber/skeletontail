import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('12345678', 10);

  const roles = [
    { name: 'Administrador', slug: 'admin', description: 'Acceso total' },
    { name: 'Developer', slug: 'developer', description: 'Acceso total' },
    { name: 'Usuario', slug: 'user', description: 'Acceso general' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {},
      create: role,
    });
  }

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
      firstName: 'Admin',
      lastName: 'Sistema',
      roles: {
        create: [
          {
            role: {
              connect: { slug: 'admin' },
            },
          },
        ],
      },
    },
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });