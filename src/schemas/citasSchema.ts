import { z, RefinementCtx } from "zod";

type ZodPreprocessCtx = RefinementCtx & { parent?: unknown };

export const citaSchema = z
  .object({
    clienteId: z.number().optional(),
    vehiculoId: z.number({
      required_error: "El vehículo es obligatorio.",
      invalid_type_error: "Debes seleccionar un vehículo válido.",
    }),
    fecha: z
      .string()
      .min(1, "La fecha es obligatoria.")
      .refine((val) => !isNaN(Date.parse(val)), "La fecha no es válida."),
    descripcion: z.string().min(1, "La descripción es obligatoria"),
    telefono: z.string().min(1, "El teléfono es obligatorio"),
    matricula: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z
        .string()
        .min(7, "Matrícula inválida")
        .max(10, "Matrícula inválida")
        .optional()
    ),
    presupuestoMin: z.preprocess(
      (val, ctx: ZodPreprocessCtx) => {
        const parent = ctx?.parent as { servicios?: { nombre?: string }[] };
        if (parent?.servicios?.[0]?.nombre === "Tintado de Lunas")
          return undefined;
        return val;
      },
      z
        .number({
          invalid_type_error: "El presupuesto mínimo debe ser un número.",
        })
        .min(0, "El presupuesto mínimo debe ser 0 o mayor.")
        .optional()
    ),
    presupuestoMax: z.preprocess(
      (val, ctx: ZodPreprocessCtx) => {
        const parent = ctx?.parent as { servicios?: { nombre?: string }[] };
        if (parent?.servicios?.[0]?.nombre === "Tintado de Lunas")
          return undefined;
        return val;
      },
      z
        .number({
          invalid_type_error: "El presupuesto máximo debe ser un número.",
        })
        .positive("El presupuesto máximo debe ser un número positivo.")
        .optional()
    ),
    estado: z.enum(["pendiente", "completada", "cancelada"]),
  })
  .refine(
    (data) => {
      if (
        typeof data.presupuestoMin === "number" &&
        typeof data.presupuestoMax === "number"
      ) {
        return data.presupuestoMax >= data.presupuestoMin;
      }
      return true;
    },
    {
      path: ["presupuestoMax"],
      message: "El presupuesto máximo debe ser mayor o igual que el mínimo.",
    }
  );
