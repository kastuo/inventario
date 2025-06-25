// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Evitamos múltiples instancias en desarrollo
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}
