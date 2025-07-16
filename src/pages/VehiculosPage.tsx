import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  IconButton,
  useDisclosure,
  Tooltip,
  Text,
  Flex,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { useEffect, useState, useMemo } from "react";
import { useVehiculoStore } from "../stores/useVehiculoStore";
import { Vehiculo } from "@/types/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "@/api/client";

import NewVehiculoModal from "@/components/vehiculos/NewVehiculoModal";
import EditVehiculoModal from "@/components/vehiculos/EditVehiculoModal";
import DeleteVehiculoDialog from "@/components/vehiculos/DeleteVehiculoDialog";
import HistorialPresupuestosModal from "@/components/vehiculos/HistorialPresupuestosModal";

interface EstadisticaVehiculo {
  vehiculoId: number;
  marca: string;
  modelo: string;
  año: number;
  atenciones: number;
  promedioMin: number;
  promedioMax: number;
  promedioBasico: number;
  promedioIntermedio: number;
}

export default function VehiculosPage() {
  const { vehiculos, loading, fetchVehiculos, fetchHistorialPresupuestos } =
    useVehiculoStore();

  const [search, setSearch] = useState("");
  const [vehiculoSeleccionado, setVehiculoSeleccionado] =
    useState<Vehiculo | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticaVehiculo[]>([]);

  const {
    isOpen: isHistorialOpen,
    onOpen: onOpenHistorial,
    onClose: onCloseHistorial,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isNewOpen,
    onOpen: onOpenNew,
    onClose: onCloseNew,
  } = useDisclosure();

  // PAGINADO: solo los últimos 5 vehículos atendidos
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtro de búsqueda simplificado
  const filteredVehiculos = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return vehiculos.filter((v) => {
      return (
        v.marca.toLowerCase().includes(searchTerm) ||
        v.modelo.toLowerCase().includes(searchTerm) ||
        v.año.toString().includes(searchTerm) ||
        v.numeroPuertas.toString().includes(searchTerm)
      );
    });
  }, [vehiculos, search]);

  // Ordenar por vehículos con más atenciones (últimos atendidos primero)
  const sortedVehiculos = useMemo(() => {
    return [...filteredVehiculos].sort((a, b) => {
      const aEstad =
        estadisticas.find((e) => e.vehiculoId === a.id)?.atenciones ?? 0;
      const bEstad =
        estadisticas.find((e) => e.vehiculoId === b.id)?.atenciones ?? 0;
      return bEstad - aEstad;
    });
  }, [filteredVehiculos, estadisticas]);

  const paginatedVehiculos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedVehiculos.slice(startIndex, endIndex);
  }, [sortedVehiculos, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedVehiculos.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, vehiculos.length]);

  const handleHistorial = async (vehiculo: Vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    await fetchHistorialPresupuestos(vehiculo.id);
    onOpenHistorial();
  };

  const fetchEstadisticas = async () => {
    try {
      const { data } = await axios.get<EstadisticaVehiculo[]>(
        "/vehiculos/estadisticas"
      );
      setEstadisticas(data);
    } catch {
      // Error silenciado
    }
  };

  useEffect(() => {
    fetchVehiculos();
    fetchEstadisticas();
  }, [fetchVehiculos]);

  const top5Estadisticas = [...estadisticas]
    .filter((v) => v.atenciones > 0)
    .sort((a, b) => b.atenciones - a.atenciones)
    .slice(0, 5);

  const datosGraficos = top5Estadisticas.map((v) => ({
    nombre: `${v.marca} ${v.modelo} ${v.año}`,
    presupuestoBasico: v.promedioBasico,
    presupuestoIntermedio: v.promedioIntermedio,
  }));

  // Colores del tema
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box
      bg={bgColor}
      minH="100vh"
      py={{ base: 4, md: 6 }}
      px={{ base: 3, md: 6, lg: 8 }}
    >
      {/* Header compacto */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap={4}
        mb={6}
      >
        <VStack align={{ base: "center", md: "flex-start" }} spacing={1}>
          <Heading
            size="lg"
            color={textColor}
            fontWeight="bold"
            textAlign={{ base: "center", md: "left" }}
          >
            Gestión de Vehículos
          </Heading>
          <Text color={mutedTextColor} fontSize="sm">
            Administra el inventario de vehículos y sus estadísticas
          </Text>
        </VStack>

        <Button
          leftIcon={<AddIcon />}
          colorScheme="brand"
          size="md"
          px={6}
          onClick={onOpenNew}
          borderRadius="lg"
          boxShadow="sm"
          _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
          transition="all 0.2s"
        >
          Nuevo Vehículo
        </Button>
      </Flex>

      {/* Estadísticas compactas */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Card
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          boxShadow="sm"
        >
          <CardBody p={4}>
            <Stat>
              <StatLabel
                color={mutedTextColor}
                fontSize="xs"
                fontWeight="medium"
              >
                Total Vehículos
              </StatLabel>
              <StatNumber color={textColor} fontSize="xl" fontWeight="bold">
                {vehiculos.length}
              </StatNumber>
              <StatHelpText color={mutedTextColor} fontSize="xs">
                Registrados en el sistema
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          boxShadow="sm"
        >
          <CardBody p={4}>
            <Stat>
              <StatLabel
                color={mutedTextColor}
                fontSize="xs"
                fontWeight="medium"
              >
                Con Atenciones
              </StatLabel>
              <StatNumber color={textColor} fontSize="xl" fontWeight="bold">
                {estadisticas.filter((s) => s.atenciones > 0).length}
              </StatNumber>
              <StatHelpText color={mutedTextColor} fontSize="xs">
                Han recibido servicios
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          boxShadow="sm"
        >
          <CardBody p={4}>
            <Stat>
              <StatLabel
                color={mutedTextColor}
                fontSize="xs"
                fontWeight="medium"
              >
                Atenciones Totales
              </StatLabel>
              <StatNumber color={textColor} fontSize="xl" fontWeight="bold">
                {estadisticas.reduce((sum, s) => sum + s.atenciones, 0)}
              </StatNumber>
              <StatHelpText color={mutedTextColor} fontSize="xs">
                Servicios realizados
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Layout principal: Tabla a la izquierda, Gráfico a la derecha */}
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={6}
        align="flex-start"
      >
        {/* Columna izquierda: Tabla de vehículos */}
        <Box flex={1} minW={0}>
          {/* Filtro de búsqueda simple */}
          <Box mb={4}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none" color={mutedTextColor}>
                <SearchIcon />
              </InputLeftElement>
              <Input
                placeholder="Buscar vehículo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                borderRadius="lg"
                borderColor="gray.300"
                bg={cardBg}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px rgba(0, 119, 204, 0.3)",
                }}
                _placeholder={{ color: "gray.400" }}
              />
            </InputGroup>
          </Box>

          <Card
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            boxShadow="sm"
            overflow="hidden"
          >
            <CardBody p={0}>
              {loading ? (
                <Flex justify="center" align="center" py={12}>
                  <Spinner size="lg" color="brand.500" />
                </Flex>
              ) : vehiculos.length === 0 ? (
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  py={12}
                  color={mutedTextColor}
                >
                  <Text fontSize="lg" mb={2}>
                    No hay vehículos registrados
                  </Text>
                  <Text fontSize="sm">
                    Comienza agregando tu primer vehículo
                  </Text>
                </Flex>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple" size="md">
                    <Thead bg="gray.50" position="sticky" top={0} zIndex={1}>
                      <Tr>
                        <Th
                          px={4}
                          py={3}
                          color="gray.700"
                          fontWeight="semibold"
                          fontSize="sm"
                        >
                          Vehículo
                        </Th>
                        <Th
                          px={4}
                          py={3}
                          color="gray.700"
                          fontWeight="semibold"
                          fontSize="sm"
                        >
                          Año
                        </Th>
                        <Th
                          px={4}
                          py={3}
                          color="gray.700"
                          fontWeight="semibold"
                          fontSize="sm"
                        >
                          Puertas
                        </Th>
                        <Th
                          px={4}
                          py={3}
                          color="gray.700"
                          fontWeight="semibold"
                          fontSize="sm"
                          textAlign="center"
                        >
                          Atenciones
                        </Th>
                        <Th
                          px={4}
                          py={3}
                          color="gray.700"
                          fontWeight="semibold"
                          fontSize="sm"
                          textAlign="right"
                        >
                          Acciones
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedVehiculos.map((v) => {
                        const estadistica = estadisticas.find(
                          (e) => e.vehiculoId === v.id
                        );
                        const atenciones = estadistica?.atenciones ?? 0;
                        const vehiculoLabel = `${v.marca} ${v.modelo} ${v.año}`;
                        return (
                          <Tr
                            key={v.id}
                            _hover={{ bg: "gray.50" }}
                            transition="background 0.2s"
                            borderBottom="1px solid"
                            borderColor="gray.100"
                          >
                            <Td px={4} py={3}>
                              <VStack align="flex-start" spacing={1}>
                                <Text
                                  fontWeight="semibold"
                                  color={textColor}
                                  fontSize="sm"
                                >
                                  {v.marca}
                                </Text>
                                <Text fontSize="xs" color={mutedTextColor}>
                                  {v.modelo}
                                </Text>
                              </VStack>
                            </Td>
                            <Td px={4} py={3}>
                              <Badge
                                colorScheme="blue"
                                variant="subtle"
                                borderRadius="full"
                                px={2}
                                py={0.5}
                                fontSize="xs"
                              >
                                {v.año}
                              </Badge>
                            </Td>
                            <Td px={4} py={3}>
                              <Text color={textColor} fontSize="sm">
                                {v.numeroPuertas}
                              </Text>
                            </Td>
                            <Td px={4} py={3} textAlign="center">
                              <Badge
                                colorScheme={atenciones > 0 ? "green" : "gray"}
                                variant="subtle"
                                borderRadius="full"
                                px={2}
                                py={0.5}
                                fontSize="xs"
                              >
                                {atenciones}
                              </Badge>
                            </Td>
                            <Td px={4} py={3}>
                              <Flex gap={1} justify="flex-end">
                                <Tooltip
                                  label={`Ver historial de ${vehiculoLabel}`}
                                >
                                  <IconButton
                                    aria-label={`Ver historial de ${vehiculoLabel}`}
                                    icon={<TimeIcon />}
                                    size="xs"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => handleHistorial(v)}
                                    borderRadius="md"
                                  />
                                </Tooltip>
                                <Tooltip label={`Editar ${vehiculoLabel}`}>
                                  <IconButton
                                    aria-label={`Editar ${vehiculoLabel}`}
                                    icon={<EditIcon />}
                                    size="xs"
                                    colorScheme="brand"
                                    variant="ghost"
                                    onClick={() => {
                                      setVehiculoSeleccionado(v);
                                      onOpenEdit();
                                    }}
                                    borderRadius="md"
                                  />
                                </Tooltip>
                                <Tooltip label={`Eliminar ${vehiculoLabel}`}>
                                  <IconButton
                                    aria-label={`Eliminar ${vehiculoLabel}`}
                                    icon={<DeleteIcon />}
                                    size="xs"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => {
                                      setVehiculoSeleccionado(v);
                                      onOpenDelete();
                                    }}
                                    borderRadius="md"
                                  />
                                </Tooltip>
                              </Flex>
                            </Td>
                          </Tr>
                        );
                      })}
                      {paginatedVehiculos.length === 0 && (
                        <Tr>
                          <Td colSpan={5} textAlign="center" py={8}>
                            <VStack spacing={2} color={mutedTextColor}>
                              <Text fontSize="sm">
                                No hay vehículos que coincidan
                              </Text>
                              <Text fontSize="xs">
                                Intenta con otros términos de búsqueda
                              </Text>
                            </VStack>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>

            {/* Controles de paginación compactos */}
            {sortedVehiculos.length > 0 && (
              <Box
                px={4}
                py={3}
                bg="gray.50"
                borderTop="1px solid"
                borderColor="gray.200"
              >
                <Flex
                  justify="space-between"
                  align="center"
                  flexWrap="wrap"
                  gap={3}
                >
                  <Text fontSize="xs" color={mutedTextColor}>
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      sortedVehiculos.length
                    )}{" "}
                    de {sortedVehiculos.length} vehículos
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    <Button
                      size="xs"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      isDisabled={currentPage === 1}
                      variant="outline"
                      borderRadius="md"
                    >
                      Anterior
                    </Button>
                    <HStack spacing={1}>
                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      )
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => {
                          const showEllipsisBefore =
                            index > 0 && page - array[index - 1] > 1;
                          return (
                            <HStack key={page} spacing={1}>
                              {showEllipsisBefore && (
                                <Text mx={1} color="gray.400" fontSize="xs">
                                  ...
                                </Text>
                              )}
                              <Button
                                size="xs"
                                onClick={() => setCurrentPage(page)}
                                colorScheme={
                                  currentPage === page ? "brand" : "gray"
                                }
                                variant={
                                  currentPage === page ? "solid" : "outline"
                                }
                                minW="32px"
                                borderRadius="md"
                              >
                                {page}
                              </Button>
                            </HStack>
                          );
                        })}
                    </HStack>
                    <Button
                      size="xs"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      isDisabled={currentPage === totalPages}
                      variant="outline"
                      borderRadius="md"
                    >
                      Siguiente
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            )}
          </Card>
        </Box>

        {/* Columna derecha: Gráfico de estadísticas */}
        {estadisticas.length > 0 && (
          <Box w={{ base: "full", lg: "400px" }} flexShrink={0}>
            <Card
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="lg"
              boxShadow="sm"
              h="fit-content"
            >
              <CardBody p={4}>
                <VStack align="flex-start" spacing={3} mb={4}>
                  <Text fontSize="md" fontWeight="semibold" color={textColor}>
                    Estadísticas de Atención
                  </Text>
                  <Text fontSize="xs" color={mutedTextColor}>
                    Top 5 vehículos con más atenciones
                  </Text>
                </VStack>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosGraficos}>
                      <XAxis
                        dataKey="nombre"
                        tick={{ fontSize: 10, fill: mutedTextColor }}
                        angle={-25}
                        height={60}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 10, fill: mutedTextColor }} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: cardBg,
                          border: `1px solid ${borderColor}`,
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="presupuestoBasico"
                        fill="#38A169"
                        name="Presupuesto 1 (Básico)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="presupuestoIntermedio"
                        fill="#ECC94B"
                        name="Presupuesto 2 (Intermedio)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </Box>
        )}
      </Flex>

      {/* Modales */}
      <NewVehiculoModal isOpen={isNewOpen} onClose={onCloseNew} />
      <EditVehiculoModal
        isOpen={isEditOpen}
        onClose={onCloseEdit}
        vehiculo={vehiculoSeleccionado}
      />
      <DeleteVehiculoDialog
        isOpen={isDeleteOpen}
        onClose={onCloseDelete}
        vehiculo={vehiculoSeleccionado}
      />
      <HistorialPresupuestosModal
        isOpen={isHistorialOpen}
        onClose={onCloseHistorial}
        vehiculo={vehiculoSeleccionado}
      />
    </Box>
  );
}
