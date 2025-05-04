'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function InventarioPage() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', cantidad: 0 });

  useEffect(() => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(setProductos);
  }, []);

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setFormData({ nombre: producto.nombre, cantidad: producto.cantidad });
  };

  const cerrarModal = () => {
    setProductoSeleccionado(null);
    setFormData({ nombre: '', cantidad: 0 });
  };

  const guardarCambios = async () => {
    await fetch('/api/productos/' + productoSeleccionado.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    cerrarModal();
    fetch('/api/productos')
      .then(res => res.json())
      .then(setProductos);
  };

  const eliminarProducto = async () => {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmacion) return;

    await fetch('/api/productos/' + productoSeleccionado.id, {
      method: 'DELETE'
    });
    cerrarModal();
    fetch('/api/productos')
      .then(res => res.json())
      .then(setProductos);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Productos</h1>
        <Link href="/dashboard/inventario/nuevo" className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary">
          + Nuevo producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <p className="text-gray-600">No hay productos registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map(p => (
            <div
              key={p.id}
              onClick={() => abrirModal(p)}
              className="cursor-pointer bg-white shadow rounded p-4 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-primary">{p.nombre}</h2>
              <p className="text-sm text-gray-700">Cantidad disponible: <strong>{p.cantidad}</strong></p>
              <p className="text-xs text-gray-400 mt-1">Creado: {new Date(p.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full relative">
            <button
              onClick={cerrarModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-primary">Editar producto</h2>
            <label className="block text-sm mb-1 font-medium">Nombre:</label>
            <input
              className="w-full border px-3 py-2 mb-4 rounded"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
            <label className="block text-sm mb-1 font-medium">Cantidad:</label>
            <input
              type="number"
              className="w-full border px-3 py-2 mb-4 rounded"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
            />
            <div className="flex justify-between gap-2">
              <button
                onClick={guardarCambios}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary w-full"
              >
                Guardar cambios
              </button>
              <button
                onClick={eliminarProducto}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
