'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const path = usePathname();

  // Si no hay sesión, redirigir
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.replace('/login');
  }, [session, status, router]);

  const menu = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Productos', href: '/dashboard/productos' },
    { label: 'Moviemientos', href: '/dashboard/movimientos' },
   // { label: 'Historial', href: '/dashboard/historial' },
  ];

  if (status === 'loading' || !session) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <div className="flex h-screen">
      <aside className={`bg-white border-r flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 self-end">
          {collapsed ? '➡️' : '⬅️'}
        </button>
        <nav className="mt-4 flex-1">
          {menu.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 my-1 rounded hover:bg-gray-200 ${path === item.href ? 'bg-gray-300' : ''}`}
            >
              {!collapsed ? item.label : item.label.charAt(0)}
            </Link>
          ))}
        </nav>
        
      </aside>
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}