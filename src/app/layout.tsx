import '../styles/globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-background text-text min-h-screen flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Inventario SinVello Torrevieja</h1>
          <nav className="space-x-4">
            <Link href="/" className="text-sm hover:underline text-secondary">Login</Link>
            <Link href="/dashboard" className="text-sm hover:underline text-secondary">Dashboard</Link>
            <Link href="/dashboard/inventario" className="text-sm hover:underline text-secondary">Productos</Link>
            <Link href="/dashboard/movimientos" className="text-sm hover:underline text-secondary">Movimientos</Link>
          </nav>
        </header>
        <main className="flex-1 p-6">{children}</main>
        <footer className="bg-white p-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} InventarioApp. @crespo Todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
