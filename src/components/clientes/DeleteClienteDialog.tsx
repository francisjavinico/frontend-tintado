import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Icon,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteClientDialog({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <AlertDialogContent
        borderRadius="2xl"
        boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        border="1px solid"
        borderColor="gray.200"
        maxW="400px"
      >
        <AlertDialogHeader
          fontSize="xl"
          fontWeight="bold"
          pb={4}
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <VStack spacing={3} align="center">
            <Icon as={FiAlertTriangle} w={8} h={8} color="red.500" />
            <Text>Confirmar eliminación</Text>
          </VStack>
        </AlertDialogHeader>

        <AlertDialogBody py={6}>
          <Text fontSize="md" color="gray.700" textAlign="center">
            ¿Estás seguro de que deseas eliminar este cliente?
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
            Esta acción no se puede deshacer y también eliminará todas las citas
            asociadas.
          </Text>
        </AlertDialogBody>

        <AlertDialogFooter
          gap={3}
          pt={4}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <Button
            ref={cancelRef}
            onClick={onClose}
            variant="outline"
            borderRadius="lg"
            flex="1"
          >
            Cancelar
          </Button>
          <Button
            colorScheme="red"
            onClick={onConfirm}
            borderRadius="lg"
            flex="1"
            _hover={{ transform: "translateY(-1px)" }}
            transition="all 0.2s ease"
          >
            Eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
