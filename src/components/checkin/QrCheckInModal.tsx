import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useClipboard,
  Text,
  Button,
  Box,
  VStack,
} from "@chakra-ui/react";
import { QRCodeCanvas } from "qrcode.react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  citaId: number;
  telefono: string;
}

const QrCheckinModal = ({ isOpen, onClose, citaId, telefono }: Props) => {
  const link = `${window.location.origin}/checkin/${citaId}?telefono=${encodeURIComponent(telefono)}`;

  const { onCopy, hasCopied } = useClipboard(link);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent p={4}>
        <ModalHeader fontSize="lg">Check-in del Cliente</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <QRCodeCanvas value={link} size={180} />
            <Text fontSize="sm" textAlign="center">
              Escanea este código QR con la tablet para que el cliente complete
              sus datos.
            </Text>
            <Box w="100%">
              <Button colorScheme="teal" onClick={onCopy} w="100%">
                {hasCopied ? "✅ Copiado" : "Copiar enlace"}
              </Button>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QrCheckinModal;
