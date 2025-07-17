import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Spinner,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Card,
  CardBody,
  Box,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Vehiculo } from "@/types/types";
import { useVehiculoStore } from "../../stores/useVehiculoStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vehiculo: Vehiculo | null;
}

export default function HistorialPresupuestosModal({
  isOpen,
  onClose,
  vehiculo,
}: Props) {
  const { historial, loadingHistorial, clearHistorial } = useVehiculoStore();

  // Colores del tema
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    if (!isOpen) clearHistorial();
  }, [isOpen, clearHistorial]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="xl"
        mx={4}
        maxH="90vh"
      >
        <ModalHeader borderBottom="1px solid" borderColor={borderColor} pb={4}>
          <VStack align="flex-start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Historial de Presupuestos
            </Text>
            {vehiculo && (
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                  {vehiculo.marca} {vehiculo.modelo}
                </Text>
                <HStack spacing={2}>
                  <Badge
                    colorScheme="blue"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {vehiculo.año}
                  </Badge>
                  <Badge
                    colorScheme="gray"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {vehiculo.numeroPuertas} puertas
                  </Badge>
                </HStack>
              </VStack>
            )}
          </VStack>
        </ModalHeader>

        <ModalCloseButton
          aria-label="Cerrar modal de historial"
          borderRadius="full"
          size="lg"
          top={4}
          right={4}
        />

        <ModalBody py={6}>
          {loadingHistorial ? (
            <VStack justify="center" align="center" py={12}>
              <Spinner size="lg" color="brand.500" />
              <Text color={mutedTextColor}>Cargando historial...</Text>
            </VStack>
          ) : historial.length === 0 ? (
            <VStack
              justify="center"
              align="center"
              py={12}
              color={mutedTextColor}
            >
              <Text fontSize="lg" mb={2}>
                No hay presupuestos registrados
              </Text>
              <Text fontSize="sm" textAlign="center">
                Este vehículo aún no tiene presupuestos en el sistema
              </Text>
            </VStack>
          ) : (
            <Card
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              overflow="hidden"
            >
              <CardBody p={0}>
                <Box overflowX="auto">
                  <Table variant="simple" size="md">
                    <Thead bg="gray.100" position="sticky" top={0} zIndex={1}>
                      <Tr>
                        <Th
                          px={6}
                          py={4}
                          color="gray.700"
                          fontWeight="semibold"
                        >
                          Fecha
                        </Th>
                        <Th
                          px={6}
                          py={4}
                          color="gray.700"
                          fontWeight="semibold"
                          textAlign="center"
                        >
                          Presupuesto Mín.
                        </Th>
                        <Th
                          px={6}
                          py={4}
                          color="gray.700"
                          fontWeight="semibold"
                          textAlign="center"
                        >
                          Presupuesto Máx.
                        </Th>
                        <Th
                          px={6}
                          py={4}
                          color="gray.700"
                          fontWeight="semibold"
                        >
                          Descripción
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {historial.map((p) => (
                        <Tr
                          key={p.id}
                          _hover={{ bg: "white" }}
                          transition="background 0.2s"
                          borderBottom="1px solid"
                          borderColor="gray.200"
                        >
                          <Td px={6} py={4}>
                            <Text fontWeight="medium" color={textColor}>
                              {formatDate(p.fecha)}
                            </Text>
                          </Td>
                          <Td px={6} py={4} textAlign="center">
                            <Badge
                              colorScheme="green"
                              variant="subtle"
                              borderRadius="full"
                              px={3}
                              py={1}
                              fontSize="sm"
                            >
                              {formatCurrency(p.presupuestoMax)}
                            </Badge>
                          </Td>
                          <Td px={6} py={4} textAlign="center">
                            <Badge
                              colorScheme="blue"
                              variant="subtle"
                              borderRadius="full"
                              px={3}
                              py={1}
                              fontSize="sm"
                            >
                              {formatCurrency(p.presupuestoMax)}
                            </Badge>
                          </Td>
                          <Td px={6} py={4}>
                            <Text color={textColor} fontSize="sm">
                              {p.descripcion || "Sin descripción"}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </CardBody>
            </Card>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
