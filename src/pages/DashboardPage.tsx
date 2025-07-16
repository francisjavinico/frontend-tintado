import CardEstadistica from "@/components/dashboard/CardEstadistica";
import CitasPendientes from "@/components/dashboard/CitasPendientes";
import GraficoIngresos from "@/components/dashboard/GraficoIngresos";
import NuevaTransaccionModal from "@/components/transacciones/NuevaTransaccionModal";
import LoadingSpinner from "@/components/utils/LoadingSpinner";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Box, Button, SimpleGrid, useDisclosure, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    isOpen: isTxOpen,
    onOpen: onTxOpen,
    onClose: onTxClose,
  } = useDisclosure();

  const { resumen, loadingResumen, formatTrendValue } = useDashboardStats();

  const actionButtons = (
    <Flex gap={2} wrap="wrap">
      <Button
        leftIcon={<FiPlus />}
        colorScheme="brand"
        size="md"
        onClick={() => navigate("/citas/nueva")}
        _hover={{ transform: "translateY(-1px)" }}
        transition="all 0.2s ease"
      >
        Nueva Cita
      </Button>
      <Button
        leftIcon={<FiDollarSign />}
        colorScheme="accent"
        size="md"
        onClick={onTxOpen}
        _hover={{ transform: "translateY(-1px)" }}
        transition="all 0.2s ease"
      >
        Nueva Transacción
      </Button>
    </Flex>
  );

  return (
    <Box px={{ base: 2, md: 4 }} py={2} w="full">
      {/* Acciones arriba a la derecha */}
      <Flex justify="flex-end" mb={2}>
        {actionButtons}
      </Flex>

      {loadingResumen ? (
        <LoadingSpinner message="Cargando datos del dashboard..." />
      ) : (
        <>
          {/* Statistics Cards */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={3} mb={3}>
            <CardEstadistica
              label="Facturado este mes"
              value={`${resumen.facturadoMes.toFixed(2)} €`}
              icon={<FiDollarSign />}
              colorScheme="blue"
              trend={resumen.tendencias.facturado.direccion}
              trendValue={formatTrendValue(
                resumen.tendencias.facturado.porcentaje
              )}
            />
            <CardEstadistica
              label="Gastos del mes"
              value={`${resumen.gastosMes.toFixed(2)} €`}
              icon={<FiTrendingDown />}
              colorScheme="orange"
              trend={resumen.tendencias.gastos.direccion}
              trendValue={formatTrendValue(
                resumen.tendencias.gastos.porcentaje
              )}
            />
            <CardEstadistica
              label="Citas pendientes"
              value={resumen.citasPendientes.toString()}
              icon={<FiCalendar />}
              colorScheme="green"
            />
            <CardEstadistica
              label="Clientes nuevos"
              value={resumen.clientesNuevos.toString()}
              icon={<FiTrendingUp />}
              colorScheme="purple"
              trend={resumen.tendencias.clientes.direccion}
              trendValue={formatTrendValue(
                resumen.tendencias.clientes.porcentaje
              )}
            />
          </SimpleGrid>

          {/* Charts Section */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
            <Box
              bg="white"
              p={4}
              borderRadius="2xl"
              boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              border="1px solid"
              borderColor="gray.200"
              minH="260px"
            >
              <GraficoIngresos />
            </Box>

            <Box
              bg="white"
              p={4}
              borderRadius="2xl"
              boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              border="1px solid"
              borderColor="gray.200"
              minH="260px"
            >
              <CitasPendientes />
            </Box>
          </SimpleGrid>
        </>
      )}

      <NuevaTransaccionModal isOpen={isTxOpen} onClose={onTxClose} />
    </Box>
  );
}
