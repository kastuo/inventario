// src/app/dashboard/movimientos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MovimientoModal from '@/components/MovimientoModal';
import { Movimiento, Producto } from '@/types';

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selected, setSelected] = useState<Movimiento | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    const [movRes, prodRes] = await Promise.all([
      fetch('/api/movimientos'),
      fetch('/api/productos'),
    ]);
    setMovimientos(await movRes.json());
    setProductos(await prodRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este registro?')) return;
    await fetch(`/api/movimientos/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
        <div className="p-6">
      {/* Header con título y botón */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Movimientos</h1>
      <button
        onClick={() => { setSelected(undefined); setModalOpen(true); }}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
      >
        Nuevo Movimiento
      </button>
      </div>

    

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Producto</th>
              
              <th className="px-4 py-2 text-right">Cant.</th>
              <th className="px-4 py-2 text-right">Stock Ant.</th>
              <th className="px-4 py-2 text-right">Stock Dep.</th>
              <th className="px-4 py-2">Obs.</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map(m => (
              <tr
                key={m.id}
                className={
                  m.tipo === 'entrada'
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'bg-red-50 hover:bg-red-100'
                }
              >
                <td className="px-4 py-2">{m.id}</td>
                <td className="px-4 py-2">{m.tipo}</td>
                <td className="px-4 py-2">{m.producto.nombre}</td>
                <td className="px-4 py-2 text-right">{m.cantidad}</td>
                <td className="px-4 py-2 text-right">{m.stockAnterior}</td>
                <td className="px-4 py-2 text-right">{m.stockDespues}</td>
                <td className="px-4 py-2">{m.observaciones}</td>
                <td className="px-4 py-2">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => { setSelected(m); setModalOpen(true); }}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="px-2 py-1 border border-danger text-danger rounded text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MovimientoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchData}
        movimiento={selected}
        productos={productos}
      />
    </div>
  );
}
