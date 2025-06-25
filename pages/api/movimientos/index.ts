// pages/api/movimientos/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const movimientos = await prisma.movimiento.findMany({
        include: { producto: { select: { id: true, nombre: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(movimientos);
    }

    if (req.method === 'POST') {
      const { productoId, tipo, cantidad, observaciones } = req.body;
      const prod = await prisma.producto.findUnique({ where: { id: Number(productoId) } });
      if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });

      const stockAnterior = prod.stockActual;
      const delta = tipo === 'entrada' ? Number(cantidad) : -Number(cantidad);
      if (tipo === 'salida' && Number(cantidad) > stockAnterior) {
        return res.status(400).json({ error: 'Cantidad supera stock actual' });
      }
      const stockDespues = stockAnterior + delta;

      const [ , movimiento ] = await prisma.$transaction([
        prisma.producto.update({
          where: { id: prod.id },
          data: { stockActual: stockDespues },
        }),
        prisma.movimiento.create({
          data: {
            productoId: prod.id,
            tipo,
            cantidad: Number(cantidad),
            stockAnterior,
            stockDespues,
            observaciones,
          },
          include: { producto: { select: { id: true, nombre: true } } },
        }),
      ]);

      return res.status(201).json(movimiento);
    }

    res.setHeader('Allow', ['GET','POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: unknown) {
    console.error('API /movimientos error:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
