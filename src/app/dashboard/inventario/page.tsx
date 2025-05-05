'use client';
import React, { useEffect, useState } from 'react';

interface Producto {
  id: number;
  nombre: string;
  cantidad: number;
}

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [formData, setFormData] = useState({ nombre: '', cantidad: 0 });
  const [open, setOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  useEffect(() => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(setProductos);
  }, []);

  // Ahora tipado explícito: producto es de tipo Producto
  const abrirModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setFormData({ nombre: producto.nombre, cantidad: producto.cantidad });
    setOpen(true);
  };

  const handleGuardar = async () => {
    if (!productoSeleccionado) return;

    await fetch(`/api/productos/${productoSeleccionado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setProductos(prev =>
      prev.map(p =>
        p.id === productoSeleccionado.id
          ? { ...p, nombre: formData.nombre, cantidad: formData.cantidad }
          : p
      )
    );
    setOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Productos</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
        >
          Nuevo producto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {productos.map(producto => (
          <div
            key={producto.id}
            onClick={() => abrirModal(producto)}
            className="cursor-pointer p-4 border rounded shadow hover:bg-muted transition"
          >
            <h2 className="text-lg font-semibold">{producto.nombre}</h2>
            <p className="text-sm text-gray-700">Cantidad: {producto.cantidad}</p>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-primary">
              {productoSeleccionado ? 'Editar producto' : 'Nuevo producto'}
            </h2>

            <label className="block text-sm font-medium mb-1">Nombre:</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={formData.nombre}
              onChange={e => setFormData({ ...formData, nombre: e.target.value })}
            />

            <label className="block text-sm font-medium mb-1">Cantidad:</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded mb-4"
              value={formData.cantidad}
              onChange={e => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
            />

            <button
              onClick={handleGuardar}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary w-full"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
