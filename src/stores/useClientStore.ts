import axios from "axios";
import { create } from "zustand";
import api from "../api/client";
import { Cita, Client } from "../types/types";

interface ClientState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
  updateClient: (id: number, data: Partial<Client>) => Promise<void>;
  createClient: (Client: Partial<Client>) => Promise<void>;
  clientAppointments: Cita[];
  loadingAppointments: boolean;
  errorAppointments: string | null;
  fetchAppointmentsByClientId: (id: number) => Promise<void>;
  appointmentsModalOpen: boolean;
  selectedClientId: number | null;
  openAppointmentsModal: (clientId: number) => Promise<void>;
  closeAppointmentsModal: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  loading: false,
  error: null,
  clientAppointments: [],
  loadingAppointments: false,
  errorAppointments: null,
  appointmentsModalOpen: false,
  selectedClientId: null,

  openAppointmentsModal: async (clientId: number) => {
    set({ appointmentsModalOpen: true, selectedClientId: clientId });
    await useClientStore.getState().fetchAppointmentsByClientId(clientId);
  },

  closeAppointmentsModal: () => {
    set({
      appointmentsModalOpen: false,
      selectedClientId: null,
      clientAppointments: [],
    });
  },

  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<Client[]>("/clients");
      set({ clients: data });
    } catch (error: unknown) {
      let message = "Error al cargar clientes";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  createClient: async (client) => {
    set({ loading: true, error: null });
    try {
      await api.post<Client>("/clients", client);
      const { data } = await api.get<Client[]>("/clients");
      set({ clients: data });
    } catch (error: unknown) {
      let message = "Error al crear cliente";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },
  deleteClient: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete<Client[]>(`/clients/${id}`);
      const { data } = await api.get<Client[]>("/clients");
      set({ clients: data });
    } catch (error: unknown) {
      let message = "Error al eliminar cliente";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  updateClient: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/clients/${id}`, data);
      const { data: updatedList } = await api.get<Client[]>("/clients");
      set({ clients: updatedList });
    } catch (error: unknown) {
      let message = "Error al actualizar cliente";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  fetchAppointmentsByClientId: async (id) => {
    set({ loadingAppointments: true, errorAppointments: null });
    try {
      const { data } = await api.get<Cita[]>(`/citas?clienteId=${id}`);
      set({ clientAppointments: data });
    } catch (error: unknown) {
      let message = "Error al cargar citas del cliente";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ errorAppointments: message });
    } finally {
      set({ loadingAppointments: false });
    }
  },
}));
