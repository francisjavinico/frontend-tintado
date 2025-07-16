import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/api/client";
import { useTransaccionesStore } from "@/stores/useTransaccionesStore";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import FormActions from "../form/FormActions";

const schema = z
  .object({
    tipo: z.enum(["ingreso", "gasto"], { required_error: "Tipo requerido" }),
    categoria: z.string().min(1, "Categoría requerida"),
    descripcion: z.string().min(1, "Descripción requerida"),
    monto: z.coerce.number().positive("Monto inválido"),
    fecha: z.string().min(1, "Fecha requerida"),
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
}

export default function NuevaTransaccionModal({ isOpen, onClose }: Props) {
  const toast = useToast();
  const { fetchUltimasTransacciones, fetchResumen } = useTransaccionesStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo: "ingreso",
      fecha: new Date().toISOString(), // Usar fecha y hora actual
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Combinar la fecha seleccionada con la hora actual
      const now = new Date();
      const [year, month, day] = data.fecha.split("-");
      const fechaConHora = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      ).toISOString();
      await api.post("/transacciones", {
        ...data,
        fecha: fechaConHora,
        origen: "manual",
      });
      await fetchUltimasTransacciones();
      await fetchResumen();
      toast({
        title: "Transacción creada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      reset();
      onClose();
    } catch {
      toast({
        title: "Error al crear transacción",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const tipoSeleccionado = watch("tipo");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent rounded="md" p={0} boxShadow="lg" border="none">
        <ModalHeader px={6} pt={6} pb={2}>
          Nueva Transacción
        </ModalHeader>
        <ModalCloseButton top={3} right={3} />
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)} pb={6} px={6}>
          <VStack spacing={4} align="stretch">
            <FormSelect
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
              label="Categoría"
              name="categoria"
              register={register}
              error={errors.categoria?.message}
              isRequired
            />
            <FormInput
              label="Descripción"
              name="descripcion"
              register={register}
              error={errors.descripcion?.message}
              isRequired
            />
            <FormInput
              label="Monto (€)"
              name="monto"
              type="number"
              step="0.01"
              register={register}
              error={errors.monto?.message}
              isRequired
            />
            <FormInput
              label="Fecha"
              name="fecha"
              type="date"
              register={register}
              error={errors.fecha?.message}
              isRequired
            />
            {tipoSeleccionado === "gasto" && (
              <FormInput
                label="Nº Factura (opcional)"
                name="numeroFacturaGasto"
                register={register}
                error={errors.numeroFacturaGasto?.message}
                maxLength={30}
                helperText="Máx. 30 caracteres. Letras, números y guiones."
              />
            )}
          </VStack>
          <FormActions
            submitLabel="Guardar"
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
