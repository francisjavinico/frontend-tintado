import { z } from "zod";

export const garantiaSchema = z
  .object({
    descripcion: z.string().min(1, "Este campo es obligatorio").max(30),
    fechaInicio: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "fechaInicio inválida"),
    fechaFin: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "fechaFin inválida"),
  })
  .refine((d) => new Date(d.fechaFin) > new Date(d.fechaInicio), {
    message: "fechaFin debe ser posterior a fechaInicio",
    path: ["fechaFin"],
  });
