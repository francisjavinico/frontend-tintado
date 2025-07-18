import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  finalizarCitaSchema,
  FinalizarCitaInput,
} from "@/schemas/finalizarCitaSchema";
import { CitaConRelaciones } from "@/types/types";
import { useCitasStore } from "@/stores/useCitaStore";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cita: CitaConRelaciones;
}

const opcionesLaminas = [
  { label: "Poliester", value: "Poliester" },
  { label: "Nanocerámica", value: "Nanoceramica" },
  { label: "NanoCarbon", value: "NanoCarbon" },
];

export default function FinalizarCitaModal({ isOpen, onClose, cita }: Props) {
  const toast = useToast();
  const finalizarCita = useCitasStore((state) => state.finalizarCita);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    trigger,
    setValue,
  } = useForm<FinalizarCitaInput>({
    resolver: zodResolver(finalizarCitaSchema),
    defaultValues: {
      citaId: cita.id,
      clienteId: cita.clienteId,
      items:
        cita.servicios && cita.servicios.length > 0
          ? cita.servicios.map((serv) => ({
              descripcion:
                serv.nombre === "Otros"
                  ? serv.descripcion || "Otros"
                  : serv.nombre,
              cantidad: 1,
              precioUnit:
                serv.nombre === "Tintado de Lunas" &&
                typeof cita.presupuestoIntermedio === "number"
                  ? cita.presupuestoIntermedio
                  : typeof cita.presupuestoMax === "number"
                    ? cita.presupuestoMax
                    : 0,
            }))
          : [
              {
                descripcion: cita.descripcion || "",
                cantidad: 1,
                precioUnit:
                  cita.descripcion === "Tintado de Lunas" &&
                  typeof cita.presupuestoIntermedio === "number"
                    ? cita.presupuestoIntermedio
                    : typeof cita.presupuestoMax === "number"
                      ? cita.presupuestoMax
                      : 0,
              },
            ],
      generarFactura: false,
      matricula: cita.matricula || "",
      tipoLamina: "Nanoceramica", // Por defecto intermedia
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const total = watch("items", []).reduce(
    (acc, item) => acc + (item.cantidad || 0) * (item.precioUnit || 0),
    0
  );
  const ivaRate = 0.21;
  const subtotal = +(total / (1 + ivaRate)).toFixed(2);
  const iva = +(total - subtotal).toFixed(2);

  // Detectar si falta la matrícula
  const faltaMatricula = !cita.matricula;

  // Detectar si algún servicio es Tintado de Lunas
  const servicios = watch("items", []);
  const esTintadoLunas = servicios.some(
    (s) => s.descripcion === "Tintado de Lunas"
  );

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

  // UI para agregar servicios
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>("");
  const [precioServicio, setPrecioServicio] = useState<string>("");
  const [descripcionOtro, setDescripcionOtro] = useState<string>("");

  // Lógica para precargar el valor intermedio si el servicio es Tintado de Lunas
  const handleServicioSeleccionado = (servicio: string) => {
    setServicioSeleccionado(servicio);
    if (servicio !== "Otros") {
      setDescripcionOtro("");
    }
    // Solo precargar si el usuario no ha escrito nada aún
    if (
      servicio === "Tintado de Lunas" &&
      typeof cita.presupuestoIntermedio === "number" &&
      precioServicio === ""
    ) {
      setPrecioServicio(cita.presupuestoIntermedio.toString());
    } else if (servicio !== "Tintado de Lunas") {
      setPrecioServicio("");
    }
  };

  // Nombres personalizados para presupuestos
  const NOMBRE_BASICO = "Standar";
  const NOMBRE_INTERMEDIO = "Pro";
  const NOMBRE_PREMIUM = "Premium";

  // Estado para error inline al agregar servicio
  const [errorAgregarServicio, setErrorAgregarServicio] = useState<string>("");

  const handleAgregarServicio = () => {
    if (!servicioSeleccionado) return;
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
    if (!precioServicio || parseFloat(precioServicio) <= 0) {
      setErrorAgregarServicio("El precio debe ser mayor que 0");
      return;
    }
    setErrorAgregarServicio("");
    append({
      descripcion: descripcionFinal,
      cantidad: 1,
      precioUnit: parseFloat(precioServicio) || 0,
    });
    setServicioSeleccionado("");
    setPrecioServicio("");
    setDescripcionOtro("");
  };

  // Estado local para edición fluida de precios en servicios precargados
  const [preciosTemp, setPreciosTemp] = useState<{ [idx: number]: string }>({});

  // Nuevo: actualizar precio de Tintado de Lunas según tipo de lámina
  const handleTipoLaminaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value;
    setValue("tipoLamina", tipo); // Sincronizar con React Hook Form
    // Actualizar el precio del servicio Tintado de Lunas
    const idx = fields.findIndex(
      (item) => item.descripcion === "Tintado de Lunas"
    );
    if (idx !== -1) {
      let nuevoPrecio = 0;
      if (tipo === "Poliester" && typeof cita.presupuestoBasico === "number") {
        nuevoPrecio = cita.presupuestoBasico;
      } else if (
        tipo === "Nanoceramica" &&
        typeof cita.presupuestoIntermedio === "number"
      ) {
        nuevoPrecio = cita.presupuestoIntermedio;
      } else if (
        tipo === "NanoCarbon" &&
        typeof cita.presupuestoPremium === "number"
      ) {
        nuevoPrecio = cita.presupuestoPremium;
      }
      update(idx, { ...fields[idx], precioUnit: nuevoPrecio });
    }
  };

  const submit = async (values: FinalizarCitaInput) => {
    // Forzar validación visual de matrícula
    const valid = await trigger("matricula");
    if (!valid) return;
    if (!values.matricula || values.matricula.trim() === "") {
      setError("matricula", {
        type: "manual",
        message: "La matrícula es obligatoria",
      });
      return;
    }
    // Validar que todos los servicios tengan precio mayor que 0
    const tieneMontoCero = values.items.some(
      (item) => !item.precioUnit || item.precioUnit <= 0
    );
    if (tieneMontoCero) {
      toast({
        title: "Error",
        description: "Todos los servicios deben tener un precio mayor que 0.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    // Construir el array de servicios con precio (convertir a número)
    const servicios = values.items.map((item) => ({
      nombre: item.descripcion || "Servicio", // Nunca undefined
      precio: item.precioUnit || 0,
    }));
    try {
      // Enviar el payload correcto al backend
      await finalizarCita({
        ...values,
        servicios,
      });
      toast({
        title: "Cita finalizada",
        description: "Los documentos fueron generados y enviados al cliente.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      onClose();
    } catch {
      toast({
        title: "Error",
        description: "No se pudo finalizar la cita",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      aria-label="Finalizar cita y generar recibo o factura"
    >
      <ModalOverlay />
      <ModalContent borderRadius="xl">
        <ModalHeader>Finalizar Cita</ModalHeader>
        <ModalCloseButton aria-label="Cerrar modal de finalizar cita" />
        <ModalBody>
          <Box mb={4} p={4} bg="gray.50" borderRadius="md">
            <Text fontWeight="bold" mb={3} color="gray.700">
              Datos del Cliente y Vehículo
            </Text>

            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Nombre completo:
                </Text>
                <Text fontSize="sm" fontWeight="500">
                  {cita.cliente?.nombre?.trim()}{" "}
                  {cita.cliente?.apellido?.trim()}
                </Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  DNI/NIE:
                </Text>
                <Text fontSize="sm" fontWeight="500">
                  {cita.cliente?.documentoIdentidad || "No especificado"}
                </Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Dirección:
                </Text>
                <Text fontSize="sm" fontWeight="500">
                  {cita.cliente?.direccion || "No especificada"}
                </Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Teléfono:
                </Text>
                <Text fontSize="sm" fontWeight="500">
                  {cita.cliente?.telefono}
                </Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Vehículo:
                </Text>
                <Text fontSize="sm" fontWeight="500">
                  {cita.vehiculo?.marca} {cita.vehiculo?.modelo} (
                  {cita.vehiculo?.año})
                </Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Matrícula:
                </Text>
                <FormControl isInvalid={!!errors.matricula} maxW="180px">
                  <Input
                    size="sm"
                    placeholder="Introduce la matrícula"
                    {...register("matricula", {
                      required: "La matrícula es obligatoria",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.matricula?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
            </VStack>

            {/* Mostrar presupuestos si es Tintado de Lunas */}
            {cita.servicios[0]?.nombre === "Tintado de Lunas" && (
              <Box
                mt={2}
                p={3}
                borderRadius="md"
                bg="gray.100"
                _dark={{ bg: "gray.800" }}
              >
                <Text
                  fontWeight="bold"
                  color="gray.700"
                  _dark={{ color: "gray.200" }}
                >
                  Presupuestos:
                </Text>
                {typeof cita.presupuestoBasico === "number" && (
                  <Text fontSize="sm">
                    Presupuesto {NOMBRE_BASICO}:{" "}
                    <b>{cita.presupuestoBasico.toFixed(2)} €</b>
                  </Text>
                )}
                {typeof cita.presupuestoIntermedio === "number" && (
                  <Text fontSize="sm">
                    Presupuesto {NOMBRE_INTERMEDIO}:{" "}
                    <b>{cita.presupuestoIntermedio.toFixed(2)} €</b>
                  </Text>
                )}
                {typeof cita.presupuestoPremium === "number" && (
                  <Text fontSize="sm">
                    Presupuesto {NOMBRE_PREMIUM}:{" "}
                    <b>{cita.presupuestoPremium.toFixed(2)} €</b>
                  </Text>
                )}
              </Box>
            )}

            {/* Eliminar cualquier advertencia general de datos faltantes para facturación completa */}
          </Box>

          <VStack spacing={4} align="stretch">
            <Text fontWeight="bold">Items del recibo</Text>
            <Box mt={6} mb={2}>
              <Text fontWeight="bold" mb={2} color="gray.700">
                Servicios realizados
              </Text>
              <VStack align="stretch" spacing={2} mb={2}>
                {fields.map((item, idx) => {
                  // Estado temporal solo para edición fluida
                  const tempValue =
                    preciosTemp[idx] !== undefined
                      ? preciosTemp[idx]
                      : item.precioUnit !== undefined
                        ? String(item.precioUnit)
                        : "";
                  const esTintadoLamina =
                    item.descripcion === "Tintado de Lunas";
                  return (
                    <HStack key={item.id} align="center">
                      {/* Si es Tintado de Lunas, mostrar el select de tipo de lámina a la izquierda del precio */}
                      {esTintadoLamina && (
                        <Select
                          placeholder="Tipo de lámina"
                          {...register("tipoLamina")}
                          size="sm"
                          w="150px"
                          isRequired
                          onChange={handleTipoLaminaChange}
                          value={watch("tipoLamina")}
                        >
                          {opcionesLaminas.map((op) => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </Select>
                      )}
                      <Input
                        value={tempValue}
                        onChange={(e) => {
                          setPreciosTemp((prev) => ({
                            ...prev,
                            [idx]: e.target.value,
                          }));
                        }}
                        onBlur={(e) => {
                          const valor = parseFloat(e.target.value) || 0;
                          update(idx, {
                            ...item,
                            precioUnit: valor,
                          });
                          setPreciosTemp((prev) => {
                            const nuevo = { ...prev };
                            delete nuevo[idx];
                            return nuevo;
                          });
                        }}
                        size="sm"
                        w="100px"
                        type="text"
                        min="0"
                        placeholder="Precio (€)"
                      />
                      <Input
                        value={item.descripcion}
                        isReadOnly
                        size="sm"
                        w="220px"
                        placeholder="Servicio"
                      />
                      <IconButton
                        aria-label="Eliminar"
                        icon={<DeleteIcon />}
                        size="xs"
                        onClick={() => remove(idx)}
                      />
                    </HStack>
                  );
                })}
              </VStack>
              <HStack mt={2} align="flex-start">
                <Select
                  placeholder="Selecciona servicio"
                  value={servicioSeleccionado}
                  onChange={(e) => handleServicioSeleccionado(e.target.value)}
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
                    placeholder="Especificar servicio"
                    value={descripcionOtro}
                    onChange={(e) => setDescripcionOtro(e.target.value)}
                    size="sm"
                    w="180px"
                  />
                )}
                <Input
                  placeholder="Precio (€)"
                  value={precioServicio}
                  onChange={(e) => setPrecioServicio(e.target.value)}
                  size="sm"
                  w="100px"
                  type="number"
                  min="0"
                  required
                />
                <Button
                  size="sm"
                  onClick={handleAgregarServicio}
                  colorScheme="brand"
                >
                  Agregar
                </Button>
              </HStack>
              {errorAgregarServicio && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errorAgregarServicio}
                </Text>
              )}
            </Box>

            <Box fontWeight="bold" textAlign="right" w="100%">
              Total: {total.toFixed(2)} €
            </Box>
            <Box textAlign="right" w="100%" fontSize="sm" color="gray.600">
              Base imponible: {subtotal.toFixed(2)} €<br />
              IVA (21%): {iva.toFixed(2)} €
            </Box>

            <FormControl>
              <Checkbox
                {...register("generarFactura")}
                aria-label="¿Desea generar también la factura?"
              >
                ¿Desea generar también la factura?
              </Checkbox>
            </FormControl>
            {/* Eliminar el select de tipo de lámina de la sección inferior */}
            {/* {esTintadoLunas && (
              <FormControl isInvalid={!!errors.tipoLamina} mt={2}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Tipo de lámina:
                  </Text>
                  <Select
                    placeholder="Selecciona tipo de lámina"
                    {...register("tipoLamina")}
                    size="sm"
                    w="220px"
                    isRequired={esTintadoLunas}
                    onChange={handleTipoLaminaChange}
                    value={watch("tipoLamina")}
                  >
                    {opcionesLaminas.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </Select>
                </HStack>
                <FormErrorMessage>
                  {errors.tipoLamina?.message}
                </FormErrorMessage>
              </FormControl>
            )} */}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={onClose}
            variant="ghost"
            mr={3}
            aria-label="Cancelar y cerrar modal"
          >
            Cancelar
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit((values) => submit(values))}
            aria-label="Finalizar cita y generar documentos"
          >
            Finalizar cita
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
