import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  useToast,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import api from "@/api/client";

interface Props {
  facturaId: number;
  onClose: () => void;
}

export default function ModalFacturaPDF({ facturaId, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string | null>(null);
  const toast = useToast();
  const urlRef = useRef<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const bgModal = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await api.get(`/facturas/${facturaId}/pdf`, {
          responseType: "blob",
        });
        const blob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(blob);
        urlRef.current = pdfUrl;
        setUrl(pdfUrl);
      } catch {
        toast({
          title: "Error al cargar el PDF",
          description: "No se pudo cargar la factura",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();

    return () => {
      // Limpiar URL cuando se cierra el modal
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [facturaId, onClose, toast]);

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="6xl"
      isCentered
      aria-label="Vista previa de la factura en PDF"
      initialFocusRef={closeBtnRef}
    >
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        bg={bgModal}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="xl"
        maxH="90vh"
      >
        <ModalHeader borderBottom="1px solid" borderColor={borderColor} pb={3}>
          <Text fontSize="lg" fontWeight="600" color="gray.700">
            Factura #{facturaId} - Vista Previa
          </Text>
        </ModalHeader>

        <ModalCloseButton
          ref={closeBtnRef}
          aria-label="Cerrar vista previa de factura"
          size="lg"
          top={3}
          right={3}
        />

        <ModalBody p={0} minH="70vh">
          {loading ? (
            <Flex
              justify="center"
              align="center"
              minH="400px"
              direction="column"
              gap={4}
            >
              <Spinner
                size="xl"
                thickness="3px"
                color="blue.500"
                speed="0.65s"
              />
              <Text color="gray.500" fontSize="sm">
                Cargando factura...
              </Text>
            </Flex>
          ) : url ? (
            <iframe
              src={url}
              title="Factura PDF"
              style={{
                width: "100%",
                height: "75vh",
                border: "none",
                borderRadius: "0 0 8px 8px",
              }}
            />
          ) : (
            <Flex
              justify="center"
              align="center"
              minH="400px"
              direction="column"
              gap={4}
            >
              <Text color="gray.500" fontSize="sm">
                No se pudo cargar la factura
              </Text>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
