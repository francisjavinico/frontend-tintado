import { create } from "zustand";
import { ReciboConItems } from "@/types/types";
import api from "@/api/client";
import axios from "axios";

interface RecibosFiltro {
  dateFrom?: string;
  dateTo?: string;
  cliente?: string;
}

interface TotalesRecibos {
  total: number;
  cantidad: number;
}

interface ReciboState {
  recibos: ReciboConItems[];
  loading: boolean;
  error: string | null;
  filtros: RecibosFiltro;
  page: number;
  resumen: TotalesRecibos;

  fetchRecibos: () => Promise<void>;
  setFiltros: (filtros: RecibosFiltro) => void;
  setPage: (page: number) => void;
}

export const useRecibosStore = create<ReciboState>((set, get) => ({
  recibos: [],
  loading: false,
  error: null,
  filtros: {},
  page: 1,
  resumen: { total: 0, cantidad: 0 },

  setFiltros: (filtros) => set({ filtros, page: 1 }),
  setPage: (page) => set({ page }),

  fetchRecibos: async () => {
    const { filtros, page } = get();
    set({ loading: true, error: null });
    try {
      const params: Record<string, string> = {
        page: String(page),
      };

      if (filtros.dateFrom) params.dateFrom = filtros.dateFrom;
      if (filtros.dateTo) params.dateTo = filtros.dateTo;
      if (filtros.cliente && filtros.cliente.trim() !== "") {
        params.cliente = filtros.cliente.trim();
      }

      const { data } = await api.get<ReciboConItems[]>("/recibos", {
        params,
      });

      const resumen = data.reduce(
        (acc, r) => ({
          total: acc.total + r.monto,
          cantidad: acc.cantidad + 1,
        }),
        { total: 0, cantidad: 0 }
      );

      set({ recibos: data, resumen });
    } catch (error: unknown) {
      let message = "Error al cargar los recibos";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
}));
