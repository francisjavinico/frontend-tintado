import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import React from "react";

interface FormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T> | string;
  type?: string;
  placeholder?: string;
  register?: UseFormRegister<T>;
  error?: string;
  isRequired?: boolean;
  value: string | number;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string | number | undefined } }
  ) => void;
  [x: string]: unknown; // Para pasar props extra a Input
}

function FormInput<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  isRequired = false,
  value,
  onChange,
  ...rest
}: FormInputProps<T>) {
  const inputProps = {
    ...(register ? { ...register(name as Path<T>) } : {}),
    value,
    onChange,
  };

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

export default FormInput;
