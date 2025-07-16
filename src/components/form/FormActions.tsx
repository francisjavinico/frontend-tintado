import { HStack, Button, Box } from "@chakra-ui/react";
import React from "react";

/**
 * Componente para agrupar y estandarizar las acciones de formulario.
 */
interface FormActionsProps {
  /** Texto del botón principal (enviar/guardar) */
  submitLabel?: string;
  /** Indica si el botón principal está en loading */
  isSubmitting?: boolean;
  /** Handler para submit (opcional, si no se usa type="submit") */
  onSubmit?: () => void;
  /** Texto del botón de cancelar */
  cancelLabel?: string;
  /** Handler para cancelar */
  onCancel?: () => void;
  /** Texto del botón de limpiar (opcional) */
  clearLabel?: string;
  /** Handler para limpiar (opcional) */
  onClear?: () => void;
  /** Alineación: 'left', 'center', 'right' */
  align?: "left" | "center" | "right";
  /** Botones extra (opcional) */
  children?: React.ReactNode;
}

const alignMap = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
} as const;

const FormActions: React.FC<FormActionsProps> = ({
  submitLabel = "Guardar",
  isSubmitting = false,
  onSubmit,
  cancelLabel = "Cancelar",
  onCancel,
  clearLabel,
  onClear,
  align = "right",
  children,
}) => (
  <Box w="full" pt={4} display="flex" justifyContent={alignMap[align]}>
    <HStack spacing={3}>
      {onClear && clearLabel && (
        <Button variant="outline" colorScheme="gray" onClick={onClear}>
          {clearLabel}
        </Button>
      )}
      {onCancel && (
        <Button variant="ghost" onClick={onCancel}>
          {cancelLabel}
        </Button>
      )}
      <Button
        colorScheme="blue"
        type={onSubmit ? "button" : "submit"}
        onClick={onSubmit}
        isLoading={isSubmitting}
      >
        {submitLabel}
      </Button>
      {children}
    </HStack>
  </Box>
);

export default FormActions;
