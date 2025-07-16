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
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  useToast,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { Vehiculo } from "@/types/types";
import { useVehiculoStore } from "../../stores/useVehiculoStore";
import FormActions from "../form/FormActions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vehiculo: Vehiculo | null;
}

export default function EditVehiculoModal({
  isOpen,
  onClose,
  vehiculo,
}: Props) {
  const toast = useToast();
  const { updateVehiculo, fetchVehiculos, vehiculos } = useVehiculoStore();

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    año: new Date().getFullYear(),
    numeroPuertas: 4,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const initialRef = useRef<HTMLInputElement>(null);

  // Colores del tema
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    if (vehiculo) {
      setForm({
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        año: vehiculo.año,
        numeroPuertas: vehiculo.numeroPuertas,
      });
      setErrors({});
    }
  }, [vehiculo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNumberChange = (
    valueAsString: string,
    valueAsNumber: number,
    name: string
  ) => {
    setForm((prev) => ({ ...prev, [name]: valueAsNumber }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.marca.trim()) {
      newErrors.marca = "La marca es obligatoria";
    }
    if (!form.modelo.trim()) {
      newErrors.modelo = "El modelo es obligatorio";
    }
    if (
      !form.año ||
      form.año < 1950 ||
      form.año > new Date().getFullYear() + 1
    ) {
      newErrors.año =
        "El año debe estar entre 1950 y " + (new Date().getFullYear() + 1);
    }
    if (
      !form.numeroPuertas ||
      form.numeroPuertas < 2 ||
      form.numeroPuertas > 5
    ) {
      newErrors.numeroPuertas = "El número de puertas debe estar entre 2 y 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!vehiculo) return;

    if (!validateForm()) {
      return;
    }

    // Validación de duplicados
    const existe = vehiculos.some(
      (v) =>
        v.id !== vehiculo.id &&
        v.marca.trim().toLowerCase() === form.marca.trim().toLowerCase() &&
        v.modelo.trim().toLowerCase() === form.modelo.trim().toLowerCase() &&
        v.año === form.año &&
        v.numeroPuertas === form.numeroPuertas
    );
    if (existe) {
      toast({
        title: "Ya existe un vehículo con esos datos",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      await updateVehiculo(vehiculo.id, {
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        año: form.año,
        numeroPuertas: form.numeroPuertas,
      });
      toast({
        title: "Vehículo actualizado exitosamente",
        status: "success",
        description: `${form.marca} ${form.modelo} ${form.año} ha sido actualizado`,
      });
      onClose();
      await fetchVehiculos();
    } catch {
      toast({
        title: "Error al actualizar el vehículo",
        status: "error",
        description: "Por favor, intenta nuevamente",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      isCentered
      aria-label="Editar vehículo"
      initialFocusRef={initialRef}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="xl"
        mx={4}
      >
        <ModalHeader borderBottom="1px solid" borderColor={borderColor} pb={4}>
          <VStack align="flex-start" spacing={1}>
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Editar Vehículo
            </Text>
            <Text fontSize="sm" color={mutedTextColor}>
              Modifica la información del vehículo seleccionado
            </Text>
          </VStack>
        </ModalHeader>

        <ModalCloseButton
          aria-label="Cerrar modal de edición de vehículo"
          borderRadius="full"
          size="lg"
          top={4}
          right={4}
        />

        <ModalBody py={6}>
          <VStack spacing={5} align="stretch">
            <FormControl isInvalid={!!errors.marca} isRequired>
              <FormLabel color={textColor} fontWeight="medium">
                Marca
              </FormLabel>
              <Input
                name="marca"
                value={form.marca}
                onChange={handleChange}
                ref={initialRef}
                placeholder="Ej: Toyota, Ford, BMW..."
                borderRadius="lg"
                borderColor="gray.300"
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px rgba(0, 119, 204, 0.3)",
                }}
                _placeholder={{ color: "gray.400" }}
              />
              <FormErrorMessage>{errors.marca}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.modelo} isRequired>
              <FormLabel color={textColor} fontWeight="medium">
                Modelo
              </FormLabel>
              <Input
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Ej: Corolla, Focus, X3..."
                borderRadius="lg"
                borderColor="gray.300"
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px rgba(0, 119, 204, 0.3)",
                }}
                _placeholder={{ color: "gray.400" }}
              />
              <FormErrorMessage>{errors.modelo}</FormErrorMessage>
            </FormControl>

            <HStack spacing={4}>
              <FormControl isInvalid={!!errors.año} isRequired flex={1}>
                <FormLabel color={textColor} fontWeight="medium">
                  Año
                </FormLabel>
                <NumberInput
                  name="año"
                  min={1950}
                  max={new Date().getFullYear() + 1}
                  value={form.año}
                  onChange={(val, num) => handleNumberChange(val, num, "año")}
                >
                  <NumberInputField
                    borderRadius="lg"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px rgba(0, 119, 204, 0.3)",
                    }}
                  />
                </NumberInput>
                <FormErrorMessage>{errors.año}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!errors.numeroPuertas}
                isRequired
                flex={1}
              >
                <FormLabel color={textColor} fontWeight="medium">
                  Número de Puertas
                </FormLabel>
                <NumberInput
                  name="numeroPuertas"
                  min={2}
                  max={5}
                  value={form.numeroPuertas}
                  onChange={(val, num) =>
                    handleNumberChange(val, num, "numeroPuertas")
                  }
                >
                  <NumberInputField
                    borderRadius="lg"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px rgba(0, 119, 204, 0.3)",
                    }}
                  />
                </NumberInput>
                <FormErrorMessage>{errors.numeroPuertas}</FormErrorMessage>
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>

        <FormActions
          submitLabel="Guardar Cambios"
          isSubmitting={loading}
          onCancel={handleClose}
          cancelLabel="Cancelar"
          align="right"
          onSubmit={handleSubmit}
        />
      </ModalContent>
    </Modal>
  );
}
