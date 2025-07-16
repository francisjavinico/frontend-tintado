import BotonesExportacionRecibos from "@/components/recibos/BotonesExportacionRecibos";
import FiltroRecibos from "@/components/recibos/FiltroRecibos";
import ModalReciboPDF from "@/components/recibos/ModalReciboPDF";
import TablaRecibos from "@/components/recibos/TablaRecibos";
import ResumenTotalesRecibos from "@/components/recibos/ResumenTotalesRecibos";
import { useRecibosStore } from "@/stores/useRecibosStore";
import { ReciboConItems } from "@/types/types";
import api from "@/api/client";

import {
  Box,
  Flex,
  Heading,
  Spinner,
  VStack,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export default function RecibosPage() {
  const { recibos, fetchRecibos, loading, filtros, page, resumen } =
    useRecibosStore();
  const toast = useToast();

  const [modalReciboId, setModalReciboId] = useState<number | null>(null);
  const [confirmReciboId, setConfirmReciboId] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchRecibos();
  }, [fetchRecibos, filtros, page]);

  const handleOpenPDF = (recibo: ReciboConItems) => setModalReciboId(recibo.id);
  const handleClosePDF = () => setModalReciboId(null);

  const handleConvertirAFactura = (reciboId: number) => {
    setConfirmReciboId(reciboId);
  };

  const handleConfirmConvertir = async () => {
    if (!confirmReciboId) return;
    try {
      await api.post(`/recibos/${confirmReciboId}/convertir-a-factura`);
      toast({
        title: "Recibo convertido",
        description: "El recibo ha sido convertido exitosamente a factura.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      fetchRecibos();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo convertir el recibo a factura";
      toast({
        title: "Error al convertir",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setConfirmReciboId(null);
    }
  };

  const handleCancelConvertir = () => setConfirmReciboId(null);

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
            Gestión de Recibos
          </Heading>
          <BotonesExportacionRecibos />
        </Flex>

        {/* Filtros */}
        <FiltroRecibos />

        {/* Tabla de recibos */}
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
            <TablaRecibos
              recibos={recibos}
              onPreview={handleOpenPDF}
              onConvertirAFactura={handleConvertirAFactura}
              loading={loading}
            />
          )}
        </Box>
        {/* Resumen de totales debajo de la tabla */}
        <Flex justify="flex-end" mt={2}>
          <ResumenTotalesRecibos
            resumen={{
              sumTotal: resumen.total,
              count: resumen.cantidad,
            }}
          />
        </Flex>
      </VStack>

      {/* Modal de vista previa PDF */}
      {modalReciboId && (
        <ModalReciboPDF reciboId={modalReciboId} onClose={handleClosePDF} />
      )}

      {/* Modal de confirmación para convertir a factura */}
      <AlertDialog
        isOpen={!!confirmReciboId}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelConvertir}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar conversión
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro de que deseas convertir este recibo a factura? Esta
              acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelConvertir}>
                Cancelar
              </Button>
              <Button
                colorScheme="green"
                onClick={handleConfirmConvertir}
                ml={3}
              >
                Convertir a Factura
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
