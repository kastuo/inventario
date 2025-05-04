import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const user = await prisma.user.upsert({
    where: { email: "nagore@sinvelloporlaser.es" },
    update: {},
    create: {
      email: "nagore@sinvelloporlaser.es",
      password: hashedPassword,
      name: "Nagore"
    }
  });
  console.log("Usuario creado:", user);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
