export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Client {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documentoIdentidad: string;
  direccion: string;
  createdAt?: string;
}

export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  numeroPuertas: number;
}

export type EstadoCita = "pendiente" | "completada" | "cancelada";

export interface Cita {
  id: number;
  fecha: string;
  descripcion: string;
  estado: EstadoCita;
  telefono: string;
  presupuestoMax: number;
  presupuestoBasico?: number;
  presupuestoIntermedio?: number;
  presupuestoPremium?: number;
  matricula: string;
  clienteId?: number;
  vehiculoId: number;
  servicios: Servicio[];
}

export interface CitaConRelaciones extends Cita {
  cliente: Client | null;
  vehiculo: Vehiculo | null;
  servicios: Servicio[];
  presupuestoBasico?: number;
  presupuestoIntermedio?: number;
  presupuestoPremium?: number;
}

export type Servicio = {
  nombre: string;
  descripcion?: string;
  precio?: number;
};

export type NuevaCitaForm = {
  clienteId?: number;
  vehiculoId?: number;
  fecha: string;
  descripcion: string;
  telefono: string;
  presupuestoMax?: string;
  presupuestoBasico?: string;
  presupuestoIntermedio?: string;
  presupuestoPremium?: string;
  matricula?: string;
  estado: "pendiente" | "completada" | "cancelada";
  servicios: Servicio[];
};

export interface PresupuestoVehiculo {
  id: number;
  vehiculoId: number;
  citaId: number;
  descripcion: string;
  presupuestoMax: number;
  fecha: string;
}

export interface FacturaItem {
  id: number;
  facturaId: number;
  descripcion: string;
  cantidad: number;
  precioUnit: number;
}

export interface Factura {
  id: number;
  fecha: string;
  subtotal: number;
  iva: number;
  total: number;
  clienteId: number;
  citaId: number;
  numeroAnual: number;
}

export interface FacturaConItems extends Factura {
  items: FacturaItem[];
  cliente?: Client;
  cita?: Cita;
}

export interface ReciboItem {
  id: number;
  reciboId: number;
  descripcion: string;
  cantidad: number;
  precioUnit: number;
}

export interface Recibo {
  id: number;
  fecha: string;
  monto: number;
  clienteId: number;
  citaId: number;
  descripcion?: string;
  estado?: string;
  numeroAnual: number;
}

export interface ReciboConItems extends Recibo {
  items: ReciboItem[];
  cliente?: Client;
  cita?: Cita;
}

export type TipoTransaccion = "ingreso" | "gasto";
export type OrigenTransaccion = "factura" | "recibo" | "manual";

export interface Transaccion {
  id: number;
  tipo: TipoTransaccion;
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
  origen: OrigenTransaccion;
  referenciaId?: number;
  numeroFacturaGasto?: string;
}

export interface FiltroTransacciones {
  tipo?: TipoTransaccion;
  origen?: OrigenTransaccion;
  dateFrom?: string;
  dateTo?: string;
  minMonto?: number;
  maxMonto?: number;
}

export interface ResumenGrafico {
  fecha: string;
  ingresos: number;
  gastos: number;
}
