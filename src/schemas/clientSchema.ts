import { z } from "zod";

export const clientCreateSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Debe ser un email válido"),
  telefono: z.preprocess(
    (val) => (typeof val === "string" ? val.replace(/\s+/g, "") : val),
    z
      .string()
      .min(1, "El teléfono es obligatorio")
      .regex(
        /^((\+34|0034)?[6-7][0-9]{8})$/,
        "El teléfono debe ser un número válido, con o sin prefijo (+34 o 0034)"
      )
  ),
  documentoIdentidad: z
    .string()
    .min(9, "El DNI/NIE debe tener 9 caracteres")
    .max(9, "El DNI/NIE debe tener 9 caracteres"),
  direccion: z.string().min(5, "La dirección es obligatoria"),
  consentimientoLOPD: z.literal(true, {
    errorMap: () => ({
      message: "Debes aceptar la política de protección de datos",
    }),
  }),
  aceptaPromociones: z.boolean().optional(),
});

export const clientEditSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Debe ser un email válido"),
  telefono: z
    .string()
    .min(9, "El teléfono debe tener 9 dígitos")
    .max(9, "El teléfono debe tener 9 dígitos"),
  documentoIdentidad: z
    .string()
    .min(9, "El DNI/NIE debe tener 9 caracteres")
    .max(9, "El DNI/NIE debe tener 9 caracteres"),
  direccion: z.string().min(5, "La dirección es obligatoria"),
  consentimientoLOPD: z.boolean().optional(),
  aceptaPromociones: z.boolean().optional(),
});

// Para compatibilidad con código existente
export const clientSchema = clientCreateSchema;
