// pages/api/dashboard/stats.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  // Total de productos
  const totalProducts = await prisma.producto.count();

  // Entradas y salidas de hoy
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const entriesToday = await prisma.movimiento.count({
    where: { tipo: 'entrada', createdAt: { gte: startOfToday } },
  });
  const exitsToday = await prisma.movimiento.count({
    where: { tipo: 'salida',  createdAt: { gte: startOfToday } },
  });

  // Productos en alerta (filtrado en memoria)
  const all = await prisma.producto.findMany({
    select: { id: true, nombre: true, stockActual: true, stockMinimo: true },
  });
  const lowStock = all.filter(p => p.stockActual <= p.stockMinimo).length;

  res.status(200).json({ totalProducts, lowStock, entriesToday, exitsToday });
}
