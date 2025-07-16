import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spinner,
  useToast,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import api from "@/api/client";

interface Props {
  reciboId: number;
  onClose: () => void;
}

export default function ModalReciboPDF({ reciboId, onClose }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const urlRef = useRef<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const bgModal = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await api.get(`/recibos/pdf/${reciboId}`, {
          responseType: "blob",
        });
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setPdfUrl(url);
      } catch {
        toast({
          title: "Error al cargar el PDF",
          description: "No se pudo cargar el recibo",
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
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [reciboId, onClose, toast]);

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="6xl"
      aria-label="Vista previa del recibo en PDF"
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
            Recibo #{reciboId} - Vista Previa
          </Text>
        </ModalHeader>

        <ModalCloseButton
          ref={closeBtnRef}
          aria-label="Cerrar vista previa de recibo"
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
                Cargando recibo...
              </Text>
            </Flex>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Recibo PDF"
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
                No se pudo cargar el recibo
              </Text>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
