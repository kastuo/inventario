'use client';
import React, { useEffect, useState } from 'react';

type Producto = { id: number; nombre: string; cantidad: number; };
type Movimiento = { id: number; tipo: 'entrada' | 'salida'; cantidad: number; fecha: string; producto: Producto };

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({ productoId: '', tipo: 'entrada', cantidad: 0 });
  const [errorStock, setErrorStock] = useState('');
  const [filtroProducto, setFiltroProducto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    async function cargar() {
      const [movRes, prodRes] = await Promise.all([
        fetch('/api/movimientos').then(r => r.json()),
        fetch('/api/productos').then(r => r.json())
      ]);
      setMovimientos(movRes);
      setProductos(prodRes);
    }
    cargar();
  }, []);

  const registrarMovimiento = async () => {
    const prod = productos.find(p => p.id === +formData.productoId);
    if (!prod) return setErrorStock('Selecciona un producto válido.');
    if (formData.tipo === 'salida' && formData.cantidad > prod.cantidad) {
      return setErrorStock('No puedes retirar más de lo disponible.');
    }
    await fetch('/api/movimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: formData.tipo,
        cantidad: formData.cantidad,
        productoId: +formData.productoId
      })
    });
    setMostrarModal(false);
    setFormData({ productoId: '', tipo: 'entrada', cantidad: 0 });
    setErrorStock('');
    // refresca datos
    const [nMov, nProd] = await Promise.all([
      fetch('/api/movimientos').then(r => r.json()),
      fetch('/api/productos').then(r => r.json())
    ]);
    setMovimientos(nMov);
    setProductos(nProd);
  };

  // aplica filtros
  const lista = movimientos
    .filter(m => !filtroProducto || m.producto.id === +filtroProducto)
    .filter(m => !filtroTipo || m.tipo === filtroTipo);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-primary">Historial de movimientos</h1>
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
        >
          + Registrar entrada/salida
        </button>
      </div>

      {/* filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label className="text-sm block">Filtrar producto</label>
          <select
            className="border rounded px-2 py-1"
            value={filtroProducto}
            onChange={e => setFiltroProducto(e.target.value)}
          >
            <option value="">Todos</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm block">Filtrar tipo</label>
          <select
            className="border rounded px-2 py-1"
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>
      </div>

      {/* lista */}
      {lista.length === 0 ? (
        <p className="text-gray-600">No hay movimientos que coincidan.</p>
      ) : (
        <ul className="space-y-3">
          {lista.map(m => (
            <li
              key={m.id}
              className={`border-l-4 p-4 rounded shadow bg-white ${
                m.tipo === 'entrada' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">[{m.tipo.toUpperCase()}] {m.cantidad} uds.</span>
                <span className="text-sm text-gray-500">{new Date(m.fecha).toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-700 mt-1">
                Producto: <strong>{m.producto.nombre}</strong>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
            <button
              onClick={() => { setMostrarModal(false); setErrorStock(''); }}
              className="absolute top-2 right-3 text-xl text-gray-400 hover:text-black"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-primary mb-4">Nuevo movimiento</h2>

            <label className="block text-sm mb-1">Producto:</label>
            <select
              className="w-full mb-3 border rounded px-3 py-2"
              value={formData.productoId}
              onChange={e => setFormData({ ...formData, productoId: e.target.value })}
            >
              <option value="">Selecciona un producto</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} (stock: {p.cantidad})
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">Tipo:</label>
            <select
              className="w-full mb-3 border rounded px-3 py-2"
              value={formData.tipo}
              onChange={e => setFormData({ ...formData, tipo: e.target.value })}
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>

            <label className="block text-sm mb-1">Cantidad:</label>
            <input
              type="number"
              className="w-full mb-2 border rounded px-3 py-2"
              value={formData.cantidad}
              onChange={e => setFormData({ ...formData, cantidad: +e.target.value })}
            />
            {errorStock && <p className="text-sm text-red-500 mb-2">{errorStock}</p>}

            <button
              onClick={registrarMovimiento}
              className="bg-primary text-white w-full py-2 rounded hover:bg-secondary"
            >
              Registrar
            </button>
          </div>
        </div>
      )}
    </div>
);
}
