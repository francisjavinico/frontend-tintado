import { useTransaccionesStore } from "@/stores/useTransaccionesStore";
import { Spinner, Text, VStack, HStack, Select, Box } from "@chakra-ui/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  LabelList,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Box
        bg="white"
        p={2}
        borderRadius="md"
        boxShadow="sm"
        border="1px solid #E2E8F0"
      >
        <Text fontWeight="bold" fontSize="sm" mb={1}>
          {label}
        </Text>
        <Text color="green.600" fontSize="xs">
          Ingresos: {payload[0]?.value?.toFixed(2)} €
        </Text>
        <Text color="red.500" fontSize="xs">
          Gastos: {payload[1]?.value?.toFixed(2)} €
        </Text>
      </Box>
    );
  }
  return null;
};

export default function GraficoTransacciones() {
  const { datos, filtrosGrafico, setFiltrosGrafico, loadingGrafico, error } =
    useTransaccionesStore();

  if (loadingGrafico) return <Spinner size="md" />;
  if (error) return <Text color="red.500">{error}</Text>;

  const formatLabel = (periodo: string) => {
    if (filtrosGrafico.tipo === "mensual") {
      const date = new Date(`${periodo}-01`);
      return format(date, "MMM yy", { locale: es });
    }
    if (filtrosGrafico.tipo === "diario") {
      const date = new Date(periodo);
      return format(date, "dd MMM", { locale: es });
    }
    if (filtrosGrafico.tipo === "semanal") {
      const year = Number(periodo.slice(0, 4));
      const week = Number(periodo.slice(4));
      return `Sem ${week} (${year})`;
    }
    return periodo;
  };

  return (
    <VStack
      align="start"
      spacing={2}
      w="full"
      p={4}
      bg="transparent"
      borderRadius="lg"
      boxShadow="none"
      maxH="340px"
      minH="320px"
    >
      <HStack w="full" justify="space-between" mb={1}>
        <Text fontSize="md" fontWeight="semibold" color="gray.700">
          Comportamiento financiero
        </Text>
        <Select
          size="sm"
          maxW="140px"
          value={filtrosGrafico.tipo}
          onChange={(e) =>
            setFiltrosGrafico({
              tipo: e.target.value as "diario" | "semanal" | "mensual",
            })
          }
          variant="flushed"
        >
          <option value="diario">Hoy</option>
          <option value="semanal">Semana</option>
          <option value="mensual">Mes</option>
        </Select>
      </HStack>
      <Box w="full" h="300px" bg="transparent" p={0}>
        {datos.length === 0 ? (
          <Box
            w="full"
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="gray.400">Sin datos para mostrar</Text>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={datos}
              margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 6"
                stroke="#E2E8F0"
                vertical={false}
              />
              <XAxis
                dataKey="periodo"
                tickFormatter={formatLabel}
                fontSize={12}
                stroke="#A0AEC0"
                tick={{ fontSize: 12, fill: "#718096", fontFamily: "inherit" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v} €`}
                fontSize={12}
                stroke="#A0AEC0"
                tick={{ fontSize: 12, fill: "#718096", fontFamily: "inherit" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                cursor={{ fill: "#EDF2F7", opacity: 0.5 }}
              />
              <Legend
                verticalAlign="top"
                height={24}
                iconSize={12}
                wrapperStyle={{
                  fontSize: 12,
                  color: "#4A5568",
                  fontFamily: "inherit",
                }}
              />
              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="#319795"
                fill="#B2F5EA"
                name="Ingresos"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "#319795",
                  stroke: "#319795",
                  strokeWidth: 1,
                }}
                activeDot={{
                  r: 5,
                  fill: "#319795",
                  stroke: "#285E61",
                  strokeWidth: 2,
                }}
              >
                <LabelList
                  dataKey="ingresos"
                  position="top"
                  formatter={(v: number) => `${v.toFixed(2)} €`}
                  fill="#319795"
                />
              </Area>
              <Area
                type="monotone"
                dataKey="gastos"
                stroke="#3182CE"
                fill="#BEE3F8"
                name="Gastos"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "#3182CE",
                  stroke: "#3182CE",
                  strokeWidth: 1,
                }}
                activeDot={{
                  r: 5,
                  fill: "#3182CE",
                  stroke: "#2C5282",
                  strokeWidth: 2,
                }}
              >
                <LabelList
                  dataKey="gastos"
                  position="top"
                  formatter={(v: number) => `${v.toFixed(2)} €`}
                  fill="#3182CE"
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Box>
    </VStack>
  );
}
