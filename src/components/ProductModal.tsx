// src/components/ProductModal.tsx
'use client';

import { FormEvent, useState, useEffect, ChangeEvent } from 'react';
import ModalWrapper from './ModalWrapper';
import { Producto } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  producto?: Producto;
}

export default function ProductModal({ isOpen, onClose, onSaved, producto }: Props) {
  const [nombre, setNombre] = useState(producto?.nombre ?? '');
  const [stockActual, setStockActual] = useState(producto?.stockActual ?? 0);
  const [stockMinimo, setStockMinimo] = useState(producto?.stockMinimo ?? 0);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setStockActual(producto.stockActual);
      setStockMinimo(producto.stockMinimo);
    }
  }, [producto]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = producto ? 'PUT' : 'POST';
    const url = producto ? `/api/productos/${producto.id}` : '/api/productos';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, stockActual, stockMinimo }),
    });
    if (res.ok) onSaved();
    else console.error('Error guardando:', await res.json());
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={producto ? 'Editar Producto' : 'Nuevo Producto'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-neutral-700">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
            className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="stockActual" className="block text-sm font-medium text-neutral-700">
            Stock Actual
          </label>
          <input
            id="stockActual"
            type="number"
            min={0}
            value={stockActual}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStockActual(Number(e.target.value))
            }
            className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="stockMinimo" className="block text-sm font-medium text-neutral-700">
            Stock Mínimo
          </label>
          <input
            id="stockMinimo"
            type="number"
            min={0}
            value={stockMinimo}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStockMinimo(Number(e.target.value))
            }
            className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
