import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const productos = await prisma.producto.findMany();
  return NextResponse.json(productos);
}

export async function POST(req: Request) {
  const data = await req.json();
  const nuevo = await prisma.producto.create({ data });
  return NextResponse.json(nuevo);
}
