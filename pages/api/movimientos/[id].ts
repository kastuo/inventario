// pages/api/movimientos/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  try {
    if (req.method === 'PUT') {
      const { cantidad, observaciones } = req.body;
      const updated = await prisma.movimiento.update({
        where: { id },
        data: { cantidad: Number(cantidad), observaciones },
        include: { producto: { select: { id: true, nombre: true } } },
      });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const mov = await prisma.movimiento.findUnique({ where: { id } });
      if (!mov) return res.status(404).end();
      const prod = await prisma.producto.findUnique({ where: { id: mov.productoId } });
      if (prod) {
        const revertStock = mov.tipo === 'entrada'
          ? prod.stockActual - mov.cantidad
          : prod.stockActual + mov.cantidad;
        await prisma.producto.update({
          where: { id: prod.id },
          data: { stockActual: revertStock },
        });
      }
      await prisma.movimiento.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['PUT','DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: unknown) {
    console.error(`API /movimientos/${id} error:`, error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
