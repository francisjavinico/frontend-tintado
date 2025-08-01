// import { NuevaCitaForm, Vehiculo } from "@/types/types";
import { NuevaCitaForm } from "@/types/types";
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
  Divider,
  Flex,
  Button,
} from "@chakra-ui/react";
import { ChangeEvent, useState, useEffect } from "react";
import FormInput from "../form/FormInput";
import FormDateInput from "../form/FormDateInput";
import VehicleAutocomplete from "../vehiculos/VehicleAutocomplete";
import NewVehiculoModal from "../vehiculos/NewVehiculoModal";
import {
  FiCheck,
  FiInfo,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiPlus,
} from "react-icons/fi";
import { Servicio } from "@/types/types";
import { Select, Input, HStack } from "@chakra-ui/react";

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

interface Props {
  formData: NuevaCitaForm;
  errors: Record<string, string>;
  onChange: (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | {
          target: {
            name: string;
            value: string | number | Servicio[] | undefined;
          };
        }
  ) => void;
  clienteIdEncontrado?: number | null;
}

export default function CitaFormFields({
  formData,
  errors,
  onChange,
  clienteIdEncontrado,
}: Props) {
  const bgSuccess = useColorModeValue("green.50", "green.900");
  const bgInfo = useColorModeValue("blue.50", "blue.900");
  const colorSuccess = useColorModeValue("green.600", "green.200");
  const colorInfo = useColorModeValue("blue.600", "blue.200");

  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>(
    formData.servicios?.[0]?.nombre || ""
  );
  const [descripcionOtro, setDescripcionOtro] = useState<string>("");
  const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false);
  // Eliminar precioServicio y lógica relacionada
  // Eliminar botón Agregar y lista de servicios
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
    onChange({
      target: {
        name: "descripcion",
        value: nuevaDescripcion,
      },
    });
    // Asignar el servicio seleccionado como único en el array
    onChange({
      target: {
        name: "servicios",
        value: [
          {
            nombre: value,
            descripcion: value === "Otros" ? descripcionOtro : undefined,
          },
        ],
      },
    });
    // Lógica de presupuesto
    if (value === "Tintado de Lunas") {
      // setPresupuestoDisabled({ min: false, max: false }); // Eliminar
    } else {
      // setPresupuestoDisabled({ min: true, max: false }); // Eliminar
      onChange({
        target: {
          name: "presupuestoMax",
          value: 0,
        },
      });
    }
  };

  // Si cambia la descripción personalizada de "Otros", también actualizar la descripción del trabajo
  const handleDescripcionOtroChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescripcionOtro(e.target.value);
    if (servicioSeleccionado === "Otros") {
      onChange({
        target: {
          name: "descripcion",
          value: e.target.value,
        },
      });
      // Actualizar también el array de servicios para que la descripción se envíe correctamente
      onChange({
        target: {
          name: "servicios",
          value: [
            {
              nombre: "Otros",
              descripcion: e.target.value,
            },
          ],
        },
      });
    }
  };

  // Eliminar cualquier declaración o uso de presupuestoDisabled

  // Sincronizar servicioSeleccionado con formData.servicios
  useEffect(() => {
    if (formData.servicios && formData.servicios[0]?.nombre) {
      setServicioSeleccionado(formData.servicios[0].nombre);
    }
  }, [formData.servicios]);

  // Lógica para saber si el servicio es Tintado de Lunas
  const servicios = formData.servicios || [];
  const esTintado = servicios.some((s) => s.nombre === "Tintado de Lunas");

  return (
    <VStack spacing={8} align="stretch">
      {/* Sección: Información del Cliente */}
      <Box>
        <Flex align="center" gap={2} mb={4}>
          <Box
            p={1.5}
            borderRadius="md"
            bg="brand.50"
            color="brand.600"
            _dark={{ bg: "brand.900", color: "brand.200" }}
          >
            <FiUser size={16} />
          </Box>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="gray.700"
            _dark={{ color: "gray.300" }}
          >
            Información del Cliente
          </Text>
        </Flex>

        <VStack spacing={4} align="stretch">
          <FormInput
            w="full"
            label="Teléfono o Email"
            name="telefono"
            value={formData.telefono}
            onChange={onChange}
            error={errors.telefono}
            isRequired
            placeholder="Introduce teléfono o email del cliente"
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />

          {formData.telefono && (
            <Box
              p={3}
              borderRadius="lg"
              fontSize="sm"
              display="flex"
              alignItems="center"
              gap={3}
              bg={clienteIdEncontrado ? bgSuccess : bgInfo}
              color={clienteIdEncontrado ? colorSuccess : colorInfo}
              border="1px solid"
              borderColor={clienteIdEncontrado ? "green.200" : "blue.200"}
              _dark={{
                borderColor: clienteIdEncontrado ? "green.700" : "blue.700",
                bg: clienteIdEncontrado ? "green.900" : "blue.900",
                color: clienteIdEncontrado ? "green.200" : "blue.200",
              }}
            >
              {clienteIdEncontrado ? (
                <>
                  <FiCheck size={14} />
                  <Text fontWeight="medium">
                    Cliente encontrado y asignado automáticamente
                  </Text>
                </>
              ) : (
                <>
                  <FiInfo size={14} />
                  <Text fontWeight="medium">
                    No se encontró un cliente con este teléfono. Se completará
                    más tarde.
                  </Text>
                </>
              )}
            </Box>
          )}

          <VehicleAutocomplete
            value={formData.vehiculoId}
            onChange={onChange}
            error={errors.vehiculoId}
          />
          <Button
            leftIcon={<FiPlus />}
            colorScheme="teal"
            size="sm"
            onClick={() => setIsVehiculoModalOpen(true)}
            _hover={{ transform: "translateY(-1px)" }}
            transition="all 0.2s ease"
          >
            Agregar Vehículo
          </Button>
        </VStack>
      </Box>

      <Divider borderColor="gray.200" _dark={{ borderColor: "gray.700" }} />

      {/* Sección: Detalles de la Cita */}
      <Box>
        <Flex align="center" gap={2} mb={4}>
          <Box
            p={1.5}
            borderRadius="md"
            bg="brand.50"
            color="brand.600"
            _dark={{ bg: "brand.900", color: "brand.200" }}
          >
            <FiCalendar size={16} />
          </Box>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="gray.700"
            _dark={{ color: "gray.300" }}
          >
            Detalles de la Cita
          </Text>
        </Flex>

        <VStack spacing={4} align="stretch">
          <HStack spacing={4} align="flex-start" flexWrap="wrap">
            <FormDateInput
              w="260px"
              label="Fecha"
              name="fecha"
              type="date"
              value={formData.fecha ? formData.fecha.split("T")[0] : ""}
              onChange={(e) => {
                // Mantener la hora si existe
                const hora = formData.fecha?.split("T")[1] || "00:00";
                const nuevaFecha = e.target.value
                  ? `${e.target.value}T${hora}`
                  : "";
                onChange({
                  target: {
                    name: "fecha",
                    value: nuevaFecha,
                  },
                });
              }}
              error={errors.fecha}
              isRequired
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            <FormInput
              w="220px"
              label="Hora"
              name="hora"
              type="time"
              value={
                formData.fecha
                  ? formData.fecha.split("T")[1]?.slice(0, 5) || ""
                  : ""
              }
              onChange={(e) => {
                // Mantener la fecha si existe
                const fecha = formData.fecha?.split("T")[0] || "";
                const nuevaFecha =
                  fecha && e.target.value ? `${fecha}T${e.target.value}` : "";
                onChange({
                  target: {
                    name: "fecha",
                    value: nuevaFecha,
                  },
                });
              }}
              error={errors.fecha}
              isRequired
              placeholder="HH:MM"
              step="60"
              inputMode="decimal"
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
          </HStack>
        </VStack>
      </Box>

      <Divider borderColor="gray.200" _dark={{ borderColor: "gray.700" }} />

      {/* Sección: Servicios */}
      <Box>
        <Flex align="center" gap={2} mb={4}>
          <Box
            p={1.5}
            borderRadius="md"
            bg="brand.50"
            color="brand.600"
            _dark={{ bg: "brand.900", color: "brand.200" }}
          >
            <FiInfo size={16} />
          </Box>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="gray.700"
            _dark={{ color: "gray.300" }}
          >
            Servicio solicitado
          </Text>
        </Flex>
        <HStack>
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
              placeholder="Especificar servicio"
              value={descripcionOtro}
              onChange={handleDescripcionOtroChange}
              size="sm"
              w="180px"
            />
          )}
        </HStack>
      </Box>

      <Divider borderColor="gray.200" _dark={{ borderColor: "gray.700" }} />

      {/* Sección: Presupuesto y Estado */}
      <Box>
        <Flex align="center" gap={2} mb={4}>
          <Box
            p={1.5}
            borderRadius="md"
            bg="brand.50"
            color="brand.600"
            _dark={{ bg: "brand.900", color: "brand.200" }}
          >
            <FiDollarSign size={16} />
          </Box>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="gray.700"
            _dark={{ color: "gray.300" }}
          >
            Presupuesto
          </Text>
        </Flex>
        {esTintado ? (
          <HStack spacing={4} align="flex-start" flexWrap="nowrap">
            <FormInput
              label="Presupuesto Standar (€)"
              name="presupuestoBasico"
              type="number"
              min={0}
              value={formData.presupuestoBasico ?? ""}
              onChange={(e) =>
                onChange({
                  target: {
                    name: "presupuestoBasico",
                    value:
                      e.target.value === "" || e.target.value === undefined
                        ? undefined
                        : Number(e.target.value),
                  },
                })
              }
              error={errors.presupuestoBasico}
              isRequired
              placeholder="0.00"
              step="0.01"
              inputMode="decimal"
              w="180px"
              maxW="180px"
            />
            <FormInput
              label="Presupuesto Pro (€)"
              name="presupuestoIntermedio"
              type="number"
              min={0}
              value={formData.presupuestoIntermedio ?? ""}
              onChange={(e) =>
                onChange({
                  target: {
                    name: "presupuestoIntermedio",
                    value:
                      e.target.value === "" || e.target.value === undefined
                        ? undefined
                        : Number(e.target.value),
                  },
                })
              }
              error={errors.presupuestoIntermedio}
              isRequired
              placeholder="0.00"
              step="0.01"
              inputMode="decimal"
              w="180px"
              maxW="180px"
            />
            <FormInput
              label="Presupuesto Premium (€)"
              name="presupuestoPremium"
              type="number"
              min={0}
              value={formData.presupuestoPremium ?? ""}
              onChange={(e) =>
                onChange({
                  target: {
                    name: "presupuestoPremium",
                    value:
                      e.target.value === "" || e.target.value === undefined
                        ? undefined
                        : Number(e.target.value),
                  },
                })
              }
              error={errors.presupuestoPremium}
              isRequired
              placeholder="0.00"
              step="0.01"
              inputMode="decimal"
              w="180px"
              maxW="180px"
            />
          </HStack>
        ) : (
          <FormInput
            label="Presupuesto Máximo (€)"
            name="presupuestoMax"
            type="number"
            min={0}
            value={formData.presupuestoMax || ""}
            onChange={(e) =>
              onChange({
                target: {
                  name: "presupuestoMax",
                  value:
                    e.target.value === "" ? undefined : Number(e.target.value),
                },
              })
            }
            error={errors.presupuestoMax}
            isRequired
            placeholder="0.00"
            step="0.01"
            inputMode="decimal"
          />
        )}
      </Box>
      <NewVehiculoModal
        isOpen={isVehiculoModalOpen}
        onClose={() => setIsVehiculoModalOpen(false)}
        onVehiculoCreado={(vehiculo) => {
          // Actualizar el formulario con el nuevo vehículo
          onChange({
            target: {
              name: "vehiculoId",
              value: vehiculo.id,
            },
          });
          setIsVehiculoModalOpen(false);
        }}
      />
    </VStack>
  );
}
