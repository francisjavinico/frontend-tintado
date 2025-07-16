import { Box, Spinner, Text, Center } from "@chakra-ui/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect } from "react";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function GraficoIngresos() {
  const datosIngresos = useDashboardStore((s) => s.datosIngresos);
  const loadingGrafico = useDashboardStore((s) => s.loadingGrafico);
  const errorGrafico = useDashboardStore((s) => s.errorGrafico);
  const fetchGraficoIngresos = useDashboardStore((s) => s.fetchGraficoIngresos);

  useEffect(() => {
    fetchGraficoIngresos();
  }, [fetchGraficoIngresos]);

  const ingresosData = [...datosIngresos]
    .sort(
      (a, b) => new Date(a.periodo).getTime() - new Date(b.periodo).getTime()
    )
    .map((d) => ({
      dia: format(new Date(d.periodo), "dd MMM", { locale: es }),
      ingreso: d.ingresos,
    }));

  if (loadingGrafico) {
    return (
      <Center h="300px">
        <Spinner size="lg" color="brand.500" />
      </Center>
    );
  }

  if (errorGrafico) {
    return (
      <Center h="300px">
        <Text color="error.500" fontSize="sm">
          {errorGrafico}
        </Text>
      </Center>
    );
  }

  return (
    <Box>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={ingresosData}>
          <defs>
            <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0077cc" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0077cc" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="dia"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={{ stroke: "#e2e8f0" }}
            tickFormatter={(value) => `${value}€`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ paddingBottom: "10px" }}
          />
          <Area
            type="monotone"
            dataKey="ingreso"
            stroke="#0077cc"
            strokeWidth={2}
            fill="url(#colorIngresos)"
            name="Ingresos"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
