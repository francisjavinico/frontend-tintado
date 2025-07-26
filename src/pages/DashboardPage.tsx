import CardEstadistica from "@/components/dashboard/CardEstadistica";
import CitasPendientes from "@/components/dashboard/CitasPendientes";
import GraficoIngresos from "@/components/dashboard/GraficoIngresos";
import NuevaTransaccionModal from "@/components/transacciones/NuevaTransaccionModal";
import LoadingSpinner from "@/components/utils/LoadingSpinner";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAuthStore } from "@/stores/useAuthStore";
import { useClientStore } from "@/stores/useClientStore";
import {
  Box,
  Button,
  SimpleGrid,
  useDisclosure,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { useState } from "react";
import EditClientModal from "@/components/clientes/EditClientModal";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    isOpen: isTxOpen,
    onOpen: onTxOpen,
    onClose: onTxClose,
  } = useDisclosure();

  // Estado para modal de cliente
  const [isClientOpen, setIsClientOpen] = useState(false);
  const { clients, createClient } = useClientStore();

  const { resumen, loadingResumen, formatTrendValue } = useDashboardStats();

  return (
    <Box px={{ base: 1, md: 2 }} py={1} w="full">
      {/* Recuadro de bienvenida con todo en una fila */}
      <Box
        bg="white"
        p={{ base: 3, md: 4 }}
        borderRadius="xl"
        boxShadow="0 2px 4px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)"
        border="1px solid"
        borderColor="gray.200"
        mb={2}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          gap={{ base: 2, md: 4 }}
          w="full"
        >
          <Flex align="center" gap={2}>
            <Box p={2} borderRadius="full" bg="blue.50" color="blue.600">
              <FiUser size={20} />
            </Box>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                ¡Bienvenido, {user?.name || "Usuario"}!
              </Text>
              <Text fontSize="sm" color="gray.600">
                Aquí tienes un resumen de tu negocio
              </Text>
            </Box>
          </Flex>
          <Flex gap={1}>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="brand"
              size="sm"
              onClick={() => navigate("/citas/nueva")}
              _hover={{ transform: "translateY(-1px)" }}
              transition="all 0.2s ease"
            >
              Nueva Cita
            </Button>
            <Button
              leftIcon={<FiDollarSign />}
              colorScheme="accent"
              size="sm"
              onClick={onTxOpen}
              _hover={{ transform: "translateY(-1px)" }}
              transition="all 0.2s ease"
            >
              Nueva Transacción
            </Button>
            <Button
              leftIcon={<FiUser />}
              colorScheme="teal"
              size="sm"
              onClick={() => setIsClientOpen(true)}
              _hover={{ transform: "translateY(-1px)" }}
              transition="all 0.2s ease"
            >
              Nuevo Cliente
            </Button>
          </Flex>
        </Flex>
      </Box>

      {loadingResumen ? (
        <LoadingSpinner message="Cargando datos del dashboard..." />
      ) : (
        <>
          {/* Statistics Cards */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 2 }} spacing={2} mb={2}>
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
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={2}>
            <Box
              bg="white"
              p={{ base: 2, md: 3 }}
              borderRadius="lg"
              boxShadow="0 2px 4px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)"
              border="1px solid"
              borderColor="gray.200"
              minH="180px"
            >
              <GraficoIngresos />
            </Box>

            <Box
              bg="white"
              p={{ base: 2, md: 3 }}
              borderRadius="lg"
              boxShadow="0 2px 4px -1px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)"
              border="1px solid"
              borderColor="gray.200"
              minH="180px"
            >
              <CitasPendientes />
            </Box>
          </SimpleGrid>
        </>
      )}

      <NuevaTransaccionModal isOpen={isTxOpen} onClose={onTxClose} />
      <EditClientModal
        isOpen={isClientOpen}
        onClose={() => setIsClientOpen(false)}
        client={null}
        clients={clients}
        onSave={createClient}
      />
    </Box>
  );
}
