import React, { useState } from "react";
import {
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tag,
  IconButton,
  HStack,
  Tooltip,
  useColorModeValue,
  Text,
  Button,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useTransaccionesStore } from "@/stores/useTransaccionesStore";
import { format } from "date-fns";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Transaccion } from "@/types/types";
import EditarTransaccionModal from "./EditarTransaccionModal";
import ConfirmarEliminarDialog from "./ConfirmarEliminarDialog";

const PAGE_SIZE = 10;

export default function TablaUltimasTransacciones() {
  const { ultimas, loadingTabla, fetchUltimasTransacciones, filtrosTabla } =
    useTransaccionesStore();
  const [transaccionSeleccionada, setTransaccionSeleccionada] =
    useState<Transaccion | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Detectar si hay filtros activos
  const hayFiltros =
    filtrosTabla && (filtrosTabla.dateFrom || filtrosTabla.dateTo);

  React.useEffect(() => {
    fetchUltimasTransacciones(page);
    // eslint-disable-next-line
  }, [page]);

  React.useEffect(() => {
    setPage(1);
  }, [fetchUltimasTransacciones]);

  const handleEdit = (tx: Transaccion) => {
    setTransaccionSeleccionada(tx);
    setIsEditOpen(true);
  };

  const handleDelete = (tx: Transaccion) => {
    setTransaccionSeleccionada(tx);
    setIsDeleteOpen(true);
  };

  if (loadingTabla) return <Spinner size="md" />;
  if (!ultimas || ultimas.length === 0)
    return <Text>No hay transacciones para mostrar.</Text>;

  return (
    <TableContainer
      bg={bg}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      px={{ base: 0, md: 2 }}
      py={2}
      overflowX={{ base: "auto", md: "visible" }}
      maxW="100%"
    >
      <Table
        variant="simple"
        size="sm"
        width="100%"
        sx={{ tableLayout: "fixed" }}
      >
        <Thead>
          <Tr>
            <Th fontSize="sm" minW="100px" isTruncated whiteSpace="nowrap">
              FECHA
            </Th>
            <Th fontSize="sm" minW="160px" isTruncated>
              DESCRIPCIÓN
            </Th>
            <Th
              fontSize="sm"
              minW="90px"
              isTruncated
              textAlign="right"
              whiteSpace="nowrap"
            >
              MONTO
            </Th>
            <Th fontSize="sm" minW="80px" isTruncated whiteSpace="nowrap">
              TIPO
            </Th>
            <Th fontSize="sm" minW="100px" isTruncated whiteSpace="nowrap">
              ORIGEN
            </Th>
            <Th fontSize="sm" minW="110px" isTruncated whiteSpace="nowrap">
              ACCIONES
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {ultimas.map((t) => (
            <Tr
              key={t.id}
              _hover={{ bg: "gray.50" }}
              transition="background 0.2s"
            >
              <Td fontSize="sm" minW="90px" maxW="110px" whiteSpace="nowrap">
                {format(new Date(t.fecha), "dd/MM/yyyy")}
              </Td>
              <Td
                fontSize="sm"
                maxW="220px"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                <Text isTruncated title={t.descripcion} maxW="200px">
                  {t.descripcion}
                </Text>
              </Td>
              <Td
                fontSize="sm"
                textAlign="right"
                minW="80px"
                maxW="100px"
                whiteSpace="nowrap"
              >
                <Text
                  fontWeight="semibold"
                  color={t.tipo === "ingreso" ? "green.600" : "red.600"}
                >
                  {t.monto.toFixed(2)} €
                </Text>
              </Td>
              <Td fontSize="sm" minW="70px" maxW="90px" whiteSpace="nowrap">
                <Tag
                  size="sm"
                  colorScheme={t.tipo === "ingreso" ? "green" : "red"}
                  variant="subtle"
                >
                  {t.tipo}
                </Tag>
              </Td>
              <Td fontSize="sm" minW="80px" maxW="100px" whiteSpace="nowrap">
                <Tag size="sm" colorScheme="purple" variant="subtle">
                  {t.origen}
                </Tag>
              </Td>
              <Td
                textAlign="center"
                minW="90px"
                maxW="110px"
                whiteSpace="nowrap"
              >
                <HStack justify="center" spacing={2}>
                  {t.origen === "factura" || t.origen === "recibo" ? (
                    <Tooltip label="Esta transacción está asociada a una factura/recibo y no puede ser editada desde aquí.">
                      <span>
                        <IconButton
                          aria-label="Editar"
                          icon={<FiEdit2 />}
                          size="sm"
                          variant="ghost"
                          colorScheme="gray"
                          isDisabled
                        />
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip label="Editar">
                      <IconButton
                        aria-label="Editar"
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => handleEdit(t)}
                      />
                    </Tooltip>
                  )}
                  {t.origen === "factura" || t.origen === "recibo" ? (
                    <Tooltip label="Esta transacción está asociada a una factura/recibo y no puede ser eliminada desde aquí.">
                      <span>
                        <IconButton
                          aria-label="Eliminar"
                          icon={<FiTrash2 />}
                          size="sm"
                          variant="ghost"
                          colorScheme="gray"
                          isDisabled
                        />
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip label="Eliminar">
                      <IconButton
                        aria-label="Eliminar"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(t)}
                      />
                    </Tooltip>
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* Paginación visual solo si hay filtros activos */}
      {hayFiltros && (ultimas.length === PAGE_SIZE || page > 1) && (
        <Box
          px={4}
          py={3}
          bg="gray.50"
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
            <Text fontSize="xs" color="gray.600">
              Página {page}
            </Text>
            <Flex align="center" gap={2} flexWrap="wrap">
              <Button
                size="xs"
                onClick={() => setPage(page - 1)}
                isDisabled={page === 1}
                variant="outline"
                borderRadius="md"
              >
                Anterior
              </Button>
              <Button
                size="xs"
                onClick={() => setPage(page + 1)}
                isDisabled={ultimas.length < PAGE_SIZE}
                variant="outline"
                borderRadius="md"
              >
                Siguiente
              </Button>
            </Flex>
          </Flex>
        </Box>
      )}
      {transaccionSeleccionada && (
        <>
          <EditarTransaccionModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            transaccion={transaccionSeleccionada}
          />
          <ConfirmarEliminarDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            transaccion={transaccionSeleccionada}
          />
        </>
      )}
    </TableContainer>
  );
}
