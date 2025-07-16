import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import React from "react";

interface Option {
  value: string | number;
  label: string;
}

interface FormSelectProps<T extends FieldValues> {
  label: string;
  name: Path<T> | string;
  options: Option[];
  register?: UseFormRegister<T>;
  error?: string;
  isRequired?: boolean;
  placeholder?: string;
  value?: string | number;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | { target: { name: string; value: string | number | undefined } }
  ) => void;
  [x: string]: unknown; // Para pasar props extra a Select
}

function FormSelect<T extends FieldValues>({
  label,
  name,
  options,
  register,
  error,
  isRequired = false,
  placeholder,
  value,
  onChange,
  ...rest
}: FormSelectProps<T>) {
  const selectProps = register
    ? { ...register(name as Path<T>) }
    : { value, onChange };

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel htmlFor={String(name)}>{label}</FormLabel>
      <Select
        id={String(name)}
        name={String(name)}
        placeholder={placeholder}
        {...selectProps}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}

export default FormSelect;
