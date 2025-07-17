import {
  AddIcon,
  CalendarIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import ClientAppointmentsModal from "../components/clientes/ClientAppointmentsModal";
import DeleteClientDialog from "../components/clientes/DeleteClienteDialog";
import EditClientModal from "../components/clientes/EditClientModal";
import { Client } from "../types/types";

import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
  Card,
  CardBody,
  SimpleGrid,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { useClientStore } from "../stores/useClientStore";
import { FiUsers, FiSearch, FiFileText } from "react-icons/fi";
import { MdAddCircleOutline } from "react-icons/md";

export default function ClientsPage() {
  const clients = useClientStore((state) => state.clients);
  const fetchClients = useClientStore((state) => state.fetchClients);
  const deleteClient = useClientStore((state) => state.deleteClient);
  const updateClient = useClientStore((state) => state.updateClient);
  const createClient = useClientStore((state) => state.createClient);
  const { openAppointmentsModal } = useClientStore();
  const navigate = useNavigate();

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const {
    isOpen: isDeleteOpen,
    onOpen: openDeleteDialog,
    onClose: closeDeleteDialog,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();

  // PAGINADO
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtro de búsqueda
  const filteredClients = useMemo(() => {
    const term = search.toLowerCase();
    return clients.filter(
      (client) =>
        client.nombre?.toLowerCase().includes(term) ||
        client.apellido?.toLowerCase().includes(term) ||
        client.telefono?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term)
    );
  }, [clients, search]);

  // Ordenar por fecha de creación descendente (últimos agregados primero)
  const sortedClients = useMemo(() => {
    return [...filteredClients].sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredClients]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedClients.slice(startIndex, endIndex);
  }, [sortedClients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, clients.length]);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    openEditModal();
  };

  const handleCreate = () => {
    setSelectedClient(null);
    openEditModal();
  };

  const handleSave = async (
    clientData: Partial<Client> & { password?: string }
  ) => {
    try {
      if (selectedClient) {
        await updateClient(selectedClient.id, clientData);
        toast({
          title: "Cliente actualizado",
          description: "El cliente fue modificado correctamente.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        await createClient(clientData);
        toast({
          title: "Cliente creado",
          description: "El cliente fue creado correctamente.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
      setSelectedClient(null);
      closeEditModal();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error al guardar cliente",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = (id: number) => {
    setClientToDelete(id);
    openDeleteDialog();
  };

  const handleDelete = async () => {
    if (clientToDelete !== null) {
      await deleteClient(clientToDelete);
      setClientToDelete(null);
      closeDeleteDialog();
    }
  };

  // Componente para mostrar clientes en cards (móvil)
  const ClientCard = ({ client }: { client: Client }) => (
    <Card
      bg="white"
      borderRadius="xl"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      border="1px solid"
      borderColor="gray.200"
      _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
      transition="all 0.2s ease"
    >
      <CardBody p={4}>
        <Flex justify="space-between" align="start" mb={3}>
          <Box flex="1">
            <Text fontWeight="semibold" fontSize="md" color="gray.800">
              {client.nombre?.trim()} {client.apellido?.trim()}
            </Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              {client.telefono}
            </Text>
            {client.email && (
              <Text fontSize="sm" color="gray.600">
                {client.email}
              </Text>
            )}
          </Box>
          <HStack spacing={1}>
            <Tooltip
              label={`Editar ${client.nombre?.trim()} ${client.apellido?.trim()}`}
            >
              <IconButton
                aria-label={`Editar ${client.nombre?.trim()} ${client.apellido?.trim()}`}
                icon={<EditIcon />}
                size="sm"
                colorScheme="blue"
                variant="ghost"
                onClick={() => handleEdit(client)}
              />
            </Tooltip>
            <Tooltip
              label={`Eliminar ${client.nombre?.trim()} ${client.apellido?.trim()}`}
            >
              <IconButton
                aria-label={`Eliminar ${client.nombre?.trim()} ${client.apellido?.trim()}`}
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => confirmDelete(client.id)}
              />
            </Tooltip>
          </HStack>
        </Flex>

        <Flex gap={2} wrap="wrap">
          <Button
            size="sm"
            colorScheme="purple"
            variant="outline"
            leftIcon={<CalendarIcon />}
            onClick={() => openAppointmentsModal(client.id)}
            flex="1"
            minW="120px"
          >
            Historial
          </Button>
          <Button
            size="sm"
            colorScheme="green"
            variant="outline"
            leftIcon={<CalendarIcon />}
            onClick={() => navigate(`/citas/nueva?clienteId=${client.id}`)}
            flex="1"
            minW="120px"
          >
            Nueva Cita
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );

  return (
    <Box px={{ base: 2, md: 4 }} py={2} w="full">
      {/* Header compacto con búsqueda, estadísticas y botón en una fila */}
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        flexWrap="wrap"
        gap={3}
      >
        {/* Búsqueda a la izquierda */}
        <Box flex="1" minW="200px" maxW="300px">
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg="white"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
              }}
            />
          </InputGroup>
        </Box>

        {/* Estadísticas al centro */}
        <HStack
          spacing={4}
          color="gray.600"
          fontSize="sm"
          display={{ base: "none", md: "flex" }}
        >
          <HStack spacing={1}>
            <Icon as={FiUsers} fontSize="xs" />
            <Text fontWeight="medium">Total:</Text>
            <Text>{clients.length}</Text>
          </HStack>

          <Text color="gray.400">|</Text>

          <HStack spacing={1}>
            <Icon as={FiSearch} fontSize="xs" />
            <Text fontWeight="medium">Resultados:</Text>
            <Text>{sortedClients.length}</Text>
          </HStack>

          <Text color="gray.400">|</Text>

          <HStack spacing={1}>
            <Icon as={FiFileText} fontSize="xs" />
            <Text fontWeight="medium">Página:</Text>
            <Text>
              {currentPage}/{totalPages || 1}
            </Text>
          </HStack>
        </HStack>

        {/* Botón a la derecha */}
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={handleCreate}
          size="sm"
          borderRadius="lg"
          _hover={{ transform: "translateY(-1px)" }}
          transition="all 0.2s ease"
          minW="120px"
        >
          Nuevo Cliente
        </Button>
      </Flex>

      {/* Estadísticas para móvil (se muestran solo en pantallas pequeñas) */}
      <Flex
        gap={3}
        mb={4}
        justify="center"
        display={{ base: "flex", md: "none" }}
      >
        <HStack spacing={2} color="gray.600" fontSize="xs">
          <Icon as={FiUsers} />
          <Text>Total: {clients.length}</Text>
        </HStack>

        <Text color="gray.400">|</Text>

        <HStack spacing={2} color="gray.600" fontSize="xs">
          <Icon as={FiSearch} />
          <Text>Resultados: {sortedClients.length}</Text>
        </HStack>

        <Text color="gray.400">|</Text>

        <HStack spacing={2} color="gray.600" fontSize="xs">
          <Icon as={FiFileText} />
          <Text>
            Página: {currentPage}/{totalPages || 1}
          </Text>
        </HStack>
      </Flex>

      {/* Contenido principal */}
      <Card
        bg="white"
        borderRadius="2xl"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        border="1px solid"
        borderColor="gray.200"
        overflow="hidden"
      >
        {isMobile ? (
          // Vista de cards para móvil
          <Box p={4}>
            <SimpleGrid columns={1} spacing={4}>
              {paginatedClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
              {paginatedClients.length === 0 && (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500" fontSize="lg">
                    No hay clientes que coincidan con tu búsqueda
                  </Text>
                </Box>
              )}
            </SimpleGrid>
          </Box>
        ) : (
          // Vista de tabla compacta para desktop
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th
                    fontWeight="semibold"
                    fontSize="xs"
                    color="gray.700"
                    py={2}
                    px={3}
                  >
                    Cliente
                  </Th>
                  <Th
                    fontWeight="semibold"
                    fontSize="xs"
                    color="gray.700"
                    px={3}
                  >
                    Teléfono
                  </Th>
                  <Th
                    fontWeight="semibold"
                    fontSize="xs"
                    color="gray.700"
                    px={3}
                  >
                    Email
                  </Th>
                  <Th
                    fontWeight="semibold"
                    fontSize="xs"
                    color="gray.700"
                    px={3}
                  >
                    Documento
                  </Th>
                  <Th
                    textAlign="center"
                    fontWeight="semibold"
                    fontSize="xs"
                    color="gray.700"
                    px={3}
                  >
                    Acciones
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedClients.map((client) => (
                  <Tr
                    key={client.id}
                    _hover={{ bg: "gray.50" }}
                    transition="background 0.2s ease"
                  >
                    <Td py={2} px={3}>
                      <Box>
                        <Text
                          fontWeight="medium"
                          color="gray.800"
                          fontSize="sm"
                        >
                          {client.nombre?.trim()} {client.apellido?.trim()}
                        </Text>
                        {client.direccion && (
                          <Text fontSize="xs" color="gray.600" mt={0.5}>
                            {client.direccion}
                          </Text>
                        )}
                      </Box>
                    </Td>
                    <Td px={3}>
                      <Text color="gray.700" fontSize="sm">
                        {client.telefono}
                      </Text>
                    </Td>
                    <Td px={3}>
                      <Text color="gray.700" fontSize="sm">
                        {client.email || "-"}
                      </Text>
                    </Td>
                    <Td px={3}>
                      <Text color="gray.700" fontSize="sm">
                        {client.documentoIdentidad || "-"}
                      </Text>
                    </Td>
                    <Td px={3}>
                      <HStack justify="center" spacing={1}>
                        <Tooltip
                          label={`Editar cliente ${client.nombre?.trim()} ${client.apellido?.trim()}`}
                        >
                          <IconButton
                            aria-label={`Editar cliente ${client.nombre?.trim()} ${client.apellido?.trim()}`}
                            icon={<EditIcon />}
                            size="xs"
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => handleEdit(client)}
                          />
                        </Tooltip>
                        <Tooltip
                          label={`Eliminar cliente ${client.nombre?.trim()} ${client.apellido?.trim()}`}
                        >
                          <IconButton
                            aria-label={`Eliminar cliente ${client.nombre?.trim()} ${client.apellido?.trim()}`}
                            icon={<DeleteIcon />}
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => confirmDelete(client.id)}
                          />
                        </Tooltip>
                        <Tooltip
                          label={`Ver historial de citas de ${client.nombre?.trim()} ${client.apellido?.trim()}`}
                        >
                          <IconButton
                            aria-label={`Ver historial de citas de ${client.nombre?.trim()} ${client.apellido?.trim()}`}
                            icon={<CalendarIcon />}
                            size="xs"
                            colorScheme="purple"
                            variant="ghost"
                            onClick={() => openAppointmentsModal(client.id)}
                          />
                        </Tooltip>
                        <Tooltip
                          label={`Crear nueva cita para ${client.nombre?.trim()} ${client.apellido?.trim()}`}
                        >
                          <IconButton
                            aria-label={`Crear nueva cita para ${client.nombre?.trim()} ${client.apellido?.trim()}`}
                            icon={<MdAddCircleOutline fontSize="2rem" />}
                            colorScheme="teal"
                            variant="ghost"
                            size="lg"
                            display="flex"
                            alignItems="center"
                            onClick={() =>
                              navigate(`/citas/nueva?clienteId=${client.id}`)
                            }
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
                {paginatedClients.length === 0 && (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={6}>
                      <Text color="gray.500" fontSize="md">
                        No hay clientes que coincidan con tu búsqueda
                      </Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {/* Paginación mejorada */}
        {sortedClients.length > 0 && (
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
              <Text fontSize="xs" color="gray.600">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, sortedClients.length)} de{" "}
                {sortedClients.length} clientes
              </Text>

              <Flex align="center" gap={2} flexWrap="wrap">
                <Button
                  size="xs"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  isDisabled={currentPage === 1}
                  variant="outline"
                  borderRadius="md"
                >
                  Anterior
                </Button>

                <Flex gap={1} flexWrap="wrap">
                  {Array.from({ length: totalPages }, (_, index) => index + 1)
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
                        <Flex key={page} align="center">
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
                            variant={currentPage === page ? "solid" : "outline"}
                            minW="32px"
                            borderRadius="md"
                          >
                            {page}
                          </Button>
                        </Flex>
                      );
                    })}
                </Flex>

                <Button
                  size="xs"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  isDisabled={currentPage === totalPages}
                  variant="outline"
                  borderRadius="md"
                >
                  Siguiente
                </Button>
              </Flex>
            </Flex>
          </Box>
        )}
      </Card>

      <EditClientModal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        client={selectedClient}
        clients={clients}
        onSave={handleSave}
      />

      <DeleteClientDialog
        isOpen={isDeleteOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
      />
      <ClientAppointmentsModal />
    </Box>
  );
}
