import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/api/client";
import { Transaccion } from "@/types/types";
import { useTransaccionesStore } from "@/stores/useTransaccionesStore";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import FormActions from "../form/FormActions";

const schema = z
  .object({
    tipo: z.enum(["ingreso", "gasto"]),
    categoria: z.string().min(1),
    descripcion: z.string().min(1),
    monto: z.coerce.number().positive(),
    fecha: z.string().min(1),
    numeroFacturaGasto: z
      .string()
      .max(30, "Máximo 30 caracteres")
      .regex(/^[A-Za-z0-9-]*$/, "Solo letras, números y guiones")
      .optional()
      .or(z.literal(undefined)),
  })
  .refine(
    (data) => {
      if (data.tipo === "gasto") return true;
      return !data.numeroFacturaGasto;
    },
    {
      message: "El número de factura solo se permite para tipo 'Gasto'",
      path: ["numeroFacturaGasto"],
    }
  );

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaccion: Transaccion;
}

export default function EditarTransaccionModal({
  isOpen,
  onClose,
  transaccion,
}: Props) {
  const toast = useToast();
  const { fetchUltimasTransacciones, fetchResumen } = useTransaccionesStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...transaccion,
      fecha: transaccion.fecha.split("T")[0], // Solo la fecha para el input
    },
  });

  const tipoSeleccionado = watch("tipo");

  const onSubmit = async (data: FormData) => {
    try {
      // Combinar la fecha seleccionada con la hora original
      const originalDate = new Date(transaccion.fecha);
      const [year, month, day] = data.fecha.split("-");
      const fechaConHora = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        originalDate.getHours(),
        originalDate.getMinutes(),
        originalDate.getSeconds(),
        originalDate.getMilliseconds()
      ).toISOString();
      await api.put(`/transacciones/${transaccion.id}`, {
        ...data,
        fecha: fechaConHora,
      });
      await fetchUltimasTransacciones();
      await fetchResumen();
      toast({
        title: "Transacción actualizada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch {
      toast({
        title: "Error al actualizar",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Transacción</ModalHeader>
        <ModalCloseButton />
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)} pb={6}>
          <FormSelect
            mb={3}
            label="Tipo"
            name="tipo"
            options={[
              { value: "ingreso", label: "Ingreso" },
              { value: "gasto", label: "Gasto" },
            ]}
            register={register}
            error={errors.tipo?.message}
            isRequired
          />
          <FormInput
            mb={3}
            label="Categoría"
            name="categoria"
            register={register}
            error={errors.categoria?.message}
            isRequired
          />
          <FormInput
            mb={3}
            label="Descripción"
            name="descripcion"
            register={register}
            error={errors.descripcion?.message}
            isRequired
          />
          <FormInput
            mb={3}
            label="Monto (€)"
            name="monto"
            type="number"
            step="0.01"
            register={register}
            error={errors.monto?.message}
            isRequired
          />
          <FormInput
            mb={3}
            label="Fecha"
            name="fecha"
            type="date"
            register={register}
            error={errors.fecha?.message}
            isRequired
          />
          {tipoSeleccionado === "gasto" && (
            <FormInput
              mb={3}
              label="Nº Factura (opcional)"
              name="numeroFacturaGasto"
              register={register}
              error={errors.numeroFacturaGasto?.message}
              maxLength={30}
              helperText="Máx. 30 caracteres. Letras, números y guiones."
            />
          )}
          <FormActions
            submitLabel="Guardar cambios"
            isSubmitting={isSubmitting}
            onCancel={onClose}
            cancelLabel="Cancelar"
            align="right"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
