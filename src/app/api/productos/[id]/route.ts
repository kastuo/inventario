import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const id = parseInt(params.id);

  const producto = await prisma.producto.update({
    where: { id },
    data: {
      nombre: body.nombre,
      cantidad: body.cantidad,
    },
  });

  return NextResponse.json(producto);
}


export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  await prisma.producto.delete({
    where: { id }
  });

  return NextResponse.json({ ok: true });
}
