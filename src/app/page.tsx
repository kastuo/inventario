export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text p-6">
      <div className="max-w-lg bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-primary mb-4 text-center">Sistema de Inventario</h1>
        <p className="text-center mb-6">
          Bienvenida a tu aplicación de gestión de inventario.
        </p>
        <a
          href="/login"
          className="block text-center bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition"
        >
          Iniciar sesión
        </a>
      </div>
    </div>
  );
}
