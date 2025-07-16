import { create } from "zustand";
import api from "@/api/client";
import { Transaccion } from "@/types/types";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

interface FiltrosTabla {
  dateFrom?: string;
  dateTo?: string;
}

interface FiltrosGrafico {
  tipo?: "mensual" | "diario" | "semanal";
}

interface PuntoResumen {
  periodo: string;
  ingresos: number;
  gastos: number;
}

interface TransaccionesState {
  ultimas: Transaccion[];
  todas: Transaccion[];
  datos: PuntoResumen[];
  loadingTabla: boolean;
  loadingGrafico: boolean;
  error: string | null;

  filtrosTabla: FiltrosTabla;
  filtrosGrafico: FiltrosGrafico;

  setFiltrosTabla: (filtros: FiltrosTabla) => void;
  setFiltrosGrafico: (filtros: FiltrosGrafico) => void;

  fetchUltimasTransacciones: (page?: number) => Promise<void>;
  fetchTransaccionesTotales: () => Promise<void>;
  fetchResumen: () => Promise<void>;
}

let currentRequestTabla = 0;
let currentRequestGrafico = 0;

type TransaccionesResponse =
  | Transaccion[]
  | { transacciones: Transaccion[]; total: number };

export const useTransaccionesStore = create<TransaccionesState>((set, get) => ({
  ultimas: [],
  todas: [],
  datos: [],
  loadingTabla: false,
  loadingGrafico: false,
  error: null,

  filtrosTabla: {},
  filtrosGrafico: { tipo: "mensual" },

  setFiltrosTabla: (filtros) => set({ filtrosTabla: filtros }),
  setFiltrosGrafico: (filtros) => {
    const hoy = new Date();
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;

    switch (filtros.tipo) {
      case "diario":
        dateFrom = startOfDay(hoy);
        dateTo = endOfDay(hoy);
        break;
      case "semanal":
        dateFrom = startOfWeek(hoy, { weekStartsOn: 1 });
        dateTo = endOfWeek(hoy, { weekStartsOn: 1 });
        break;
      case "mensual":
        dateFrom = startOfMonth(hoy);
        dateTo = endOfMonth(hoy);
        break;
    }

    const filtrosConFechas = {
      ...filtros,
      dateFrom: dateFrom?.toISOString(),
      dateTo: dateTo?.toISOString(),
    };

    set({ filtrosGrafico: filtrosConFechas });
    get().fetchResumen();
  },
  fetchUltimasTransacciones: async (page = 1) => {
    const req = ++currentRequestTabla;
    const { filtrosTabla } = get();
    set({ loadingTabla: true, error: null });
    try {
      const res = await api.get<TransaccionesResponse>("/transacciones", {
        params: {
          ...filtrosTabla,
          page,
          pageSize: 10,
        },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.transacciones;
      if (req === currentRequestTabla) set({ ultimas: data });
    } catch {
      if (req === currentRequestTabla)
        set({ error: "Error al cargar transacciones" });
    } finally {
      set({ loadingTabla: false });
    }
  },
  fetchTransaccionesTotales: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get<TransaccionesResponse>("/transacciones", {
        params: {
          pageSize: 10000,
        },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.transacciones;
      set({ todas: data });
    } catch {
      set({ error: "Error al cargar todas las transacciones" });
    } finally {
      set({ loading: false });
    }
  },
  fetchResumen: async () => {
    const req = ++currentRequestGrafico;
    const { filtrosGrafico } = get();
    set({ loadingGrafico: true, error: null });
    try {
      const res = await api.get<PuntoResumen[]>(
        "/transacciones/resumen-grafico",
        {
          params: filtrosGrafico,
        }
      );
      if (req === currentRequestGrafico) set({ datos: res.data });
    } catch {
      if (req === currentRequestGrafico)
        set({ error: "Error al cargar gráfico" });
    } finally {
      set({ loadingGrafico: false });
    }
  },
}));
