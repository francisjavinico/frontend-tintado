import { FacturaConItems } from "@/types/types";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Badge,
  IconButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  Text,
  useColorModeValue,
  Flex,
  Box,
} from "@chakra-ui/react";
import { format } from "date-fns";

interface Props {
  facturas: FacturaConItems[];
  loading: boolean;
  onPreview: (factura: FacturaConItems) => void;
}

export default function TablaFacturas({ facturas, loading, onPreview }: Props) {
  const bgHover = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const getEstadoColor = () => {
    // Por ahora asumimos que todas las facturas están pagadas
    // En el futuro se puede agregar un campo estado a la factura
    return "green";
  };

  return (
    <TableContainer>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr borderBottom="1px solid" borderColor={borderColor}>
            <Th fontSize="sm" fontWeight="600" color="gray.700" py={3} px={4}>
              Nº Factura
            </Th>
            <Th fontSize="sm" fontWeight="600" color="gray.700" py={3} px={4}>
              Fecha
            </Th>
            <Th fontSize="sm" fontWeight="600" color="gray.700" py={3} px={4}>
              Cliente
            </Th>
            <Th
              fontSize="sm"
              fontWeight="600"
              color="gray.700"
              py={3}
              px={4}
              isNumeric
            >
              Subtotal
            </Th>
            <Th
              fontSize="sm"
              fontWeight="600"
              color="gray.700"
              py={3}
              px={4}
              isNumeric
            >
              IVA
            </Th>
            <Th
              fontSize="sm"
              fontWeight="600"
              color="gray.700"
              py={3}
              px={4}
              isNumeric
            >
              Total
            </Th>
            <Th
              fontSize="sm"
              fontWeight="600"
              color="gray.700"
              py={3}
              px={4}
              isNumeric
            >
              Estado
            </Th>
            <Th
              fontSize="sm"
              fontWeight="600"
              color="gray.700"
              py={3}
              px={4}
              isNumeric
            >
              Presupuestos
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
          {facturas.map((factura) => (
            <Tr
              key={factura.id}
              _hover={{ bg: bgHover }}
              transition="background-color 0.2s"
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              <Td py={3} px={4}>
                <Text fontWeight="500" fontSize="sm">
                  #{factura.id}
                </Text>
              </Td>
              <Td py={3} px={4}>
                <Text fontSize="sm" color={textColor}>
                  {format(new Date(factura.fecha), "dd/MM/yyyy")}
                </Text>
              </Td>
              <Td py={3} px={4}>
                <Box>
                  <Text fontWeight="500" fontSize="sm">
                    {factura.cliente?.nombre ?? "—"}
                  </Text>
                  {factura.cliente?.email && (
                    <Text fontSize="xs" color="gray.500">
                      {factura.cliente.email}
                    </Text>
                  )}
                </Box>
              </Td>
              <Td py={3} px={4} isNumeric>
                <Text fontSize="sm" fontWeight="500">
                  {factura.subtotal.toFixed(2)} €
                </Text>
              </Td>
              <Td py={3} px={4} isNumeric>
                <Text fontSize="sm" color={textColor}>
                  {factura.iva.toFixed(2)} €
                </Text>
              </Td>
              <Td py={3} px={4} isNumeric>
                <Text fontSize="sm" fontWeight="600" color="blue.600">
                  {factura.total.toFixed(2)} €
                </Text>
              </Td>
              <Td py={3} px={4} isNumeric>
                <Badge
                  colorScheme={getEstadoColor()}
                  variant="subtle"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  Pagada
                </Badge>
              </Td>
              <Td py={3} px={4}>
                {factura.cita?.servicios &&
                factura.cita.servicios[0]?.nombre === "Tintado de Lunas" ? (
                  <Box>
                    <Text fontSize="xs">
                      Básico:{" "}
                      <b>{factura.cita.presupuestoBasico?.toFixed(2)} €</b>
                    </Text>
                    <Text fontSize="xs">
                      Intermedio:{" "}
                      <b>{factura.cita.presupuestoIntermedio?.toFixed(2)} €</b>
                    </Text>
                    <Text fontSize="xs">
                      Premium:{" "}
                      <b>{factura.cita.presupuestoPremium?.toFixed(2)} €</b>
                    </Text>
                  </Box>
                ) : (
                  <Text fontSize="xs" color="gray.400">
                    —
                  </Text>
                )}
              </Td>
              <Td py={3} px={4} isNumeric>
                <Tooltip label={`Ver factura #${factura.id}`} placement="top">
                  <IconButton
                    aria-label={`Ver factura #${factura.id}`}
                    icon={<ViewIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => onPreview(factura)}
                    _hover={{ bg: "blue.50" }}
                  />
                </Tooltip>
              </Td>
            </Tr>
          ))}

          {!loading && facturas.length === 0 && (
            <Tr>
              <Td colSpan={8} textAlign="center" py={8}>
                <Flex direction="column" align="center" gap={2}>
                  <Text color="gray.500" fontSize="sm">
                    No hay facturas para los filtros seleccionados
                  </Text>
                </Flex>
              </Td>
            </Tr>
          )}

          {loading && (
            <Tr>
              <Td colSpan={8} textAlign="center" py={8}>
                <Spinner size="md" color="blue.500" />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
