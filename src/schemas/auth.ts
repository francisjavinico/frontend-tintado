import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "El email no tiene formato valido" }),
  password: z
    .string()
    .min(6, { message: "Debe contener al menos 6 caracteres" })
    .max(14, { message: "La longitud maxima es de 14 caracteres" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string[]>>;
