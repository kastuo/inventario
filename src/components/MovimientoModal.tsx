// src/components/MovimientoModal.tsx
'use client';

import { FormEvent, useState, useEffect, ChangeEvent } from 'react';
import ModalWrapper from './ModalWrapper';
import { Producto, Movimiento } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  movimiento?: Movimiento;
  productos: Producto[];
}

export default function MovimientoModal({
  isOpen,
  onClose,
  onSaved,
  movimiento,
  productos,
}: Props) {
  const [productoId, setProductoId] = useState<number>(movimiento?.productoId ?? 0);
  const [tipo, setTipo] = useState<'entrada' | 'salida'>(movimiento?.tipo ?? 'entrada');
  const [cantidad, setCantidad] = useState<number>(movimiento?.cantidad ?? 0);
  const [observaciones, setObservaciones] = useState<string>(movimiento?.observaciones ?? '');

  useEffect(() => {
    if (movimiento) {
      setProductoId(movimiento.productoId);
      setTipo(movimiento.tipo);
      setCantidad(movimiento.cantidad);
      setObservaciones(movimiento.observaciones ?? '');
    }
  }, [movimiento]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = movimiento ? 'PUT' : 'POST';
    const url = movimiento ? `/api/movimientos/${movimiento.id}` : '/api/movimientos';
    const body = { productoId, tipo, cantidad, observaciones };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) onSaved();
    else console.error('Error:', await res.json());
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={movimiento ? 'Editar Movimiento' : 'Nuevo Movimiento'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-neutral-700">
            Tipo
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setTipo(e.target.value as 'entrada' | 'salida')
            }
            className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>
        <div>
          <label htmlFor="producto" className="block text-sm font-medium text-neutral-700">
            Producto
          </label>
          <select
            id="producto"
            value={productoId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setProductoId(Number(e.target.value))
            }
            className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            required
          >
            <option value={0} disabled>Selecciona un producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cantidad" className="block text-sm font-medium text-neutral-700">
            Cantidad
          </label>
          <input
            id="cantidad"
            type="number"
            min={1}
            value={cantidad}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCantidad(Number(e.target.value))
            }
            className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="observaciones" className="block text-sm font-medium text-neutral-700">
            Observaciones
          </label>
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setObservaciones(e.target.value)
            }
            className="mt-1 block w-full border-neutral-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            rows={3}
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
