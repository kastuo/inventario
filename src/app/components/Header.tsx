// src/components/Header.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-primary text-white p-4 flex justify-between items-center">
      {/* Logo o título a la izquierda */}
      <Link href="/dashboard">
        <h1 className="text-2xl font-semibold cursor-pointer">
          SinVello Torrevieja – Inventario
        </h1>
      </Link>

      {/* Usuario y logout a la derecha */}
      {session && (
        <div className="flex items-center space-x-4">
          <span className="font-medium">
            {session.user?.name ?? session.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-secondary px-3 py-1 rounded hover:bg-warning/90 transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
);
}
