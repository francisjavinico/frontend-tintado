import {
  Box,
  Button,
  Flex,
  Heading,
  useDisclosure,
  useToast,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CitaFilters from "../components/citas/CitasFilter";
import CitaTable from "../components/citas/CitaTable";
import EditCitaModal from "../components/citas/EditCitaModal";
import { filtrarCitas } from "../components/citas/FiltroCitas";
import { useCitasStore } from "../stores/useCitaStore";
import { CitaConRelaciones } from "../types/types";
import QrCheckinModal from "@/components/checkin/QrCheckInModal";
import FinalizarCitaModal from "@/components/citas/FinalizarCitaModal";
import { FiPlus, FiCalendar } from "react-icons/fi";

export default function CitasPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const { citas, fetchCitas, deleteCita, updateCita, loading } =
    useCitasStore();

  const [estadoFiltro, setEstadoFiltro] = useState("pendiente");
  const [fechaDesde, setFechaDesde] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [fechaHasta, setFechaHasta] = useState("");
  const limpiarFiltros = () => {
    const hoy = new Date().toISOString().split("T")[0];
    setEstadoFiltro("todas");
    setFechaDesde(hoy);
    setFechaHasta("");
  };

  const [showQrModal, setShowQrModal] = useState(false);
  const [citaIdParaQr, setCitaIdParaQr] = useState<number | null>(null);
  const [telefonoQr, setTelefonoQr] = useState<string>("");

  const handleDelete = async (id: number) => {
    try {
      await deleteCita(id);
      toast({
        title: "Cita eliminada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error al eliminar",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCompletar = (cita: CitaConRelaciones) => {
    setCitaParaFinalizar(cita);
    openFinalizarModal();
  };

  const abrirQrModal = (cita: CitaConRelaciones) => {
    const telefono = cita.telefono || cita.cliente?.telefono || "";
    setCitaIdParaQr(cita.id);
    setTelefonoQr(telefono);
    setShowQrModal(true);
  };

  const cerrarQrModal = () => {
    setShowQrModal(false);
    setCitaIdParaQr(null);
    setTelefonoQr("");
    fetchCitas(); // Actualiza la lista de citas al cerrar el modal QR
  };

  const [selectedCita, setSelectedCita] = useState<CitaConRelaciones | null>(
    null
  );

  const [citaParaFinalizar, setCitaParaFinalizar] =
    useState<CitaConRelaciones | null>(null);
  const {
    isOpen: isFinalizarOpen,
    onOpen: openFinalizarModal,
    onClose: closeFinalizarModal,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();

  // Función para actualizar selectedCita con los datos más recientes del store
  const actualizarSelectedCita = () => {
    if (selectedCita) {
      const citaActualizada = citas.find((c) => c.id === selectedCita.id);
      if (citaActualizada) {
        setSelectedCita(citaActualizada);
      }
    }
  };

  // Función para manejar el guardado de citas
  const handleSaveCita = async (
    id: number,
    data: Partial<CitaConRelaciones>
  ) => {
    try {
      await updateCita(id, data);
      // Actualizar selectedCita con los datos más recientes
      actualizarSelectedCita();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  // Actualizar selectedCita cuando cambien las citas del store
  useEffect(() => {
    actualizarSelectedCita();
  }, [citas, selectedCita?.id]);

  const citasFiltradas = filtrarCitas(
    citas,
    estadoFiltro,
    fechaDesde,
    fechaHasta
  );

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box px={{ base: 2, md: 4 }} py={2} w="full">
      {/* Header Section */}
      <VStack spacing={4} align="stretch" mb={6}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <VStack align={{ base: "center", md: "flex-start" }} spacing={2}>
            <Flex align="center" gap={3}>
              <FiCalendar size={24} color="#0077cc" />
              <Heading
                size="lg"
                color="gray.800"
                _dark={{ color: "gray.100" }}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
              >
                Gestión de Citas
              </Heading>
            </Flex>
            <Text
              color="gray.600"
              _dark={{ color: "gray.400" }}
              fontSize={{ base: "md", md: "lg" }}
              textAlign={{ base: "center", md: "left" }}
            >
              Administra y organiza todas las citas del taller
            </Text>
          </VStack>
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
        </Flex>

        {/* Filters */}
        <CitaFilters
          estado={estadoFiltro}
          onEstadoChange={setEstadoFiltro}
          fechaDesde={fechaDesde}
          onFechaDesdeChange={setFechaDesde}
          fechaHasta={fechaHasta}
          onFechaHastaChange={setFechaHasta}
          onLimpiar={limpiarFiltros}
        />
      </VStack>

      {/* Table Section */}
      <Box
        bg={bg}
        borderRadius="2xl"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        border="1px solid"
        borderColor={borderColor}
        overflowX="auto"
      >
        <CitaTable
          citas={citasFiltradas}
          loading={loading}
          onEditar={(cita) => {
            setSelectedCita(cita);
            openEditModal();
          }}
          onCompletar={handleCompletar}
          onEliminar={handleDelete}
          onQrClick={abrirQrModal}
          onUpdateCita={handleSaveCita}
        />
      </Box>

      <EditCitaModal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        cita={selectedCita}
        onSave={handleSaveCita}
      />

      {citaParaFinalizar && (
        <FinalizarCitaModal
          key={citaParaFinalizar.id}
          isOpen={isFinalizarOpen}
          onClose={() => {
            closeFinalizarModal();
            setCitaParaFinalizar(null);
          }}
          cita={citaParaFinalizar}
        />
      )}

      {citaIdParaQr !== null && (
        <QrCheckinModal
          isOpen={showQrModal}
          onClose={cerrarQrModal}
          citaId={citaIdParaQr}
          telefono={telefonoQr}
        />
      )}
    </Box>
  );
}
