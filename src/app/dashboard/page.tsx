'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Producto {
  id: number;
  nombre: string;
  cantidad: number;
  createdAt: string;
}

interface Movimiento {
  id: number;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  fecha: string;
  producto: Producto;
}

export default function DashboardPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  // Carga todos los productos
  useEffect(() => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(setProductos);
  }, []);

  // Carga movimientos filtrando por productoId
  const cargarMovimientos = async (productoId: number) => {
    const res = await fetch(`/api/movimientos?productoId=${productoId}`);
    const data: Movimiento[] = await res.json();
    setMovimientos(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Productos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {productos.map((p) => (
            <button
              key={p.id}
              onClick={() => cargarMovimientos(p.id)}
              className="p-4 border rounded shadow hover:bg-muted transition text-left"
            >
              <h3 className="font-medium">{p.nombre}</h3>
              <p className="text-sm text-gray-600">Cantidad: {p.cantidad}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Movimientos</h2>
        {movimientos.length === 0 ? (
          <p className="text-gray-600">Selecciona un producto para ver su historial.</p>
        ) : (
          <ul className="space-y-3">
            {movimientos.map((m) => (
              <li
                key={m.id}
                className={`border-l-4 p-4 rounded shadow bg-white ${
                  m.tipo === 'entrada' ? 'border-green-500' : 'border-red-500'
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">
                    [{m.tipo.toUpperCase()}] {m.cantidad} uds.
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(m.fecha).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  Producto: <strong>{m.producto.nombre}</strong>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6">
        <Link
          href="/dashboard/inventario"
          className="text-primary hover:underline"
        >
          Ir a Inventario
        </Link>
      </div>
    </div>
  );
}
