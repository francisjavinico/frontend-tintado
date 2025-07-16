import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useRef } from "react";
import api from "@/api/client";
import { useTransaccionesStore } from "@/stores/useTransaccionesStore";
import { Transaccion } from "@/types/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaccion: Transaccion;
}

export default function ConfirmarEliminarDialog({
  isOpen,
  onClose,
  transaccion,
}: Props) {
  const cancelRef = useRef(null);
  const toast = useToast();
  const { fetchUltimasTransacciones, fetchResumen } = useTransaccionesStore();

  const handleDelete = async () => {
    try {
      await api.delete(`/transacciones/${transaccion.id}`);
      await fetchUltimasTransacciones();
      await fetchResumen();
      toast({
        title: "Transacción eliminada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch {
      toast({
        title: "Error al eliminar",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Eliminar transacción
          </AlertDialogHeader>

          <AlertDialogBody>
            ¿Estás seguro que deseas eliminar esta transacción?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
