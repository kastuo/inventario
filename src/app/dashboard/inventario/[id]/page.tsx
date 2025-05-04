'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditarProducto({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [producto, setProducto] = useState({ nombre: '', cantidad: 0 });

  useEffect(() => {
    fetch('/api/productos/' + params.id)
      .then(res => res.json())
      .then(setProducto);
  }, [params.id]);

  const actualizarProducto = async () => {
    await fetch('/api/productos/' + params.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    router.push('/dashboard/inventario');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-xl font-bold text-primary mb-4">Editar producto</h1>

      <label className="block mb-2 text-sm font-medium">Nombre:</label>
      <input
        className="w-full border px-3 py-2 rounded mb-4"
        value={producto.nombre}
        onChange={e => setProducto({ ...producto, nombre: e.target.value })}
      />

      <label className="block mb-2 text-sm font-medium">Cantidad:</label>
      <input
        type="number"
        className="w-full border px-3 py-2 rounded mb-4"
        value={producto.cantidad}
        onChange={e => setProducto({ ...producto, cantidad: parseInt(e.target.value) })}
      />

      <button onClick={actualizarProducto} className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary">
        Guardar cambios
      </button>
    </div>
  );
}
