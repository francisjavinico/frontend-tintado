import { updateUserSchema } from "@/schemas/userSchema";
import { User } from "@/types/types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  VStack,
  Select,
  useColorModeValue,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  users: User[];
  onSave: (userData: Partial<User> & { password?: string }) => void;
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  users,
  onSave,
}: Props) {
  const [form, setForm] = useState<Partial<User> & { password?: string }>({
    name: "",
    email: "",
    role: "empleado",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialRef = useRef<HTMLInputElement>(null);

  const bgModal = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const labelColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    if (isOpen) {
      setForm(
        user
          ? { ...user, password: "" }
          : {
              name: "",
              email: "",
              role: "empleado",
              password: "",
            }
      );
      setErrors({});
      setIsSubmitting(false);
    }
  }, [user, isOpen]);

  const handleChange = (
    field: keyof (User & { password?: string }),
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const result = updateUserSchema.safeParse(form);

    if (!result.success) {
      const zodErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (typeof field === "string") {
          zodErrors[field] = err.message;
        }
      });
      setErrors(zodErrors);
      setIsSubmitting(false);
      return;
    }

    const isDuplicate = users.some(
      (u) => u.email === form.email && u.id !== form.id
    );
    if (isDuplicate) {
      setErrors({ email: "Este email ya está en uso" });
      setIsSubmitting(false);
      return;
    }

    const userToSave = { ...form };
    if (!userToSave.password) delete userToSave.password;

    try {
      await onSave(userToSave);
      onClose();
      setErrors({});
    } catch {
      // El error será manejado por el store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      size="md"
      isCentered
      aria-label={form?.id ? "Editar usuario" : "Crear nuevo usuario"}
      initialFocusRef={initialRef}
      closeOnOverlayClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        bg={bgModal}
        borderRadius="lg"
        boxShadow="xl"
        maxW="500px"
        mx={4}
      >
        <ModalHeader
          borderBottom="1px solid"
          borderColor={borderColor}
          pb={4}
          pt={6}
          px={6}
        >
          <Text fontSize="xl" fontWeight="600" color={textColor}>
            {form?.id ? "Editar Usuario" : "Nuevo Usuario"}
          </Text>
          <Text fontSize="sm" color={labelColor} mt={1} fontWeight="normal">
            {form?.id
              ? "Modifica la información del usuario"
              : "Completa la información para crear un nuevo usuario"}
          </Text>
        </ModalHeader>

        <ModalCloseButton
          aria-label="Cerrar modal"
          size="lg"
          top={4}
          right={4}
          isDisabled={isSubmitting}
        />

        <ModalBody px={6} py={6}>
          <VStack spacing={5} align="stretch">
            <FormControl isInvalid={!!errors.name} isRequired>
              <FormLabel
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb={2}
              >
                Nombre completo
              </FormLabel>
              <Input
                placeholder="Ingresa el nombre completo"
                value={form?.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                ref={initialRef}
                size="md"
                borderRadius="md"
                borderColor={borderColor}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
                _hover={{ borderColor: "gray.400" }}
                isDisabled={isSubmitting}
              />
              <FormErrorMessage fontSize="xs" mt={1}>
                {errors.name}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb={2}
              >
                Correo electrónico
              </FormLabel>
              <Input
                type="email"
                placeholder="usuario@correo.com"
                value={form?.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                size="md"
                borderRadius="md"
                borderColor={borderColor}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
                _hover={{ borderColor: "gray.400" }}
                isDisabled={isSubmitting}
              />
              <FormErrorMessage fontSize="xs" mt={1}>
                {errors.email}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.role} isRequired>
              <FormLabel
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb={2}
              >
                Rol de usuario
              </FormLabel>
              <Select
                placeholder="Selecciona un rol"
                value={
                  Array.isArray(form?.role) ? form.role[0] : form?.role || ""
                }
                onChange={(e) => handleChange("role", e.target.value)}
                size="md"
                borderRadius="md"
                borderColor={borderColor}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
                _hover={{ borderColor: "gray.400" }}
                isDisabled={isSubmitting}
              >
                <option value="admin">Administrador</option>
                <option value="empleado">Empleado</option>
              </Select>
              <FormHelperText fontSize="xs" color={labelColor}>
                El administrador tiene acceso completo al sistema
              </FormHelperText>
              <FormErrorMessage fontSize="xs" mt={1}>
                {errors.role}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb={2}
              >
                Contraseña {form?.id ? "(opcional)" : ""}
              </FormLabel>
              <Input
                type="password"
                placeholder={
                  form?.id
                    ? "Dejar en blanco si no se modifica"
                    : "Ingresa una contraseña segura"
                }
                value={form?.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                size="md"
                borderRadius="md"
                borderColor={borderColor}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
                _hover={{ borderColor: "gray.400" }}
                isDisabled={isSubmitting}
              />
              <FormHelperText fontSize="xs" color={labelColor}>
                {form?.id
                  ? "Mínimo 6 caracteres si se modifica"
                  : "Mínimo 6 caracteres, incluye letras y números"}
              </FormHelperText>
              <FormErrorMessage fontSize="xs" mt={1}>
                {errors.password}
              </FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter
          borderTop="1px solid"
          borderColor={borderColor}
          pt={4}
          pb={6}
          px={6}
        >
          <HStack spacing={3} w="full" justify="flex-end">
            <Button
              variant="ghost"
              onClick={handleCancel}
              size="md"
              isDisabled={isSubmitting}
              _hover={{ bg: "gray.100" }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              size="md"
              isLoading={isSubmitting}
              loadingText={form?.id ? "Guardando..." : "Creando..."}
              _hover={{ bg: "blue.600" }}
            >
              {form?.id ? "Guardar cambios" : "Crear usuario"}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
