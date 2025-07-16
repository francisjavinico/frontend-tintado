import { User } from "@/types/types";
import { AddIcon, DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
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
  VStack,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import DeleteUserDialog from "../components/usuarios/DeleteUserDialog";
import EditUserModal from "../components/usuarios/EditUserModal";
import { useUserStore } from "../stores/useUserStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function UsersTable() {
  const users = useUserStore((state) => state.users);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const createUser = useUserStore((state) => state.createUser);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toast = useToast();

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

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtro de búsqueda mejorado
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (Array.isArray(user.role)
          ? user.role.some((role) => role.toLowerCase().includes(term))
          : user.role.toLowerCase().includes(term))
    );
  }, [users, searchTerm]);

  // Calcular estadísticas
  const totalUsers = users.length;
  const adminUsers = users.filter((user: User) => user.role === "admin").length;
  const employeeUsers = users.filter(
    (user: User) => user.role === "empleado"
  ).length;

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    openEditModal();
  };

  const handleCreate = () => {
    setSelectedUser(null);
    openEditModal();
  };

  const handleSave = async (
    userData: Partial<User> & { password?: string }
  ) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, userData);
      toast({
        title: "Usuario actualizado",
        description: "El usuario fue modificado correctamente.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } else {
      await createUser(userData);
      toast({
        title: "Usuario creado",
        description: "El usuario fue creado correctamente.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
    setSelectedUser(null);
    closeEditModal();
  };

  const confirmDelete = (id: number) => {
    setUserToDelete(id);
    openDeleteDialog();
  };

  const handleDelete = async () => {
    if (userToDelete !== null) {
      await deleteUser(userToDelete);
      // Si el usuario borrado es el usuario autenticado, cerrar sesión y redirigir
      if (user && user.id === userToDelete) {
        logout();
        navigate("/login");
        return;
      }
      setUserToDelete(null);
      closeDeleteDialog();
    }
  };

  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const getRoleColor = (role: string) => {
    return role === "admin" ? "purple" : "blue";
  };

  return (
    <Box p={{ base: 4, md: 6 }} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header con título */}
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          <Heading size="lg" color="gray.700">
            Gestión de Usuarios
          </Heading>
        </Flex>

        {/* Filtros y resumen integrados */}
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
                placeholder="Buscar por nombre, email o rol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="white"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                }}
                _hover={{ borderColor: "gray.300" }}
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
              <Text fontWeight="medium">Total:</Text>
              <Text>{totalUsers}</Text>
            </HStack>

            <Text color="gray.400">|</Text>

            <HStack spacing={1}>
              <Text fontWeight="medium">Resultados:</Text>
              <Text>{filteredUsers.length}</Text>
            </HStack>

            <Text color="gray.400">|</Text>

            <HStack spacing={1}>
              <Text fontWeight="medium">Admin:</Text>
              <Text>{adminUsers}</Text>
            </HStack>

            <Text color="gray.400">|</Text>

            <HStack spacing={1}>
              <Text fontWeight="medium">Empleados:</Text>
              <Text>{employeeUsers}</Text>
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
            Nuevo Usuario
          </Button>
        </Flex>

        {/* Estadísticas para móvil */}
        <Flex
          gap={3}
          mb={4}
          justify="center"
          display={{ base: "flex", md: "none" }}
        >
          <HStack spacing={2} color="gray.600" fontSize="xs">
            <Text>Total: {totalUsers}</Text>
          </HStack>

          <Text color="gray.400">|</Text>

          <HStack spacing={2} color="gray.600" fontSize="xs">
            <Text>Resultados: {filteredUsers.length}</Text>
          </HStack>

          <Text color="gray.400">|</Text>

          <HStack spacing={2} color="gray.600" fontSize="xs">
            <Text>Admin: {adminUsers}</Text>
          </HStack>

          <Text color="gray.400">|</Text>

          <HStack spacing={2} color="gray.600" fontSize="xs">
            <Text>Empleados: {employeeUsers}</Text>
          </HStack>
        </Flex>

        {/* Tabla de usuarios */}
        <Box
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          boxShadow="sm"
          overflow="hidden"
        >
          {error ? (
            <Flex justify="center" align="center" minH="300px">
              <Text color="red.500" fontSize="lg">
                Error al cargar usuarios: {error}
              </Text>
            </Flex>
          ) : loading ? (
            <Flex justify="center" align="center" minH="300px">
              <Spinner
                size="lg"
                thickness="3px"
                speed="0.65s"
                color="blue.500"
              />
            </Flex>
          ) : (
            <TableContainer>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr borderBottom="1px solid" borderColor={borderColor}>
                    <Th
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.700"
                      py={3}
                      px={4}
                    >
                      Usuario
                    </Th>
                    <Th
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.700"
                      py={3}
                      px={4}
                    >
                      Email
                    </Th>
                    <Th
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.700"
                      py={3}
                      px={4}
                    >
                      Rol
                    </Th>
                    <Th
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.700"
                      py={3}
                      px={4}
                      isNumeric
                    >
                      Acciones
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredUsers.map((user) => (
                    <Tr
                      key={user.id}
                      _hover={{ bg: "gray.50" }}
                      transition="background-color 0.2s"
                      borderBottom="1px solid"
                      borderColor={borderColor}
                    >
                      <Td py={3} px={4}>
                        <Text fontWeight="500" fontSize="sm">
                          {user.name}
                        </Text>
                      </Td>
                      <Td py={3} px={4}>
                        <Text fontSize="sm" color={textColor}>
                          {user.email}
                        </Text>
                      </Td>
                      <Td py={3} px={4}>
                        <Badge
                          colorScheme={getRoleColor(user.role)}
                          variant="subtle"
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="full"
                          textTransform="capitalize"
                        >
                          {Array.isArray(user.role)
                            ? user.role.join(", ")
                            : user.role}
                        </Badge>
                      </Td>
                      <Td py={3} px={4} isNumeric>
                        <HStack justify="flex-end" spacing={2}>
                          <Tooltip label={`Editar usuario ${user.name}`}>
                            <IconButton
                              aria-label={`Editar usuario ${user.name}`}
                              icon={<EditIcon />}
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => handleEdit(user)}
                              _hover={{ bg: "blue.50" }}
                            />
                          </Tooltip>
                          <Tooltip label={`Eliminar usuario ${user.name}`}>
                            <IconButton
                              aria-label={`Eliminar usuario ${user.name}`}
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => confirmDelete(user.id)}
                              _hover={{ bg: "red.50" }}
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}

                  {!loading && filteredUsers.length === 0 && (
                    <Tr>
                      <Td colSpan={4} textAlign="center" py={8}>
                        <Flex direction="column" align="center" gap={2}>
                          <Text color="gray.500" fontSize="sm">
                            {searchTerm
                              ? "No se encontraron usuarios con los filtros aplicados"
                              : "No hay usuarios registrados"}
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </VStack>

      <EditUserModal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        user={selectedUser}
        users={users}
        onSave={handleSave}
      />

      <DeleteUserDialog
        isOpen={isDeleteOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
