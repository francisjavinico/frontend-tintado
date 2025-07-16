import axios from "axios";
import { create } from "zustand";
import api from "../api/client";
import { User } from "../types/types";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
  createUser: (user: Partial<User>) => Promise<void>;
}

let currentRequest = 0;

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    const req = ++currentRequest;
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<User[]>("/users");
      if (req === currentRequest) set({ users: data });
    } catch (error: unknown) {
      let message = "Error al cargar usuarios";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      } else {
        console.log(
          "[useUserStore] Error desconocido al cargar usuarios:",
          error
        );
      }
      if (req === currentRequest) set({ error: message });
    } finally {
      if (req === currentRequest) set({ loading: false });
    }
  },
  createUser: async (user) => {
    set({ loading: true, error: null });
    try {
      await api.post<User>("/users", user);
      const { data } = await api.get<User[]>("/users");
      set({ users: data });
    } catch (error: unknown) {
      let message = "Error al crear usuario";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete<User[]>(`/users/${id}`);
      const { data } = await api.get<User[]>("/users");
      set({ users: data });
    } catch (error: unknown) {
      let message = "Error al eliminar usuario";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  updateUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/users/${id}`, data);
      const { data: updatedList } = await api.get<User[]>("/users");
      set({ users: updatedList });
    } catch (error: unknown) {
      let message = "Error al actualizar usuario";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      }
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
}));
