'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';



const COLORS = ['#E91E63', '#C2185B', '#FFB300', '#00C49F', '#FF8042'];

export default function DashboardPage() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [movimientos, setMovimientos] = useState([]);

  const cargarDatos = async () => {
    const res = await fetch('/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  const cargarMovimientos = async (productoId) => {
    const res = await fetch('/api/movimientos?productoId=' + productoId);
    const data = await res.json();
    setMovimientos(data);
  };

  const abrirModal = async (producto) => {
    setProductoSeleccionado(producto);
    await cargarMovimientos(producto.id);
  };

  const cerrarModal = () => {
    setProductoSeleccionado(null);
    setMovimientos([]);
  };

  useEffect(() => {
    cargarDatos();
    const intervalo = setInterval(() => cargarDatos(), 5000);
    return () => clearInterval(intervalo);
  }, []);

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const hoja = workbook.addWorksheet('Inventario');
    hoja.columns = [
      { header: 'ID', key: 'id' },
      { header: 'Nombre', key: 'nombre' },
      { header: 'Cantidad', key: 'cantidad' }
    ];
    productos.forEach(p => hoja.addRow(p));
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'inventario.xlsx');
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Inventario de Productos', 10, 10);
    autoTable(doc, {
      head: [['ID', 'Nombre', 'Cantidad']],
      body: productos.map(p => [p.id, p.nombre, p.cantidad])
    });
    doc.save('inventario.pdf');
  };

  const dataGrafico = productos.map(p => ({
    name: p.nombre,
    value: p.cantidad
  }));

  const productosFiltrados = filtro
    ? productos.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
    : productos;

  return (
    <div className="p-6 bg-background text-text min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Inventario en tiempo real</h1>
        <div className="flex gap-2">
          <button onClick={exportarExcel} className="bg-primary text-white px-3 py-2 rounded hover:bg-secondary">Exportar Excel</button>
          <button onClick={exportarPDF} className="bg-primary text-white px-3 py-2 rounded hover:bg-secondary">Exportar PDF</button>
          <Link href="/dashboard/inventario/nuevo" className="bg-primary text-white px-3 py-2 rounded hover:bg-secondary">+ Producto</Link>
        </div>
      </div>

      <input
        type="text"
        placeholder="Filtrar por nombre..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        className="mb-4 p-2 border w-full rounded"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Distribución del Stock</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={dataGrafico} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {dataGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Productos filtrados</h2>
          <ul className="space-y-2">
            {productosFiltrados.map(p => (
              <li
                key={p.id}
                className="border p-2 rounded flex justify-between items-center cursor-pointer hover:bg-gray-100"
                onClick={() => abrirModal(p)}
              >
                <span>{p.nombre}</span>
                <span className="text-sm text-gray-500">Cantidad: {p.cantidad}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full relative">
            <button onClick={cerrarModal} className="absolute top-2 right-2 text-gray-500 hover:text-black">&times;</button>
            <h2 className="text-xl font-bold text-primary mb-2">{productoSeleccionado.nombre}</h2>
            <p className="mb-2">Cantidad actual: <strong>{productoSeleccionado.cantidad}</strong></p>
            <h3 className="font-semibold mb-2">Historial de movimientos:</h3>
            <ul className="max-h-60 overflow-y-auto space-y-1 text-sm">
              {movimientos.length === 0 ? (
                <li className="text-gray-500">Sin movimientos</li>
              ) : (
                movimientos.map(m => (
                  <li key={m.id}>
                    [{m.tipo}] {m.cantidad} unidades – {new Date(m.fecha).toLocaleString()}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
