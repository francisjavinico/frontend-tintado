import { create } from "zustand";
import api from "@/api/client";

interface PuntoResumen {
  periodo: string;
  ingresos: number;
}

interface Tendencia {
  porcentaje: number;
  direccion: "up" | "down";
}

interface ResumenDashboard {
  facturadoMes: number;
  gastosMes: number;
  citasPendientes: number;
  clientesNuevos: number;
  tendencias: {
    facturado: Tendencia;
    gastos: Tendencia;
    clientes: Tendencia;
  };
}

interface DashboardState {
  resumen: ResumenDashboard;
  datosIngresos: PuntoResumen[];

  loadingResumen: boolean;
  errorResumen: string | null;

  loadingGrafico: boolean;
  errorGrafico: string | null;

  fetchResumen: () => Promise<void>;
  fetchGraficoIngresos: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  resumen: {
    facturadoMes: 0,
    gastosMes: 0,
    citasPendientes: 0,
    clientesNuevos: 0,
    tendencias: {
      facturado: { porcentaje: 0, direccion: "up" },
      gastos: { porcentaje: 0, direccion: "down" },
      clientes: { porcentaje: 0, direccion: "up" },
    },
  },
  datosIngresos: [],

  loadingResumen: false,
  errorResumen: null,

  loadingGrafico: false,
  errorGrafico: null,

  fetchResumen: async () => {
    set({ loadingResumen: true, errorResumen: null });
    try {
      const res = await api.get<ResumenDashboard>("/dashboard/resumen");
      set({ resumen: res.data });
    } catch {
      set({ errorResumen: "Error al cargar resumen del dashboard" });
    } finally {
      set({ loadingResumen: false });
    }
  },

  fetchGraficoIngresos: async () => {
    set({ loadingGrafico: true, errorGrafico: null });
    try {
      const res = await api.get<PuntoResumen[]>("/dashboard/grafico-ingresos");
      set({ datosIngresos: res.data });
    } catch {
      set({ errorGrafico: "Error al cargar gráfico de ingresos" });
    } finally {
      set({ loadingGrafico: false });
    }
  },
}));
