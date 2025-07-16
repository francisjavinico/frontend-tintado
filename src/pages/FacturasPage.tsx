import BotonesExportacion from "@/components/facturas/BotonesExportacion";
import FiltroFacturas from "@/components/facturas/FiltroFacturas";
import ModalFacturaPDF from "@/components/facturas/ModalFacturarPDF";
import TablaFacturas from "@/components/facturas/TablaFacturas";
import ResumenTotales from "@/components/facturas/ResumenTotales";
import { useFacturasStore } from "@/stores/useFacturasStore";
import { FacturaConItems } from "@/types/types";

import {
  Box,
  Flex,
  Heading,
  Spinner,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function FacturasPage() {
  const { facturas, fetchFacturas, loading, filtros, page, resumen } =
    useFacturasStore();

  const [modalFacturaId, setModalFacturaId] = useState<number | null>(null);

  useEffect(() => {
    fetchFacturas();
  }, [fetchFacturas, filtros, page]);

  const handleOpenPDF = (factura: FacturaConItems) =>
    setModalFacturaId(factura.id);
  const handleClosePDF = () => setModalFacturaId(null);

  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box p={{ base: 4, md: 6 }} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header con título y botones de exportación */}
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          <Heading size="lg" color="gray.700">
            Gestión de Facturas
          </Heading>
          <BotonesExportacion />
        </Flex>

        {/* Filtros */}
        <FiltroFacturas />

        {/* Tabla de facturas */}
        <Box
          bg={bgCard}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          boxShadow="sm"
          overflow="hidden"
        >
          {loading ? (
            <Flex justify="center" align="center" minH="300px">
              <Spinner
                size="lg"
                thickness="3px"
                speed="0.65s"
                color="blue.500"
              />
            </Flex>
          ) : (
            <TablaFacturas
              facturas={facturas}
              onPreview={handleOpenPDF}
              loading={loading}
            />
          )}
        </Box>
        {/* Resumen de totales debajo de la tabla */}
        <Flex justify="flex-end" mt={2}>
          <ResumenTotales
            resumen={{
              sumTotal: resumen.total,
              sumIva: resumen.iva,
              sumSub: resumen.subtotal,
              count: resumen.cantidad,
            }}
          />
        </Flex>
      </VStack>

      {/* Modal de vista previa PDF */}
      {modalFacturaId && (
        <ModalFacturaPDF facturaId={modalFacturaId} onClose={handleClosePDF} />
      )}
    </Box>
  );
}
