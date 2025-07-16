import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useColorModeValue,
  Text,
  VStack,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { WarningIcon } from "@chakra-ui/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteUserDialog({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  const cancelRef = useRef(null);
  const bgDialog = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const warningColor = useColorModeValue("orange.500", "orange.300");

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <AlertDialogContent
        bg={bgDialog}
        borderRadius="lg"
        boxShadow="xl"
        maxW="450px"
        mx={4}
      >
        <AlertDialogHeader
          borderBottom="1px solid"
          borderColor={borderColor}
          pb={4}
          pt={6}
          px={6}
        >
          <VStack spacing={3} align="flex-start">
            <HStack spacing={3} align="center">
              <Icon as={WarningIcon} color={warningColor} boxSize={5} />
              <Text fontSize="xl" fontWeight="600" color={textColor}>
                Confirmar eliminación
              </Text>
            </HStack>
          </VStack>
        </AlertDialogHeader>

        <AlertDialogBody py={6} px={6}>
          <VStack spacing={4} align="flex-start">
            <Text color="gray.600" fontSize="sm" lineHeight="tall">
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no
              se puede deshacer y el usuario perderá acceso al sistema
              inmediatamente.
            </Text>
            <Text
              color="gray.500"
              fontSize="xs"
              bg="gray.50"
              p={3}
              borderRadius="md"
              w="full"
            >
              <strong>Nota:</strong> Si el usuario tiene sesiones activas, estas
              se cerrarán automáticamente.
            </Text>
          </VStack>
        </AlertDialogBody>

        <AlertDialogFooter
          borderTop="1px solid"
          borderColor={borderColor}
          pt={4}
          pb={6}
          px={6}
        >
          <HStack spacing={3} w="full" justify="flex-end">
            <Button
              ref={cancelRef}
              onClick={onClose}
              variant="ghost"
              size="md"
              _hover={{ bg: "gray.100" }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              size="md"
              _hover={{ bg: "red.600" }}
            >
              Eliminar usuario
            </Button>
          </HStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
