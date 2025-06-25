// pages/api/productos/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const productos = await prisma.producto.findMany({ orderBy: { id: 'asc' } });
      return res.status(200).json(productos);
    }

    if (req.method === 'POST') {
      const { nombre, stockActual, stockMinimo } = req.body;
      const nuevo = await prisma.producto.create({
        data: { nombre, stockActual, stockMinimo },
      });
      return res.status(201).json(nuevo);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error desconocido';
    console.error('API /productos error:', error);
    return res.status(500).json({ error: message });
  }
}
