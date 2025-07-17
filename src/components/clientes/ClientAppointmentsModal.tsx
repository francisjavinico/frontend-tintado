import { useClientStore } from "@/stores/useClientStore";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Card,
  CardBody,
  Badge,
  HStack,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { FiCalendar, FiTruck, FiDollarSign, FiFileText } from "react-icons/fi";

export default function ClientAppointmentsModal() {
  const {
    appointmentsModalOpen,
    closeAppointmentsModal,
    clientAppointments,
    selectedClientId,
    clients,
  } = useClientStore();

  const client = clients.find((c) => c.id === selectedClientId) || null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return "orange";
      case "en progreso":
        return "blue";
      case "completada":
        return "green";
      case "cancelada":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Modal
      isOpen={appointmentsModalOpen}
      onClose={closeAppointmentsModal}
      size="xl"
      isCentered
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        borderRadius="2xl"
        boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        border="1px solid"
        borderColor="gray.200"
        maxH="80vh"
      >
        <ModalHeader
          fontSize="xl"
          fontWeight="bold"
          pb={4}
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <VStack align="start" spacing={2}>
            <Text>Historial de Citas</Text>
            <Text fontSize="md" color="gray.600" fontWeight="normal">
              {client?.nombre?.trim()} {client?.apellido?.trim()}
            </Text>
          </VStack>
        </ModalHeader>

        <ModalCloseButton size="lg" top={4} right={4} />

        <ModalBody p={6} overflowY="auto">
          <VStack spacing={4} align="stretch">
            {clientAppointments.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Icon as={FiCalendar} w={12} h={12} color="gray.300" mb={4} />
                <Text color="gray.500" fontSize="lg">
                  Este cliente no tiene citas registradas
                </Text>
                <Text color="gray.400" fontSize="sm" mt={2}>
                  Las citas aparecerán aquí cuando se creen
                </Text>
              </Box>
            ) : (
              clientAppointments.map((cita) => (
                <Card
                  key={cita.id}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  border="1px solid"
                  borderColor="gray.200"
                  _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                  transition="all 0.2s ease"
                >
                  <CardBody p={4}>
                    <HStack justify="space-between" align="start" mb={3}>
                      <VStack align="start" spacing={1}>
                        <HStack spacing={2}>
                          <Icon as={FiCalendar} color="blue.500" />
                          <Text fontWeight="semibold" color="gray.800">
                            {new Date(cita.fecha).toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          {new Date(cita.fecha).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </VStack>

                      <Badge
                        colorScheme={getStatusColor(cita.estado)}
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="sm"
                        fontWeight="medium"
                        textTransform="capitalize"
                      >
                        {cita.estado}
                      </Badge>
                    </HStack>

                    <Divider my={3} />

                    <VStack spacing={3} align="stretch">
                      <HStack spacing={3}>
                        <Icon as={FiTruck} color="green.500" />
                        <Text fontSize="sm" color="gray.700">
                          <Text as="span" fontWeight="medium">
                            Matrícula:
                          </Text>{" "}
                          {cita.matricula}
                        </Text>
                      </HStack>

                      <HStack spacing={3}>
                        <Icon as={FiDollarSign} color="purple.500" />
                        <Text fontSize="sm" color="gray.700">
                          <Text as="span" fontWeight="medium">
                            Presupuesto:
                          </Text>{" "}
                          €{cita.presupuestoMax}
                        </Text>
                      </HStack>

                      {cita.descripcion && (
                        <HStack spacing={3} align="start">
                          <Icon as={FiFileText} color="orange.500" mt={1} />
                          <Text fontSize="sm" color="gray.700">
                            <Text as="span" fontWeight="medium">
                              Descripción:
                            </Text>{" "}
                            {cita.descripcion}
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              ))
            )}
          </VStack>
        </ModalBody>

        <ModalFooter pt={4} borderTop="1px solid" borderColor="gray.200">
          <Button
            onClick={closeAppointmentsModal}
            variant="outline"
            borderRadius="lg"
            _hover={{ transform: "translateY(-1px)" }}
            transition="all 0.2s ease"
          >
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
