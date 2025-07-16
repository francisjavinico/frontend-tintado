import { z } from "zod";

export const facturaSchema = z.object({
  clienteId: z.number({ required_error: "clienteId es obligatorio" }),
  citaId: z.number().optional(),
});

export const facturaItemSchema = z.object({
  descripcion: z.string().min(1, "Descripción requerida"),
  cantidad: z.number().min(1, "Cantidad mínima 1"),
  precioUnit: z.number().min(0, "Precio unitario inválido"),
});

export const createFacturaSchema = facturaSchema.extend({
  items: z.array(facturaItemSchema).min(1, "Debe tener al menos un item"),
});

export const getFacturasQuerySchema = z.object({
  cliente: z.string().optional(),
  clienteId: z.coerce.number().optional(),
  minTotal: z.coerce.number().optional(),
  maxTotal: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).optional(),
  dateFrom: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? new Date(val) : undefined)),
  dateTo: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? new Date(val) : undefined)),
});

export const updateFacturaSchema = createFacturaSchema
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });
