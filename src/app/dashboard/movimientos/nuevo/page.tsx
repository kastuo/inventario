'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NuevoMovimiento() {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [cantidad, setCantidad] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/movimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, cantidad, productoId: parseInt(productoId) }),
    });
    router.push('/dashboard/movimientos');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Registrar movimiento</h2>
      <select value={productoId} onChange={e => setProductoId(e.target.value)} className="block w-full border p-2 mb-2 rounded" required>
        <option value="">Selecciona un producto</option>
        {productos.map((p: any) => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>
      <select value={tipo} onChange={e => setTipo(e.target.value)} className="block w-full border p-2 mb-2 rounded">
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>
      <input type="number" value={cantidad} onChange={e => setCantidad(Number(e.target.value))} className="block w-full border p-2 mb-2 rounded" required />
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary">Registrar</button>
    </form>
  );
}
