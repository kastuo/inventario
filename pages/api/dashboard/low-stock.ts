// pages/api/dashboard/low-stock.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const productos = await prisma.producto.findMany({
    select: { id: true, nombre: true, stockActual: true, stockMinimo: true },
  });
  const lowStock = productos.filter(p => p.stockActual <= p.stockMinimo);
  res.status(200).json(lowStock);
}
