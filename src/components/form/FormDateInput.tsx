import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import React from "react";

/**
 * Componente reutilizable para campos de fecha, hora o fecha+hora.
 * Soporta integración con React Hook Form (register) o patrón controlado (value/onChange).
 */
interface FormDateInputProps<T extends FieldValues> {
  /** Etiqueta del campo */
  label: string;
  /** Nombre del campo (soporta Path<T> para RHF o string para controlado) */
  name: Path<T> | string;
  /** Tipo de input: 'date', 'datetime-local' o 'time' (por defecto: 'date') */
  type?: "date" | "datetime-local" | "time";
  /** Placeholder opcional */
  placeholder?: string;
  /** Función register de React Hook Form (opcional) */
  register?: UseFormRegister<T>;
  /** Mensaje de error (opcional) */
  error?: string;
  /** Si el campo es obligatorio */
  isRequired?: boolean;
  /** Valor del campo (para patrón controlado) */
  value?: string | number;
  /** onChange del campo (para patrón controlado) */
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string | number | undefined } }
  ) => void;
  /** Props extra para el input */
  [x: string]: unknown;
}

function FormDateInput<T extends FieldValues>({
  label,
  name,
  type = "date",
  placeholder,
  register,
  error,
  isRequired = false,
  value,
  onChange,
  ...rest
}: FormDateInputProps<T>) {
  const inputProps = register
    ? { ...register(name as Path<T>) }
    : { value, onChange };

  return (
    <FormControl
      isInvalid={!!error}
      isRequired={isRequired}
      w={rest.w ?? "auto"}
      display={rest.display ?? "inline-flex"}
    >
      <FormLabel htmlFor={String(name)}>{label}</FormLabel>
      <Input
        id={String(name)}
        name={String(name)}
        type={type}
        placeholder={placeholder}
        {...inputProps}
        {...rest}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}

export default FormDateInput;
