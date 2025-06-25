'use client';
import { useState, useEffect, FormEvent } from 'react';

interface Producto {
  id?: number;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (producto: Producto) => void;
  initialData?: Producto;
}

export default function ProductoModal({ isOpen, onClose, onSaved, initialData }: Props) {
  const [nombre, setNombre] = useState('');
  const [stockActual, setStockActual] = useState(0);
  const [stockMinimo, setStockMinimo] = useState(0);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setStockActual(initialData.stockActual);
      setStockMinimo(initialData.stockMinimo);
    } else {
      setNombre('');
      setStockActual(0);
      setStockMinimo(0);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSaved({ id: initialData?.id, nombre, stockActual, stockMinimo });
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Editar Producto' : 'Añadir Producto'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre del producto
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              className="mt-1 w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="stockActual" className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              id="stockActual"
              type="number"
              value={stockActual}
              onChange={e => setStockActual(Number(e.target.value))}
              required
              className="mt-1 w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="stockMinimo" className="block text-sm font-medium text-gray-700">
              Stock mínimo
            </label>
            <input
              id="stockMinimo"
              type="number"
              value={stockMinimo}
              onChange={e => setStockMinimo(Number(e.target.value))}
              required
              className="mt-1 w-full border p-2 rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}