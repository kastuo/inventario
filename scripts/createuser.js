import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'nagore@sinvelloporlaser.es';
  const plainPassword = 'Torreyuyu2@25';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: 'Nagore',
    },
  });

  console.log(`Usuario creado: ${user.email}`);
}

main()
  .catch((e) => {
    console.error('Error creando usuario:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
