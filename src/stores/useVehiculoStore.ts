import { create } from "zustand";
import axios from "axios";
import api from "@/api/client";
import { Vehiculo, PresupuestoVehiculo } from "@/types/types";

interface VehiculoState {
  vehiculos: Vehiculo[];
  loading: boolean;
  error: string | null;
  historial: PresupuestoVehiculo[];
  loadingHistorial: boolean;
  errorHistorial: string | null;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  loadingMore: boolean;

  fetchVehiculos: (params?: {
    search?: string;
    marca?: string;
    modelo?: string;
    año?: number;
    page?: number;
    pageSize?: number;
    append?: boolean;
  }) => Promise<void>;
  addVehiculo: (
    vehiculo: Omit<Vehiculo, "id">
  ) => Promise<Vehiculo | undefined>;
  updateVehiculo: (id: number, data: Omit<Vehiculo, "id">) => Promise<void>;
  deleteVehiculo: (id: number) => Promise<void>;

  fetchHistorialPresupuestos: (vehiculoId: number) => Promise<void>;
  clearHistorial: () => void;
}

export const useVehiculoStore = create<VehiculoState>((set, get) => ({
  vehiculos: [],
  loading: false,
  error: null,
  historial: [],
  loadingHistorial: false,
  errorHistorial: null,
  search: "",
  setSearch: (value) => set({ search: value }),
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 1,
  loadingMore: false,

  fetchVehiculos: async (params = {}) => {
    const {
      search,
      marca,
      modelo,
      año,
      page = 1,
      pageSize = 20,
      append = false,
    } = params;
    if (append) set({ loadingMore: true });
    else set({ loading: true, error: null });
    try {
      const { data } = await api.get("/vehiculos", {
        params: { search, marca, modelo, año, page, pageSize },
      });
      if (append) {
        set((state) => ({
          vehiculos: [...state.vehiculos, ...data.vehicles],
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages,
          loadingMore: false,
        }));
      } else {
        set({
          vehiculos: data.vehicles,
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages,
          loading: false,
        });
      }
    } catch (error: unknown) {
      let message = "Error al cargar vehículos";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message, loading: false, loadingMore: false });
    }
  },

  addVehiculo: async (vehiculo) => {
    console.log("[addVehiculo] Enviando:", vehiculo);
    try {
      const { data } = await api.post<Vehiculo>("/vehiculos", vehiculo);
      set({ vehiculos: [...get().vehiculos, data] });
      return data;
    } catch {
      return undefined;
    }
  },

  updateVehiculo: async (id, data) => {
    try {
      const res = await api.put(`/vehiculos/${id}`, data);
      set({
        vehiculos: get().vehiculos.map((v) => (v.id === id ? res.data : v)),
      });
    } catch {
      // Error silenciado
    }
  },

  deleteVehiculo: async (id) => {
    try {
      await api.delete(`/vehiculos/${id}`);
      set({
        vehiculos: get().vehiculos.filter((v) => v.id !== id),
      });
    } catch {
      // Error silenciado
    }
  },

  fetchHistorialPresupuestos: async (vehiculoId: number) => {
    set({ loadingHistorial: true, errorHistorial: null });
    try {
      const { data } = await api.get<PresupuestoVehiculo[]>(
        `/vehiculos/historial/${vehiculoId}`
      );
      set({ historial: data });
    } catch (error: unknown) {
      let message = "Error al cargar historial de presupuestos";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ errorHistorial: message });
    } finally {
      set({ loadingHistorial: false });
    }
  },

  clearHistorial: () => {
    set({ historial: [], errorHistorial: null });
  },
}));
