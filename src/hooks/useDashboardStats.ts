import { useEffect } from "react";
import { useDashboardStore } from "@/stores/useDashboardStore";

export const useDashboardStats = () => {
  const {
    resumen,
    loadingResumen,
    errorResumen,
    fetchResumen,
    fetchGraficoIngresos,
  } = useDashboardStore();

  useEffect(() => {
    fetchResumen();
    fetchGraficoIngresos();
  }, [fetchResumen, fetchGraficoIngresos]);

  // Función para formatear el valor de tendencia
  const formatTrendValue = (porcentaje: number): string => {
    const sign = porcentaje >= 0 ? "+" : "";
    return `${sign}${porcentaje.toFixed(1)}% vs mes anterior`;
  };

  // Función para obtener el color de la tendencia
  const getTrendColor = (direccion: "up" | "down") => {
    return direccion === "up" ? "success.500" : "error.500";
  };

  // Función para obtener el ícono de la tendencia
  const getTrendIcon = (direccion: "up" | "down") => {
    return direccion === "up" ? "↑" : "↓";
  };

  return {
    resumen,
    loadingResumen,
    errorResumen,
    formatTrendValue,
    getTrendColor,
    getTrendIcon,
  };
};
