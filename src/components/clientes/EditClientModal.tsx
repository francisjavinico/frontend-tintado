import { clientSchema } from "@/schemas/clientSchema";
import { Client } from "@/types/types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import FormActions from "../form/FormActions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  clients: Client[];
  onSave: (clientData: Partial<Client>) => void;
}

export default function EditClientModal({
  isOpen,
  onClose,
  client,
  clients,
  onSave,
}: Props) {
  const [form, setForm] = useState<Partial<Client>>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    documentoIdentidad: "",
    direccion: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const initialRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(
        client
          ? {
              ...client,
              direccion:
                typeof client.direccion === "string" ? client.direccion : "",
            }
          : {
              nombre: "",
              apellido: "",
              email: "",
              telefono: "",
              documentoIdentidad: "",
              direccion: "",
            }
      );
      setErrors({});
    }
  }, [client, isOpen]);

  const handleChange = (field: keyof Client, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const result = clientSchema.safeParse(form);

    if (!result.success) {
      const zodErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (typeof field === "string") {
          zodErrors[field] = err.message;
        }
      });
      setErrors(zodErrors);
      return;
    }
    const duplicates: { [key: string]: string } = {};
    const isDuplicate = clients.some(
      (c) =>
        c.telefono.toLowerCase() === form.telefono?.toLowerCase() &&
        c.id !== form.id
    );
    if (isDuplicate) {
      duplicates.telefono = "Este teléfono ya está registrado";
    }
    const isEmailDuplicate = clients.some(
      (c) =>
        c.email.toLowerCase() === form.email?.toLowerCase() && c.id !== form.id
    );
    if (isEmailDuplicate) {
      duplicates.email = "Este email ya está registrado";
    }
    const isDNIDuplicate = clients.some(
      (c) =>
        c.documentoIdentidad.toLowerCase() ===
          form.documentoIdentidad?.toLowerCase() && c.id !== form.id
    );
    if (isDNIDuplicate) {
      duplicates.documentoIdentidad = "Este documento ya está registrado";
    }
    if (Object.keys(duplicates).length > 0) {
      setErrors(duplicates);
      return;
    }
    onSave(form);
    onClose();
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
      aria-label="Editar cliente"
      initialFocusRef={initialRef}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        borderRadius="2xl"
        boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        border="1px solid"
        borderColor="gray.200"
      >
        <ModalHeader
          fontSize="xl"
          fontWeight="bold"
          pb={4}
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          {form?.id ? "Editar Cliente" : "Agregar Cliente"}
        </ModalHeader>
        <ModalCloseButton
          aria-label="Cerrar modal de edición de cliente"
          size="lg"
          top={4}
          right={4}
        />
        <ModalBody p={6}>
          <VStack spacing={6} align="stretch">
            {/* Información personal */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.nombre}>
                <FormLabel fontWeight="medium" color="gray.700">
                  Nombre *
                </FormLabel>
                <Input
                  ref={initialRef}
                  value={form?.nombre || ""}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
                  placeholder="Ingresa el nombre"
                />
                {errors.nombre && (
                  <FormErrorMessage fontSize="sm">
                    {errors.nombre}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.apellido}>
                <FormLabel fontWeight="medium" color="gray.700">
                  Apellido *
                </FormLabel>
                <Input
                  value={form?.apellido || ""}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
                  placeholder="Ingresa el apellido"
                />
                {errors.apellido && (
                  <FormErrorMessage fontSize="sm">
                    {errors.apellido}
                  </FormErrorMessage>
                )}
              </FormControl>
            </SimpleGrid>

            {/* Información de contacto */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.telefono}>
                <FormLabel fontWeight="medium" color="gray.700">
                  Teléfono *
                </FormLabel>
                <Input
                  value={form?.telefono || ""}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
                  placeholder="Ej: 612345678"
                />
                <FormErrorMessage fontSize="sm">
                  {errors.telefono}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontWeight="medium" color="gray.700">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  value={form?.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
                  placeholder="ejemplo@email.com"
                />
                {errors.email && (
                  <FormErrorMessage fontSize="sm">
                    {errors.email}
                  </FormErrorMessage>
                )}
              </FormControl>
            </SimpleGrid>

            {/* Información adicional */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.documentoIdentidad}>
                <FormLabel fontWeight="medium" color="gray.700">
                  Documento de Identidad
                </FormLabel>
                <Input
                  value={form?.documentoIdentidad || ""}
                  onChange={(e) =>
                    handleChange("documentoIdentidad", e.target.value)
                  }
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
                  placeholder="DNI, NIE, etc."
                />
                <FormErrorMessage fontSize="sm">
                  {errors.documentoIdentidad}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.direccion}>
                <FormLabel fontWeight="medium" color="gray.700">
                  Dirección
                </FormLabel>
                <Input
                  value={form?.direccion || ""}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
                  placeholder="Dirección completa"
                />
                {errors.direccion && (
                  <FormErrorMessage fontSize="sm">
                    {errors.direccion === "La dirección es obligatoria" ||
                    errors.direccion === "Required" ||
                    errors.direccion === "Required field"
                      ? "La dirección es obligatoria y debe tener al menos 5 caracteres"
                      : errors.direccion}
                  </FormErrorMessage>
                )}
              </FormControl>
            </SimpleGrid>
          </VStack>

          <Box mt={8}>
            <FormActions
              submitLabel={form?.id ? "Guardar Cambios" : "Crear Cliente"}
              onCancel={onClose}
              cancelLabel="Cancelar"
              align="right"
              onSubmit={handleSubmit}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
