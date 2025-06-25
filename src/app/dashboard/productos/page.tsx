// src/app/dashboard/productos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Producto } from '@/types';
import ProductModal from '@/components/ProductModal';

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | undefined>(undefined);

  const refresh = async () => {
    const res = await fetch('/api/productos');
    const data: Producto[] = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Productos</h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
          onClick={() => {
            setSelectedProduct(undefined);
            setModalOpen(true);
          }}
        >
          Añadir Producto
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-right">Stock</th>
              <th className="px-4 py-2 text-right">Stock Mínimo</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr
                key={p.id}
                className={
                  p.stockActual <= p.stockMinimo
                    ? 'bg-red-50 hover:bg-red-100'
                    : 'hover:bg-gray-50'
                }
              >
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2 text-right">{p.stockActual}</td>
                <td className="px-4 py-2 text-right">{p.stockMinimo}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    className="px-2 py-1 border rounded text-sm"
                    onClick={() => {
                      setSelectedProduct(p);
                      setModalOpen(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="px-2 py-1 border border-danger text-danger rounded text-sm"
                    onClick={async () => {
                      if (!confirm('¿Eliminar este producto?')) return;
                      await fetch(`/api/productos/${p.id}`, { method: 'DELETE' });
                      refresh();
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          refresh();
        }}
        producto={selectedProduct}
      />
    </div>
  );
}
