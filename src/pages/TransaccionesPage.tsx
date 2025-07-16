import { useEffect, useMemo, useState } from "react";
import { useTransaccionesStore } from "@/stores/useTransaccionesStore";
import {
  Box,
  Flex,
  Heading,
  Button,
  Input,
  HStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";
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
  const [isOpenNuevo, setIsOpenNuevo] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Cargar las 10 últimas y todas al montar
  useEffect(() => {
    setFiltrosTabla({});
    fetchUltimasTransacciones();
    fetchTransaccionesTotales();
    setTimeout(() => {
      setFiltrosGrafico({ tipo: "mensual" });
    }, 0);
  }, [
    fetchUltimasTransacciones,
    setFiltrosGrafico,
    fetchTransaccionesTotales,
    setFiltrosTabla,
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
    <Box p={{ base: 2, md: 6 }} bg="gray.50" minH="100vh">
      {/* Header con título, botones de exportación y nueva transacción */}
      <Flex align="center" justify="space-between" mb={2} gap={4} wrap="wrap">
        <Heading size="lg" color="gray.700">
          Transacciones
        </Heading>
        <Flex gap={2} align="center">
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

      {/* Gráfico y tabla alineados con separación visual */}
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={8}
        align="stretch"
        w="full"
      >
        <Box flex={1} minW={0}>
          {/* Filtro de fechas centrado respecto a la tabla */}
          <Flex justify="center" align="center" mb={4}>
            <HStack gap={2}>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                size="sm"
                variant="flushed"
                maxW="140px"
              />
              <Text fontSize="sm">-</Text>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                size="sm"
                variant="flushed"
                maxW="140px"
              />
              <Button
                size="sm"
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
          <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
            <ResumenTotalesTransacciones total={totalNeto} />
          </Box>
        </Box>
        {/* Divider horizontal solo en mobile */}
        <Divider
          display={{ base: "block", lg: "none" }}
          orientation="horizontal"
          color="gray.200"
          borderColor="gray.200"
          my={4}
        />
        {/* Divider vertical solo en desktop */}
        <Divider
          display={{ base: "none", lg: "block" }}
          orientation="vertical"
          color="gray.200"
          borderColor="gray.200"
          mx={4}
          height="auto"
        />
        <Box flex={1} minW={0}>
          <GraficoTransacciones />
        </Box>
      </Flex>

      <NuevaTransaccionModal
        isOpen={isOpenNuevo}
        onClose={() => setIsOpenNuevo(false)}
      />
    </Box>
  );
}
