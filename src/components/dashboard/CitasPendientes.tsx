import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useDisclosure,
  Button,
  Icon,
  HStack,
  Badge,
  Center,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCitasStore } from "@/stores/useCitaStore";
import { format } from "date-fns";
import { CitaConRelaciones } from "@/types/types";
import FinalizarCitaModal from "@/components/citas/FinalizarCitaModal";
import { FiClock, FiXCircle, FiSmartphone } from "react-icons/fi";
import QrCheckinModal from "@/components/checkin/QrCheckInModal";

export default function CitasPendientes() {
  const { fetchCitasHoy, citasHoy, loading } = useCitasStore();
  const [citaSeleccionada, setCitaSeleccionada] =
    useState<CitaConRelaciones | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [citaAReprogramar, setCitaAReprogramar] =
    useState<CitaConRelaciones | null>(null);
  const [isReprogramarOpen, setIsReprogramarOpen] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");
  const toast = useToast();
  const updateCita = useCitasStore((s) => s.updateCita);
  const [citaACancelar, setCitaACancelar] = useState<CitaConRelaciones | null>(
    null
  );
  const [isCancelarOpen, setIsCancelarOpen] = useState(false);
  const [qrCita, setQrCita] = useState<CitaConRelaciones | null>(null);

  useEffect(() => {
    fetchCitasHoy();
  }, [fetchCitasHoy]);

  useEffect(() => {
    if (isReprogramarOpen && citaAReprogramar) {
      const fecha = new Date(citaAReprogramar.fecha);
      setNuevaFecha(fecha.toISOString().slice(0, 10));
      setNuevaHora(fecha.toTimeString().slice(0, 5));
    }
  }, [isReprogramarOpen, citaAReprogramar]);

  const horasOcupadas = citasHoy
    .filter(
      (c) =>
        citaAReprogramar &&
        c.id !== citaAReprogramar.id &&
        new Date(c.fecha).toISOString().slice(0, 10) === nuevaFecha
    )
    .map((c) => new Date(c.fecha).toTimeString().slice(0, 5));

  const handleReprogramar = async () => {
    if (!citaAReprogramar) return;
    if (!nuevaFecha || !nuevaHora) {
      toast({ title: "Completa fecha y hora", status: "warning" });
      return;
    }
    if (horasOcupadas.includes(nuevaHora)) {
      toast({ title: "Hora ocupada", status: "error" });
      return;
    }
    const fechaISO = new Date(`${nuevaFecha}T${nuevaHora}`).toISOString();
    try {
      await updateCita(citaAReprogramar.id, {
        fecha: fechaISO,
        clienteId: citaAReprogramar.clienteId,
        vehiculoId: citaAReprogramar.vehiculoId,
      });
      toast({ title: "Cita reprogramada", status: "success" });
      setIsReprogramarOpen(false);
      setCitaAReprogramar(null);
      fetchCitasHoy();
    } catch {
      toast({ title: "Error al reprogramar", status: "error" });
    }
  };

  const handleFinalizar = (cita: CitaConRelaciones) => {
    setCitaSeleccionada(cita);
    onOpen();
  };

  const handleCancelar = async () => {
    if (!citaACancelar) return;
    try {
      await updateCita(citaACancelar.id, {
        fecha: citaACancelar.fecha,
        telefono: citaACancelar.telefono,
        presupuestoMax: citaACancelar.presupuestoMax,
        presupuestoBasico: citaACancelar.presupuestoBasico,
        presupuestoIntermedio: citaACancelar.presupuestoIntermedio,
        presupuestoPremium: citaACancelar.presupuestoPremium,
        ...(typeof citaACancelar.matricula === "string"
          ? { matricula: citaACancelar.matricula }
          : {}),
        clienteId: citaACancelar.clienteId,
        vehiculoId: citaACancelar.vehiculoId,
        estado: "cancelada",
        descripcion: citaACancelar.descripcion,
        servicios: citaACancelar.servicios,
      });
      toast({ title: "Cita cancelada", status: "success" });
      setIsCancelarOpen(false);
      setCitaACancelar(null);
      fetchCitasHoy();
    } catch {
      toast({ title: "Error al cancelar la cita", status: "error" });
    }
  };

  return (
    <Box>
      <HStack spacing={3} mb={6} align="center">
        <Box
          p={2}
          borderRadius="lg"
          bg="brand.50"
          color="brand.500"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={FiClock} boxSize={5} />
        </Box>
        <HStack spacing={2} align="center">
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            Citas pendientes de hoy
          </Text>
          <Badge
            colorScheme="brand"
            borderRadius="full"
            px={3}
            py={1}
            fontSize="xs"
            fontWeight="medium"
          >
            {citasHoy.length}
          </Badge>
        </HStack>
      </HStack>

      {loading ? (
        <Center h="200px">
          <Spinner size="lg" color="brand.500" />
        </Center>
      ) : citasHoy.length === 0 ? (
        <Center h="200px">
          <Text color="gray.500" fontSize="sm">
            No hay citas pendientes para hoy.
          </Text>
        </Center>
      ) : (
        <Box
          overflowX="auto"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <Table size="sm" variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="xs" fontWeight="semibold" color="gray.700" py={3}>
                  Hora
                </Th>
                <Th fontSize="xs" fontWeight="semibold" color="gray.700" py={3}>
                  Vehículo
                </Th>
                <Th fontSize="xs" fontWeight="semibold" color="gray.700" py={3}>
                  Presupuesto
                </Th>
                <Th
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.700"
                  py={3}
                  textAlign="center"
                >
                  Acción
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {citasHoy.map((cita) => (
                <Tr
                  key={cita.id}
                  _hover={{ bg: "gray.50" }}
                  transition="background 0.2s ease"
                >
                  <Td py={3}>
                    <Text fontWeight="medium" color="gray.800">
                      {format(new Date(cita.fecha), "HH:mm")}
                    </Text>
                  </Td>
                  <Td py={3}>
                    <Text fontWeight="medium" color="gray.800">
                      {cita.vehiculo?.marca} {cita.vehiculo?.modelo}
                    </Text>
                  </Td>
                  <Td py={3}>
                    {typeof cita.presupuestoBasico === "number" &&
                    typeof cita.presupuestoIntermedio === "number" &&
                    typeof cita.presupuestoPremium === "number" ? (
                      <Text color="gray.600" fontSize="sm">
                        Básico: {cita.presupuestoBasico}€<br />
                        Intermedio: {cita.presupuestoIntermedio}€<br />
                        Premium: {cita.presupuestoPremium}€
                      </Text>
                    ) : (
                      <Text color="gray.600" fontSize="sm">
                        {typeof cita.presupuestoMax === "number"
                          ? `${cita.presupuestoMax}€`
                          : "—"}
                      </Text>
                    )}
                  </Td>
                  <Td py={3} textAlign="center">
                    <HStack spacing={1} justify="center">
                      <Button
                        size="xs"
                        colorScheme="brand"
                        variant="ghost"
                        onClick={() => handleFinalizar(cita)}
                        leftIcon={undefined}
                        _hover={{ bg: "brand.50", transform: "scale(1.05)" }}
                        transition="all 0.2s ease"
                        fontSize="md"
                        isDisabled={!cita.cliente}
                      >
                        <Text fontWeight="bold" fontSize="md">
                          Finalizar
                        </Text>
                      </Button>
                      <Tooltip label="Reprogramar" hasArrow>
                        <Button
                          size="xs"
                          colorScheme="orange"
                          variant="ghost"
                          leftIcon={undefined}
                          onClick={() => {
                            setCitaAReprogramar(cita);
                            setIsReprogramarOpen(true);
                          }}
                          _hover={{ bg: "orange.50", transform: "scale(1.05)" }}
                          transition="all 0.2s ease"
                          aria-label="Reprogramar"
                          fontSize="2xl"
                        >
                          <FiClock size={15} />
                        </Button>
                      </Tooltip>
                      <Tooltip label="Cancelar" hasArrow>
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          leftIcon={undefined}
                          onClick={() => {
                            setCitaACancelar(cita);
                            setIsCancelarOpen(true);
                          }}
                          _hover={{ bg: "red.50", transform: "scale(1.05)" }}
                          transition="all 0.2s ease"
                          aria-label="Cancelar"
                          fontSize="2xl"
                        >
                          <FiXCircle size={15} />
                        </Button>
                      </Tooltip>
                      {!cita.cliente && (
                        <Tooltip label="Generar QR para check-in" hasArrow>
                          <Button
                            size="xs"
                            colorScheme="purple"
                            variant="ghost"
                            leftIcon={undefined}
                            onClick={() => setQrCita(cita)}
                            _hover={{
                              bg: "purple.50",
                              transform: "scale(1.05)",
                            }}
                            transition="all 0.2s ease"
                            aria-label="QR"
                            fontSize="2xl"
                          >
                            <FiSmartphone size={15} />
                          </Button>
                        </Tooltip>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {citaSeleccionada && (
        <FinalizarCitaModal
          isOpen={isOpen}
          onClose={onClose}
          cita={citaSeleccionada}
        />
      )}

      <Modal
        isOpen={isReprogramarOpen}
        onClose={() => {
          setIsReprogramarOpen(false);
          setCitaAReprogramar(null);
        }}
        isCentered
        motionPreset="scale"
      >
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.600" />
        <ModalContent>
          <ModalHeader>Reprogramar Cita</ModalHeader>
          <ModalBody>
            <Input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              mb={3}
            />
            <Input
              type="time"
              value={nuevaHora}
              onChange={(e) => setNuevaHora(e.target.value)}
              mb={1}
              min="08:00"
              max="20:00"
              step="900"
              isInvalid={horasOcupadas.includes(nuevaHora)}
            />
            {horasOcupadas.includes(nuevaHora) && (
              <Text color="red.500" fontSize="sm">
                Esa hora ya está ocupada
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                setIsReprogramarOpen(false);
                setCitaAReprogramar(null);
              }}
              mr={3}
              variant="ghost"
            >
              Cancelar
            </Button>
            <Button colorScheme="orange" onClick={handleReprogramar}>
              Guardar cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de confirmación de cancelación */}
      <Modal
        isOpen={isCancelarOpen}
        onClose={() => {
          setIsCancelarOpen(false);
          setCitaACancelar(null);
        }}
        isCentered
        motionPreset="scale"
      >
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.600" />
        <ModalContent>
          <ModalHeader>Cancelar Cita</ModalHeader>
          <ModalBody>
            <Text>¿Estás seguro de que deseas cancelar esta cita?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                setIsCancelarOpen(false);
                setCitaACancelar(null);
              }}
              mr={3}
              variant="ghost"
            >
              No cancelar
            </Button>
            <Button colorScheme="red" onClick={handleCancelar}>
              Sí, cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {qrCita && (
        <QrCheckinModal
          isOpen={!!qrCita}
          onClose={() => setQrCita(null)}
          citaId={qrCita.id}
          telefono={qrCita.telefono}
        />
      )}
    </Box>
  );
}
