import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Text,
  Td,
  Flex,
  Button,
  Box,
  useColorModeValue,
  Spinner,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useToast,
} from "@chakra-ui/react";
import { CitaConRelaciones } from "../../types/types";
// import CitaRow from "./CitaRow"; // No se usa
import { useState, useMemo, useEffect } from "react";
import {
  FiEdit,
  FiCheck,
  FiTrash,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface CitaTableProps {
  citas: CitaConRelaciones[];
  loading: boolean;
  onEditar: (cita: CitaConRelaciones) => void;
  onCompletar: (cita: CitaConRelaciones) => void;
  onEliminar: (id: number) => void;
  onQrClick?: (cita: CitaConRelaciones) => void;
  onUpdateCita?: (id: number, data: Partial<CitaConRelaciones>) => void;
}

export default function CitaTable({
  citas,
  loading,
  onEditar,
  onCompletar,
  onEliminar,
  onQrClick,
  onUpdateCita,
}: CitaTableProps) {
  const { isOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [citaAReprogramar, setCitaAReprogramar] =
    useState<CitaConRelaciones | null>(null);
  const toast = useToast();
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.700");

  // Calcular las citas para la página actual
  const paginatedCitas: CitaConRelaciones[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return citas.slice(startIndex, endIndex);
  }, [citas, currentPage, itemsPerPage]);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(citas.length / itemsPerPage);

  // Resetear a la primera página cuando cambien las citas
  useEffect(() => {
    setCurrentPage(1);
  }, [citas]);

  useEffect(() => {
    if (isOpen && citaAReprogramar) {
      const fecha = new Date(citaAReprogramar.fecha);
      setNuevaFecha(fecha.toISOString().slice(0, 10));
      setNuevaHora(fecha.toTimeString().slice(0, 5));
    }
  }, [isOpen, citaAReprogramar]);

  // Validar horas ocupadas
  const horasOcupadas = useMemo(() => {
    if (!nuevaFecha) return [];
    return citas
      .filter((c) => {
        if (!citaAReprogramar) return false;
        return (
          c.id !== citaAReprogramar.id &&
          new Date(c.fecha).toISOString().slice(0, 10) === nuevaFecha
        );
      })
      .map((c) => new Date(c.fecha).toTimeString().slice(0, 5));
  }, [nuevaFecha, citas, citaAReprogramar]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleReprogramar = () => {
    if (!citaAReprogramar) return;
    if (!nuevaFecha || !nuevaHora) {
      toast({ title: "Completa fecha y hora", status: "warning" });
      return;
    }
    if (horasOcupadas.includes(nuevaHora)) {
      toast({ title: "Hora ocupada", status: "error" });
      return;
    }
    // Formato ISO-8601 UTC para Prisma
    const fechaISO = new Date(`${nuevaFecha}T${nuevaHora}`).toISOString();
    if (onUpdateCita) {
      onUpdateCita(citaAReprogramar.id, {
        fecha: fechaISO,
        clienteId: citaAReprogramar.clienteId,
        vehiculoId: citaAReprogramar.vehiculoId,
      });
    }
    setCitaAReprogramar(null);
    onClose();
    toast({ title: "Cita reprogramada", status: "success" });
  };

  if (loading) {
    return (
      <Center py={12}>
        <Spinner size="lg" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  return (
    <Box>
      <TableContainer>
        <Table variant="simple" size="md">
          <Thead bg={headerBg}>
            <Tr>
              <Th
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
                py={4}
                px={4}
              >
                Fecha
              </Th>
              <Th
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
                py={4}
                px={4}
              >
                Hora
              </Th>
              <Th
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
                py={4}
                px={4}
              >
                Cliente
              </Th>
              <Th
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
                py={4}
                px={4}
              >
                Teléfono
              </Th>
              <Th
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
                py={4}
                px={4}
              >
                Vehículo
              </Th>
              <Th
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
                py={4}
                px={4}
              >
                Estado
              </Th>
              <Th
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
                py={4}
                px={4}
              >
                Presupuestos
              </Th>
              <Th
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
                py={4}
                px={4}
                textAlign="center"
              >
                Acciones
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedCitas.map((cita) => (
              <Tr key={cita.id}>
                <Td>{new Date(cita.fecha).toISOString().slice(0, 10)}</Td>
                <Td>{new Date(cita.fecha).toTimeString().slice(0, 5)}</Td>
                <Td>{cita.cliente?.nombre}</Td>
                <Td>{cita.cliente?.telefono}</Td>
                <Td>
                  {cita.vehiculo?.marca} {cita.vehiculo?.modelo}
                </Td>
                <Td>{cita.estado}</Td>
                <Td>
                  {cita.servicios &&
                  cita.servicios[0]?.nombre === "Tintado de Lunas" ? (
                    <Box>
                      {typeof cita.presupuestoBasico === "number" && (
                        <Text fontSize="xs">
                          Básico: <b>{cita.presupuestoBasico.toFixed(2)} €</b>
                        </Text>
                      )}
                      {typeof cita.presupuestoIntermedio === "number" && (
                        <Text fontSize="xs">
                          Intermedio:{" "}
                          <b>{cita.presupuestoIntermedio.toFixed(2)} €</b>
                        </Text>
                      )}
                      {typeof cita.presupuestoPremium === "number" && (
                        <Text fontSize="xs">
                          Premium: <b>{cita.presupuestoPremium.toFixed(2)} €</b>
                        </Text>
                      )}
                    </Box>
                  ) : (
                    <Text fontSize="xs" color="gray.600">
                      {typeof cita.presupuestoMin === "number" &&
                      typeof cita.presupuestoMax === "number"
                        ? `${cita.presupuestoMin.toFixed(2)} € - ${cita.presupuestoMax.toFixed(2)} €`
                        : "—"}
                    </Text>
                  )}
                </Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      onClick={() => onEditar(cita)}
                      variant="outline"
                      aria-label="Editar"
                      iconSpacing={0}
                      leftIcon={<FiEdit />}
                      _hover={{ bg: "gray.50" }}
                      _dark={{ _hover: { bg: "gray.700" } }}
                    ></Button>
                    <Button
                      size="sm"
                      onClick={() => onCompletar(cita)}
                      variant="outline"
                      aria-label="Completar"
                      iconSpacing={0}
                      leftIcon={<FiCheck />}
                      _hover={{ bg: "gray.50" }}
                      _dark={{ _hover: { bg: "gray.700" } }}
                    ></Button>
                    <Button
                      size="sm"
                      onClick={() => onEliminar(cita.id)}
                      variant="outline"
                      colorScheme="red"
                      aria-label="Eliminar"
                      iconSpacing={0}
                      leftIcon={<FiTrash />}
                      _hover={{ bg: "gray.50" }}
                      _dark={{ _hover: { bg: "gray.700" } }}
                    ></Button>
                    {onQrClick &&
                      // Mostrar QR solo si faltan datos del cliente distintos a la matrícula
                      (!cita.cliente ||
                        !cita.cliente.nombre ||
                        !cita.cliente.apellido ||
                        !cita.cliente.direccion ||
                        !cita.cliente.documentoIdentidad) && (
                        <Button
                          size="sm"
                          onClick={() => onQrClick(cita)}
                          variant="outline"
                          leftIcon={<FiChevronRight />}
                          _hover={{ bg: "gray.50" }}
                          _dark={{ _hover: { bg: "gray.700" } }}
                        >
                          QR
                        </Button>
                      )}
                  </Flex>
                </Td>
              </Tr>
            ))}
            {paginatedCitas.length === 0 && !loading && (
              <Tr>
                <Td colSpan={7} textAlign="center" py={12}>
                  <Text color="gray.500" fontSize="md">
                    No hay citas que coincidan con los filtros aplicados
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <Flex
          justify="space-between"
          align="center"
          px={6}
          py={4}
          bg={bg}
          borderTop="1px solid"
          borderColor={borderColor}
        >
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(currentPage * itemsPerPage, citas.length)} de{" "}
            {citas.length} citas
          </Text>

          <Flex align="center" gap={2}>
            <Button
              size="sm"
              onClick={handlePreviousPage}
              isDisabled={currentPage === 1}
              variant="outline"
              leftIcon={<FiChevronLeft />}
              _hover={{ bg: "gray.50" }}
              _dark={{ _hover: { bg: "gray.700" } }}
            >
              Anterior
            </Button>

            <Flex gap={1}>
              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, array) => {
                  // Añadir puntos suspensivos si hay páginas ocultas
                  const showEllipsisBefore =
                    index > 0 && page - array[index - 1] > 1;

                  return (
                    <Flex key={page} align="center">
                      {showEllipsisBefore && (
                        <Text mx={1} color="gray.400">
                          ...
                        </Text>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        colorScheme={currentPage === page ? "brand" : "gray"}
                        variant={currentPage === page ? "solid" : "outline"}
                        minW="40px"
                        _hover={{ transform: "translateY(-1px)" }}
                        transition="all 0.2s ease"
                      >
                        {page}
                      </Button>
                    </Flex>
                  );
                })}
            </Flex>

            <Button
              size="sm"
              onClick={handleNextPage}
              isDisabled={currentPage === totalPages}
              variant="outline"
              rightIcon={<FiChevronRight />}
              _hover={{ bg: "gray.50" }}
              _dark={{ _hover: { bg: "gray.700" } }}
            >
              Siguiente
            </Button>
          </Flex>
        </Flex>
      )}

      {/* Modal de reprogramación */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setCitaAReprogramar(null);
          onClose();
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
                setCitaAReprogramar(null);
                onClose();
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
    </Box>
  );
}
