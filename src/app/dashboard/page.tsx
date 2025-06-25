// src/app/dashboard/page.tsx
'use client';

import useSWR from 'swr';

interface Stats {
  totalProducts: number;
  lowStock: number;
  entriesToday: number;
  exitsToday: number;
}

interface Producto {
  id: number;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardPage() {
  const { data: stats } = useSWR<Stats>('/api/dashboard/stats', fetcher, {
    refreshInterval: 5000,
  });
  const { data: lowStockProducts } = useSWR<Producto[]>('/api/dashboard/low-stock', fetcher);

  if (!stats || !lowStockProducts) return <p className="p-6">Cargando estadísticas…</p>;

  return (
    <div className="p-6 space-y-8">
      {/* Banner de alerta */}
      {lowStockProducts.length > 0 && (
        <div className="bg-danger/20 text-danger px-4 py-2 rounded mb-4">
          ¡Hay {lowStockProducts.length} producto(s) con stock crítico!
        </div>
      )}

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
          <span className="text-sm text-neutral-500">Total Productos</span>
          <span className="mt-2 text-2xl font-bold">{stats.totalProducts}</span>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col border-l-4 border-danger">
          <span className="text-sm text-neutral-500">Stock Crítico</span>
          <span className="mt-2 text-2xl font-bold text-danger">{stats.lowStock}</span>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
          <span className="text-sm text-neutral-500">Entradas Hoy</span>
          <span className="mt-2 text-2xl font-bold text-success">{stats.entriesToday}</span>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
          <span className="text-sm text-neutral-500">Salidas Hoy</span>
          <span className="mt-2 text-2xl font-bold text-danger">{stats.exitsToday}</span>
        </div>
      </div>

      {/* Tabla de productos con stock crítico */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Productos con stock bajo</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-right">Stock</th>
                <th className="px-4 py-2 text-right">Stock Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map(p => (
                  <tr key={p.id} className="bg-red-50 hover:bg-red-100">
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">{p.nombre}</td>
                    <td className="px-4 py-2 text-right">{p.stockActual}</td>
                    <td className="px-4 py-2 text-right">{p.stockMinimo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-sm text-neutral-500">
                    Ningún producto con stock bajo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
