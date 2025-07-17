import { citaSchema } from "@/schemas/citasSchema";
import { useCitasStore } from "@/stores/useCitaStore";
import { useClientStore } from "@/stores/useClientStore";
import { useVehiculoStore } from "@/stores/useVehiculoStore";
import { CitaConRelaciones, EstadoCita } from "@/types/types";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  VStack,
  useToast,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { CheckIcon } from "@chakra-ui/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cita: CitaConRelaciones | null;
  onSave: (id: number, data: Partial<CitaConRelaciones>) => Promise<void>;
}

const formatFechaForInput = (fecha: string | Date): string => {
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Define el tipo para el estado del formulario
interface EditCitaFormData {
  clienteId?: number;
  vehiculoId?: number;
  fecha: string;
  descripcion: string;
  telefono: string;
  presupuestoMax?: number;
  presupuestoBasico?: number;
  presupuestoIntermedio?: number;
  presupuestoPremium?: number;
  estado: EstadoCita;
}

export default function EditCitaModal({
  isOpen,
  onClose,
  cita,
  onSave,
}: Props) {
  const toast = useToast();
  const clients = useClientStore((state) => state.clients);
  const fetchClients = useClientStore((state) => state.fetchClients);

  const vehiculos = useVehiculoStore((state) => state.vehiculos);
  const fetchVehiculos = useVehiculoStore((state) => state.fetchVehiculos);

  const [formData, setFormData] = useState<EditCitaFormData>({
    clienteId: cita?.clienteId ?? undefined,
    vehiculoId: cita?.vehiculoId ?? undefined,
    fecha: cita?.fecha ? formatFechaForInput(cita.fecha) : "",
    descripcion: cita?.descripcion ?? "",
    telefono: cita?.telefono ?? "",
    presupuestoMax:
      typeof cita?.presupuestoMax === "number"
        ? cita.presupuestoMax
        : undefined,
    presupuestoBasico:
      typeof cita?.presupuestoBasico === "number"
        ? cita.presupuestoBasico
        : undefined,
    presupuestoIntermedio:
      typeof cita?.presupuestoIntermedio === "number"
        ? cita.presupuestoIntermedio
        : undefined,
    presupuestoPremium:
      typeof cita?.presupuestoPremium === "number"
        ? cita.presupuestoPremium
        : undefined,
    estado: (cita?.estado as EstadoCita) ?? "pendiente",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const initialRef = useRef<HTMLInputElement>(null);

  // Declarar los useState ANTES de cualquier efecto o función que los use
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>(
    cita?.servicios?.[0]?.nombre || ""
  );
  const [descripcionOtro, setDescripcionOtro] = useState<string>("");

  // Modifico resetFormState para también actualizar el servicio seleccionado y la descripción personalizada
  const resetFormState = useCallback(() => {
    if (cita) {
      const clienteAsociado = clients.find((c) => c.id === cita.clienteId);
      let initialBusqueda = "";
      if (clienteAsociado) {
        initialBusqueda =
          clienteAsociado.telefono || clienteAsociado.email || "";
      } else if (cita.telefono) {
        initialBusqueda = cita.telefono;
      }
      const newFormData = {
        clienteId: cita.clienteId ?? undefined,
        vehiculoId: cita.vehiculoId ?? undefined,
        fecha: cita.fecha ? formatFechaForInput(cita.fecha) : "",
        descripcion: cita.descripcion ?? "",
        telefono: cita.telefono ?? "",
        presupuestoMax:
          typeof cita.presupuestoMax === "number"
            ? cita.presupuestoMax
            : undefined,
        presupuestoBasico:
          typeof cita.presupuestoBasico === "number"
            ? cita.presupuestoBasico
            : undefined,
        presupuestoIntermedio:
          typeof cita.presupuestoIntermedio === "number"
            ? cita.presupuestoIntermedio
            : undefined,
        presupuestoPremium:
          typeof cita.presupuestoPremium === "number"
            ? cita.presupuestoPremium
            : undefined,
        estado: cita.estado ?? "pendiente",
      };
      setFormData(newFormData);
      setBusquedaCliente(initialBusqueda);
      setErrors({});
      // Sincronizar servicio seleccionado
      if (cita.servicios && cita.servicios.length > 0) {
        setServicioSeleccionado(cita.servicios[0].nombre);
        setDescripcionOtro(
          cita.servicios[0].nombre === "Otros"
            ? cita.servicios[0].descripcion || ""
            : ""
        );
      } else {
        setServicioSeleccionado("");
        setDescripcionOtro("");
      }
    }
  }, [cita, clients]);

  // Depuración profunda: log al abrir el modal y al resetear el estado
  useEffect(() => {
    if (isOpen && cita) {
      // console.log("[EditCitaModal] Cita recibida en modal:", cita);
    }
  }, [isOpen, cita]);

  useEffect(() => {
    fetchClients();
    fetchVehiculos();
  }, [fetchClients, fetchVehiculos]);

  useEffect(() => {
    if (isOpen) {
      resetFormState();
    }
  }, [isOpen, resetFormState]);

  useEffect(() => {
    if (cita?.servicios && cita.servicios[0]?.nombre) {
      setServicioSeleccionado(cita.servicios[0].nombre);
    }
  }, [cita?.servicios]);

  // Elimina cualquier otro useEffect redundante que intente sincronizar el servicio

  const handleClose = () => {
    resetFormState();
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let castedValue: number | string | undefined = value;
    if (name.includes("presupuesto") || name.includes("Id")) {
      castedValue = value === "" ? undefined : Number(value);
    }
    const updatedForm: EditCitaFormData = {
      ...formData,
      [name]: castedValue,
    };
    setFormData(updatedForm);
    // Validación
    const presupuestoMax =
      typeof updatedForm.presupuestoMax === "number"
        ? updatedForm.presupuestoMax
        : undefined;
    const result = citaSchema.safeParse({
      ...updatedForm,
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
  };

  const citas = useCitasStore((state) => state.citas);

  const handleSubmit = async () => {
    if (isLoading) return;
    // Validar que haya un servicio seleccionado
    if (!servicioSeleccionado) {
      toast({
        title: "Servicio requerido",
        description: "Debes seleccionar un servicio para la cita.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    // Validar que la descripción no sea vacía
    let descripcionFinal = servicioSeleccionado;
    if (servicioSeleccionado === "Otros") {
      if (!descripcionOtro.trim()) {
        toast({
          title: "Descripción requerida",
          description:
            "Debes escribir una descripción para el servicio 'Otros'.",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
      descripcionFinal = descripcionOtro.trim();
    }
    // Construir el objeto a guardar con los datos correctos
    const serviciosFinal = [
      {
        nombre: servicioSeleccionado,
        descripcion:
          servicioSeleccionado === "Otros" ? descripcionOtro.trim() : undefined,
      },
    ];
    setIsLoading(true);
    try {
      const datosParaGuardar = {
        ...formData,
        fecha: formData.fecha
          ? new Date(formData.fecha).toISOString()
          : undefined,
        descripcion: descripcionFinal,
        servicios: serviciosFinal,
        estado: formData.estado as EstadoCita,
        ...(servicioSeleccionado === "Tintado de Lunas"
          ? {
              presupuestoBasico:
                typeof formData.presupuestoBasico === "number"
                  ? formData.presupuestoBasico
                  : undefined,
              presupuestoIntermedio:
                typeof formData.presupuestoIntermedio === "number"
                  ? formData.presupuestoIntermedio
                  : undefined,
              presupuestoPremium:
                typeof formData.presupuestoPremium === "number"
                  ? formData.presupuestoPremium
                  : undefined,
            }
          : {
              presupuestoMax:
                typeof formData.presupuestoMax === "number"
                  ? formData.presupuestoMax
                  : undefined,
            }),
      };
      if (
        servicioSeleccionado === "Tintado de Lunas" &&
        "presupuestoMax" in datosParaGuardar
      ) {
        delete datosParaGuardar.presupuestoMax;
      }
      const result = citaSchema.safeParse({
        ...datosParaGuardar,
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
      if (!formData.fecha) {
        toast({
          title: "Fecha requerida",
          description: "Debes seleccionar una fecha válida",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
      const nuevaFecha = datosParaGuardar.fecha;
      const existeConflicto = citas.some(
        (c) =>
          c.id !== cita?.id && new Date(c.fecha).toISOString() === nuevaFecha
      );
      if (existeConflicto) {
        toast({
          title: "Horario ocupado",
          description: "Ya existe una cita programada para esa fecha y hora.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (cita) {
        await onSave(cita.id, datosParaGuardar);
        toast({
          title: "Cita actualizada",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } catch {
      toast({
        title: "Error al actualizar",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const opcionesServicios = [
    "Tintado de Lunas",
    "Wrapping",
    "Detailing",
    "Pulido de Faros",
    "Pulido de Coche",
    "Tintado para Arquitectura",
    "Vinilado",
    "Diseño + Impresión",
    "Otros",
  ];
  // Eliminar el campo de descripción del renderizado (Input de descripción)

  // Elimino cualquier lógica de precio y lista de servicios
  // Al seleccionar un servicio, se asigna automáticamente como el único servicio
  const handleServicioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setServicioSeleccionado(value);
    if (value !== "Otros") {
      setDescripcionOtro("");
    }
    // Sobrescribir siempre la descripción
    let nuevaDescripcion = value;
    if (value === "Otros" && descripcionOtro) {
      nuevaDescripcion = descripcionOtro;
    }
    setFormData((prev) => ({
      ...prev,
      descripcion: nuevaDescripcion,
      servicios: [
        {
          nombre: value,
          descripcion: value === "Otros" ? descripcionOtro : undefined,
        },
      ],
      ...(value !== "Tintado de Lunas" && {
        presupuestoBasico: undefined,
        presupuestoIntermedio: undefined,
        presupuestoPremium: undefined,
      }),
    }));
    if (value === "Tintado de Lunas") {
      // setPresupuestoDisabled({ min: false, max: false }); // Eliminado
    } else {
      // setPresupuestoDisabled({ min: true, max: false }); // Eliminado
      setFormData((prev) => ({
        ...prev,
        presupuestoMax: 0,
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      isCentered
      aria-label="Editar cita"
      initialFocusRef={initialRef}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
      >
        <ModalHeader
          fontSize="xl"
          fontWeight="bold"
          color="gray.800"
          _dark={{ color: "gray.100" }}
          pb={4}
        >
          Editar Cita
        </ModalHeader>
        <ModalCloseButton
          aria-label="Cerrar modal de edición de cita"
          size="lg"
          borderRadius="full"
          _hover={{ bg: "gray.100" }}
          _dark={{ _hover: { bg: "gray.700" } }}
        />
        <ModalBody pb={6}>
          <VStack spacing={5} align="stretch">
            <FormControl isInvalid={!!errors.clienteId}>
              <FormLabel
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Teléfono o Email del Cliente
              </FormLabel>
              <Input
                placeholder="Introduce teléfono o email"
                value={busquedaCliente}
                onChange={(e) => {
                  const input = e.target.value;
                  setBusquedaCliente(input);

                  if (!input.trim()) {
                    setFormData((prev) => ({
                      ...prev,
                      clienteId: undefined,
                      telefono: "",
                    }));
                    return;
                  }

                  const match = clients.find(
                    (c) =>
                      c.telefono?.toLowerCase() ===
                        input.toLowerCase().trim() ||
                      c.email?.toLowerCase() === input.toLowerCase().trim()
                  );

                  if (match) {
                    setFormData((prev) => {
                      const newData = {
                        ...prev,
                        clienteId: match.id,
                        telefono: match.telefono || input,
                      };
                      return newData;
                    });
                  } else {
                    setFormData((prev) => {
                      const newData = {
                        ...prev,
                        clienteId: undefined,
                        telefono: input,
                      };
                      return newData;
                    });
                  }
                }}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
              {formData.clienteId ? (
                <Box
                  mt={2}
                  color="green.600"
                  fontSize="xs"
                  display="flex"
                  alignItems="center"
                  p={2}
                  bg="green.50"
                  borderRadius="md"
                  _dark={{ bg: "green.900", color: "green.200" }}
                >
                  <CheckIcon mr={2} />
                  Cliente encontrado y asignado
                </Box>
              ) : (
                busquedaCliente.trim() && (
                  <Box
                    mt={2}
                    color="orange.600"
                    fontSize="xs"
                    display="flex"
                    alignItems="center"
                    p={2}
                    bg="orange.50"
                    borderRadius="md"
                    _dark={{ bg: "orange.900", color: "orange.200" }}
                  >
                    Cliente no encontrado - se guardará solo con el teléfono
                  </Box>
                )
              )}
              <FormErrorMessage>{errors.clienteId}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.vehiculoId}>
              <FormLabel
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Vehículo
              </FormLabel>
              <Select
                name="vehiculoId"
                value={formData.vehiculoId ?? ""}
                onChange={handleChange}
                placeholder="Selecciona un vehículo"
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              >
                {vehiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.marca} {v.modelo} ({v.año})
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.vehiculoId}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.fecha}>
              <FormLabel
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Fecha y hora
              </FormLabel>
              <Input
                type="datetime-local"
                name="fecha"
                value={formData.fecha || ""}
                onChange={handleChange}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
              <FormErrorMessage>{errors.fecha}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Servicio solicitado
              </FormLabel>
              <Select
                placeholder="Selecciona servicio"
                value={servicioSeleccionado}
                onChange={handleServicioChange}
                size="sm"
                w="200px"
              >
                {opcionesServicios.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </Select>
              {servicioSeleccionado === "Otros" && (
                <Input
                  mt={2}
                  placeholder="Describe el servicio solicitado"
                  value={descripcionOtro}
                  onChange={(e) => setDescripcionOtro(e.target.value)}
                  size="sm"
                />
              )}
            </FormControl>

            {/* Presupuestos para Tintado de Lunas */}
            {servicioSeleccionado === "Tintado de Lunas" && (
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <FormControl isRequired isInvalid={!!errors.presupuestoBasico}>
                  <FormLabel>Presupuesto Básico (€)</FormLabel>
                  <Input
                    name="presupuestoBasico"
                    type="number"
                    min={0}
                    value={formData.presupuestoBasico || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    inputMode="decimal"
                  />
                  <FormErrorMessage>
                    {errors.presupuestoBasico}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={!!errors.presupuestoIntermedio}
                >
                  <FormLabel>Presupuesto Intermedio (€)</FormLabel>
                  <Input
                    name="presupuestoIntermedio"
                    type="number"
                    min={0}
                    value={formData.presupuestoIntermedio || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    inputMode="decimal"
                  />
                  <FormErrorMessage>
                    {errors.presupuestoIntermedio}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.presupuestoPremium}>
                  <FormLabel>Presupuesto Premium (€)</FormLabel>
                  <Input
                    name="presupuestoPremium"
                    type="number"
                    min={0}
                    value={formData.presupuestoPremium || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    inputMode="decimal"
                  />
                  <FormErrorMessage>
                    {errors.presupuestoPremium}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>
            )}

            {servicioSeleccionado !== "Tintado de Lunas" && (
              <FormControl
                isRequired
                isInvalid={!!errors.presupuestoMax}
                mt={4}
              >
                <FormLabel>Presupuesto Máximo (€)</FormLabel>
                <Input
                  name="presupuestoMax"
                  type="number"
                  min={0}
                  value={formData.presupuestoMax || ""}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  inputMode="decimal"
                />
                <FormErrorMessage>{errors.presupuestoMax}</FormErrorMessage>
              </FormControl>
            )}

            <FormControl isInvalid={!!errors.estado}>
              <FormLabel
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
                _dark={{ color: "gray.300" }}
              >
                Estado
              </FormLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              >
                <option value="pendiente">Pendiente</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </Select>
              <FormErrorMessage>{errors.estado}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter pt={0} gap={3}>
          <Button
            variant="outline"
            onClick={handleClose}
            isDisabled={isLoading}
            _hover={{ bg: "gray.50" }}
            _dark={{ _hover: { bg: "gray.700" } }}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Guardando..."
            _hover={{ transform: "translateY(-1px)" }}
            transition="all 0.2s ease"
          >
            Guardar Cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
