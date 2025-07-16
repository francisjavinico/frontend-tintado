import { create } from "zustand";
import api from "@/api/client";
import { FacturaConItems } from "@/types/types";
import axios from "axios";

interface FacturasFiltro {
  dateFrom?: string;
  dateTo?: string;
  cliente?: string;
}

interface Totales {
  subtotal: number;
  iva: number;
  total: number;
  cantidad: number;
}

interface FacturaState {
  facturas: FacturaConItems[];
  loading: boolean;
  error: string | null;
  filtros: FacturasFiltro;
  page: number;
  resumen: Totales;

  fetchFacturas: () => Promise<void>;
  setFiltros: (filtros: FacturasFiltro) => void;
  setPage: (page: number) => void;
}

export const useFacturasStore = create<FacturaState>((set, get) => ({
  facturas: [],
  loading: false,
  error: null,
  filtros: {},
  page: 1,
  resumen: { subtotal: 0, iva: 0, total: 0, cantidad: 0 },

  setFiltros: (filtros) => set({ filtros, page: 1 }),
  setPage: (page) => set({ page }),

  fetchFacturas: async () => {
    const { filtros, page } = get();
    set({ loading: true, error: null });

    try {
      const { data } = await api.get<FacturaConItems[]>("/facturas", {
        params: { ...filtros, page },
      });

      const resumen = data.reduce(
        (acc, f) => ({
          subtotal: acc.subtotal + f.subtotal,
          iva: acc.iva + f.iva,
          total: acc.total + f.total,
          cantidad: acc.cantidad + 1,
        }),
        { subtotal: 0, iva: 0, total: 0, cantidad: 0 }
      );

      set({ facturas: data, resumen });
    } catch (error: unknown) {
      let message = "Error al cargar las facturas";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
}));
