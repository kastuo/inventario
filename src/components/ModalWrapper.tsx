// src/components/ModalWrapper.tsx
'use client';

import { ReactNode, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function ModalWrapper({ isOpen, onClose, title, children }: Props) {
  // Cerrar con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}            /* clic fuera cierra */
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 relative"
        onClick={e => e.stopPropagation()}  /* evitar cierre al clic dentro */
      >
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-lg font-medium text-neutral-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded"
          >
            {/* Ícono de cerrar (X) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
