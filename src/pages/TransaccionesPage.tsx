import { useEffect, useMemo, useState } from "react";
import { useTransaccionesStore } from "@/stores/useTransaccionesStore";
import { useDashboardStore } from "@/stores/useDashboardStore";
import CardEstadistica from "@/components/dashboard/CardEstadistica";
import {
  Box,
  Flex,
  Heading,
  Button,
  Input,
  HStack,
  Text,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import { FiDollarSign, FiTrendingDown } from "react-icons/fi";
import TablaTransacciones from "@/components/transacciones/TablaUltimasTransacciones";
import GraficoTransacciones from "@/components/transacciones/GraficoTransacciones";
import NuevaTransaccionModal from "@/components/transacciones/NuevaTransaccionModal";
import BotonesExportacionTransacciones from "@/components/transacciones/BotonesExportacionTransacciones";
import ResumenTotalesTransacciones from "@/components/transacciones/ResumenTotalesTransacciones";

export default function TransaccionesPage() {
  const {
    fetchUltimasTransacciones,
    fetchTransaccionesTotales,
    todas,
    setFiltrosTabla,
    setFiltrosGrafico,
  } = useTransaccionesStore();

  const { resumen, fetchResumen } = useDashboardStore();

  const [isOpenNuevo, setIsOpenNuevo] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Función para formatear el valor de tendencia
  const formatTrendValue = (porcentaje: number): string => {
    const sign = porcentaje >= 0 ? "+" : "";
    return `${sign}${porcentaje.toFixed(1)}% vs mes anterior`;
  };

  // Cargar las 10 últimas y todas al montar
  useEffect(() => {
    setFiltrosTabla({});
    fetchUltimasTransacciones();
    fetchTransaccionesTotales();
    fetchResumen(); // Cargar datos del dashboard para los recuadros
    setTimeout(() => {
      setFiltrosGrafico({ tipo: "mensual" });
    }, 0);
  }, [
    fetchUltimasTransacciones,
    setFiltrosGrafico,
    fetchTransaccionesTotales,
    setFiltrosTabla,
    fetchResumen,
  ]);

  // Actualizar filtro por fecha
  useEffect(() => {
    if (!dateFrom && !dateTo) {
      setFiltrosTabla({});
      fetchUltimasTransacciones();
      fetchTransaccionesTotales();
      return;
    }
    setFiltrosTabla({ dateFrom, dateTo });
    fetchUltimasTransacciones();
    fetchTransaccionesTotales();
  }, [
    dateFrom,
    dateTo,
    setFiltrosTabla,
    fetchUltimasTransacciones,
    fetchTransaccionesTotales,
  ]);

  // Resumen calculado (total neto de todas las transacciones o del filtro)
  const transFiltradas = useMemo(() => {
    let trans = todas;
    if (dateFrom || dateTo) {
      trans = todas.filter((t) => {
        const fecha = t.fecha.slice(0, 10);
        return (!dateFrom || fecha >= dateFrom) && (!dateTo || fecha <= dateTo);
      });
    }
    return trans;
  }, [todas, dateFrom, dateTo]);

  const totalNeto = useMemo(() => {
    return transFiltradas.reduce(
      (acc, t) => acc + (t.tipo === "ingreso" ? t.monto : -t.monto),
      0
    );
  }, [transFiltradas]);

  return (
    <Box p={{ base: 1, md: 2 }} bg="gray.50" minH="100vh">
      {/* Header con título, botones de exportación y nueva transacción */}
      <Flex align="center" justify="space-between" mb={1} gap={2} wrap="wrap">
        <Heading size="lg" color="gray.700">
          Transacciones
        </Heading>
        <Flex gap={1} align="center">
          <BotonesExportacionTransacciones />
          <Button
            onClick={() => setIsOpenNuevo(true)}
            colorScheme="blue"
            size="sm"
            leftIcon={<AddIcon />}
          >
            Nueva transacción
          </Button>
        </Flex>
      </Flex>

      {/* Recuadros de estadísticas financieras */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 2 }} spacing={2} mb={2}>
        <CardEstadistica
          label="Facturado este mes"
          value={`${resumen.facturadoMes.toFixed(2)} €`}
          icon={<FiDollarSign />}
          colorScheme="blue"
          trend={resumen.tendencias.facturado.direccion}
          trendValue={formatTrendValue(resumen.tendencias.facturado.porcentaje)}
        />
        <CardEstadistica
          label="Gastos del mes"
          value={`${resumen.gastosMes.toFixed(2)} €`}
          icon={<FiTrendingDown />}
          colorScheme="orange"
          trend={resumen.tendencias.gastos.direccion}
          trendValue={formatTrendValue(resumen.tendencias.gastos.porcentaje)}
        />
      </SimpleGrid>

      {/* Gráfico y tabla alineados con separación visual */}
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={2}
        align="stretch"
        w="full"
      >
        <Box flex={1} minW={0}>
          {/* Filtro de fechas centrado respecto a la tabla */}
          <Flex justify="center" align="center" mb={2}>
            <HStack gap={1}>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                size="xs"
                variant="flushed"
                maxW="110px"
              />
              <Text fontSize="sm">-</Text>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                size="xs"
                variant="flushed"
                maxW="110px"
              />
              <Button
                size="xs"
                colorScheme="gray"
                variant="ghost"
                leftIcon={<CloseIcon boxSize={4} />}
                iconSpacing={2}
                px={3}
                _hover={{ bg: "gray.100", boxShadow: "none", border: "none" }}
                _focus={{ outline: "none", boxShadow: "none", border: "none" }}
                ml={1}
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Limpiar
              </Button>
            </HStack>
          </Flex>
          <TablaTransacciones />
          {/* Resumen debajo de la tabla, alineado a la derecha */}
          <Box mt={1} mb={1} display="flex" justifyContent="flex-end">
            <ResumenTotalesTransacciones total={totalNeto} />
          </Box>
        </Box>
        {/* Divider horizontal solo en mobile */}
        <Divider
          display={{ base: "block", lg: "none" }}
          orientation="horizontal"
          color="gray.200"
          borderColor="gray.200"
          my={1}
        />
        {/* Divider vertical solo en desktop */}
        <Divider
          display={{ base: "none", lg: "block" }}
          orientation="vertical"
          color="gray.200"
          borderColor="gray.200"
          mx={1}
          height="auto"
        />
        <Box flex={1} minW={0}>
          <Box
            bg="white"
            p={{ base: 2, md: 3 }}
            borderRadius="lg"
            boxShadow="0 2px 4px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)"
            border="1px solid"
            borderColor="gray.200"
            minH="180px"
          >
            <GraficoTransacciones />
          </Box>
        </Box>
      </Flex>

      <NuevaTransaccionModal
        isOpen={isOpenNuevo}
        onClose={() => setIsOpenNuevo(false)}
      />
    </Box>
  );
}
