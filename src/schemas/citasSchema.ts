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
    servicios: z
      .array(
        z.object({
          nombre: z.string().min(1, "El nombre del servicio es obligatorio"),
          descripcion: z.string().optional(),
          precio: z.number().nonnegative().optional(),
        })
      )
      .min(1, "Debe haber al menos un servicio"),
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
    presupuestoBasico: z.number().nonnegative().optional(),
    presupuestoIntermedio: z.number().nonnegative().optional(),
    presupuestoPremium: z.number().nonnegative().optional(),
    estado: z.enum(["pendiente", "completada", "cancelada"]),
  })
  .superRefine((data, ctx) => {
    if (data.servicios?.[0]?.nombre === "Tintado de Lunas") {
      if (typeof data.presupuestoBasico !== "number") {
        ctx.addIssue({
          path: ["presupuestoBasico"],
          code: z.ZodIssueCode.custom,
          message: "El presupuesto básico es obligatorio para Tintado de Lunas",
        });
      }
      if (typeof data.presupuestoIntermedio !== "number") {
        ctx.addIssue({
          path: ["presupuestoIntermedio"],
          code: z.ZodIssueCode.custom,
          message:
            "El presupuesto intermedio es obligatorio para Tintado de Lunas",
        });
      }
      if (typeof data.presupuestoPremium !== "number") {
        ctx.addIssue({
          path: ["presupuestoPremium"],
          code: z.ZodIssueCode.custom,
          message:
            "El presupuesto premium es obligatorio para Tintado de Lunas",
        });
      }
      if (data.presupuestoMax !== undefined && data.presupuestoMax !== null) {
        ctx.addIssue({
          path: ["presupuestoMax"],
          code: z.ZodIssueCode.custom,
          message: "No se debe enviar presupuestoMax para Tintado de Lunas",
        });
      }
    } else {
      if (typeof data.presupuestoMax !== "number") {
        ctx.addIssue({
          path: ["presupuestoMax"],
          code: z.ZodIssueCode.custom,
          message: "El presupuesto es obligatorio para este servicio",
        });
      }
      if (
        typeof data.presupuestoBasico === "number" ||
        typeof data.presupuestoIntermedio === "number" ||
        typeof data.presupuestoPremium === "number"
      ) {
        ctx.addIssue({
          path: ["presupuestoBasico"],
          code: z.ZodIssueCode.custom,
          message: "Solo se debe enviar un presupuesto para este servicio",
        });
      }
    }
  });
