import CheckInPage from "@/pages/CheckinPage";
import FacturasPage from "@/pages/FacturasPage";
import GraciasPage from "@/pages/GraciasPage";
import NuevaCitaPage from "@/pages/NuevaCitaPage";
import RecibosPage from "@/pages/RecibosPage";
import VehiculosPage from "@/pages/VehiculosPage";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import CitasPage from "../pages/CitasPage";
import ClientsPage from "../pages/ClientPage";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import UserPage from "../pages/UserPage";
import { useAuthStore } from "../stores/useAuthStore";
import TransaccionesPage from "@/pages/TransaccionesPage";
import { ReactNode } from "react";
import ResetPasswordPage from "../pages/ResetPasswordPage";

const EMPLEADO_ROUTES = ["/dashboard", "/citas", "/vehiculos", "/clients"];

function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const location = window.location.pathname;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    user.role === "empleado" &&
    !EMPLEADO_ROUTES.some((route) => location.startsWith(route))
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const restoreSession = useAuthStore.getState().restoreSession;

  useEffect(() => {
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/checkin/:id" element={<CheckInPage />} />
      <Route path="/gracias" element={<GraciasPage />} />

      <Route
        path="/"
        element={
          isAuthenticated() ? (
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UserPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="citas" element={<CitasPage />} />
        <Route path="/citas/nueva" element={<NuevaCitaPage />} />
        <Route path="/vehiculos" element={<VehiculosPage />} />
        <Route path="/facturas" element={<FacturasPage />} />
        <Route path="/recibos" element={<RecibosPage />} />
        <Route path="/transacciones" element={<TransaccionesPage />} />
      </Route>
      <Route
        path="*"
        element={
          isAuthenticated() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
