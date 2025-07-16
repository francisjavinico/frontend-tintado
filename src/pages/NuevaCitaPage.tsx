import CitaFormFields from "@/components/citas/CitaFormFiel";
import { citaSchema } from "@/schemas/citasSchema";
import { useCitasStore } from "@/stores/useCitaStore";
import { useClientStore } from "@/stores/useClientStore";
import { useVehiculoStore } from "@/stores/useVehiculoStore";
import { NuevaCitaForm } from "@/types/types";
import { Box, Button, VStack, useToast, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

export default function NuevaCitaPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchVehiculos = useVehiculoStore((s) => s.fetchVehiculos);

  const clients = useClientStore((s) => s.clients);
  const fetchClients = useClientStore((s) => s.fetchClients);

  const createCita = useCitasStore((s) => s.createCita);
  const citas = useCitasStore((s) => s.citas);
  const fetchCitas = useCitasStore((s) => s.fetchCitas);

  const [formData, setFormData] = useState<NuevaCitaForm>({
    clienteId: undefined,
    vehiculoId: undefined,
    fecha: "",
    descripcion: "",
    telefono: "",
    presupuestoMin: "",
    presupuestoMax: "",
    matricula: "",
    estado: "pendiente",
    servicios: [], // Aseguramos que siempre exista el array
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clienteIdEncontrado, setClienteIdEncontrado] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchClients();
    fetchVehiculos();
    fetchCitas();
  }, [fetchClients, fetchVehiculos, fetchCitas]);

  // Prellenar datos si viene clienteId por query
  useEffect(() => {
    const clienteIdParam = searchParams.get("clienteId");
    if (clienteIdParam && clients.length > 0) {
      const cliente = clients.find((c) => c.id === Number(clienteIdParam));
      if (cliente) {
        setFormData((prev) => ({
          ...prev,
          clienteId: cliente.id,
          telefono: cliente.telefono || "",
        }));
        setClienteIdEncontrado(cliente.id);
      }
    }
  }, [searchParams, clients]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | {
          target: {
            name: string;
            value:
              | string
              | number
              | import("@/types/types").Servicio[]
              | undefined;
          };
        }
  ) => {
    const { name, value } = e.target;

    // Si el campo es servicios, lo pasamos tal cual (array)
    const castedValue =
      name === "servicios"
        ? value
        : name.includes("presupuesto") || name.includes("Id")
          ? value === ""
            ? undefined
            : Number(value)
          : value;

    const parsedForm = {
      ...formData,
      [name]: castedValue,
    };

    setFormData((prev) => ({
      ...prev,
      [name]: castedValue,
    }));

    const presupuestoMin =
      parsedForm.presupuestoMin === ""
        ? undefined
        : Number(parsedForm.presupuestoMin);
    const presupuestoMax =
      parsedForm.presupuestoMax === ""
        ? undefined
        : Number(parsedForm.presupuestoMax);

    const result = citaSchema.safeParse({
      ...parsedForm,
      presupuestoMin,
      presupuestoMax,
    });

    if (!result.success) {
      const fieldError = result.error.errors.find(
        (err) => err.path[0] === name
      );
      setErrors((prev) => ({ ...prev, [name]: fieldError?.message || "" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Lógica para buscar cliente por teléfono
    if (name === "telefono" && typeof value === "string") {
      const clienteEncontrado = clients.find(
        (c) => c.telefono === value.trim()
      );
      if (clienteEncontrado) {
        setClienteIdEncontrado(clienteEncontrado.id);
        setFormData((prev) => ({
          ...prev,
          clienteId: clienteEncontrado.id,
        }));
      } else {
        setClienteIdEncontrado(null);
        setFormData((prev) => ({
          ...prev,
          clienteId: undefined,
        }));
      }
    }
  };

  const handleSubmit = async () => {
    const presupuestoMin =
      formData.presupuestoMin === ""
        ? undefined
        : Number(formData.presupuestoMin);
    const presupuestoMax =
      formData.presupuestoMax === ""
        ? undefined
        : Number(formData.presupuestoMax);

    // Validación extra: si el servicio es 'Otros', la descripción es obligatoria
    if (
      Array.isArray(formData.servicios) &&
      formData.servicios.length > 0 &&
      formData.servicios[0].nombre === "Otros" &&
      (!formData.servicios[0].descripcion ||
        formData.servicios[0].descripcion.trim() === "")
    ) {
      toast({
        title: "Descripción requerida",
        description: "Debes especificar la descripción del servicio 'Otros'.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (
      presupuestoMin !== undefined &&
      presupuestoMax !== undefined &&
      presupuestoMin > presupuestoMax
    ) {
      toast({
        title: "Error en presupuestos",
        description: "El presupuesto mínimo no puede ser mayor que el máximo",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const result = citaSchema.safeParse({
      ...formData,
      presupuestoMin,
      presupuestoMax,
    });

    if (!result.success) {
      toast({
        title: "Error en el formulario",
        description: result.error.errors[0]?.message ?? "Formulario inválido",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const esTintado =
      Array.isArray(formData.servicios) &&
      formData.servicios[0]?.nombre === "Tintado de Lunas";

    // Validación específica para Tintado de Lunas
    if (esTintado) {
      const basico = Number(formData.presupuestoBasico);
      const intermedio = Number(formData.presupuestoIntermedio);
      const premium = Number(formData.presupuestoPremium);
      if (
        isNaN(basico) ||
        isNaN(intermedio) ||
        isNaN(premium) ||
        formData.presupuestoBasico === undefined ||
        formData.presupuestoIntermedio === undefined ||
        formData.presupuestoPremium === undefined
      ) {
        toast({
          title: "Presupuestos requeridos",
          description:
            "Debes ingresar los tres presupuestos para Tintado de Lunas.",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
      if (!(intermedio > basico)) {
        toast({
          title: "Presupuesto intermedio incorrecto",
          description:
            "El presupuesto intermedio debe ser mayor que el básico.",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
      if (!(premium > intermedio && premium > basico)) {
        toast({
          title: "Presupuesto premium incorrecto",
          description:
            "El presupuesto premium debe ser mayor que el básico y el intermedio.",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
    }

    const soloCampos = {
      clienteId: formData.clienteId,
      vehiculoId: formData.vehiculoId,
      fecha: formData.fecha ? new Date(formData.fecha).toISOString() : "",
      descripcion: formData.descripcion,
      telefono: formData.telefono,
      presupuestoMin,
      presupuestoMax,
      matricula: formData.matricula,
      estado: formData.estado,
      servicios: Array.isArray(formData.servicios) ? formData.servicios : [],
      ...(esTintado && {
        presupuestoBasico: formData.presupuestoBasico
          ? Number(formData.presupuestoBasico)
          : undefined,
        presupuestoIntermedio: formData.presupuestoIntermedio
          ? Number(formData.presupuestoIntermedio)
          : undefined,
        presupuestoPremium: formData.presupuestoPremium
          ? Number(formData.presupuestoPremium)
          : undefined,
      }),
    };

    const parsed = citaSchema.safeParse(soloCampos);

    if (!parsed.success) {
      toast({
        title: "Error en el formulario",
        description: parsed.error.errors[0]?.message ?? "Formulario inválido",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const fechaCita = parsed.data.fecha;
    const citaYaExiste = citas.some(
      (c) => new Date(c.fecha).toISOString() === fechaCita
    );

    if (citaYaExiste) {
      toast({
        title: "Horario ocupado",
        description: "Ya existe una cita programada para esa fecha y hora.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await createCita(soloCampos);
      toast({
        title: "Cita creada con éxito",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/citas");
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error inesperado.";

      toast({
        title: "Error al crear cita",
        description: mensaje,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box px={{ base: 2, md: 4 }} py={4} w="full" minH="100vh">
      {/* Form Section */}
      <Box w="full" maxW={{ base: "100%", sm: "90%", md: "800px" }} mx="auto">
        <Box
          bg="white"
          _dark={{ bg: "gray.800", borderColor: "gray.700" }}
          borderRadius="xl"
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          border="1px solid"
          borderColor="gray.200"
          p={{ base: 6, md: 8 }}
          position="relative"
          overflow="hidden"
        >
          {/* Decorative accent */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="4px"
            bg="linear-gradient(90deg, brand.500 0%, accent.500 100%)"
          />

          <VStack spacing={8} align="stretch">
            {/* Form Header */}
            <Box textAlign="center" pb={4}>
              <Text
                fontSize="lg"
                fontWeight="semibold"
                color="gray.700"
                _dark={{ color: "gray.300" }}
                mb={2}
              >
                Información de la Cita
              </Text>
              <Text
                fontSize="sm"
                color="gray.500"
                _dark={{ color: "gray.400" }}
              >
                Todos los campos marcados con * son obligatorios
              </Text>
            </Box>

            {/* Form Fields */}
            <CitaFormFields
              formData={formData}
              errors={errors}
              onChange={handleChange}
              clienteIdEncontrado={clienteIdEncontrado}
            />

            {/* Action Buttons */}
            <Box
              pt={6}
              borderTop="1px solid"
              borderColor="gray.200"
              _dark={{ borderColor: "gray.700" }}
            >
              <HStack w="full" justify="flex-end" spacing={4}>
                <Button
                  variant="outline"
                  colorScheme="gray"
                  onClick={() => navigate("/citas")}
                  size="md"
                  px={6}
                  _hover={{
                    bg: "gray.50",
                    transform: "translateY(-1px)",
                    boxShadow: "md",
                  }}
                  _dark={{ _hover: { bg: "gray.700" } }}
                  transition="all 0.2s ease"
                >
                  Cancelar
                </Button>
                <Button
                  colorScheme="brand"
                  onClick={handleSubmit}
                  leftIcon={<FiPlus />}
                  size="md"
                  px={8}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s ease"
                >
                  Crear Cita
                </Button>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
