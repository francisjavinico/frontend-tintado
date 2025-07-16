import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
  VStack,
  HStack,
  Text,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Vehiculo } from "@/types/types";
import { useVehiculoStore } from "../../stores/useVehiculoStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vehiculo: Vehiculo | null;
}

export default function DeleteVehiculoDialog({
  isOpen,
  onClose,
  vehiculo,
}: Props) {
  const cancelRef = useRef(null);
  const toast = useToast();
  const { deleteVehiculo, fetchVehiculos } = useVehiculoStore();
  const [loading, setLoading] = useState(false);

  // Colores del tema
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  const handleDelete = async () => {
    if (!vehiculo) return;
    setLoading(true);
    try {
      await deleteVehiculo(vehiculo.id);
      toast({
        title: "Vehículo eliminado exitosamente",
        status: "success",
        description: `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año} ha sido eliminado del sistema`,
      });
      onClose();
      await fetchVehiculos();
    } catch {
      toast({
        title: "Error al eliminar vehículo",
        status: "error",
        description: "Por favor, intenta nuevamente",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <AlertDialogContent
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="xl"
        mx={4}
        maxW="md"
      >
        <AlertDialogHeader
          borderBottom="1px solid"
          borderColor={borderColor}
          pb={4}
        >
          <VStack align="flex-start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Eliminar Vehículo
            </Text>
            <Text fontSize="sm" color={mutedTextColor}>
              Esta acción no se puede deshacer
            </Text>
          </VStack>
        </AlertDialogHeader>

        <AlertDialogBody py={6}>
          <VStack spacing={4} align="stretch">
            <Text color={textColor}>
              ¿Estás seguro que deseas eliminar este vehículo?
            </Text>

            {vehiculo && (
              <VStack
                spacing={3}
                p={4}
                bg="gray.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
              >
                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                  {vehiculo.marca} {vehiculo.modelo}
                </Text>
                <HStack spacing={2}>
                  <Badge
                    colorScheme="blue"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {vehiculo.año}
                  </Badge>
                  <Badge
                    colorScheme="gray"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {vehiculo.numeroPuertas} puertas
                  </Badge>
                </HStack>
              </VStack>
            )}

            <Text fontSize="sm" color={mutedTextColor}>
              Se eliminarán todos los datos asociados a este vehículo,
              incluyendo su historial de presupuestos.
            </Text>
          </VStack>
        </AlertDialogBody>

        <AlertDialogFooter
          borderTop="1px solid"
          borderColor={borderColor}
          pt={4}
          gap={3}
        >
          <Button
            ref={cancelRef}
            onClick={onClose}
            variant="outline"
            borderRadius="lg"
            px={6}
            _hover={{ bg: "gray.50" }}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="red"
            onClick={handleDelete}
            isLoading={loading}
            loadingText="Eliminando..."
            borderRadius="lg"
            px={6}
            _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
            transition="all 0.2s"
          >
            Eliminar Vehículo
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
