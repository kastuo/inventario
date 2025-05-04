'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoProducto() {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, cantidad }),
    });
    router.push("/dashboard/inventario");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Nuevo producto</h2>
      <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="block w-full border p-2 mb-2 rounded" required />
      <input type="number" placeholder="Cantidad" value={cantidad} onChange={e => setCantidad(Number(e.target.value))} className="block w-full border p-2 mb-2 rounded" required />
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary">Guardar</button>
    </form>
  );
}
