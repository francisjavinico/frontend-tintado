import { Credentials } from "@/api/auth";
import api from "../api/client";
import { User } from "../types/types";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (creds: Credentials) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
  isAuthenticated: () => boolean;
}

let currentRequest = 0;

export const useAuthStore = create<AuthState>((set, get) => {
  return {
    user: null,
    token: null,
    loading: true,
    error: null,
    restoreSession: async () => {
      const req = ++currentRequest;
      set({ loading: true, error: null });
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
      } else {
        if (req === currentRequest) set({ loading: false });
        return;
      }
      try {
        const { data: me } = await api.get<User>("/auth/me");
        if (req === currentRequest) set({ user: me });
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common.Authorization;
          if (req === currentRequest) set({ user: null, token: null });
        }
      } finally {
        if (req === currentRequest) set({ loading: false });
      }
    },
    login: async (creds) => {
      const req = ++currentRequest;
      set({ loading: true, error: null });
      try {
        const { data } = await api.post<{ token: string }>(
          "/auth/login",
          creds
        );
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;

        const { data: me } = await api.get<User>("/auth/me");
        if (req === currentRequest) set({ user: me, token: data.token });
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ message?: string }>;
          const serverMsg = axiosErr.response?.data.message;

          if (req === currentRequest) {
            set({
              error:
                serverMsg || axiosErr.message || "Ocurrió un error inesperado",
            });
          }
        } else {
          if (req === currentRequest)
            set({ error: "Ocurrió un error inesperado" });
        }
        throw err;
      } finally {
        if (req === currentRequest) set({ loading: false });
      }
    },
    logout: () => {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common.Authorization;
      set({ user: null, token: null });
    },
    isAuthenticated: () => Boolean(get().user),
  };
});
