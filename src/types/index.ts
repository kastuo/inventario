export interface Producto { 
  id: number; 
  nombre: string; 
  stockActual: number;   
  stockMinimo: number;   
}
export interface Movimiento {
  id: number;
  productoId: number;
  producto: Producto;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  stockAnterior: number;
  stockDespues: number;
  observaciones?: string;
  createdAt: string;
}
