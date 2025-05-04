import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const movimientos = await prisma.movimiento.findMany({
    orderBy: { fecha: 'desc' },
    include: { producto: true }
  });
  return Response.json(movimientos);
}

export async function POST(req: NextRequest) {
  const { tipo, cantidad, productoId } = await req.json();

  // Crear movimiento
  const movimiento = await prisma.movimiento.create({
    data: {
      tipo,
      cantidad,
      producto: { connect: { id: productoId } }
    }
  });

  // Actualizar stock
  await prisma.producto.update({
    where: { id: productoId },
    data: {
      cantidad: {
        increment: tipo === 'entrada' ? cantidad : -cantidad
      }
    }
  });

  return Response.json(movimiento);
}
