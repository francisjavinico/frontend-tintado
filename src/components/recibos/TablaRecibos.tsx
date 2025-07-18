import { ReciboConItems } from "@/types/types";
import { ViewIcon } from "@chakra-ui/icons";
import { AddIcon } from "@chakra-ui/icons";
import { EmailIcon } from "@chakra-ui/icons";
import {
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
  HStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import api from "@/api/client";
import { useToast } from "@chakra-ui/react";

interface Props {
  recibos: ReciboConItems[];
  loading: boolean;
  onPreview: (recibo: ReciboConItems) => void;
  onConvertirAFactura: (reciboId: number) => void;
}

export default function TablaRecibos({
  recibos,
  loading,
  onPreview,
  onConvertirAFactura,
}: Props) {
  const bgHover = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const toast = useToast();

  const handleReenviarEmail = async (reciboId: number) => {
    try {
      await api.post(`/recibos/${reciboId}/reenviar-email`);
      toast({
        title: "Recibo enviado correctamente al cliente",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "No se pudo enviar el recibo",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <TableContainer>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr borderBottom="1px solid" borderColor={borderColor}>
            <Th fontSize="sm" fontWeight="600" color="gray.700" py={3} px={4}>
              Nº Recibo
            </Th>
            <Th fontSize="sm" fontWeight="600" color="gray.700" py={3} px={4}>
              Fecha
            </Th>
            <Th fontSize="sm" fontWeight="600" color="gray.700" py={3} px={4}>
              Cliente
            </Th>
            <Th fontSize="sm" fontWeight="600" color="gray.700" py={3} px={4}>
              Descripción
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
              Acciones
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {recibos.map((recibo) => (
            <Tr
              key={recibo.id}
              _hover={{ bg: bgHover }}
              transition="background-color 0.2s"
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              <Td py={3} px={4}>
                <Text fontWeight="500" fontSize="sm">
                  #{recibo.numeroAnual}
                </Text>
              </Td>
              <Td py={3} px={4}>
                <Text fontSize="sm" color={textColor}>
                  {format(new Date(recibo.fecha), "dd/MM/yyyy")}
                </Text>
              </Td>
              <Td py={3} px={4}>
                <Box>
                  <Text fontWeight="500" fontSize="sm">
                    {recibo.cliente?.nombre ?? "—"}
                  </Text>
                  {recibo.cliente?.email && (
                    <Text fontSize="xs" color="gray.500">
                      {recibo.cliente.email}
                    </Text>
                  )}
                </Box>
              </Td>
              <Td py={3} px={4}>
                <Text
                  fontSize="sm"
                  color={textColor}
                  maxW="200px"
                  noOfLines={2}
                >
                  {recibo.descripcion ?? "—"}
                </Text>
              </Td>
              <Td py={3} px={4} isNumeric>
                <Text fontSize="sm" fontWeight="600" color="green.600">
                  {recibo.monto.toFixed(2)} €
                </Text>
              </Td>
              <Td py={3} px={4} isNumeric>
                <HStack spacing={1} justify="flex-end">
                  <Tooltip
                    label={`Ver recibo #${recibo.numeroAnual}`}
                    placement="top"
                  >
                    <IconButton
                      aria-label={`Ver recibo #${recibo.numeroAnual}`}
                      icon={<ViewIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => onPreview(recibo)}
                      _hover={{ bg: "blue.50" }}
                    />
                  </Tooltip>
                  <Tooltip
                    label={
                      recibo.cliente?.nombre &&
                      recibo.cliente?.apellido &&
                      recibo.cliente?.email &&
                      recibo.cliente?.documentoIdentidad &&
                      recibo.cliente?.direccion
                        ? "Reenviar por email"
                        : "Faltan datos del cliente"
                    }
                    placement="top"
                  >
                    <span>
                      <IconButton
                        aria-label={`Reenviar recibo #${recibo.numeroAnual} por email`}
                        icon={<EmailIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="teal"
                        isDisabled={
                          !(
                            recibo.cliente?.nombre &&
                            recibo.cliente?.apellido &&
                            recibo.cliente?.email &&
                            recibo.cliente?.documentoIdentidad &&
                            recibo.cliente?.direccion
                          )
                        }
                        onClick={() => handleReenviarEmail(recibo.id)}
                        _hover={{ bg: "teal.50" }}
                      />
                    </span>
                  </Tooltip>
                  {recibo.estado !== "convertido" && (
                    <Tooltip
                      label={`Convertir recibo #${recibo.numeroAnual} a factura`}
                      placement="top"
                    >
                      <IconButton
                        aria-label={`Convertir recibo #${recibo.numeroAnual} a factura`}
                        icon={<AddIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        onClick={() => onConvertirAFactura(recibo.id)}
                        _hover={{ bg: "green.50" }}
                      />
                    </Tooltip>
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}

          {!loading && recibos.length === 0 && (
            <Tr>
              <Td colSpan={6} textAlign="center" py={8}>
                <Flex direction="column" align="center" gap={2}>
                  <Text color="gray.500" fontSize="sm">
                    No hay recibos para los filtros seleccionados
                  </Text>
                </Flex>
              </Td>
            </Tr>
          )}

          {loading && (
            <Tr>
              <Td colSpan={6} textAlign="center" py={8}>
                <Spinner size="md" color="blue.500" />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
