// pages/api/productos/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.id);

  try {
    if (req.method === 'DELETE') {
      // 1) Borra primero los movimientos vinculados
      await prisma.movimiento.deleteMany({
        where: { productoId: id },
      });
      // 2) Luego borra el producto
      await prisma.producto.delete({
        where: { id },
      });
      return res.status(204).end();
    }

    if (req.method === 'PUT') {
      // Ejemplo de PUT (update)
      const { nombre, stockActual, stockMinimo } = req.body;
      const updated = await prisma.producto.update({
        where: { id },
        data: { nombre, stockActual, stockMinimo },
      });
      return res.status(200).json(updated);
    }

    // Si llegan otros métodos, devolvemos 405
    res.setHeader('Allow', ['DELETE', 'PUT']);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  } catch (error: unknown) {
    // Aquí tipamos el error correctamente
    console.error(`API /productos/${id} error:`, error);
    const message =
      error instanceof Error ? error.message : 'Unexpected error';
    return res.status(500).json({ error: message });
  }
}
