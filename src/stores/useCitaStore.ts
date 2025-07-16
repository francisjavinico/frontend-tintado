import { create } from "zustand";
import api from "../api/client";
import { CitaConRelaciones } from "../types/types";
import axios from "axios";
import { FinalizarCitaInput } from "@/schemas/finalizarCitaSchema";

interface CitaState {
  citas: CitaConRelaciones[];
  citasHoy: CitaConRelaciones[];
  loading: boolean;
  error: string | null;

  fetchCitas: () => Promise<void>;
  fetchCitasHoy: () => Promise<void>;
  createCita: (data: Partial<CitaConRelaciones>) => Promise<void>;
  updateCita: (id: number, data: Partial<CitaConRelaciones>) => Promise<void>;
  deleteCita: (id: number) => Promise<void>;
  finalizarCita: (data: FinalizarCitaInput) => Promise<void>;
}

export const useCitasStore = create<CitaState>((set) => ({
  citas: [],
  citasHoy: [],
  loading: false,
  error: null,

  fetchCitas: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<CitaConRelaciones[]>("/citas");
      set({ citas: data });
    } catch (error: unknown) {
      let message = "Error al cargar citas";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  fetchCitasHoy: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<CitaConRelaciones[]>(
        "/citas/hoy/pendientes"
      );
      set({ citasHoy: data });
    } catch (error: unknown) {
      let message = "Error al cargar citas de hoy";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  createCita: async (data) => {
    set({ loading: true });
    try {
      await api.post("/citas", data);
      await useCitasStore.getState().fetchCitas();
    } catch (error: unknown) {
      let message = "Error al crear la cita";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  updateCita: async (id, data) => {
    set({ loading: true });
    try {
      await api.put(`/citas/${id}`, data);
      await useCitasStore.getState().fetchCitas();
    } catch (error: unknown) {
      let message = "Error al actualizar la cita";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  deleteCita: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`/citas/${id}`);
      await useCitasStore.getState().fetchCitas();
    } catch (error: unknown) {
      let message = "Error al borrar la cita";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  finalizarCita: async (data: FinalizarCitaInput) => {
    set({ loading: true });
    try {
      await api.post("/citas/finalizar", data);
      await useCitasStore.getState().fetchCitas();
      await useCitasStore.getState().fetchCitasHoy();
    } catch (error: unknown) {
      let message = "Error al finalizar la cita";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
}));
