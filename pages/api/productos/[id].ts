// pages/api/productos/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.id);

  try {
    if (req.method === 'PUT') {
      const { nombre, stockActual, stockMinimo } = req.body;
      const updated = await prisma.producto.update({
        where: { id },
        data: { nombre, stockActual, stockMinimo },
      });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      await prisma.producto.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: unknown) {
    // narrow to Error to leer `.message`
    const message =
      error instanceof Error ? error.message : 'Error desconocido';
    console.error(`API /productos/${id} error:`, error);
    return res.status(500).json({ error: message });
  }
}
